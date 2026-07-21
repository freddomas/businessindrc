# Visual QA — Octopus Expertise

Date: 2026-07-21

## Direction validée

Lecture: réseau de confiance industriel pour décideurs achats et opérations. La façade publique utilise une composition asymétrique, une transition clair/graphite et des signaux de corridor. La console reste dense, familière et orientée décision.

- Variation: 8/10 public, 3/10 console.
- Motion: 7/10 public, 2/10 console.
- Densité: 6/10 public, 8/10 console.

## Matrice rendue

- Accueil: 390 px et laptop, page complète.
- Connexion: 390 px et laptop.
- Console authentifiée: 360, 390, laptop, desktop et wide selon les scénarios.
- Mouvement réduit: accueil 390 et laptop.
- Modales console: clavier, Escape, boucle de focus, restauration et verrouillage du scroll.

## Contrôles

- absence de débordement document;
- absence de chevauchement des cibles interactives;
- contraste axe sans violation après correction ciblée;
- médias chargés, décodés, avec alt et identifiant de registre;
- aucun message console ou échec réseau inattendu;
- navigation console 360 px sans lien rogné;
- table mobile lisible sans panoramique du document;
- contenu utilisable avec `prefers-reduced-motion`.

## Preuves versionnées

- `qa/evidence/home-desktop-full.png`
- `qa/evidence/home-mobile-full.png`
- `qa/evidence/login-desktop-full.png`
- `qa/evidence/console-mobile-full.png`

Les captures sont des sorties Playwright du code final de cette couche. Le statut exact du DRY_RUN global reste documenté dans `VALIDATION-REPORT.md`.
