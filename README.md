# Between Memories

> "기억을 저장하지 않습니다. 다시 만날 수 있게 합니다."

과거의 나와 현재의 나를 조용히 마주 앉히는 서비스.

## 서비스 문서
- [서비스 철학 & AI 역할 정의](docs/PHILOSOPHY.md)
- [제품 가이드 (MVP, 알림, 톤)](docs/PRODUCT.md)
- [디자인 원칙 (UX/UI, 글로벌, 수익)](docs/DESIGN_PRINCIPLES.md)
- [기술 아키텍처](docs/ARCHITECTURE.md)

## 포함 항목
- FastAPI 서비스 골격 (`src/between_memories_service`)
- 정책 기반 모델 선택을 포함한 Claude 라우팅 계층 (Haiku/Sonnet/Opus)
- 토큰 예산 제한을 활용한 비용 가드레일
- Claude Code 로컬 설정 및 안전 훅 (`.claude/settings.json`, `automation/hooks/block-dangerous.ps1`)
- 기본 테스트, 린트, 실행 명령어
- `docs/`에 아키텍처 및 서비스 가이드 문서

## 빠른 시작
1. 환경 생성 및 의존성 설치:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .[dev]
```
2. 환경 변수 템플릿 복사 후 키 설정:
```powershell
Copy-Item .env.example .env
```
3. API 실행:
```powershell
uvicorn between_memories_service.main:app --reload --app-dir src
```
4. 테스트 실행:
```powershell
pytest -q
```

## API
- `GET /health`
- `POST /v1/ai/respond`

사용 예시:
```bash
curl -X POST http://localhost:8000/v1/ai/respond \
  -H "Content-Type: application/json" \
  -d '{"task_type":"build","prompt":"견고한 페이지네이션 전략을 작성해줘"}'
```

## 모델 정책
- `quick`: 기본값 `claude-3-5-haiku-latest`
- `build`: 기본값 `claude-sonnet-4-5`
- `critical`: 기본값 `claude-opus-4-6`

필요 시 `.env`에서 재정의 가능.

## 다음 권장 단계
1. `src/between_memories_service/` 하위에 도메인 모듈 추가.
2. 첫 번째 실제 엔드포인트에 대한 통합 테스트 추가.
3. Usage & Cost API 지표를 대시보드/알림에 연동.

## 협업
- 커밋 및 PR 가이드라인: `CONTRIBUTING.md`