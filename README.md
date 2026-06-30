# accomodation

Development setup:

1. Copy `.env` and set your Postgres URL:

```bash
cp .env .env.local
# edit .env.local
```

2. Start dev server:

```bash
pnpm install
pnpm dev
```

3. `src/db.ts` exports a `db` instance (drizzle) using `DATABASE_URL` from `.env`.
