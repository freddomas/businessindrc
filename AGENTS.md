# Instructions du projet

- Projet Next.js/Vercel pour Grand Katanga Industrial Services Hub.
- Le produit V1 doit rester centré sur sourcing B2B industriel, fournisseurs, RFQ, opportunités, vérification et console.
- Ne pas exposer de secrets dans le dépôt, les logs, les pages publiques ou les rapports.
- Ne pas exécuter `vercel pull` sur ce projet: préserver `.env.local`.
- La vérification Postgres passe par `GET /api/health`.
- Utiliser `DATABASE_URL` en priorité, avec `POSTGRES_URL` comme fallback.
- Les flags V1 restent fermés sauf décision explicite: `PUBLIC_API_ENABLED=false`, `WEBHOOKS_ENABLED=false`, `EXTERNAL_INTEGRATIONS_ENABLED=false`, `PAYMENTS_ENABLED=false`.
- L'UI publique ne doit pas afficher: demo, démonstration, test, sample, fake, mock, lorem, placeholder, tutoriel, guide, exemple.
- Aucune image non approuvée ne peut être affichée publiquement.
- Les utilisateurs locaux avec mot de passe partagé sont réservés à la validation contrôlée; ne pas les présenter comme un mécanisme commercial.
