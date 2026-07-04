# Grand Katanga Industrial Services Hub

Plateforme B2B industrielle pour le Grand Katanga: annuaire fournisseurs,
RFQ, sourcing managé, vérification, opportunités et console opérationnelle.

## Démarrage local

```bash
npm install
npm run dev
```

## Base de données

Copier `.env.example` vers `.env.local` en local, ou connecter une base
Postgres/Neon dans Vercel pour injecter automatiquement `DATABASE_URL` ou
`POSTGRES_URL`.

```bash
npm run db:seed
```

## Vérification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Endpoint de santé: `/api/health`.

Sans variable Postgres, les pages publiques utilisent le seed déterministe en
lecture seule, mais les écritures RFQ nécessitent une base configurée.
