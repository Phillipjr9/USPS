import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import {
  createSession,
  fail,
  hashPassword,
  publicUser,
  setSessionCookie,
  type DbUser,
} from "../_auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await ensureSchema();

    const body = (req.body ?? {}) as Record<string, string>;
    const firstName = (body.firstName ?? "").trim();
    const lastName = (body.lastName ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const phone = (body.phone ?? "").trim();
    const password = body.password ?? "";

    if (!firstName) return void res.status(400).json({ error: "First name is required." });
    if (!lastName) return void res.status(400).json({ error: "Last name is required." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return void res.status(400).json({ error: "Enter a valid email address." });
    }
    if (password.length < 8) {
      return void res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    // A deployment always has the bootstrap administrator, so this only makes
    // a new sign-up an admin if that account was removed or renamed.
    const admins = await query<{ count: string }>(
      `select count(*)::text as count from users where role = 'admin'`
    );
    const needsAdmin = admins[0]?.count === "0";

    const inserted = await query<DbUser>(
      `insert into users (email, first_name, last_name, phone, password_hash, role)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (email) do nothing
       returning id, email, first_name, last_name, phone, role, created_at`,
      [email, firstName, lastName, phone, hashPassword(password), needsAdmin ? "admin" : "customer"]
    );

    if (inserted.length === 0) {
      return void res.status(409).json({ error: "An account with that email already exists." });
    }

    const token = await createSession(inserted[0].id);
    setSessionCookie(res, token);
    res.status(201).json({ user: publicUser(inserted[0]) });
  } catch (err) {
    fail(res, err);
  }
}
