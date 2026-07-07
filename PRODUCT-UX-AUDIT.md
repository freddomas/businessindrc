# Product UX Audit

## Inferred product purpose

Grand Katanga Industrial Services Hub is a controlled B2B industrial sourcing and partner qualification platform for OCTOPUS Mining. It should make industrial needs, supplier capacity, verification status and console operations legible.

## Current user journey

1. Public user lands on `/`.
2. User reads a premium OCTOPUS Mining presentation and sector descriptions.
3. User can open `/connexion`.
4. Authenticated operator enters `/console`.
5. Operator searches, filters, views, creates, edits or deletes partner records.

## Critical flows

- Public comprehension: understand what OCTOPUS Mining does and why the platform exists.
- Private activation: log in and reach the console without confusion.
- Partner qualification: filter partner registry, inspect a record, edit status/risk/readiness.
- Controlled sourcing: connect a need/RFQ to relevant qualified partners.
- Governance: keep closed V1 features closed and avoid presenting local credentials as commercial auth.

## Flow-by-flow diagnosis

### Public comprehension

- Severity: P1.
- The home page has strong visuals but reads more like a corporate profile than a sourcing workflow.
- The first viewport does not make the RFQ-to-shortlist job explicit enough.
- CTA hierarchy points to model/sector reading rather than the primary business workflow.

### Private activation

- Severity: P1.
- Login page is adequate, but it does not reinforce controlled access and operational purpose as strongly as it could.
- Error state exists.

### Partner qualification

- Severity: P0.
- Core CRUD exists and tests cover it.
- Missing empty state when filters return no records.
- Delete is immediate, which is weak for production-oriented registry management.
- Fetch failure paths can leave weak feedback if the network or API fails.

### Controlled sourcing

- Severity: P0.
- There is no visible RFQ/opportunity lane in the console despite project scope naming RFQ and opportunities.
- Operators can inspect partners, but the interface does not show how partner data supports a sourcing decision.

### Governance and trust

- Severity: P1.
- Closed V1 flags are mentioned publicly in governance language, which is directionally good.
- More explicit private-console framing is needed so the app does not look like an open marketplace.

## Friction points

- Public CTA flow is not focused on the main sourcing job.
- Console sidebar navigation starts at registry and underplays operational prioritisation.
- Filter results have no recovery state.
- Deletion lacks confirmation.
- Admin console component is too large, making future product changes riskier.

## Trust gaps

- RFQ/opportunity process is implied but not operationalised.
- Readiness score has a method, but the connection between score and active needs is missing.
- Public seed-style company names can be misread as traction unless framed as internal registry/workflow.

## Clarity gaps

- "Why this exists" is clearer than "what the user does next".
- The private console needs a stronger overview of current sourcing lanes before the raw table.

## Hierarchy problems

- Public page: large narrative sections compete with primary flow.
- Console: metrics and table are useful, but no "next operating action" is surfaced before the registry.

## Navigation problems

- Public navigation does not name RFQ/opportunities directly.
- Console navigation should include a sourcing/RFQ lane.

## Accessibility issues

- Existing tests include axe and layout checks.
- Delete confirmation and empty states need keyboard-accessible controls.

## Visual consistency issues

- Public interface is heavily dark; this conflicts with the prior redesign direction to move away from a dark-heavy platform.
- Console uses light workspace with dark sidebar; public and private experiences feel related but not fully coherent.

## Conversion or activation blockers

- Main CTA does not lead users toward the controlled sourcing workflow.
- Private console value is not obvious before login.

## Missing states

- Empty filter result.
- Delete confirmation.
- Network failure on save/delete.
- RFQ lane readiness/matching state.

## Mobile/responsive risks

- Existing tests protect against table panning on mobile.
- Adding RFQ lanes must keep card dimensions stable and avoid cramped button text.

## Severity list

### P0

- Console lacks RFQ/opportunity workflow despite V1 scope.
- Deletion lacks confirmation in a controlled registry.
- Filtered registry lacks an empty state and recovery.

### P1

- Public first viewport underplays the sourcing/RFQ job.
- CTA hierarchy is not centered on the primary product job.
- Console component has too much logic and copy in one file.
- Public UI remains too dark-heavy for the requested visual direction.

### P2

- Minor copy tightening.
- More consistent microcopy between public route and console.
- Remove dead visual/3D code.
