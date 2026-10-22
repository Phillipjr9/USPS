import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import { fail, requireAdmin, requireUser } from "../_auth.js";

type HoldRow = {
  id: string;
  tracking: string;
  action: "hold" | "stop";
  reason_code: string;
  notes: string;
  created_by: string;
  created_at: string;
  released_at: string | null;
  released_by: string | null;
  release_note: string | null;
};

export function toClientHold(row: HoldRow) {
  return {
    id: row.id,
    tracking: row.tracking,
    action: row.action,
    reasonCode: row.reason_code,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: new Date(row.created_at).toISOString(),
    releasedAt: row.released_at ? new Date(row.released_at).toISOString() : undefined,
    releasedBy: row.released_by ?? undefined,
    releaseNote: row.release_note ?? undefined,
  };
}

const SELECT = `select id, tracking, action, reason_code, notes, created_by, created_at,
                       released_at, released_by, release_note
                  from holds`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();

    if (req.method === "GET") {
      await requireUser(req);
      const rows = await query<HoldRow>(`${SELECT} order by created_at desc`);
      res.status(200).json({ holds: rows.map(toClientHold) });
      return;
    }

    if (req.method === "POST") {
      const admin = await requireAdmin(req);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const tracking = String(body.tracking ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const action = body.action === "stop" ? "stop" : "hold";
      const reasonCode = String(body.reasonCode ?? "");
      const notes = String(body.notes ?? "");

      if (!tracking) return void res.status(400).json({ error: "Enter a tracking number." });
      if (!reasonCode) return void res.status(400).json({ error: "Choose a reason." });

      const active = await query<{ id: string }>(
        `select id from holds where tracking = $1 and released_at is null limit 1`,
        [tracking]
      );
      if (active.length > 0) {
        return void res
          .status(409)
          .json({ error: "That tracking number already has an active hold." });
      }

      const id = `hold-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
      const inserted = await query<HoldRow>(
        `insert into holds (id, tracking, action, reason_code, notes, created_by)
         values ($1, $2, $3, $4, $5, $6)
         returning id, tracking, action, reason_code, notes, created_by, created_at,
                   released_at, released_by, release_note`,
        [id, tracking, action, reasonCode, notes, admin.email]
      );
      res.status(201).json({ hold: toClientHold(inserted[0]) });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    fail(res, err);
  }
}
