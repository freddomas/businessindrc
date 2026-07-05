# Red Team Findings

## Current Premortem

- Scope risk: the full brief describes a broad B2B platform; shipping every possible module at once would create weak, unverified features.
- Credibility risk: seeded commercial data must support navigation and dashboards without pretending to be proven market traction.
- Security risk: local shared-password users are acceptable only for controlled validation and must be disabled or rotated before commercial launch.
- Media risk: public pages may use external imagery only when it is declared in the media registry with source, domain, license, approval status and public usage.
- Deployment risk: Vercel project settings can override repository intent; the deployed URL must be verified after push.
- Visual risk: reference-site screenshots are useful local evidence, but third-party artifacts must not be committed.
- UX risk: cinematic motion can reduce trust if it hides RFQ intake, supplier scoring, deal status, or closed V1 flags.
- Runtime risk: a stale local dev process can make the rebuilt app look broken even when the current code passes.
- DB risk: sandboxed runs can fail `DATABASE_URL` access; database health must be verified through `/api/health` with approved network access.
- Mobile risk: hover-based transforms can destabilize click targets in touch emulation; primary actions need stable boxes.
- Scope risk: the new business model is deal orchestration by OCTOPUS Mining, not an open marketplace. Public copy must not imply self-serve payments, public APIs, webhooks, or external integrations while V1 flags are closed.
