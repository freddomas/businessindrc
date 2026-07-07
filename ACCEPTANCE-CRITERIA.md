# Acceptance Criteria

## Product and flow

- Public first viewport states the operated industrial sourcing promise.
- Public primary CTA leads to RFQ/sourcing workflow explanation.
- Private console shows a sourcing/RFQ board before or adjacent to the registry.
- Each RFQ/opportunity lane shows target need, corridor, urgency, matched partners and next action.
- Clicking a lane filters the registry to a relevant shortlist.
- Registry filtering has an explicit empty state and reset action.
- Partner delete requires explicit confirmation.

## UI states

- Login submit has disabled/submitting state.
- Create/edit partner save has disabled/saving state.
- Save/delete failures show an actionable error and leave the UI usable.
- Empty registry filter state is keyboard-accessible.
- Delete confirmation can be cancelled.

## Responsive and accessibility

- No obvious overlap, clipping or document-level horizontal overflow at 360, 390, 768, 1366 and 1440 widths.
- Primary actions have stable dimensions and readable labels.
- Keyboard focus remains visible on interactive controls.
- Axe checks pass on critical routes.

## Governance

- Public UI does not display forbidden internal words from `AGENTS.md`.
- No secrets, database URLs or local passwords are exposed in public UI or reports.
- V1 flags remain closed unless explicitly changed.
- Local shared credentials remain available for controlled tests only.

## Technical

- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run test` passes.
- `npm run build` passes.
- `npm run test:e2e` passes locally.
- `/api/health` is used for database/runtime verification.
- Public deployment validates after push at `https://businessindrc.vercel.app/`.
