# Product Plan - UX/UI Remediation

## Product Goal
Refondre l'expérience visuelle et interactive d'Octopus Expertise en restant strictement centré sur la V1: sourcing B2B industriel, flux RFQ, fournisseurs, opportunités, qualification, vérification et console privée.

## Target User Assumption
Utilisateur principal: responsable opérations/procurement Octopus Expertise qui doit transformer un besoin industriel critique en shortlist de partenaires locaux qualifiés.

Utilisateur secondaire: décideur industriel qui évalue rapidement si Octopus Expertise sait cadrer, vérifier et mobiliser des capacités locales dans le Grand Katanga.

## Primary Job-To-Be-Done
Comprendre le modèle opéré RFQ, identifier les corridors/capacités utiles, puis utiliser la console pour filtrer, comparer, qualifier et suivre des partenaires.

## Product Promise
Octopus Expertise structure un besoin industriel en flux RFQ contrôlé: cadrage, lecture terrain, vérification, shortlist, décision privée et traçabilité.

## Chosen Direction
Direction retenue: poste de pilotage industriel premium, plus visuel, plus clair, plus opérationnel.

Le choix rejeté: conserver les faux panneaux décoratifs sombres et les grilles plates. Ils créaient une impression d'images vides, de répétition et de produit incomplet.

## Scope
- Recomposer la page publique autour du flux RFQ et de visuels industriels réels/approuvés.
- Rendre les images déjà approuvées visibles et utiles.
- Ajouter un actif local approuvé pour enrichir la section RFQ.
- Corriger les faux alignements, les cadres vides, la hiérarchie hero, les liens d'ancrage et les grilles.
- Corriger les points console visibles: sidebar, cartes RFQ, recherche, table mobile, états vides et interactivité.
- Préserver l'auth, les API, la base, les flags V1 et les règles de secret.

## Non-Goals
- Pas de changement backend ou modèle de données.
- Pas d'activation paiements, webhooks, API publique ou intégrations externes.
- Pas d'exposition de secrets, identifiants ou valeurs `.env`.
- Pas de médias externes non déclarés.

## Success Criteria
- La première vue explique clairement le flux RFQ opéré.
- Les images publiques sont visibles, chargées et cadrées.
- Les ancres de navigation pointent vers des sections existantes.
- Les cartes ne se chevauchent pas et gardent des dimensions stables.
- La recherche console ne superpose plus label, icône et champ.
- La console mobile n'impose pas de panoramique horizontal pour lire les champs de décision.
- Les tests copy, media, RBAC, build et e2e passent.

## Assumptions
- Les partenaires et flux visibles en console restent des données de validation contrôlée.
- Le nouvel actif généré est acceptable car local, déclaré, licencié et approuvé dans le registre média.
- Les corrections CSS finales peuvent neutraliser l'ancien thème sans refactor complet du fichier CSS dans ce cycle.

## Risks
- Le fichier CSS contient encore des couches historiques. Risque maintenabilité moyen, atténué par une couche finale documentée et testée.
- La console dépend du healthcheck DB pour la validation complète; en sandbox, la QA peut échouer sans représenter un défaut UI.

## Decision Boundaries
- V1 flags restent fermés.
- `vercel pull` interdit.
- Vérification Postgres via `/api/health`.
- Aucun secret dans les rapports, logs publics ou UI.
