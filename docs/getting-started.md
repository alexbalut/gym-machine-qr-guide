# Getting started

## Prerequisites

- Node.js 20+ recommended
- npm

## Clone & env

```bash
git clone https://github.com/alexbalut/gym-machine-qr-guide.git
cd gym-machine-qr-guide
cp .env.example .env
```

`.env.example` contains:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-to-a-long-random-string"
APP_URL="http://localhost:3000"
```

Prisma resolves `DATABASE_URL=file:./dev.db` relative to the `prisma/` folder → `prisma/dev.db`.

## Install, database, seed

```bash
npm install
npx prisma db push
npm run seed
```

Or one-shot (also copies `.env` from `.env.example` if missing):

```bash
npm install && npm run setup
```

## Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Staff: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Credentials: `admin@demofitness.ca` / `demo1234`

## Production build (local check)

```bash
npm run build && npm start
```

## Re-seed

```bash
npm run seed
```

Seed **wipes** gyms, users, machines, and issues, then recreates Demo Fitness Montréal with 10 machines and sample issues/views.

## Common errors

### `Environment variable not found: DATABASE_URL`

You skipped `.env`. Run:

```bash
cp .env.example .env
```

Then retry `npx prisma db push` / `npm run seed` / `npm run dev`.

### Empty home (“No gym seeded”)

Database has no gym. Run:

```bash
npm run seed
```

### Prisma / SQLite path confusion

Keep `DATABASE_URL="file:./dev.db"`. The SQLite file should appear at `prisma/dev.db`. That file is gitignored — don’t commit it.

### Camera scan fails on LAN IP / HTTP

Browsers require **secure context** (HTTPS or `localhost`) for camera. Use manual “Enter code” or open via `localhost`. See [deployment.md](./deployment.md).

### Wrong host in printed QRs

QRs encode `APP_URL` + `/q/[token]`. Update `APP_URL` before generating/printing QRs for a deployed URL.

## Sibling repo

For the Écono-branded unofficial demo:

```bash
git clone https://github.com/alexbalut/econofitness-gym-qr-guide.git
```

Feature set is intentionally parallel; branding, seed gym, and some localStorage key prefixes differ.
