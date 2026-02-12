# 기여 가이드

## 커밋 컨벤션
이 레포지토리는 Conventional Commits 스타일을 따른다.

커밋 형식:
`<type>(<scope>): <subject>`

예시:
- `feat(api): add /v1/ai/respond endpoint`
- `fix(llm): handle empty Anthropic API key fallback`
- `docs(til): add architecture learning note`
- `test(health): add health endpoint test`
- `chore(ci): add lint workflow`

규칙:
1. `type`은 필수이며 다음 중 하나여야 한다: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
2. `scope`는 선택이지만 권장하며, `api`, `llm`, `docs`, `tests`, `infra` 같은 짧은 도메인 이름을 사용한다.
3. `subject`는 소문자, 명령형, 간결하게 작성한다 (약 50자 이내).
4. 맥락이 필요한 경우 본문에 변경 내용과 이유를 기술한다.
5. 푸터에 Breaking Change와 이슈 참조를 기록한다.

Breaking Change:
- type/scope 뒤에 `!`를 추가한다. 예: `feat(api)!: change response schema`
- 또는 푸터에 `BREAKING CHANGE:`를 포함한다.

## 권장 Scope
- `api`: HTTP 계층 및 엔드포인트
- `llm`: 모델 라우팅 및 게이트웨이 로직
- `guard`: 토큰/안전 가드레일
- `docs`: 문서 및 가이드
- `tests`: 자동화 테스트
- `infra`: 배포/런타임 설정

## 브랜치 네이밍
- `feat/<short-topic>`
- `fix/<short-topic>`
- `docs/<short-topic>`
- `chore/<short-topic>`

예시:
- `feat/ai-routing-v1`
- `fix/token-budget-validation`

## Pull Request 체크리스트
1. 제목이 커밋 컨벤션 요약 형식을 따르는가.
2. 설명에 목적, 범위, 위험 요소가 포함되었는가.
3. 동작 변경에 대한 테스트를 추가/수정했는가.
4. 시크릿이 커밋에 포함되지 않았는가.
5. 관련 이슈/작업이 있으면 링크했는가.
