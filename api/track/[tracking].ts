import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import { fail } from "../_auth.js";
import { toClientShipment, type ShipmentRow } from "../shipments/index.js";
import { toClientHold } from "../holds/index.js";

/**
 * Public tracking lookup. Returns the stored shipment (if one was created in
 * the admin dashboard) and any active hold on it. The client falls back to its
 * local generator when nothing is stored for this number.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    await ensureSchema();

    const key = String(req.query.tracking ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (!key) return void res.status(400).json({ error: "Enter a tracking number." });

    const shipments = await query<ShipmentRow>(
      `select tracking, service, from_address, to_address, weight_lbs, price,
              status, scans, created_at, created_by, eta
         from shipments
        where regexp_replace(upper(tracking), '[^A-Z0-9]', '', 'g') = $1
        limit 1`,
      [key]
    );

    const holds = await query<{
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
    }>(
      `select id, tracking, action, reason_code, notes, created_by, created_at,
              released_at, released_by, release_note
         from holds
        where tracking = $1 and released_at is null
        order by created_at desc
        limit 1`,
      [key]
    );

    res.status(200).json({
      shipment: shipments[0] ? toClientShipment(shipments[0]) : null,
      hold: holds[0] ? toClientHold(holds[0]) : null,
    });
  } catch (err) {
    fail(res, err);
  }
}
