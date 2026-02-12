# Claude-Oriented Architecture (2026-02-11)

## Goal
Build one production service with fast developer iteration, high answer quality, and controlled model spend.

## Recommended architecture
1. API layer (FastAPI): request validation, auth, rate limiting.
2. Orchestration layer: task classification, context preparation, and model routing.
3. Model gateway: single adapter for Anthropic API calls, retries, timeouts, and usage capture.
4. Guardrail layer: token budget checks, safety policy, and fallback behavior.
5. Storage/telemetry: log prompt metadata (not raw secrets), token usage, latency, error classes.

## Model routing policy
- Haiku 4.5: classification, short transforms, extraction, high-volume low-risk tasks.
- Sonnet 4.5: default for feature work, coding support, and medium-complexity reasoning.
- Opus 4.6: only for critical tasks where quality gain justifies higher cost/latency.

## Cost optimization levers
1. Prompt caching: cache stable prefix/system context to avoid paying full input repeatedly.
2. Batch API: for async large-volume jobs where latency is not interactive, use Batch for lower unit cost.
3. Two-step pipeline: cheap model first (triage/summarize), expensive model only on escalated cases.
4. Hard budgets: fail fast when token/request budgets exceed policy.
5. Observability: monitor per-endpoint token and model mix, then tighten routing.

## Developer workflow defaults
- Keep repository instructions in `CLAUDE.md`.
- Use `.claude/settings.json` permissions + pre-tool hook to block destructive commands.
- Require tests for behavior-changing PRs.

## Immediate extension points
- Add Redis or DB-backed cache keyed by model + stable prompt hash.
- Add async queue worker for Batch jobs.
- Add Usage & Cost API pull job to build daily spend dashboard.
