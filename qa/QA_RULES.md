# QA Rules

## 2026-07-04 Initial Platform Gate

### What can fail silently

- A Vercel build can compile and still fail deployment when the output directory is misconfigured.
- A public page can look polished while exposing internal wording or unsupported commercial claims.
- A basic `toBeVisible()` check can pass while an element is overlapped or clipped on small screens.

### Rules applied

- Build success is not deployment success; verify the deployment URL.
- Public UI must avoid internal setup language and the forbidden terms from the product brief.
- Critical routes require console, network, layout, text and accessibility checks.
- Media displayed publicly must pass review status, license status, AI-like and usage filters.
- Do not run `npm run typecheck` in parallel with `npm run build`; Next regenerates `.next/types` during build and can produce false missing-file errors.
