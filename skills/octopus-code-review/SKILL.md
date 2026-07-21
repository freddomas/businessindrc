---
name: octopus-code-review
description: Review and validate changes to the Octopus Expertise Next.js B2B industrial sourcing platform. Use for pull requests, frontend or API changes, authentication, RBAC, RFQ workflows, supplier registry, media, database health, feature flags, tests, Vercel configuration, or release readiness in this repository.
---

# Octopus Code Review

Review against the current repository, not remembered behavior.

## Review order

1. Read `AGENTS.md`, `README.md`, `qa/QA_RULES.md`, and the changed files.
2. Identify affected contracts: public copy, auth/RBAC, RFQ flow, partner registry, media registry, database health, flags, responsive UI, or deployment.
3. Inspect the smallest relevant tests before judging correctness.
4. Rank findings by exploitability, data risk, broken user task, regression reach, then polish.
5. Cite file and line evidence. Do not report hypothetical defects as confirmed.

## Non-negotiable contracts

- Keep V1 centered on industrial B2B sourcing, suppliers, RFQs, opportunities, verification, and the private console.
- Never expose secrets or validation credentials. Never run `vercel pull`.
- Check Postgres only through `GET /api/health`; prefer `DATABASE_URL`, then `POSTGRES_URL`.
- Keep public API, webhooks, external integrations, and payments disabled unless explicitly authorized.
- Reject forbidden public copy listed in `AGENTS.md`.
- Require every public external image to be approved in the media registry with source, domain, license, and alt text.
- Keep local shared-password users limited to controlled validation.

## Validation

Run targeted checks first. For UI changes, require rendered browser evidence at desktop and mobile plus interaction, keyboard, reduced-motion, console, network, and overflow checks. Do not convert a build pass into UX proof. Respect any one-DRY_RUN limit and never trigger an extra global run.

Report findings first, ordered by severity. If none remain, state what was checked and what remains unverified.
