# Acceptance Criteria

## Public UX
- [x] Hero RFQ lisible dans la première vue.
- [x] Image hero visible, cadrée et non masquée par des faux panneaux.
- [x] Les liens `Flux RFQ`, `Capacités`, `Qualification`, `Gouvernance` ciblent des sections existantes.
- [x] Au moins trois actifs médias locaux approuvés sont disponibles.
- [x] Aucun mot public interdit par `AGENTS.md` dans la copie visible.

## Console UX
- [x] Sidebar privée stabilisée.
- [x] Cartes RFQ avec urgence, corridor, besoin, nombre de partenaires et prochaine action.
- [x] Recherche sans chevauchement label/icône/champ.
- [x] Etat vide du registre avec action de récupération.
- [x] Table partenaire lisible sans scroll horizontal mobile.

## Responsive And Accessibility
- [x] Playwright public smoke sur 360, 390, tablette, laptop, desktop, wide.
- [x] Axe checks passés via `auditPage`.
- [x] Focus/hover visibles sur liens et boutons critiques.
- [x] Réduction de mouvement validée.

## Governance
- [x] Pas de changement auth.
- [x] Pas de changement DB/API.
- [x] Pas de secret exposé.
- [x] Nouvel actif média déclaré et approuvé.

## Technical Validation
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run test:e2e` hors sandbox, sortie 0
