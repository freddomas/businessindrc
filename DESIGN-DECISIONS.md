# Design Decisions

## Decision 1 - Replace Empty Hero Frames With Real Operational Image
Rationale: les faux cadres faisaient croire à des images manquantes.

User impact: compréhension plus rapide, page perçue comme complète.

Affected files: `app/page.tsx`, `app/globals.css`.

Rejected alternative: conserver les cadres et seulement modifier les bordures.

Confidence: high. Reversibility: easy.

## Decision 2 - Keep Public IA Anchored On RFQ
Rationale: le produit V1 est sourcing B2B industriel, pas une vitrine générique.

User impact: le premier parcours explique le travail réel: cadrer, vérifier, mobiliser.

Affected files: `app/page.tsx`.

Rejected alternative: multiplier les sections marketing.

Confidence: high. Reversibility: easy.

## Decision 3 - Add One Local Approved Visual Asset
Rationale: les actifs existants étaient bons mais insuffisants pour une page riche.

User impact: la section RFQ gagne une preuve visuelle claire.

Affected files: `public/media/octopus-rfq-operations-v1.png`, `lib/seed-data.ts`, `app/page.tsx`.

Rejected alternative: utiliser une image externe non déclarée.

Confidence: high. Reversibility: easy.

## Decision 4 - Use Final CSS Remediation Layer
Rationale: le CSS historique contient plusieurs directions empilées; un refactor total aurait augmenté le risque.

User impact: défauts visibles corrigés rapidement et testés.

Affected files: `app/globals.css`.

Rejected alternative: refactor CSS complet dans ce cycle.

Confidence: medium. Reversibility: moderate.

## Decision 5 - Restore Mobile Table As No-Panning Layout
Rationale: les champs de décision ne doivent pas être cachés derrière un scroll horizontal sur mobile.

User impact: statut, risque, indice, évaluation et actions restent accessibles.

Affected files: `app/globals.css`.

Rejected alternative: accepter le scroll horizontal comme compromis.

Confidence: high. Reversibility: easy.

## Decision 6 - Keep Auth And API Semantics Unchanged
Rationale: la demande est UX/UI uniquement.

User impact: aucun risque de régression sécurité ou données.

Affected files: no backend files.

Rejected alternative: modifier healthcheck ou API pour faire passer des tests.

Confidence: high. Reversibility: not applicable.
