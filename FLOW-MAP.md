# Flow Map

## Flow 1: Public comprehension to controlled access

Entry point: `/`

User goal: understand whether OCTOPUS Mining can structure industrial sourcing and know the next controlled step.

Current steps:

1. Read hero.
2. Scroll role, network, operations, sectors, model and governance.
3. Click private access.

Friction points:

- RFQ/sourcing job is not named early enough.
- CTAs lead to reading sections rather than the controlled operating flow.

Dead ends:

- Public page does not explain what happens after a need is framed.

Missing feedback:

- No visible bridge between public promise and private console workflow.

Target flow:

1. First viewport states the operated sourcing promise.
2. Primary CTA jumps to RFQ workflow explanation.
3. Secondary CTA opens private console login.
4. Public user understands that V1 is controlled and private.

Affected screens/components:

- `app/page.tsx`
- `app/globals.css`
- `lib/product-content.ts`

Completion criteria:

- Primary job and main CTA visible in first viewport.
- Public copy still passes forbidden-word checks.

## Flow 2: Login to console

Entry point: `/connexion`

User goal: authenticate and reach the private operating console.

Current steps:

1. Enter identifier and password.
2. Submit.
3. Redirect to `/console`.

Friction points:

- Login is functional; minimal issue.

Dead ends:

- Failed login shows an error.

Missing feedback:

- Submit state exists but can be visually stronger.

Target flow:

1. Controlled access framing remains clear.
2. Submit disabled during verification.
3. Error remains visible and accessible.

Affected screens/components:

- `app/connexion/page.tsx`
- `components/LoginForm.tsx`

Completion criteria:

- Existing auth e2e still passes.

## Flow 3: Console RFQ lane to partner shortlist

Entry point: `/console`

User goal: identify which active industrial need should be handled and which partner pool can support it.

Current steps:

1. Console opens on metrics and registry.
2. Operator filters/searches partners manually.

Friction points:

- No active need/RFQ lane.
- No matched partner count or next action.

Dead ends:

- Operator must infer sourcing relevance from raw table.

Missing feedback:

- No visible "ready", "needs review" or "risk" state per opportunity.

Target flow:

1. Console opens with a sourcing board before registry.
2. Each lane shows sector need, corridor, urgency, matched partner count and next action.
3. Clicking a lane applies registry filters.

Affected screens/components:

- `components/AdminConsole.tsx`
- `lib/console-model.ts`
- `app/globals.css`
- `tests/e2e/auth-console.spec.ts`

Completion criteria:

- RFQ board visible after login.
- Clicking a lane updates the registry toward a relevant shortlist.

## Flow 4: Registry filtering

Entry point: `/console#registre`

User goal: find partner records by sector, status or text.

Current steps:

1. Search or select filters.
2. Review table.

Friction points:

- Empty results do not explain what happened or how to recover.

Dead ends:

- User can stare at an empty table without next action.

Missing feedback:

- No clear "no result" state.

Target flow:

1. Filters show result count.
2. Empty result explains no match and offers a clear reset action.

Affected screens/components:

- `components/AdminConsole.tsx`
- `app/globals.css`
- `tests/e2e/auth-console.spec.ts`

Completion criteria:

- Empty state appears and reset button restores rows.

## Flow 5: Partner mutation

Entry point: registry row actions.

User goal: create, edit or remove a partner record without accidental destructive action.

Current steps:

1. Add/edit modal.
2. Save.
3. Delete directly from row.

Friction points:

- Delete is immediate.
- Network failures need more robust handling.

Dead ends:

- Failed save/delete can leave ambiguous state.

Missing feedback:

- Explicit delete confirmation.
- Error message with recovery path.

Target flow:

1. Save/delete actions expose saving state.
2. Delete requires confirmation.
3. API/network failure returns operator to a usable state.

Affected screens/components:

- `components/AdminConsole.tsx`
- `tests/e2e/auth-console.spec.ts`

Completion criteria:

- Create/edit/delete e2e still passes with updated confirmation.
