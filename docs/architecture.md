# Architecture

## Stack

- **Next.js** App Router (v16) + **React** 19 + **TypeScript**
- **Tailwind CSS** v4
- **SQLite** via **Prisma** 5
- **qrcode** — server-side PNG/SVG generation
- **html5-qrcode** — client camera scan
- **jose** + **bcryptjs** — JWT cookie session + password hashes
- **zod** / **uuid** — validation / IDs where used

## Prisma models (sketch)

```
Gym
  id, name, slug (unique), tagline?, primaryColor, secondaryColor,
  logoUrl?, city?, users[], machines[]

User
  id, email (unique), passwordHash, name, role (default ADMIN), gymId → Gym

Machine
  id, gymId → Gym, nameEn, nameFr, slug, token (unique opaque),
  category, descriptionEn/Fr?, stepsEn/Fr (JSON string arrays),
  tipsEn/Fr?, warningsEn/Fr?, muscleGroups?,
  imageUrls? (JSON array, max 3), active, viewCount, sortOrder
  @@unique([gymId, slug])

IssueReport
  id, machineId → Machine, note, status (OPEN | RESOLVED), createdAt
```

## Multi-tenant gym

- Each `User` belongs to one `Gym`.
- Admin APIs and pages filter machines/issues by `session.gymId`.
- Member home hard-loads the seeded gym by slug (`demo-fitness-montreal`), with fallback to the first gym.

## Auth

- Cookie name: `gym_qr_session`
- JWT HS256 signed with `AUTH_SECRET` (fallback demo secret if unset — change in production)
- 7-day expiry; `httpOnly`, `sameSite=lax`, `secure` in production
- Middleware redirects unauthenticated `/admin/*` (except login) to `/admin/login`
- Member routes are public

## Where state lives

| Concern | Where |
|---------|--------|
| Gyms, users, machines, issues, view counts | SQLite via Prisma (server) |
| Admin session | JWT cookie |
| In-progress workout + saved history | **Browser localStorage** (see [member-experience.md](./member-experience.md)) |
| EN/FR UI preference | React component state (not persisted) |
| QR target URL | Built from `APP_URL` + `/q/{token}` at generation time |

## App structure (high level)

```
src/app/           # routes: /, /scan, /q/[token], /m/..., /admin/..., /api/...
src/components/    # GymHome, MachineGuide, WorkoutTracker, ProgressDashboard, admin/*
src/lib/           # prisma, auth, workout, utils, machines
prisma/            # schema.prisma, seed.ts, dev.db (local)
public/machines/   # demo Unsplash photos
```
