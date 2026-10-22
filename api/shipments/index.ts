import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureSchema, query } from "../_db.js";
import { fail, requireAdmin, requireUser } from "../_auth.js";

export type ShipmentRow = {
  tracking: string;
  service: string;
  from_address: unknown;
  to_address: unknown;
  weight_lbs: string;
  price: string;
  status: string;
  scans: unknown;
  created_at: string;
  created_by: string;
  eta: string | null;
};

/** Shapes a database row into the object the client already expects. */
export function toClientShipment(row: ShipmentRow) {
  return {
    tracking: row.tracking,
    service: row.service,
    from: row.from_address,
    to: row.to_address,
    weightLbs: Number(row.weight_lbs),
    price: Number(row.price),
    status: row.status,
    scans: row.scans,
    createdAt: new Date(row.created_at).getTime(),
    createdBy: row.created_by,
    eta: row.eta ? new Date(row.eta).getTime() : null,
  };
}

const SELECT = `select tracking, service, from_address, to_address, weight_lbs, price,
                       status, scans, created_at, created_by, eta
                  from shipments`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureSchema();

    if (req.method === "GET") {
      await requireUser(req);
      const rows = await query<ShipmentRow>(`${SELECT} order by created_at desc`);
      res.status(200).json({ shipments: rows.map(toClientShipment) });
      return;
    }

    if (req.method === "POST") {
      const admin = await requireAdmin(req);
      const body = (req.body ?? {}) as Record<string, unknown>;
      const tracking = String(body.tracking ?? "").trim();
      const service = String(body.service ?? "").trim();
      const from = body.from;
      const to = body.to;
      const weightLbs = Number(body.weightLbs);
      const price = Number(body.price);
      const status = String(body.status ?? "Label Created");
      const scans = body.scans ?? [];
      // Epoch ms from the client; null lets the column default apply.
      const etaRaw = body.eta;
      const eta = typeof etaRaw === "number" && Number.isFinite(etaRaw) ? new Date(etaRaw).toISOString() : null;

      if (!tracking || !service || !from || !to) {
        return void res.status(400).json({ error: "Missing shipment details." });
      }
      if (!Number.isFinite(weightLbs) || !Number.isFinite(price)) {
        return void res.status(400).json({ error: "Weight and price must be numbers." });
      }

      const inserted = await query<ShipmentRow>(
        `insert into shipments (tracking, service, from_address, to_address, weight_lbs, price, status, scans, created_by, eta)
         values ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8::jsonb, $9, $10::timestamptz)
         on conflict (tracking) do nothing
         returning tracking, service, from_address, to_address, weight_lbs, price, status, scans, created_at, created_by, eta`,
        [
          tracking,
          service,
          JSON.stringify(from),
          JSON.stringify(to),
          weightLbs,
          price,
          status,
          JSON.stringify(scans),
          admin.email,
          eta,
        ]
      );

      if (inserted.length === 0) {
        return void res.status(409).json({ error: "That tracking number already exists." });
      }
      res.status(201).json({ shipment: toClientShipment(inserted[0]) });
      return;
    }

    res.status(405).json({ error: "Method not allowed." });
  } catch (err) {
    fail(res, err);
  }
}
