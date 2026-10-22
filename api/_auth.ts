import { randomBytes } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./_db";

export const SESSION_COOKIE = "usps_session";
const SESSION_DAYS = 30;

export type DbUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "customer";
  created_at: string;
};

/* ---------------- passwords ---------------- */

export { hashPassword, verifyPassword } from "./_password";

/* ---------------- cookies ---------------- */

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce<Record<string, string>>((acc, part) => {
    const idx = part.indexOf("=");
    if (idx > 0) acc[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    return acc;
  }, {});
}

export function sessionTokenFromRequest(req: VercelRequest): string | null {
  return parseCookies(req.headers.cookie)[SESSION_COOKIE] ?? null;
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
      SESSION_DAYS * 86400
    }${secure}`
  );
}

export function clearSessionCookie(res: VercelResponse): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

/* ---------------- sessions ---------------- */

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await query(
    `insert into sessions (token, user_id, expires_at)
     values ($1, $2, now() + ($3 || ' days')::interval)`,
    [token, userId, String(SESSION_DAYS)]
  );
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await query(`delete from sessions where token = $1`, [token]);
}

/** Returns the signed-in user for this request, or null. */
export async function currentUser(req: VercelRequest): Promise<DbUser | null> {
  const token = sessionTokenFromRequest(req);
  if (!token) return null;
  const rows = await query<DbUser>(
    `select u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at
       from sessions s
       join users u on u.id = s.user_id
      where s.token = $1 and s.expires_at > now()`,
    [token]
  );
  return rows[0] ?? null;
}

export async function requireUser(req: VercelRequest): Promise<DbUser> {
  const user = await currentUser(req);
  if (!user) {
    const err = new Error("Sign in to continue.") as Error & { status?: number };
    err.status = 401;
    throw err;
  }
  return user;
}

export async function requireAdmin(req: VercelRequest): Promise<DbUser> {
  const user = await requireUser(req);
  if (user.role !== "admin") {
    const err = new Error("This action requires an administrator account.") as Error & {
      status?: number;
    };
    err.status = 403;
    throw err;
  }
  return user;
}

/* ---------------- responses ---------------- */

export function publicUser(u: DbUser) {
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    phone: u.phone,
    role: u.role,
  };
}

export function fail(res: VercelResponse, err: unknown): void {
  const status = (err as { status?: number })?.status ?? 500;
  const raw = (err as Error)?.message ?? "";

  // eslint-disable-next-line no-console
  console.error("[api]", err);

  if (raw.startsWith("No database connection string")) {
    res.status(503).json({ error: "Database is not configured for this deployment." });
    return;
  }

  // Never leak internals on an unexpected failure.
  const message = status >= 500 ? "Something went wrong on our side." : raw || "Request failed.";
  res.status(status).json({ error: message });
}
