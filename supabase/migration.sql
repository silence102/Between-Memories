-- Between Memories MVP: Supabase migration
-- Run this in Supabase SQL Editor

-- users: linked to Supabase Auth
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  language text not null default 'ko',
  timezone text not null default 'Asia/Seoul',
  subscription_status text not null default 'free',
  created_at timestamptz not null default now()
);

-- messages: curated sentence library
create table if not exists public.messages (
  id bigint primary key generated always as identity,
  text text not null,
  type text not null check (type in ('morning', 'lunch', 'evening', 'variation')),
  language text not null default 'ko',
  created_at timestamptz not null default now()
);

-- user_memories: user records (1-3 lines, trace only)
create table if not exists public.user_memories (
  id bigint primary key generated always as identity,
  user_id uuid not null references public.users(id) on delete cascade,
  text text not null check (length(text) <= 300),
  created_at timestamptz not null default now()
);

-- delivery_logs: delivery tracking (silence included)
create table if not exists public.delivery_logs (
  id bigint primary key generated always as identity,
  user_id uuid not null references public.users(id) on delete cascade,
  message_id bigint references public.messages(id),
  delivered_at timestamptz not null default now(),
  is_silence boolean not null default false
);

-- RLS policies
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.user_memories enable row level security;
alter table public.delivery_logs enable row level security;

-- users: can read/update own row only
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- messages: anyone authenticated can read
create policy "messages_select_all" on public.messages
  for select using (auth.role() = 'authenticated');

-- user_memories: own records only
create policy "memories_select_own" on public.user_memories
  for select using (auth.uid() = user_id);
create policy "memories_insert_own" on public.user_memories
  for insert with check (auth.uid() = user_id);

-- delivery_logs: own records only
create policy "logs_select_own" on public.delivery_logs
  for select using (auth.uid() = user_id);
create policy "logs_insert_own" on public.delivery_logs
  for insert with check (auth.uid() = user_id);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index if not exists idx_messages_type_lang on public.messages(type, language);
create index if not exists idx_memories_user on public.user_memories(user_id, created_at desc);
create index if not exists idx_logs_user on public.delivery_logs(user_id, delivered_at desc);
