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
- Visual rewrites require Playwright screenshots or attachments for the critical route matrix, not only passing DOM assertions.
- Copy checks must include public shared components because visible labels, inputs and actions are often defined outside `app/`.
- Database acceptance checks must use the project health endpoint, not direct secret inspection or copied connection strings.
- Touch viewports must not depend on hover transforms for navigation or primary actions.
- Public visual richness must come from approved media or procedural graphics; unreviewed generated, scraped, or stock imagery is not allowed.
- A local dev server must be identified before browser QA; stale processes on the same port can invalidate the result.
