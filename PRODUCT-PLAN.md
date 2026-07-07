# Product Plan

## Product goal

Improve Grand Katanga Industrial Services Hub from a presentation-heavy site into a clearer industrial sourcing workspace: public users must understand the operated sourcing model quickly, and internal users must be able to qualify partners against RFQ-style needs inside the private console.

## Target user assumption

Primary user: OCTOPUS Mining operations or procurement lead coordinating industrial sourcing requests for mining, construction, logistics, IT, medical, legal, agriculture and site services in Lualaba and Haut-Katanga.

Secondary user: a senior buyer or industrial executive evaluating whether OCTOPUS Mining can structure local supplier capacity before being invited into a controlled private process.

## Primary job-to-be-done

Turn an industrial need into a controlled shortlist of qualified local partners, with visible status, risk, readiness, coverage and next operating action.

## Product promise

OCTOPUS Mining gives a disciplined path from RFQ framing to partner qualification and controlled mobilisation, without opening public APIs, payments, webhooks or self-serve commercial flows in V1.

## Chosen product direction

Operational command center. The public route should explain the sourcing and verification model, while the private console should act as the work surface for partner registry, RFQ lanes, qualification and coverage.

## Scope

- Clarify the public first viewport around sourcing, RFQ framing and private console access.
- Add a private console RFQ/opportunity lane using existing partner data as the matching surface.
- Improve empty, error, disabled, saving and confirmation states for critical console actions.
- Improve responsive readability and navigation clarity.
- Extract product copy/data from large page components.
- Remove unused front-end code and unused 3D dependency if validation confirms it is dead.

## Non-goals

- No public self-serve RFQ submission.
- No payment, webhook, external integration or public API enablement.
- No auth model change beyond preserving controlled local credentials for validation.
- No production migration unless needed for a validated product fix.
- No secret exposure in reports, logs or UI.

## Success criteria

- Primary public promise visible in the first viewport.
- Console exposes registry plus RFQ/opportunity prioritisation without needing horizontal panning on mobile.
- Partner filtering has a clear empty state and recovery action.
- Partner deletion requires explicit confirmation.
- Mutating console actions handle network/API failure without leaving the UI stuck.
- Public copy still passes forbidden-word checks.
- `lint`, `typecheck`, `test`, `build`, and Playwright e2e pass locally.
- Public deployment is validated after push through `https://businessindrc.vercel.app/` and `/api/health`.

## Assumptions

- RFQ/opportunity lanes can be represented as front-end operational briefs derived from existing partner data for V1.
- Public visitors should not be able to submit or mutate data in V1.
- Seeded/training partner data is acceptable for controlled validation but should not be presented as market traction.

## Risks

- Adding RFQ language without a persisted RFQ model could overpromise if framed as a public feature. Mitigation: present it as controlled private operational workflow.
- Broad visual overhaul can break strict public copy and layout QA. Mitigation: keep QA scripts authoritative and run e2e across the configured viewport matrix.
- Local shared credentials are useful for tests but are not commercial auth. Mitigation: keep them private to validation wording and do not surface them publicly.

## Decision boundaries

- V1 flags remain closed: public API, webhooks, external integrations and payments stay disabled.
- Postgres is verified only through `/api/health`.
- `vercel pull` is not allowed.
- Local temporary credentials are preserved for tests.
