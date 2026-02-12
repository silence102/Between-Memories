You are working in the Between Memories service repository.

## Hard constraints (absolute — violation = failure)
- AI MUST NOT interpret, analyze, score, or classify user data.
- AI MUST NOT judge emotions as positive/negative.
- AI MUST NOT accumulate data for analysis purposes.
- Silence (no message) is a feature, not a bug. Never treat it as an error.
- Minimal data collection: no real name, no birthdate, no SNS linking (MVP).
- Logs are for operational debugging only, never for user behavior analysis.
- Refer to docs/PHILOSOPHY.md for the complete list of hard constraints.

## Service identity
This service quietly reconnects a user's past self with their present self.
It does NOT store, analyze, score, or coach. It observes and leaves room for interpretation.

## AI agent constraints (non-negotiable)
- Never judge, advise, analyze, or score the user.
- Never demand or suggest action.
- Never use phrases like "you've grown", "try harder", "here's a tip", or "your emotional state is…".
- Generate only observer-perspective sentences that leave interpretive space.
- Keep sentences short (15-40 chars Korean). No exclamation marks. Avoid question marks.
- Use "사람은 / 어떤 날은 / 우리는" — never "너는 / 당신은".
- No duplicate sentences within same day. No repeat within 7 days.
- English sentences must also maintain observer tone — no advice/judgment.
- Refer to docs/PHILOSOPHY.md and docs/PRODUCT.md for full tone and content rules.

## 7-day MVP scope (current phase)
- Goal: working app, not perfect app. "작동"이 기준이다.
- Tech: Expo (React Native) + Supabase + Polar. No Python backend for MVP.
- AI: NOT used in MVP. Sentences come from a curated library of 150+ entries.
- Do NOT suggest adding features beyond the MVP scope.
- Do NOT over-engineer. Minimal code that works.
- Refer to docs/MVP_ROADMAP.md for the full 7-day plan.

## Sentence engine rules
- MVP: curated library only (no AI generation).
- 2nd phase: curated library, AI-generated, user past entries.
- Modes: morning (08:00), lunch (13:00), evening (18:00), variation (random).
- Variation probability: 5-10%. Silence probability: 3%. Both are valid.
- No duplicate sentences within same day. No repeat within 7 days.
- Refer to docs/PRODUCT.md for sentence engine architecture details.

## Feature guardrails
- Never build: emotion scores, growth metrics, goal management, analysis reports, comparison features.
- Never build: premium sentences — paid features are cosmetic only (themes, backgrounds).
- Never build in MVP: AI real-time generation, auto-recommendation, custom backgrounds, stats, reports, Instagram export.
- User records: 1-3 lines text only. No emotion tags, no categories, no folders.

## Development rules
1. Keep changes small and testable.
2. Prefer adding tests for behavior changes.
3. Never hardcode secrets; use environment variables.
4. Do NOT suggest feature additions. Do NOT over-engineer. Philosophy violation = failure.
5. For AI features (2nd phase only):
   - Start with Haiku for cheap classification/rewrites.
   - Use Sonnet for most build tasks.
   - Escalate to Opus only for critical reasoning quality.
6. Before large edits, summarize the plan and risks in 3-5 bullets.
