# Visual QA

## Screens inspected

- Public home `/`
- Private login `/connexion`
- Authenticated console `/console`
- Console RFQ lane interaction
- Registry empty filter state
- Partner detail, edit and delete confirmation flows

## Viewport sizes tested

- 360 x 800
- 390 x 844
- 768 x 1024
- 1366 x 768
- 1440 x 900
- 1920 x 1080

## Visual observations

- Public first viewport now exposes the sourcing promise, the RFQ CTA and private console access without requiring scroll.
- The next section is visible below the hero on desktop, preserving onward flow.
- Public UI moved from dark-heavy presentation to a lighter industrial command-center style.
- Cards, section bands and CTA hierarchy are consistent across public sections.
- Login page remains focused and readable with a single controlled-access action.
- Console shows RFQ sourcing lanes before qualification/registry work, making the primary operating flow visible.
- Registry empty state and delete confirmation are visible, keyboard-reachable and recoverable.
- Mobile public route stacks sections cleanly; no overlap or clipping was detected by Playwright layout audits.
- Mobile console keeps the partner table in a card layout without document-level horizontal panning.

## Evidence

- `npm run test:e2e` passed with Playwright browser, layout, text, media and axe checks across configured projects.
- Playwright report artifacts generated under `playwright-report/`.
- Representative captures inspected manually from `playwright-report/data`, including desktop and mobile public home plus login.

## Defects found and fixed

- Old public test still expected the previous H1; updated to the new sourcing promise.
- Detail modal had two buttons named `Fermer`, causing ambiguous accessibility targeting; icon buttons now use distinct accessible labels.
- The first sandboxed e2e run failed database paths; rerun outside sandbox validated `/api/health` and partner mutations.
- Parallel `typecheck` and `build` produced the known `.next/types` false negative; isolated `typecheck` passed.

## Remaining visual risks

- Some full-page smoke screenshots can capture below-fold lazy images before browser scroll triggers loading. The dedicated media-render test scrolls to the image and validates it loads. Human QA should still scroll the public page on a real phone before commercial launch.
- The app is technically healthy, but "ready for prod" should not be read as commercial launch readiness until production auth, monitoring, backup/restore and operational ownership are formally approved.
