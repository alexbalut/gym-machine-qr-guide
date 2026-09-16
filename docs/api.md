# HTTP APIs

Base URL: your `APP_URL` (local default `http://localhost:3000`).

JSON request/response unless noted. Admin routes require a valid `gym_qr_session` cookie.

## Auth

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/auth/login` | Public | Body `{ email, password }` → sets session cookie; returns `{ ok, user }` |
| `POST` | `/api/auth/logout` | Session | Clears session cookie |

## Machines

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/machines` | Admin | Create machine for session gym. Requires `nameEn`, `nameFr`, `slug`, steps EN/FR. Optional category, descriptions, tips, warnings, muscleGroups, sortOrder, active, `imageUrls` (max 3). Auto-generates opaque `token`. |
| `PUT` | `/api/machines/[id]` | Admin | Update machine (must belong to session gym). Same fields as create. |
| `DELETE` | `/api/machines/[id]` | Admin | Delete machine (gym-scoped). |
| `GET` | `/api/machines/[id]/qr` | Admin | Download QR image. Query `format=png` (default) or `format=svg`. Encodes `{APP_URL}/q/{token}`. |

## Issues

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| `POST` | `/api/issues` | Public | Body `{ token, note }` — member report against machine by opaque token. Note truncated to 1000 chars. |
| `PATCH` | `/api/issues/[id]` | Admin | Mark issue `RESOLVED` if it belongs to a machine in the session gym. |

## Non-API member pages (for context)

These are HTML routes, not JSON APIs:

- `GET /` — member home
- `GET /scan` — scanner page
- `GET /q/[token]` — guide (increments `viewCount`)
- `GET /m/[gymSlug]/[machineSlug]` — slug guide

There is **no** REST API for workouts — client localStorage only.
