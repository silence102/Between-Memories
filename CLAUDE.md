You are working in the Between Memories service repository.

Rules:
1. Keep changes small and testable.
2. Prefer adding tests for behavior changes.
3. Never hardcode secrets; use environment variables.
4. Keep API contracts explicit with Pydantic models.
5. For AI features:
   - Start with Haiku for cheap classification/rewrites.
   - Use Sonnet for most build tasks.
   - Escalate to Opus only for critical reasoning quality.
6. Before large edits, summarize the plan and risks in 3-5 bullets.
