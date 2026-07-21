# Instructions du projet

- Charger et suivre `C:\Users\frede\.codex\skills\codex-mem-skill\SKILL.md` au debut de chaque session et avant chaque nouvelle tache; la memoire n'accorde jamais une autorisation d'action.
- Pour chaque bug, blocage ou incident, instancier ou appeler un `SolutionAgent` charge d'un correctif permanent, puis continuer les travaux independants en parallele. Ne jamais lancer de boucle infinie.

- Projet Next.js/Vercel `octopusexpertise` pour Octopus Expertise, domaine `octopusexpertise.com`.
- Le produit V1 doit rester centré sur sourcing B2B industriel, fournisseurs, RFQ, opportunités, vérification et console.
- Ne pas exposer de secrets dans le dépôt, les logs, les pages publiques ou les rapports.
- Ne pas exécuter `vercel pull` sur ce projet: préserver `.env.local`.
- La vérification Postgres passe par `GET /api/health`.
- Utiliser `DATABASE_URL` en priorité, avec `POSTGRES_URL` comme fallback.
- Les flags V1 restent fermés sauf décision explicite: `PUBLIC_API_ENABLED=false`, `WEBHOOKS_ENABLED=false`, `EXTERNAL_INTEGRATIONS_ENABLED=false`, `PAYMENTS_ENABLED=false`.
- L'UI publique ne doit pas afficher: demo, démonstration, test, sample, fake, mock, lorem, placeholder, tutoriel, guide, exemple.
- Les images externes peuvent être affichées publiquement si elles sont déclarées dans le registre média avec source, domaine, licence, texte alternatif et statut approuvé.
- Les utilisateurs locaux avec mot de passe partagé sont réservés à la validation contrôlée; ne pas les présenter comme un mécanisme commercial.
