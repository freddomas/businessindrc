# Red Team Findings

## Current Premortem

- Scope risk: full brief describes a broad B2B platform; shipping too many modules at once would create weak, unverified features.
- Credibility risk: seeded commercial data must support navigation dashboards without pretending to be proven market traction.
- Security risk: local shared-password users are acceptable only for controlled validation and must be disabled or rotated before commercial launch.
- Media risk: public pages may use imagery only when declared in the media registry with source, license, approval status and public usage.
- Deployment risk: Vercel project settings can override repository intent; deployed URL must be verified after push.
- Visual risk: reference-site screenshots are useful local evidence, but third-party artifacts must not be committed.
- UX risk: cinematic motion can reduce trust if it hides qualification, partner scoring, private access or closed V1 flags.
- Runtime risk: a stale local dev process can make the rebuilt app look broken even when current code passes.
- DB risk: sandboxed runs can fail `DATABASE_URL` access; database health must be verified through `/api/health` with approved network access.
- Mobile risk: touch viewports need stable boxes, no document-level horizontal overflow and no hover-dependent actions.
- Scope risk: the business model is operated partner qualification by Octopus Expertise, not an open marketplace. Public copy must not imply self-serve payments, public APIs, webhooks or external integrations while V1 flags stay closed.
- Clean-slate risk: old supplier, RFQ and zone routes must not remain available unless deliberately reintroduced. Current route surface is `/`, `/connexion`, `/console`, `/api/health`, `/api/auth/*`, `/api/partners/*`.
- Hydration risk: server-rendered private console controls can look clickable before handlers attach. Console actions now require a ready state.
- Logout risk: navigating away after a failed logout is a security bug. Client logout must verify a 200 response before leaving the console.
- CRUD risk: UI assertions without API-specific waits can pass or fail for timing reasons. Mutations must capture the exact POST, PATCH or DELETE response.
