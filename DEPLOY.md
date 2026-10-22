# Deploying to Vercel

The app is a static Vite SPA plus Vercel serverless functions in `api/` that
talk to a Neon Postgres database.

## 1. Connect the database

In the Vercel project: **Storage → Create Database → Neon**, or use the Neon
integration from the Marketplace. Connecting it injects the connection string
into the project automatically.

The API accepts any of these names, so the default integration works as-is:

```
DATABASE_URL · POSTGRES_URL · NEON_DATABASE_URL · DATABASE_URL_UNPOOLED · POSTGRES_PRISMA_URL
```

If you set it by hand, add `DATABASE_URL` under **Settings → Environment
Variables** and redeploy.

## 2. Deploy

Import the repo into Vercel — `vercel.json` already sets:

- Framework: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Or from the CLI:

```bash
npm i -g vercel
vercel --prod
```

## 3. Tables are created automatically

There is no migration step. The first request to any `/api` route runs
`CREATE TABLE IF NOT EXISTS` for `users`, `sessions`, `shipments` and `holds`.
Schema source of truth: `api/_db.ts`.

To inspect or reset it, run those statements in the Neon SQL editor.

## 4. The administrator account

The first request to any `/api` route creates a built-in administrator:

```
email:    admin@usps.com
password: Olami6525$
```

Sign in at `/#/login`, then open `/#/admin/dashboard`. Every account registered
afterwards is a customer.

The account is only created when that email is absent — an existing account is
never overwritten, so changing the password survives redeploys.

Override the credentials with environment variables instead of editing code:

```
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=some-strong-password
```

Set them **before** the first request. If the account already exists with the
default password, change `ADMIN_PASSWORD` alone won't update it — delete the row
in Neon (or change the email) and redeploy.

> ⚠️ The default password is written in `api/_db.ts`, so it is visible to anyone
> with access to this repo. Rotate it via `ADMIN_PASSWORD` before sharing the
> deployment URL widely.

## Local development

`npm run dev` serves only the Vite app — `/api` routes will 404. Use:

```bash
npx vercel dev        # app + serverless functions on one port
```

with a `.env.local` containing `DATABASE_URL` (see `.env.example`).

## Routing

The app uses `HashRouter`, so every URL is `/#/...` and no rewrite is needed.
`vercel.json` deliberately has **no** catch-all rewrite: a `/(.*)` → `/index.html`
rule shadows the `/api` functions.

## Security notes

- Passwords are hashed with scrypt (`node:crypto`), never stored in plain text.
- Sessions are opaque 32-byte tokens in an **HttpOnly, SameSite=Lax** cookie,
  stored in the `sessions` table and checked on every request.
- Admin endpoints call `requireAdmin` server-side, so the UI gate is not the
  only protection.
- Set `NODE_ENV=production` (Vercel does this) so session cookies get `Secure`.

## Still simulated

Tracking scans for numbers that have no stored shipment are generated on the
client. Real shipments created in the admin dashboard are stored in Postgres and
resolve through `/api/track/:number`.
