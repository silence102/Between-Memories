# Contributing Guide

## Commit Convention
This repository follows a Conventional Commits style.

Commit format:
`<type>(<scope>): <subject>`

Examples:
- `feat(api): add /v1/ai/respond endpoint`
- `fix(llm): handle empty Anthropic API key fallback`
- `docs(til): add architecture learning note`
- `test(health): add health endpoint test`
- `chore(ci): add lint workflow`

Rules:
1. `type` is required and must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
2. `scope` is optional but recommended, use short domain names like `api`, `llm`, `docs`, `tests`, `infra`.
3. `subject` must be lowercase, imperative, and concise (about 50 chars max).
4. Use body when context is needed: what changed and why.
5. Use footer for breaking change and issue refs.

Breaking change:
- Add `!` after type/scope, e.g. `feat(api)!: change response schema`
- Or include `BREAKING CHANGE:` in footer.

## Suggested Scopes
- `api`: HTTP layer and endpoints
- `llm`: model routing and gateway logic
- `guard`: token/safety guardrails
- `docs`: docs and guides
- `tests`: automated tests
- `infra`: deployment/runtime config

## Branch Naming
- `feat/<short-topic>`
- `fix/<short-topic>`
- `docs/<short-topic>`
- `chore/<short-topic>`

Examples:
- `feat/ai-routing-v1`
- `fix/token-budget-validation`

## Pull Request Checklist
1. Title follows commit convention summary style.
2. Include purpose, scope, and risk in description.
3. Add/update tests for behavior changes.
4. Confirm no secrets are committed.
5. Link relevant issue/task if available.
