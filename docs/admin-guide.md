# Admin guide

## Login

1. Open `/admin/login` (subtle **Staff** link on member home).
2. Demo: `admin@demofitness.ca` / `demo1234`.
3. Middleware protects `/admin/*` except `/admin/login` via JWT cookie `gym_qr_session` (7-day expiry).

Logout: admin nav calls `POST /api/auth/logout`.

## Machines dashboard (`/admin`)

- List of machines for the signed-in user’s gym
- Summary cards: machine count, total views, open issues
- Per row: name, category, views, active flag, issue count, QR download, edit, delete
- Actions: **+ Add machine**, **Print QR sheet**

## Create / edit

- `/admin/machines/new` · `/admin/machines/[id]/edit`
- Required: `nameEn`, `nameFr`, `slug`, at least one step EN and FR
- Optional: category, muscle groups, descriptions, tips, warnings, sort order, active
- **imageUrls**: up to **3** HTTPS or relative URLs (newline- or comma-separated in the form). Stored as JSON on `Machine.imageUrls`. Member guides show a horizontal media strip; empty → pitch-friendly “add photos in admin” empty state.

## QR download & print

- Per-machine download: `GET /api/machines/[id]/qr?format=png|svg` (auth required). Target URL is `{APP_URL}/q/{token}`.
- Print sheet: `/admin/print` — browser print / Save as PDF for floor stickers.

Always set `APP_URL` to the public origin before printing for a real floor.

## Issues (`/admin/issues`)

Members submit notes from the guide page. Staff see open/resolved reports and can mark resolved (`PATCH /api/issues/[id]`).

## ROI insights (`/admin/insights`)

Owner dashboard from real Prisma data only:

- Total machine views (sum of `viewCount`)
- Open vs resolved issue counts
- Top machines by views
- Zero-view machines as **content gaps**

Useful pitch language: scans = guided members; open issues = maintenance backlog; zero views = promote those stickers or add photos.
