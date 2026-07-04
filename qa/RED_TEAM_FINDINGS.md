# Red Team Findings

## Current Premortem

- Scope risk: the full brief describes a broad B2B platform; shipping every requested module at once would create weak, unverified features.
- Credibility risk: synthetic data must support navigation and dashboards without being presented as real traction.
- Security risk: local users with the shared password are acceptable only for controlled validation and must be disabled or rotated before commercial launch.
- Media risk: no public page should use unreviewed industrial photography or generated photorealistic scenes.
- Deployment risk: Vercel project settings can override repo intent; `vercel.json` and live checks are mandatory.
