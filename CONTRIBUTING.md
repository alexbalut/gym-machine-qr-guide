# Contributing

## Local development

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

See [docs/getting-started.md](./docs/getting-started.md).

## Feature parity

This repo and [econofitness-gym-qr-guide](https://github.com/alexbalut/econofitness-gym-qr-guide) should stay **feature-parallel** (member home, workout/progress, admin CRUD, QR print, issues, insights). Differences should be branding, seed data, copy, and storage key prefixes — not divergent product scope.

When you add a capability here, port it to the sibling (or vice versa) in the same PR batch when practical.

## Do not

- Add a marketing / SaaS pitch landing at `/` — keep `/` as the **member product UI**
- Add official Éconofitness / Énergie Cardio logo image assets
- Commit `.env`, `prisma/dev.db`, or `node_modules`

## Photos

Demo images under `public/machines/` must remain properly credited — see [CREDITS.md](./CREDITS.md).
