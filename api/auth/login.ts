import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db";
import {
  createSession,
  fail,
  publicUser,
  setSessionCookie,
  verifyPassword,
  type DbUser,
} from "../_auth";

type UserRow = DbUser & { password_hash: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await ensureSchema();

    const body = (req.body ?? {}) as Record<string, string>;
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return void res.status(400).json({ error: "Enter your email and password." });
    }

    const rows = await query<UserRow>(
      `select id, email, first_name, last_name, phone, role, created_at, password_hash
         from users where email = $1`,
      [email]
    );

    const user = rows[0];
    if (!user) {
      return void res.status(401).json({ error: "No account found with that email address." });
    }
    if (!verifyPassword(password, user.password_hash)) {
      return void res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = await createSession(user.id);
    setSessionCookie(res, token);
    res.status(200).json({ user: publicUser(user) });
  } catch (err) {
    fail(res, err);
  }
}
