# Between Memories

Starter baseline for building one production service with fast iteration, reliable quality, and controlled LLM cost.

## What is included
- FastAPI service skeleton (`src/between_memories_service`)
- Claude routing layer (Haiku/Sonnet/Opus) with simple policy-based model selection
- Cost guardrail using token budget limits
- Claude Code local settings + safety hook (`.claude/settings.json`, `automation/hooks/block-dangerous.ps1`)
- Basic test, lint, and run commands
- Architecture and source notes in `docs/`

## Quick start
1. Create environment and install dependencies:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .[dev]
```
2. Copy env template and set your key:
```powershell
Copy-Item .env.example .env
```
3. Run API:
```powershell
uvicorn between_memories_service.main:app --reload --app-dir src
```
4. Run tests:
```powershell
pytest -q
```

## API
- `GET /health`
- `POST /v1/ai/respond`

Example:
```bash
curl -X POST http://localhost:8000/v1/ai/respond \
  -H "Content-Type: application/json" \
  -d '{"task_type":"build","prompt":"Write a robust pagination strategy"}'
```

## Model policy
- `quick`: default `claude-3-5-haiku-latest`
- `build`: default `claude-sonnet-4-5`
- `critical`: default `claude-opus-4-6`

Override via `.env` if needed.

## Next recommended steps
1. Add your domain modules under `src/between_memories_service/`.
2. Add integration tests for your first real endpoint.
3. Wire Usage & Cost API metrics to your dashboard/alerts.
## Collaboration
- Commit and PR guideline: `CONTRIBUTING.md`