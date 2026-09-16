# Member experience

Members never log in. Everything on `/` is the in-product gym home for **Demo Fitness Montréal**.

## Home tabs

On `/`, three primary tabs:

| Tab | Purpose |
|-----|---------|
| **Machines** | Browse active machines; switch to **Scan** or **Enter code** modes |
| **Workout** | Log an in-progress session (strength sets or cardio) |
| **Progress** | Stats from **saved** workouts |

Deep links: `/?tab=workout`, `/?tab=progress`.

Scan is also available at dedicated route `/scan`.

## Language

EN / FR toggle on the home header and on machine guides. Guide content uses bilingual fields (`nameEn`/`nameFr`, `stepsEn`/`stepsFr`, tips, warnings, descriptions).

## QR & guide flow

1. Staff print QR stickers that encode `{APP_URL}/q/{token}`.
2. Member scans → `/q/[token]` opens the machine guide (opaque token, not a guessable slug).
3. Friendly URLs also work: `/m/demo-fitness-montreal/lat-pulldown`.
4. Opening a guide increments `Machine.viewCount` (server-side).
5. Guide shows optional photo strip (`imageUrls`, max 3), steps, tips, warnings, muscle groups.
6. Member can **Add to workout** (writes into localStorage session) or **Report an issue** (`POST /api/issues` with machine token + note).

## Workout tracker

From **Workout** (or Add to workout on a guide):

- **Strength** (`category !== "Cardio"`): multiple sets with required reps and optional weight (kg).
- **Cardio** (`category === "Cardio"`): duration (minutes + seconds) and optional distance (km).
- **Save**: commits the session into history, clears in-progress, opens Progress.
- **Finish** / **Clear**: discard in-progress without saving.
- In-progress session survives refresh.

Machines available to log are the same **active** machines listed on home.

## localStorage keys

Keyed by gym slug (`demo-fitness-montreal`). No member account.

| Key | Contents |
|-----|----------|
| `gymqr-workout:<slug>` | In-progress session JSON |
| `gymqr-history:<slug>` | Array of saved workouts |

Clearing site data / another browser resets progress. This is intentional for the demo.

## Progress

Per machine used at least once in saved history:

- Times used, last used
- Strength: last sets×reps summary, heaviest weight, total sets
- Cardio: last / best / total duration (and distance when logged)
- Short expandable recent history

Empty state until the member saves at least one workout.
