import { neon } from "@neondatabase/serverless";
import { hashPassword } from "./_password.js";

/**
 * Resolves the Postgres connection string.
 *
 * The Neon integration on Vercel injects several names depending on when it
 * was installed, so accept the common ones rather than pinning to one.
 */
export function databaseUrl(): string | null {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.NEON_DATABASE_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_PRISMA_URL,
  ];
  return candidates.find((v) => typeof v === "string" && v.length > 0) ?? null;
}

export class DatabaseNotConfigured extends Error {
  constructor() {
    super("No database connection string found. Set DATABASE_URL in the Vercel project.");
  }
}

type QueryResult = Record<string, unknown>[];

let client: ReturnType<typeof neon> | null = null;

function getClient() {
  if (client) return client;
  const url = databaseUrl();
  if (!url) throw new DatabaseNotConfigured();
  client = neon(url);
  return client;
}

/** Parameterised query returning rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getClient();
  const rows = (await sql.query(text, params)) as unknown as QueryResult;
  return rows as T[];
}

const SCHEMA = `
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text not null,
  last_name text not null,
  phone text not null default '',
  password_hash text not null,
  role text not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  tracking text not null unique,
  service text not null,
  from_address jsonb not null,
  to_address jsonb not null,
  weight_lbs numeric(6,2) not null,
  price numeric(8,2) not null,
  status text not null default 'Label Created',
  scans jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  created_by text not null default ''
);

create table if not exists holds (
  id text primary key,
  tracking text not null,
  action text not null,
  reason_code text not null,
  notes text not null default '',
  created_by text not null default '',
  created_at timestamptz not null default now(),
  released_at timestamptz,
  released_by text,
  release_note text
);
create index if not exists holds_tracking_idx on holds(tracking);
`;


/* ---------------- bootstrap administrator ---------------- */

/**
 * Credentials for the built-in administrator.
 *
 * Override with ADMIN_EMAIL / ADMIN_PASSWORD in the Vercel project. The
 * defaults exist so a fresh deployment has a working admin without any setup.
 */
export const BOOTSTRAP_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@usps.com").trim().toLowerCase();
export const BOOTSTRAP_PASSWORD = process.env.ADMIN_PASSWORD ?? "Olami6525$";

type Runner = (text: string, params?: unknown[]) => Promise<unknown[]>;

/**
 * Creates the administrator account if that email isn't present yet.
 * An existing account is never modified, so a changed password survives
 * redeploys.
 */
export async function ensureBootstrapAdmin(
  run: Runner
): Promise<{ created: boolean; email: string }> {
  const existing = await run(`select id from users where email = $1 limit 1`, [BOOTSTRAP_EMAIL]);
  if (existing.length > 0) return { created: false, email: BOOTSTRAP_EMAIL };

  await run(
    `insert into users (email, first_name, last_name, phone, password_hash, role)
     values ($1, $2, $3, $4, $5, 'admin')
     on conflict (email) do nothing`,
    [BOOTSTRAP_EMAIL, "USPS", "Administrator", "", hashPassword(BOOTSTRAP_PASSWORD)]
  );
  return { created: true, email: BOOTSTRAP_EMAIL };
}

let schemaReady: Promise<void> | null = null;

/** Creates tables on first use of a cold instance. Idempotent. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getClient();
      const run: Runner = async (text, params) =>
        (await sql.query(text, params as unknown[])) as unknown as unknown[];
      for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
        await run(statement);
      }
      await ensureBootstrapAdmin(run);
    })().catch((err) => {
      // Let the next request retry instead of caching a failure forever.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}
