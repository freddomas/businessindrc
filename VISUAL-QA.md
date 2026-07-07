# Visual QA

## Screens Inspected
- Public home `/`
- Login `/connexion`
- Private console `/console`
- RFQ cards
- Partner registry table
- Empty registry state
- Mobile table layout

## Viewports Tested
- 360px
- 390px
- 768px tablet
- 1366px laptop
- 1440px desktop
- 1920px wide

## Defects Found And Fixed
- Empty-looking hero frames: removed.
- Hero image too hidden: restored full visual role.
- Hero title too massive on mobile: reduced responsive clamp.
- Access button label hidden on mobile: restored.
- Header links hit-test issue on mobile: z-index stabilized.
- Search label/icon overlap: fixed.
- RFQ cards flat and cramped: fixed with stable layout and hover/focus.
- Mobile partner table horizontal panning: fixed.
- Public media poverty: added local approved RFQ operations image.

## Visual Evidence
- Playwright report generated under `playwright-report/`.
- Last Playwright run status recorded in `test-results/.last-run.json` as `passed`.
- Playwright attached screenshots for public, login and console checks during e2e.
- Online public smoke against `https://businessindrc.vercel.app` passed on 390px and laptop viewports.

## Remaining Visual Risk
The CSS source still contains historical rules. The rendered output is validated, but a future cleanup should consolidate the file into a smaller design system.
