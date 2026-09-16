# Pitch demo (seller walkthrough)

Goal: show an investor or gym owner the **product**, not a marketing site. Narrate while staying inside the app.

Suggested order (~5–8 minutes):

## 1. Member home (`/`)

- “You’re a member walking into Demo Fitness Montréal.”
- Point at **Machines | Workout | Progress** — product tabs, not a SaaS pitch page.
- Toggle **EN / FR** once to show bilingual readiness for Montréal / Québec.

## 2. Open a machine guide

- Tap **Lat Pulldown** (or any machine with photos).
- Show steps, tips, warnings, photo strip.
- Optional: **Add to workout**.
- Optional: **Report an issue** (“thigh pad loose”) — sets up the staff inbox later.

## 3. Scan story

- Explain: on the floor they’d scan a sticker → `/q/[token]`.
- Open `/scan` or use Scan mode under Machines; if camera is awkward in the room, use **Enter code** with a token from admin/print.
- Say: “QR encodes our public URL + opaque token so stickers stay stable even if names change.”

## 4. Workout + Progress

- **Workout**: log 2–3 strength sets (reps + weight) and/or cardio minutes.
- Hit **Save** → lands on **Progress**.
- “No member login — progress lives on the phone for this demo; production could sync later.”

## 5. Staff login

- `/admin/login` → `admin@demofitness.ca` / `demo1234`.
- Dashboard: views, open issues, machine list.

## 6. Ops loop

- **Issues**: resolve the report you filed.
- **Edit machine**: show image URL slots (max 3) and bilingual steps.
- **Print QR sheet** or download PNG — “stickers for the floor.”
- **`/admin/insights`**: total views, open vs resolved, top machines, zero-view content gaps.

## 7. Close

- “Members get confidence; staff get content + maintenance signal; owners see usage.”
- Mention sibling Écono-branded unofficial demo if the conversation is about a specific club chain: [econofitness-gym-qr-guide](https://github.com/alexbalut/econofitness-gym-qr-guide).

## What not to do

- Don’t navigate to a fictional marketing landing — `/` is the product.
- Don’t claim official partnership with any chain in this generic repo.
