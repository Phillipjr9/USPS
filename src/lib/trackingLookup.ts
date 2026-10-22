import { api } from "./api";
import { applyHold, mockTracking, trackingFromShipment } from "../data/content";
import { normalizeTracking, type ShipmentRecord } from "../data/shipments";

type ApiTrackingResponse = {
  shipment: (Omit<ShipmentRecord, "date"> & { date?: string }) | null;
  hold:
    | {
        id: string;
        action: "hold" | "stop";
        reasonCode: string;
        notes: string;
        createdAt: string;
        createdBy: string;
      }
    | null;
};

/**
 * Tracking lookup.
 *
 * Asks the database first: a shipment created in the admin dashboard resolves
 * with its real addresses and scans. Numbers with no stored shipment fall back
 * to the local generator so the tracking page still has something to show.
 *
 * Throws if the API itself fails (for example the database isn't configured),
 * so the page can say so instead of silently pretending.
 */
export async function lookupTracking(raw: string): Promise<ReturnType<typeof mockTracking>> {
  const key = normalizeTracking(raw);
  if (!key) return mockTracking(raw);

  const data = await api<ApiTrackingResponse>(`/api/track/${encodeURIComponent(key)}`);

  const base = data.shipment
    ? trackingFromShipment(data.shipment as unknown as ShipmentRecord)
    : mockTracking(raw);

  if (data.hold) return applyHold(base, data.hold);

  // Local fallback may already carry a hold from the client cache.
  if ("hold" in base && base.hold) return base;
  return { ...base, isHeld: false as const, hold: null } as ReturnType<typeof mockTracking>;
}
