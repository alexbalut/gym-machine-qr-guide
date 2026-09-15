# GymQR Guide

**B2B QR machine-instruction app for gyms.** Members scan a QR on a machine → bilingual (EN/FR) how-to guide. Staff manage machines, download QRs, and print floor sheets.

Pitch-ready for Montréal gyms. Multi-tenant (Gym model + branding).

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- SQLite via Prisma
- `qrcode` for QR generation
- `html5-qrcode` camera scan + manual token/URL fallback
- Cookie JWT auth (`jose` + `bcryptjs`)

## Quick start

```bash
cd gym-machine-qr-guide
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

Open [http://localhost:3000](http://localhost:3000).

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
| `/` | Public | Marketing landing |
| `/scan` | Members | Camera QR scan + manual entry + demo machine list |
| `/q/[token]` | Members | Machine guide (opaque QR target) |
| `/m/[gymSlug]/[machineSlug]` | Members | Friendly slug URL (e.g. `/m/demo-fitness-montreal/lat-pulldown`) |
| `/admin/login` | Staff | Admin login |
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

## Product pitch (Montréal)

- **Problem:** New members don’t know machines; trainers get interrupted; laminated posters go stale; French + English needed.
- **Solution:** Stick a QR on each machine → phone opens a clean EN/FR guide (steps, tips, warnings). Staff update content in minutes and reprint QRs when needed.
- **Wedge:** Independent gyms & boutiques in MTL / QC that want bilingual UX without building an app.
- **Demo flow (5 min):** Landing → Staff login → Print sheet → Scan/open a machine → flip EN/FR → submit an issue → see it in Admin → Issues.

## Monetization ideas

1. **Per-location SaaS** — $49–149/mo per gym (machine caps, branding).
2. **Setup fee** — photo + content pack for 20–40 machines (agency upsell).
3. **Franchise / multi-site** — volume pricing + shared template library.
4. **OEM / equipment brands** — white-label guides shipped with machines.
5. **Add-ons** — trainer video embeds, workout programs, member accounts (later).

Out of scope for this MVP: payments, real email, native apps.

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

```bash
git init
git add .
git commit -m "Initial MVP: GymQR Guide"
git remote add origin git@github.com:alexbalut/gym-machine-qr-guide.git
git push -u origin main
```

## Caveats

- Auth is simple credential + JWT cookie (fine for demo; harden for production).
- SQLite file lives at `prisma/dev.db` — don’t commit it.
- Camera scan needs HTTPS (or localhost) and permission; manual entry always works.
- `APP_URL` must match the domain members will open, or printed QRs point at the wrong host.
