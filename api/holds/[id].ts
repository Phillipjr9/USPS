import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import { fail, requireAdmin } from "../_auth.js";
import { toClientHold } from "./index.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    const admin = await requireAdmin(req);

    const id = String(req.query.id ?? "");
    if (!id) return void res.status(400).json({ error: "Missing hold id." });

    if (req.method === "PATCH") {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const releaseNote = String(body.releaseNote ?? "");
      const updated = await query(
        `update holds
            set released_at = now(), released_by = $2, release_note = $3
          where id = $1 and released_at is null
        returning id, tracking, action, reason_code, notes, created_by, created_at,
                  released_at, released_by, release_note`,
        [id, admin.email, releaseNote]
      );
      if (updated.length === 0) {
        return void res.status(404).json({ error: "That hold is missing or already released." });
      }
      res.status(200).json({ hold: toClientHold(updated[0] as never) });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    fail(res, err);
  }
}
