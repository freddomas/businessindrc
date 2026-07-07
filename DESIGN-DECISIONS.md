# Design Decisions

## Decision 1: Position the product as an operated sourcing command center

Rationale: The repository scope is sourcing B2B industrial, suppliers, RFQ, opportunities, verification and console. A corporate brochure alone does not satisfy that scope.

User impact: Public users understand the controlled process; operators see the work surface as sourcing-oriented.

Business impact: Better alignment between the platform promise and the console workflow.

Affected screens/files: `/`, `/console`, `app/page.tsx`, `components/AdminConsole.tsx`.

Rejected alternative: Keep the home page as mostly brand/profile content and only polish visuals.

Confidence: High.

Assumption: The V1 process is operated by OCTOPUS Mining, not self-serve.

Reversibility: Moderate.

## Decision 2: Add RFQ/opportunity lanes without opening public submissions

Rationale: RFQ/opportunities are in scope, but V1 flags and instructions keep public APIs and external flows closed.

User impact: Operators can connect partner data to active needs without exposing public mutation.

Business impact: Makes the console more valuable while respecting current governance.

Affected screens/files: `components/AdminConsole.tsx`, `lib/console-model.ts`, tests.

Rejected alternative: Add a public RFQ form. That would overstep V1 controls and require data model/security decisions.

Confidence: High.

Assumption: Static operational briefs are acceptable for V1 training data and UI validation.

Reversibility: Easy.

## Decision 3: Require confirmation before deleting a partner

Rationale: A partner registry is operational data; immediate delete is a production-risk behavior.

User impact: Prevents accidental destructive action.

Business impact: Reduces operational risk.

Affected screens/files: `components/AdminConsole.tsx`, e2e tests.

Rejected alternative: Keep single-click delete for speed.

Confidence: High.

Assumption: Slight extra click is acceptable for destructive action.

Reversibility: Easy.

## Decision 4: Extract product content and console model out of large components

Rationale: Large page/component files make product changes harder to review and validate.

User impact: Indirect; safer iteration and fewer regressions.

Business impact: Better maintainability before production hardening.

Affected screens/files: `app/page.tsx`, `lib/product-content.ts`, `lib/console-model.ts`.

Rejected alternative: Keep all arrays and logic inline.

Confidence: High.

Assumption: No runtime performance penalty matters here.

Reversibility: Easy.

## Decision 5: Remove unused 3D scene and dependency

Rationale: Dead code and unused dependencies increase bundle, audit and maintenance burden.

User impact: No visible loss because the component is not rendered.

Business impact: Cleaner production surface.

Affected screens/files: `components/OctopusScene.tsx`, `package.json`, `package-lock.json`, CSS.

Rejected alternative: Keep unused code for possible future use.

Confidence: Medium until validation confirms no references remain.

Assumption: No planned route imports `OctopusScene`.

Reversibility: Easy through git history.

## Decision 6: Move the visual system away from dark-heavy presentation

Rationale: The prior redesign direction requested a platform out of a dark-heavy look, and the current public page is still dominated by dark surfaces.

User impact: More professional, inspectable, operational feel.

Business impact: Better trust for B2B procurement and industrial stakeholders.

Affected screens/files: `app/globals.css`, `/`, `/connexion`, `/console`.

Rejected alternative: Keep the dark cinematic style and only adjust spacing.

Confidence: Medium.

Assumption: Premium industrial does not need a dark-dominant palette.

Reversibility: Moderate.
