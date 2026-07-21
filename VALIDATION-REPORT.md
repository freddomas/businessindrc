# Validation Report — Octopus Expertise

Date: 2026-07-21

## Portée

Refonte de l'identité, de la page publique, de la connexion, de la console, de l'authentification, de l'accessibilité clavier, du SEO et des contrats de validation.

## Validations ciblées réussies

- `npm run lint`
- `npm run typecheck`
- `npm run test:copy`
- `npm run seed:validate`
- `npm run test:rbac`
- `npm run test:auth`
- `npm run test:db-bootstrap`
- `npm run test:media`
- Playwright public, Chromium 390 + laptop: 8/8.
- Playwright health hors sandbox: `/api/health` 200, 1/1.
- Playwright clavier console: focus initial, boucle Tab/Shift+Tab, Escape et restitution du focus, 1/1.
- Playwright connexion/déconnexion et axe après correctif final: 360, laptop, desktop et wide réussis.

## DRY_RUN global unique

Commande exécutée une seule fois: `npm run qa:full`.

Résultat exact:

- lint: réussi;
- typecheck: réussi;
- tests métier: réussis;
- build Next.js: réussi;
- Playwright: 39 réussis, 35 ignorés selon la matrice, 4 échecs.

Les quatre échecs provenaient d'une cause unique: axe calculait le mot `EXPERTISE` du logo de la console en blanc sur le fond clair principal, ratio 1,07:1, sur 360, laptop, desktop et wide.

Le DRY_RUN global n'a pas été relancé. Le correctif permanent limite le filtre d'inversion au bitmap du logo, fixe la couleur du sous-titre sur la sidebar sombre et stabilise la navigation 360 px. Le scénario concerné a ensuite réussi sur les quatre projets ciblés.

## Base de données

Le premier probe sandbox a échoué avec `EACCES`. Le même `SELECT 1` hors sandbox a réussi et le healthcheck public local a retourné 200. Le code du healthcheck n'a pas été affaibli et aucune valeur d'environnement n'a été affichée.

## Limite de certification

Le build et chaque défaut observé disposent d'une preuve ciblée verte, mais le run global reste historiquement en échec puisqu'il était interdit de le relancer. La production doit donc être vérifiée après le dernier push, sans présenter ce rapport comme un DRY_RUN global vert.
