# Claude-Oriented 아키텍처 (2026-02-11)

## 목표
빠른 개발 반복, 높은 응답 품질, 통제된 모델 비용을 갖춘 하나의 프로덕션 서비스를 구축한다.

## 권장 아키텍처
1. API 계층 (FastAPI): 요청 검증, 인증, 속도 제한.
2. 오케스트레이션 계층: 작업 분류, 컨텍스트 준비, 모델 라우팅.
3. 모델 게이트웨이: Anthropic API 호출, 재시도, 타임아웃, 사용량 수집을 위한 단일 어댑터.
4. 가드레일 계층: 토큰 예산 검사, 안전 정책, 폴백 동작.
5. 저장/텔레메트리: 프롬프트 메타데이터(민감 정보 제외), 토큰 사용량, 지연 시간, 오류 유형 기록.

## 모델 라우팅 정책
- Haiku 4.5: 분류, 짧은 변환, 추출, 대량·저위험 작업.
- Sonnet 4.5: 기능 개발, 코딩 지원, 중간 복잡도 추론의 기본 모델.
- Opus 4.6: 품질 향상이 높은 비용/지연을 정당화하는 중요 작업에만 사용.

## 비용 최적화 수단
1. 프롬프트 캐싱: 안정적인 접두사/시스템 컨텍스트를 캐싱하여 반복 입력 비용 절감.
2. Batch API: 대화형 지연이 필요 없는 비동기 대량 작업에 Batch를 사용하여 단위 비용 절감.
3. 2단계 파이프라인: 저렴한 모델로 먼저 분류/요약 후, 에스컬레이션된 경우에만 고비용 모델 사용.
4. 하드 예산: 토큰/요청 예산 초과 시 즉시 실패 처리.
5. 관측성: 엔드포인트별 토큰 및 모델 비율을 모니터링한 후 라우팅 정책 강화.

## 개발 워크플로 기본 설정
- 레포지토리 지시사항은 `CLAUDE.md`에 유지.
- `.claude/settings.json` 권한 + pre-tool 훅으로 위험 명령 차단.
- 동작 변경이 있는 PR에는 테스트 필수.

## 앱 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| Frontend | React Native 또는 Flutter | iOS / Android 동시 지원 |
| Backend | Python (FastAPI) | 현재 서비스 골격과 일치 |
| Notification | Firebase Cloud Messaging (FCM) | 아침/점심/저녁 알림 |
| DB | PostgreSQL 또는 SQLite (MVP) | 최소 스키마 |
| AI | Anthropic Claude API | Haiku/Sonnet/Opus 라우팅 |

## 최소 DB 스키마

```
User
├── id              (PK)
├── language        (ko, en, ja, ...)
├── notification_preferences  (JSON: morning/lunch/evening ON/OFF)
└── created_at

Message
├── id              (PK)
├── type            (morning / lunch / evening / variation / user_memory)
├── text
├── language
└── created_at

DeliveryLog
├── id              (PK)
├── user_id         (FK → User)
├── message_id      (FK → Message, nullable for silence)
├── delivered_at
└── is_silence      (boolean)
```

### 스키마 설계 원칙
- 유저 개인정보 최소화 (이름, 생년월일, SNS 연동 없음)
- Message 테이블은 언어별 분리로 i18n 대응
- DeliveryLog에 `is_silence` 플래그로 침묵도 기록 (침묵은 기능)
- 감정 태그, 카테고리, 분석용 필드 금지

## 다국어(i18n) 구조

- Message 테이블에 `language` 컬럼으로 언어별 문장 관리
- 직역이 아닌 현지 감각 재작성(Transcreation) 원칙
- 문화 민감도 필터: 종교/정치 단어 차단, 강한 감정 단어 제한

## 즉시 확장 가능한 항목
- 모델 + 안정적 프롬프트 해시를 키로 하는 Redis 또는 DB 기반 캐시 추가.
- Batch 작업을 위한 비동기 큐 워커 추가.
- 일일 비용 대시보드 구축을 위한 Usage & Cost API 수집 작업 추가.
