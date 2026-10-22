import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import { fail, requireAdmin } from "../_auth.js";
import { toClientShipment, type ShipmentRow } from "./index.js";

const normalize = (v: string) => v.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();
    await requireAdmin(req);

    const raw = String(req.query.tracking ?? "");
    const key = normalize(raw);
    if (!key) return void res.status(400).json({ error: "Missing tracking number." });

    // Tracking numbers are stored formatted; compare on the stripped value.
    const matchSql = `regexp_replace(upper(tracking), '[^A-Z0-9]', '', 'g') = $1`;

    if (req.method === "PATCH") {
      const body = (req.body ?? {}) as Record<string, unknown>;
      const status = typeof body.status === "string" ? body.status : null;
      const scans = body.scans ?? null;
      if (!status) return void res.status(400).json({ error: "Missing status." });

      const updated = await query<ShipmentRow>(
        `update shipments
            set status = $2, scans = coalesce($3::jsonb, scans)
          where ${matchSql}
        returning tracking, service, from_address, to_address, weight_lbs, price, status, scans, created_at, created_by, eta`,
        [key, status, scans === null ? null : JSON.stringify(scans)]
      );
      if (updated.length === 0) return void res.status(404).json({ error: "Shipment not found." });
      res.status(200).json({ shipment: toClientShipment(updated[0]) });
      return;
    }

    if (req.method === "DELETE") {
      const deleted = await query<{ tracking: string }>(
        `delete from shipments where ${matchSql} returning tracking`,
        [key]
      );
      if (deleted.length === 0) return void res.status(404).json({ error: "Shipment not found." });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    fail(res, err);
  }
}
