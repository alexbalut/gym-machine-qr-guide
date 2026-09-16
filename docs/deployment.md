# Deployment notes

## Local vs production

| Concern | Local | Production |
|---------|-------|------------|
| `APP_URL` | `http://localhost:3000` | Public HTTPS origin members will open |
| `AUTH_SECRET` | Demo string OK | Long random secret |
| `DATABASE_URL` | `file:./dev.db` under `prisma/` | Still SQLite for this demo; plan migration for scale |
| Camera scan | Works on `localhost` | Needs **HTTPS** (secure context) |
| Auth cookie `secure` | Off in development | On when `NODE_ENV=production` |

## APP_URL and printed QRs

QR payloads are `{APP_URL}/q/{token}` generated at download/print time. If you change domain later, **re-print** stickers (or keep the old domain redirecting).

## HTTPS for camera

`html5-qrcode` needs camera permission in a secure context. Non-HTTPS LAN IPs often fail; manual token/URL entry still works.

## SQLite limits

Fine for demos and single-club pilots:

- One file DB; careful with concurrent writes under load
- Backups = copy `dev.db` (or configured path)
- Not ideal for multi-region / high traffic — move to Postgres (Prisma makes this relatively straightforward) when ready

## What to harden later

- Strong unique `AUTH_SECRET`; rotate if leaked
- Rate-limit `POST /api/auth/login` and public `POST /api/issues`
- CSRF strategy for cookie-authenticated mutating routes
- Input sanitization / XSS review on rendered guide HTML/text
- Member accounts + server-side workout history if productizing Progress
- Object storage for machine photos instead of arbitrary remote URLs only
- Observability (logs, error tracking)
- Do not commit `.env` or `prisma/dev.db`

## Hosting sketch

Any Node host that can run `next start` (or a platform with Next support):

```bash
npm install
npx prisma db push
npm run seed   # or a production seed strategy
npm run build
npm start
```

Set env vars in the host dashboard. Ensure the process can write the SQLite file path if you stay on SQLite.
