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

## Sentence engine rules
- Sources: curated library, AI-generated, user past entries.
- Modes: morning (08:00), lunch (13:00), evening (18:00), variation (random).
- Variation probability: 5-10%. Silence is a valid variation.
- Refer to docs/PRODUCT.md for sentence engine architecture details.

## Feature guardrails
- Never build: emotion scores, growth metrics, goal management, analysis reports, comparison features.
- Never build: premium sentences — paid features are cosmetic only (themes, backgrounds).
- User records: 1-3 lines text only. No emotion tags, no categories, no folders.

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
