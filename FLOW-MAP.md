# Flow Map

## Flow 1 - Public RFQ Comprehension
Entry point: `/`

User goal: comprendre rapidement ce qu'Octopus Expertise fait.

Previous friction: hero trop massif, image invisible, faux cadres, CTA noyé.

Target flow:
1. Lire promesse RFQ dans le hero.
2. Voir une image industrielle réelle.
3. Accéder au flux RFQ ou à la console.
4. Lire les étapes de cadrage, shortlist, vérification, mobilisation.

Completion criteria: le job principal est visible dans la première vue et les ancres fonctionnent.

## Flow 2 - Capability And Trust Scan
Entry point: navigation publique vers `#capacites`, `#qualification`, `#gouvernance`.

User goal: vérifier que la plateforme couvre secteurs, corridors, qualification et contrôle privé.

Previous friction: sections répétitives, faible image, faible différenciation.

Target flow:
1. Parcourir registre qualifié.
2. Voir terrain et opérations avec image.
3. Voir intelligence RFQ avec image dédiée.
4. Lire capacités par secteur.
5. Comprendre gouvernance privée.

Completion criteria: pas de section vide, pas de lien inutile, chaque bloc a une fonction.

## Flow 3 - Private Login
Entry point: `/connexion`

User goal: accéder à la console contrôlée.

Previous friction: page correcte mais visuellement isolée du reste.

Target flow:
1. Reconnaitre l'espace OCTOPUS.
2. Comprendre que l'accès est privé.
3. Utiliser le formulaire sans confusion.

Completion criteria: login rendu, état submit désactivé, erreurs visibles.

## Flow 4 - RFQ Console Shortlist
Entry point: `/console#flux-rfq`

User goal: choisir une priorité RFQ et voir la shortlist pertinente.

Previous friction: cartes RFQ visibles mais hiérarchie et feedback faibles.

Target flow:
1. Lire les cartes par urgence, corridor, besoin, nombre mobilisable.
2. Cliquer une carte.
3. Voir le registre filtré.
4. Réinitialiser si le résultat est vide ou trop restreint.

Completion criteria: RFQ lanes pilotent bien le registre et l'état vide permet la récupération.

## Flow 5 - Registry Qualification
Entry point: `/console#registre`

User goal: chercher, filtrer, ouvrir, modifier ou retirer un partenaire.

Previous friction: recherche mal cadrée, table mobile trop large.

Target flow:
1. Rechercher par partenaire, ville, secteur, contact ou services.
2. Filtrer par secteur/statut.
3. Lire statut, risque, indice, évaluation et actions sans scroll horizontal mobile.
4. Ouvrir une fiche ou modifier.
5. Confirmer explicitement le retrait.

Completion criteria: Playwright mobile confirme absence de scroll horizontal dans `.partners-table-wrap`.
