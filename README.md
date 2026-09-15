# GymQR Guide

**B2B QR machine-instruction app for gyms.** Members scan a QR on a machine → bilingual (EN/FR) how-to guide. Staff manage machines, download QRs, and print floor sheets.

Multi-tenant (Gym model + branding). Seeded demo gym: **Demo Fitness Montréal**.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- SQLite via Prisma
- `qrcode` for QR generation
- `html5-qrcode` camera scan + manual token/URL fallback
- Cookie JWT auth (`jose` + `bcryptjs`)

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

Open [http://localhost:3000](http://localhost:3000) — you land **inside the member demo** for Demo Fitness Montréal (scan / enter code / browse machines). No marketing landing page.

### Environment

Copy `.env.example` → `.env` (already present for local demo):

| Variable       | Purpose                                      |
|----------------|----------------------------------------------|
| `DATABASE_URL` | SQLite path, default `file:./dev.db`         |
| `AUTH_SECRET`  | JWT signing secret                           |
| `APP_URL`      | Base URL used in QR codes (default localhost)|

> **QR tip:** Set `APP_URL` to your public URL before printing QRs for a real gym floor.

## Demo login

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@demofitness.ca`  |
| Password | `demo1234`              |
| Gym      | Demo Fitness Montréal   |

Seed creates **10 bilingual machines** (Lat Pulldown, Seated Row, Leg Press, Chest Press, Shoulder Press, Triceps Pushdown, Leg Curl, Cable Crossover, Smith Squat, Treadmill).

## Key routes

| Route | Who | Description |
|-------|-----|-------------|
| `/` | Members | **Demo gym home** — branding, scan / enter code, browsable machine list |
| `/scan` | Members | Dedicated camera QR scan + manual entry |
| `/q/[token]` | Members | Machine guide (opaque QR target) |
| `/m/[gymSlug]/[machineSlug]` | Members | Friendly slug URL (e.g. `/m/demo-fitness-montreal/lat-pulldown`) |
| `/admin/login` | Staff | Admin login (subtle link on member home) |
| `/admin` | Staff | Machine list, views, QR download |
| `/admin/machines/new` | Staff | Create machine |
| `/admin/machines/[id]/edit` | Staff | Edit machine |
| `/admin/print` | Staff | Printable QR sheet (browser print / PDF) |
| `/admin/issues` | Staff | Member-reported issues |

### APIs (selected)

- `POST /api/auth/login` · `POST /api/auth/logout`
- `POST /api/machines` · `PUT/DELETE /api/machines/[id]`
- `GET /api/machines/[id]/qr?format=png|svg`
- `POST /api/issues` (public, from guide page)
- `PATCH /api/issues/[id]` (resolve)

## Live demo flow (seller narrates)

1. Open `/` — member is “at” Demo Fitness Montréal.
2. Browse a machine → EN/FR guide → optionally report an issue.
3. Staff: `/admin/login` → print QR sheet → issues inbox.

Seller explains the product verbally; the UI stays in-product.

## Scripts

| Script | Action |
|--------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Prisma generate + Next build |
| `npm run setup` | generate + db push + seed |
| `npm run seed` | Re-seed demo gym & machines |
| `npm run db:push` | Push Prisma schema to SQLite |

## Repo

Target remote: `https://github.com/alexbalut/gym-machine-qr-guide`

## Caveats

- Auth is simple credential + JWT cookie (fine for demo; harden for production).
- SQLite file lives at `prisma/dev.db` — don’t commit it.
- Camera scan needs HTTPS (or localhost) and permission; manual entry always works.
- `APP_URL` must match the domain members will open, or printed QRs point at the wrong host.
