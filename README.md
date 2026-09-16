# GymQR Guide

**B2B QR machine-instruction app for gyms.** Members scan a QR on a machine → bilingual (EN/FR) how-to guide. Staff manage machines, download QRs, print floor sheets, and review ROI insights.

Multi-tenant (`Gym` model + branding). Seeded demo gym: **Demo Fitness Montréal**. `/` is the **demo-ready member product UI** — not a marketing landing page.

Sibling (Écono branding demo): [econofitness-gym-qr-guide](https://github.com/alexbalut/econofitness-gym-qr-guide)

## Table of contents

- [Quick start](#quick-start)
- [Demo credentials](#demo-credentials)
- [Docs](#docs)
- [Key routes](#key-routes)
- [Scripts](#scripts)
- [Caveats](#caveats)
- [Photo credits](#photo-credits)

Deep dives in [`docs/`](./docs/):

1. [Overview](./docs/overview.md) — product vision, audiences, Montreal pitch context
2. [Getting started](./docs/getting-started.md) — clone, env, install, seed, common errors
3. [Member experience](./docs/member-experience.md) — home tabs, QR/guide flow, workout localStorage
4. [Admin guide](./docs/admin-guide.md) — CRUD, imageUrls, QR print, issues, insights
5. [Pitch demo](./docs/pitch-demo.md) — suggested live walkthrough for sellers
6. [Architecture](./docs/architecture.md) — stack, Prisma models, auth, client vs server state
7. [API](./docs/api.md) — HTTP methods, paths, purpose
8. [Deployment](./docs/deployment.md) — APP_URL, HTTPS, SQLite limits, hardening

## Quick start

```bash
cd gym-machine-qr-guide
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Or one-shot setup:

```bash
npm install && npm run setup && npm run dev
```

Production build check:

```bash
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000) — you land **inside the member demo** for Demo Fitness Montréal (Machines / Workout / Progress; scan & enter code from Machines). No marketing landing page.

### Environment

| Variable       | Purpose                                       |
|----------------|-----------------------------------------------|
| `DATABASE_URL` | SQLite path, default `file:./dev.db`          |
| `AUTH_SECRET`  | JWT signing secret                            |
| `APP_URL`      | Base URL embedded in QR codes (default localhost) |

> **QR tip:** Set `APP_URL` to your public URL before printing QRs for a real gym floor.

## Demo credentials

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@demofitness.ca` |
| Password | `demo1234`             |
| Gym      | Demo Fitness Montréal  |
| Slug     | `demo-fitness-montreal`|

Seed creates **10 bilingual machines** (Lat Pulldown, Seated Cable Row, Leg Press, Chest Press, Shoulder Press, Triceps Pushdown, Leg Curl, Cable Crossover, Smith Squat, Treadmill), sample view counts, and a few open/resolved issues.

## Docs

| Doc | Description |
|-----|-------------|
| [docs/overview.md](./docs/overview.md) | Vision, audiences, problem, Montreal pitch |
| [docs/getting-started.md](./docs/getting-started.md) | Local setup & troubleshooting |
| [docs/member-experience.md](./docs/member-experience.md) | Member UI, workout keys, EN/FR |
| [docs/admin-guide.md](./docs/admin-guide.md) | Staff workflows |
| [docs/pitch-demo.md](./docs/pitch-demo.md) | Seller live demo script |
| [docs/architecture.md](./docs/architecture.md) | Stack & data model |
| [docs/api.md](./docs/api.md) | HTTP APIs |
| [docs/deployment.md](./docs/deployment.md) | Local vs production |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [CREDITS.md](./CREDITS.md) | Unsplash photo credits |

## Key routes

| Route | Who | Description |
|-------|-----|-------------|
| `/` | Members | Demo gym home — **Machines** / **Workout** / **Progress** |
| `/?tab=workout` · `/?tab=progress` | Members | Deep-link into Workout or Progress |
| `/scan` | Members | Dedicated camera QR scan + manual entry |
| `/q/[token]` | Members | Machine guide (opaque QR target) |
| `/m/[gymSlug]/[machineSlug]` | Members | Friendly slug URL |
| `/admin/login` | Staff | Admin login |
| `/admin` | Staff | Machine list, views, QR download |
| `/admin/machines/new` | Staff | Create machine |
| `/admin/machines/[id]/edit` | Staff | Edit machine |
| `/admin/print` | Staff | Printable QR sheet |
| `/admin/insights` | Staff | Owner ROI dashboard |
| `/admin/issues` | Staff | Member-reported issues |

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + Next build |
| `npm start` | Start production server |
| `npm run setup` | Copy `.env` if missing + generate + db push + seed |
| `npm run seed` | Re-seed demo gym & machines |
| `npm run db:push` | Push Prisma schema to SQLite |

## Caveats

- Auth is simple credential + JWT cookie (`gym_qr_session`) — fine for demo; harden for production.
- SQLite file lives at `prisma/dev.db` — don’t commit it.
- Camera scan needs HTTPS (or localhost) and permission; manual entry always works.
- `APP_URL` must match the domain members will open, or printed QRs point at the wrong host.
- Member workout/progress is **browser localStorage only** (no member login).

## Photo credits

Demo photos under `public/machines/` are from Unsplash — see [CREDITS.md](./CREDITS.md).

## Repo

https://github.com/alexbalut/gym-machine-qr-guide
