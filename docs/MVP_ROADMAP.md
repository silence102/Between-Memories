# 7일 MVP 로드맵

> 이번 7일은 "서비스를 만드는 기간"이 아니라 "존재를 현실에 꺼내놓는 기간"이다.

## 완성 목표 (절대 기준)

7일 후 반드시 가능한 상태:

- [ ] 앱 실행 가능 (iOS TestFlight 또는 APK)
- [ ] 알림 3회 작동
- [ ] 문장 표시 작동
- [ ] 사용자 1~3줄 기록 저장 가능
- [ ] 기본 구독 버튼 연결 (결제 테스트 가능)
- [ ] 영어/한국어 전환 가능 (최소 2언어 구조)

완성 기준은 "작동"이다. 완벽이 아니다.

---

## 기술 스택 (7일 최적화)

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| Frontend | React Native (Expo) | 알림 쉬움, 배포 빠름, export 구현 용이 |
| Backend / DB / Auth | Supabase | Auth + DB + RLS 한번에 해결, 빠른 세팅 |
| 결제 | Polar (테스트 모드) | 빠른 구독 연동 |
| AI | ❌ 사용 안 함 (MVP) | 수동 문장 150개로 시작 |

### 기존 Python 백엔드와의 관계
- `src/between_memories_service/` (FastAPI + Claude 라우팅)는 2차 단계에서 AI 문장 생성 시 활용
- MVP에서는 Supabase가 DB + Auth를 직접 처리하므로 Python 백엔드 불필요
- 기존 코드는 삭제하지 않고 유지 (AI 고도화 시 재활용)

---

## DB 스키마 (Supabase)

```sql
-- users: Supabase Auth와 연동
create table users (
  id uuid primary key references auth.users(id),
  language text not null default 'ko',
  timezone text not null default 'Asia/Seoul',
  subscription_status text not null default 'free',
  created_at timestamptz not null default now()
);

-- messages: 수동 큐레이션 문장 라이브러리
create table messages (
  id bigint primary key generated always as identity,
  text text not null,
  type text not null check (type in ('morning', 'lunch', 'evening', 'variation')),
  language text not null default 'ko',
  created_at timestamptz not null default now()
);

-- user_memories: 유저 기록 (1~3줄, 흔적)
create table user_memories (
  id bigint primary key generated always as identity,
  user_id uuid not null references users(id),
  text text not null check (length(text) <= 300),
  created_at timestamptz not null default now()
);

-- delivery_logs: 전달 기록 (침묵 포함)
create table delivery_logs (
  id bigint primary key generated always as identity,
  user_id uuid not null references users(id),
  message_id bigint references messages(id),
  delivered_at timestamptz not null default now(),
  is_silence boolean not null default false
);
```

---

## DAY 1 – 프로젝트 세팅

- [ ] Expo 프로젝트 생성 (`app/`)
- [ ] Supabase 프로젝트 생성 및 연결
- [ ] 기본 테이블 생성 (위 스키마)
- [ ] Auth 구현 (이메일 로그인만)

**완료 조건:** 회원가입/로그인 작동

## DAY 2 – DB + 문장 데이터

- [ ] RLS 정책 설정
- [ ] Supabase 콘솔에서 CRUD 확인
- [ ] 한국어 문장 150개 입력 시작 (morning 50 / lunch 50 / evening 50)

**완료 조건:** Supabase 콘솔에서 데이터 CRUD 확인

## DAY 3 – 문장 엔진 1.0

- [ ] 시간대별 필터링 로직 구현
- [ ] 최근 7일 중복 방지
- [ ] variation 확률 5%
- [ ] 침묵 확률 3%
- [ ] 메인 화면: 문장 하나 + 여백

**완료 조건:** 앱 실행 시 시간대에 맞는 문장 출력

## DAY 4 – 알림 시스템

- [ ] Expo Push Notification 설정
- [ ] 08:00 / 13:00 / 18:00 로컬 스케줄
- [ ] variation 확률 적용
- [ ] 침묵 시 알림 생략

**완료 조건:** 실제 폰에서 알림 작동

## DAY 5 – 기록 기능

- [ ] 1~3줄 텍스트 입력 UI
- [ ] 날짜 자동 저장
- [ ] 감정 태그 없음, 수정 기능 없음
- [ ] 기록 목록 조회 (시간순)

**완료 조건:** 기록 작성 후 DB 저장 확인

## DAY 6 – 구독 연결

- [ ] Polar 테스트 모드 연결
- [ ] 구독 버튼 UI ("커피 한 잔 가격" 명시)
- [ ] subscription_status 업데이트
- [ ] 유료 기능 차별 없음 확인

**완료 조건:** 테스트 결제 성공

## DAY 7 – 글로벌 + 빌드

- [ ] language 컬럼 기반 한/영 전환
- [ ] 영어 메시지 100개 추가
- [ ] 앱 아이콘 / 소개 문구
- [ ] TestFlight 또는 APK 빌드

**완료 조건:** 제출 가능한 빌드 파일 생성

---

## 7일 버전에서 반드시 제거할 것

- AI 실시간 문장 생성
- 감정 분석
- 과거 문장 자동 추천
- 커스터마이징 배경
- 통계 화면
- 리포트 화면
- 인스타 export (2차)

---

## 성공 조건 체크리스트

- [ ] 앱이 크래시 없이 실행된다
- [ ] 로그인/회원가입이 작동한다
- [ ] 시간대에 맞는 문장이 표시된다
- [ ] 알림이 3회 정상 전달된다
- [ ] 기록 저장이 작동한다
- [ ] 구독 버튼이 결제로 연결된다
- [ ] 한/영 전환이 작동한다
- [ ] 철학 원칙이 침범되지 않았다
