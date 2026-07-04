# Instructions du projet

- Projet minimal Next.js destine a un premier deploiement Vercel.
- Garder les changements simples tant que le produit n'est pas defini.
- Ne pas exposer de secrets dans le depot.
- La verification Postgres passe par `GET /api/health`.
- Utiliser `DATABASE_URL` en priorite, avec `POSTGRES_URL` comme fallback.
