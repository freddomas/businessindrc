# Lessons Learned

## 2026-07-05 Visual Rebuild QA

### Ce qui s'est mal passé

Le socle QA initial pouvait accepter une refonte visuelle sans capture systématique, sans audit axe sur toutes les pages publiques et sans scan copy sur les composants partagés.

### Cause racine

La couverture était centrée sur quelques routes et sur les fichiers `app/`, alors que le texte visible et les interactions principales vivent aussi dans `components/`.

### Règle à appliquer désormais

Toute refonte UI doit produire des preuves Playwright attachées au rapport, scanner `components/`, vérifier l'absence de copy interdite, et auditer console, réseau, layout, visibilité réelle, texte et accessibilité sur les routes critiques.

### Test de non-régression ajouté

`tests/e2e/platform.spec.ts` couvre les routes publiques, le flux fiche fournisseur, la redirection console, le mode mouvement réduit et `/api/health`.

### Impact sur le framework QA

Le script `check-copy.ts` scanne maintenant les composants et le mot interdit `placeholder`. Les captures d'inspiration tierces restent locales et ignorées par Git.

## 2026-07-05 Mobile Overflow Lock

### Ce qui s'est mal passé

La première matrice complète a détecté un overflow horizontal sur `/zones/kolwezi` en 360px.

### Cause racine

Un heading inline gardait son lien d'action sur la même ligne en très petit viewport, et le reflet animé des cartes pouvait contribuer au `scrollWidth`.

### Règle à appliquer désormais

Les sections avec action inline doivent passer en colonne sous 760px, et les effets de reflet doivent être confinés par `contain: paint` ou une géométrie qui ne sort pas du composant.

### Test de non-régression ajouté

`tests/e2e/platform.spec.ts` audite l'overflow horizontal sur `/zones/kolwezi` dans le projet `chromium-360`.

### Impact sur le framework QA

La matrice responsive complète reste obligatoire après toute modification de motion, car les reflets et transforms peuvent créer un scroll horizontal invisible au premier regard.
