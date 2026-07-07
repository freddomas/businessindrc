# Implementation Plan

## Batch 1 - Reconnaissance
Goal: confirmer contraintes projet, skill PM/UX/UI, fichiers et tests.

Affected files: no edits.

Validation method: lecture `PMSkill.md`, `AGENTS.md`, `qa/QA_RULES.md`, source app.

Status: completed.

## Batch 2 - Public IA And Hero
Goal: supprimer impression de page vide et clarifier promesse RFQ.

Affected files: `app/page.tsx`, `app/globals.css`.

Expected user impact: compréhension immédiate, images visibles, CTA clair.

Validation method: public smoke Playwright.

Status: completed.

## Batch 3 - Media Enrichment
Goal: enrichir le parcours public sans média externe non déclaré.

Affected files: `public/media/octopus-rfq-operations-v1.png`, `lib/seed-data.ts`, `app/page.tsx`.

Expected user impact: meilleur signal opérationnel RFQ.

Validation method: `npm run test:media`, Playwright media render.

Status: completed.

## Batch 4 - Console Visual Stabilization
Goal: corriger sidebar, cartes RFQ, recherche, table mobile, états.

Affected files: `app/globals.css`.

Expected user impact: console plus lisible, moins cassée, meilleure interaction mobile.

Validation method: auth-console Playwright.

Status: completed.

## Batch 5 - Documentation And Validation
Goal: enregistrer audit, décisions, critères, preuves.

Affected files: product artifacts and validation report.

Validation method: final command matrix.

Status: completed.
