import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "./_db.js";
import { fail, publicUser, requireUser, type DbUser } from "./_auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }
  try {
    await ensureSchema();
    const me = await requireUser(req);
    const body = (req.body ?? {}) as Record<string, string>;

    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : null;
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : null;
    const phone = typeof body.phone === "string" ? body.phone.trim() : null;

    if (firstName !== null && !firstName) {
      return void res.status(400).json({ error: "First name is required." });
    }
    if (lastName !== null && !lastName) {
      return void res.status(400).json({ error: "Last name is required." });
    }

    const rows = await query<DbUser>(
      `update users
          set first_name = coalesce($2, first_name),
              last_name  = coalesce($3, last_name),
              phone      = coalesce($4, phone)
        where id = $1
      returning id, email, first_name, last_name, phone, role, created_at`,
      [me.id, firstName, lastName, phone]
    );

    res.status(200).json({ user: publicUser(rows[0]) });
  } catch (err) {
    fail(res, err);
  }
}
