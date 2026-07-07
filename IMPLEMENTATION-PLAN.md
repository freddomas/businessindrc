# Implementation Plan

## Batch 1: Product and IA

Goal: Reframe the public route around industrial sourcing and controlled RFQ flow.

Affected files/screens:

- `app/page.tsx`
- `lib/product-content.ts`
- `app/globals.css`

Expected user impact:

- Clearer first-viewport promise.
- Stronger path from public page to controlled private workflow.

Validation method:

- Public copy check.
- Playwright public smoke tests.
- Visual QA at mobile/tablet/desktop widths.

## Batch 2: Console sourcing workflow

Goal: Add RFQ/opportunity lanes and connect them to partner shortlist filtering.

Affected files/screens:

- `components/AdminConsole.tsx`
- `lib/console-model.ts`
- `app/globals.css`
- `tests/e2e/auth-console.spec.ts`

Expected user impact:

- Operators can see active sourcing priorities before browsing raw records.
- Partner registry becomes a decision tool, not only a data table.

Validation method:

- E2E login and console tests.
- New RFQ lane interaction assertion.

## Batch 3: UI states and destructive action safety

Goal: Add empty state, robust error handling and delete confirmation.

Affected files/screens:

- `components/AdminConsole.tsx`
- `app/globals.css`
- `tests/e2e/auth-console.spec.ts`

Expected user impact:

- Fewer dead ends and accidental destructive actions.

Validation method:

- Playwright CRUD flow.
- Keyboard and layout audits.

## Batch 4: Cleanup

Goal: Remove dead 3D code and unused dependency; reduce component bloat by extracting content/model.

Affected files/screens:

- `components/OctopusScene.tsx`
- `package.json`
- `package-lock.json`
- `app/globals.css`

Expected user impact:

- No visible feature loss.
- Cleaner production surface.

Validation method:

- `rg` reference check.
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Batch 5: Deployment validation

Goal: Push validated code and verify live Vercel app.

Affected systems:

- Git remote.
- `https://businessindrc.vercel.app/`
- `https://businessindrc.vercel.app/api/health`

Expected user impact:

- Confirmed public deployment state after push.

Validation method:

- Git push result.
- HTTP checks on live routes.
- Playwright against `PLAYWRIGHT_BASE_URL` if deployment responds.
