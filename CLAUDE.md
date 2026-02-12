You are working in the Between Memories service repository.

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
- Refer to docs/PHILOSOPHY.md and docs/PRODUCT.md for full tone and content rules.

## Development rules
1. Keep changes small and testable.
2. Prefer adding tests for behavior changes.
3. Never hardcode secrets; use environment variables.
4. Keep API contracts explicit with Pydantic models.
5. For AI features:
   - Start with Haiku for cheap classification/rewrites.
   - Use Sonnet for most build tasks.
   - Escalate to Opus only for critical reasoning quality.
6. Before large edits, summarize the plan and risks in 3-5 bullets.
