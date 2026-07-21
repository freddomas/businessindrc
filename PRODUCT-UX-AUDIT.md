# Product UX/UI Audit

## Purpose Inferred
Plateforme Next.js/Vercel pour Octopus Expertise: cadrer des besoins industriels, qualifier des fournisseurs locaux et piloter des décisions RFQ dans une console privée.

## Inputs Audited
- Captures utilisateur du 2026-07-07.
- `app/page.tsx`, `app/globals.css`, `components/AdminConsole.tsx`, `components/LoginForm.tsx`.
- Règles projet dans `AGENTS.md` et `qa/QA_RULES.md`.
- Tests Playwright, scripts copy/media/RBAC/build.

## Critical Findings

### P0 - Hero visuellement trompeur
Le hero affichait des cadres sombres vides au lieu d'exploiter l'image industrielle disponible. Impact: perception de page cassée, pauvreté média, mauvais cadrage.

Correction: suppression des faux cadres, image hero visible en arrière-plan, hiérarchie texte resserrée, preuve opérationnelle latérale.

### P0 - Navigation vers sections faibles ou peu lisibles
Les liens existaient mais menaient à des sections qui ne répondaient pas clairement au job utilisateur. Impact: navigation fonctionnelle en code mais faible en UX.

Correction: sections publiques réordonnées et nommées autour de RFQ, capacités, qualification, gouvernance.

### P0 - Console mobile dépendante d'une table large
La table partenaire reprenait une largeur fixe qui forçait le scroll horizontal. Impact: champs Indice, Evaluation, Actions difficiles à lire sur mobile.

Correction: override mobile pour table en vue sans largeur minimale; test dédié passé.

### P1 - Recherche console mal cadrée
Le label, l'icône et le champ recherche se superposaient visuellement. Impact: interface perçue comme non finie.

Correction: label vertical, icône ancrée au champ, hauteur et padding stabilisés.

### P1 - Cartes RFQ et workflow trop plates
Les cartes avaient une logique métier mais peu de hiérarchie, feedback ou rythme. Impact: faible fluidité interactive et peu de signal de priorité.

Correction: hover/focus, badges d'urgence, hauteur stable, contrastes et actions plus lisibles.

### P1 - Pauvreté média
Deux bons actifs existaient mais étaient sous-exploités. Impact: la plateforme semblait abstraite et vide.

Correction: actifs existants rendus visibles + nouvel actif `octopus-rfq-operations-v1.png` déclaré dans le registre média.

### P1 - Sidebar privée mal finie
La session et les liens console paraissaient désalignés et trop pauvres. Impact: faible confiance dans l'espace privé.

Correction: session box compacte, navigation stable, largeur sidebar et état hover/focus clarifiés.

### P2 - Cohérence visuelle
Le CSS mélangeait ancien thème clair et thème sombre final. Impact: maintenance plus risquée.

Correction immédiate: couche UX/UI finale ciblée. Refactor complet CSS reporté car risqué hors périmètre UI immédiat.

## Flow Diagnosis
- Public comprehension: amélioré par hero RFQ + sections structurées.
- Private activation: login visuellement renforcé avec média RFQ.
- Console qualification: cartes RFQ, filtres, table et états vides stabilisés.
- Responsive: validé par Playwright sur 360, 390, tablette, laptop, desktop, wide.

## Remaining Risk
Le CSS reste volumineux et répétitif. Le rendu est validé, mais un refactor CSS modulaire serait utile dans un cycle séparé.
