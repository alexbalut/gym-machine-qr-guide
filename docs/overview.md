# Overview

## What it is

**GymQR Guide** is a B2B product demo: stick a QR code on each gym machine; members scan and get a clear bilingual (EN/FR) how-to guide on their phone. Staff manage machine content, print QR sheets, triage member-reported issues, and see a simple ROI / usage dashboard.

The home route `/` is the **member product UI** for the seeded gym (Demo Fitness Montréal) — browse machines, scan, log a workout, check progress. There is **no marketing / SaaS landing page**.

## Problem it solves

- New or infrequent members don’t know how to use machines safely.
- Floor staff repeat the same explanations.
- Paper posters go stale and aren’t bilingual by default.
- Owners lack a lightweight signal of which guides are used and which machines need attention.

GymQR Guide turns each machine into a scannable, updatable digital guide plus a light staff ops loop (issues + views).

## Audiences

| Audience | What they get |
|----------|----------------|
| **Members** | Scan QR → guide; browse machines; EN/FR toggle; optional workout log & progress (device-local) |
| **Staff / gym admins** | Login → CRUD machines, image URLs, download/print QRs, resolve issues, insights |
| **Sellers / founders** | Live walkthrough of an in-club product experience (see [pitch-demo.md](./pitch-demo.md)) |

## Multi-tenant shape

Data is scoped by `Gym`. Users belong to one gym; machines and issues hang off that gym. The demo seeds a single gym (`demo-fitness-montreal`). Branding fields (`primaryColor`, `secondaryColor`, `tagline`, `city`) drive the member chrome.

## Montreal pitch context

The seeded gym is framed as a Montréal club (“Demo Fitness Montréal”, city `Montréal, QC`) with bilingual content — a natural fit for Québec gyms where EN/FR floor instructions matter. The sibling repo [econofitness-gym-qr-guide](https://github.com/alexbalut/econofitness-gym-qr-guide) shows the same product skinned as an **unofficial** Éconofitness club demo for pitch conversations.

## What is intentionally out of scope (demo)

- No member accounts or cloud workout sync
- No official third-party brand logo assets
- No payment, CRM, or class booking
- SQLite + simple JWT cookie auth (not production-hardened)

See [architecture.md](./architecture.md) and [deployment.md](./deployment.md) for stack and hardening notes.
