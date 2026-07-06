# Lessons Learned

## 2026-07-05 Visual Rebuild QA

### Failure

The initial QA baseline could have accepted a visual rebuild without systematic screenshots, full public-route layout checks, or copy scans across shared components.

### Root Cause

The earlier coverage focused too much on `app/`, while visible labels, form text, navigation, and primary interactions also live in `components/`.

### Rule

Any major UI rebuild must attach Playwright visual evidence, scan `app/` and `components/`, and audit console, network, layout, real visibility, text, media, reduced motion, and critical flows across the route matrix.

### Guard Added

`tests/e2e/platform.spec.ts` now covers the public routes, supplier profile navigation, console access redirect, reduced-motion rendering, `/api/health`, public API closures, and RFQ validation.

## 2026-07-05 Mobile Overflow Lock

### Failure

The first complete route matrix found horizontal overflow on a small mobile viewport.

### Root Cause

Some inline section headers and actions stayed on one row at 360px, and decorative card motion could contribute to `scrollWidth`.

### Rule

Action rows must wrap or become columns on small screens. Decorative motion cannot increase document width.

### Guard Added

The Playwright layout audit now fails on horizontal overflow and samples multiple mobile and desktop viewports.

## 2026-07-05 DB Health False Negatives

### Failure

Database-backed checks failed inside the sandbox even after the app code was correct.

### Root Cause

Local Postgres verification depends on `DATABASE_URL` network access. Running the same test without that access creates a false application failure.

### Rule

Use sandboxed tests for static gates, but run `/api/health`, seeded RFQ submission, and full e2e with approved network access when database verification is part of the acceptance criteria.

### Guard Added

`app/api/rfq/route.ts` validates payload shape before touching the database and returns controlled service-unavailable responses when the persistence layer is unreachable.

## 2026-07-05 Stale Dev Server

### Failure

An old process on port 3000 served stale Next assets and produced misleading browser errors.

### Root Cause

The test run reused a port before verifying the owning process.

### Rule

Before e2e validation, check port 3000 and stop only confirmed stale project-owned dev processes. Do not trust a browser failure until the runtime process is identified.

### Guard Added

Final QA starts from a free port and `scripts/run-e2e.mjs` launches the project runtime for the test run.

## 2026-07-05 Mobile Click Stability

### Failure

The mobile supplier-card navigation became flaky after reducing the supplier grid.

### Root Cause

Hover transforms can destabilize a click target in browser emulation even when the element is visible.

### Rule

Hover-only transforms must be gated behind `@media (hover: hover) and (pointer: fine)`. Touch layouts need stable hit targets.

### Guard Added

The supplier-profile Playwright flow clicks a real public card and verifies the destination page headline.

## 2026-07-05 Public Media Policy

### Failure

The design goal pushed toward photorealistic imagery, but the project rule forbids unapproved public images.

### Root Cause

Generated or scraped imagery can look impressive while introducing licensing, review, and brand-risk uncertainty.

### Rule

Until a reviewed media library exists, the public experience uses procedural graphics, CSS, and WebGL only.

### Guard Added

`scripts/check-media.ts` and e2e public-media checks fail if public routes expose unapproved image or CSS URL media.

## 2026-07-05 External Media Registry

### Failure

A total visual redesign needs real imagery, but a blanket media ban blocks stronger UX directions and encourages purely decorative procedural work.

### Root Cause

The previous policy treated every external image as unsafe instead of separating declared, licensed, approved assets from undeclared media.

### Rule

External public imagery is allowed only when it is registered with HTTPS URL, source domain, source URL, license URL, useful alt text, approved review status, valid license status, and public usage.

### Guard Added

`scripts/check-media.ts`, CSP `img-src`, and Playwright media audit now allow only registered external media from approved domains.

## 2026-07-06 OCTOPUS Clean Slate QA

### What went wrong

- A decorative WebGL container used `aria-label` on a plain `div`, producing an axe `aria-prohibited-attr` failure.
- Browser login created a session cookie but did not reliably navigate with the plain HTML redirect flow.
- Console actions could be clicked before React hydration, so the modal did not open even though the button looked usable.
- The first console layout widened the document on mobile because the table min-content size escaped its scroll wrapper.
- Logout navigated away even when `/api/auth/logout` failed once during dev compilation, leaving the session active.
- The CRUD test asserted UI state before waiting for the POST, PATCH and DELETE responses.

### Root cause

The initial rebuild mixed server-rendered controls, client handlers, database cold starts and responsive tables without explicit readiness and action-specific API waits.

### Rule to apply now

- Decorative canvas wrappers must be `aria-hidden` or given a valid role.
- Private console controls must expose a hydration-ready state before Playwright clicks them.
- Logout must never navigate unless the server has actually cleared the session.
- Tables can scroll inside their wrapper, but they must not increase `documentElement.scrollWidth`.
- Mutating tests must wait for the exact API response triggered by the action before asserting UI state.

### Regression guard added

`tests/e2e/public-smoke.spec.ts`, `tests/e2e/auth-console.spec.ts`, and `tests/e2e/api-contract.spec.ts` now cover WebGL rendering, mobile layout, auth, logout, private partners API, health DB, and CRUD.

### Framework impact

The QA helper set now separates public page audits, API contracts, auth-console flows, screenshot proof, runtime guards, layout checks, real visibility, media checks and secret leak checks.
