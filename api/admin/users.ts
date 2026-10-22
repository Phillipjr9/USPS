import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BOOTSTRAP_EMAIL, ensureSchema, query } from "../_db.js";
import { fail, requireAdmin } from "../_auth.js";

/**
 * Administrator-only account directory.
 *
 * GET  /api/admin/users  → every account, with how many shipments and holds
 *                          each created (matched on the recorded email).
 * PATCH /api/admin/users → change a role between "admin" and "customer".
 *
 * Guardrails: an administrator can't change their own role, and the built-in
 * bootstrap administrator can't be demoted — either would lock the deployment
 * out of its own dashboard.
 */

type UserRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "customer";
  created_at: string;
  shipments: string | number;
  holds: string | number;
};

const SELECT_USERS = `
  select u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
         coalesce(s.shipments, 0) as shipments,
         coalesce(h.holds, 0) as holds
    from users u
    left join (
      select created_by, count(*) as shipments
        from shipments
       group by created_by
    ) s on s.created_by = u.email
    left join (
      select created_by, count(*) as holds
        from holds
       group by created_by
    ) h on h.created_by = u.email
   order by u.created_at desc
   limit 500`;

function toClientUser(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
    shipments: Number(row.shipments ?? 0),
    holds: Number(row.holds ?? 0),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const admin = await requireAdmin(req);

    if (req.method === "GET") {
      const rows = await query<UserRow>(SELECT_USERS);
      res.status(200).json({ users: rows.map(toClientUser) });
      return;
    }

    if (req.method === "PATCH") {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const id = String(body.id ?? "").trim();
      const role = String(body.role ?? "").trim();

      if (!id) return void res.status(400).json({ error: "Missing account id." });
      if (role !== "admin" && role !== "customer") {
        return void res.status(400).json({ error: "Role must be admin or customer." });
      }
      if (id === admin.id) {
        return void res.status(400).json({ error: "You can't change your own role." });
      }

      const target = await query<{ email: string }>(
        `select email from users where id = $1 limit 1`,
        [id]
      );
      if (target.length === 0) {
        return void res.status(404).json({ error: "That account no longer exists." });
      }
      if (target[0].email === BOOTSTRAP_EMAIL) {
        return void res.status(400).json({
          error: "The built-in administrator can't be demoted — it's the account that restores access.",
        });
      }

      const updated = await query<UserRow>(
        `update users set role = $2 where id = $1 returning id`,
        [id, role]
      );
      if (updated.length === 0) {
        return void res.status(404).json({ error: "That account no longer exists." });
      }

      const rows = await query<UserRow>(SELECT_USERS);
      res.status(200).json({ users: rows.map(toClientUser) });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    fail(res, err);
  }
}
