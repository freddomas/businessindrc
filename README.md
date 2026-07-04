# Business in DRC

Squelette minimal Next.js pour un premier deploiement Vercel avec Postgres.

## Demarrage local

```bash
npm install
npm run dev
```

## Variables Vercel/Postgres

Copier `.env.example` vers `.env.local` en local, ou connecter une base
Postgres/Neon dans Vercel pour injecter automatiquement `DATABASE_URL` ou
`POSTGRES_URL`.

Endpoint de verification :

```text
/api/health
```

Sans variable Postgres, l'endpoint repond quand meme `ok: true` avec
`database: "not_configured"` pour permettre un premier deploiement.
