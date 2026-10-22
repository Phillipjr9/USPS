import { useEffect, useSyncExternalStore } from "react";
import { api, errorMessage, type ApiError } from "../lib/api";
import { generateTrackingNumber } from "./tracking";

/**
 * Shared shipment store.
 *
 * The admin dashboard writes here and the customer-facing tracking page reads
 * here, so a label an admin creates is immediately trackable with the exact
 * addresses, service, and weight that were entered — not hash-generated noise.
 */

export type ShipmentStatus =
  | "Label Created"
  | "Accepted"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered";

export interface ShipmentAddress {
  name: string;
  company: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ShipmentScan {
  title: string;
  /** ISO timestamp. */
  at: string;
  /** Which end of the journey this scan belongs to. */
  place: "origin" | "destination" | "none";
}

export interface ShipmentRecord {
  /** Human-formatted tracking number, e.g. "9400 5483 1381 3152 3762 23". */
  tracking: string;
  service: string;
  from: ShipmentAddress;
  to: ShipmentAddress;
  weightLbs: number;
  price: number;
  status: ShipmentStatus;
  /** Epoch ms — used to order the history table. */
  createdAt: number;
  /** Display date, e.g. "Oct 22, 2026". */
  date: string;
  scans: ShipmentScan[];
  createdBy: string;
}


export const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Label Created",
  "Accepted",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export function normalizeTracking(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatScanDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

/** "New York, NY 10001" */
export function cityLine(a: ShipmentAddress): string {
  return `${a.city}, ${a.state.toUpperCase()} ${a.zip}`;
}

/* ---------------- scan scripts ---------------- */

/**
 * The scan sequence USPS actually posts for each status. Index = status index,
 * so a shipment that reaches "In Transit" also carries the earlier scans.
 */
const STATUS_SCANS: Record<ShipmentStatus, { title: string; place: ShipmentScan["place"] }[]> = {
  "Label Created": [
    { title: "Shipping Label Created, USPS Awaiting Item", place: "origin" },
  ],
  Accepted: [
    { title: "Shipping Label Created, USPS Awaiting Item", place: "origin" },
    { title: "USPS in possession of item", place: "origin" },
  ],
  "In Transit": [
    { title: "Shipping Label Created, USPS Awaiting Item", place: "origin" },
    { title: "USPS in possession of item", place: "origin" },
    { title: "Arrived at USPS Regional Origin Facility", place: "origin" },
    { title: "Departed USPS Regional Facility", place: "origin" },
    { title: "In Transit to Next Facility", place: "none" },
  ],
  "Out for Delivery": [
    { title: "Shipping Label Created, USPS Awaiting Item", place: "origin" },
    { title: "USPS in possession of item", place: "origin" },
    { title: "Arrived at USPS Regional Origin Facility", place: "origin" },
    { title: "Departed USPS Regional Facility", place: "origin" },
    { title: "In Transit to Next Facility", place: "none" },
    { title: "Arrived at USPS Regional Destination Facility", place: "destination" },
    { title: "Arrived at Post Office", place: "destination" },
    { title: "Out for Delivery", place: "destination" },
  ],
  Delivered: [
    { title: "Shipping Label Created, USPS Awaiting Item", place: "origin" },
    { title: "USPS in possession of item", place: "origin" },
    { title: "Arrived at USPS Regional Origin Facility", place: "origin" },
    { title: "Departed USPS Regional Facility", place: "origin" },
    { title: "In Transit to Next Facility", place: "none" },
    { title: "Arrived at USPS Regional Destination Facility", place: "destination" },
    { title: "Arrived at Post Office", place: "destination" },
    { title: "Out for Delivery", place: "destination" },
    { title: "Delivered, Front Door/Porch", place: "destination" },
  ],
};

/** Builds the scan list for a brand-new label. */
function initialScans(createdAt: number): ShipmentScan[] {
  return STATUS_SCANS["Label Created"].map((s) => ({
    title: s.title,
    place: s.place,
    at: new Date(createdAt).toISOString(),
  }));
}

/**
 * Rebuilds the scan list for a status change. Earlier scans keep their original
 * timestamps; new scans are stamped now, six hours apart going back.
 */
export function scansForStatus(record: ShipmentRecord, status: ShipmentStatus): ShipmentScan[] {
  const target = STATUS_SCANS[status];
  const now = Date.now();
  const prior = new Map(record.scans.map((s) => [s.title, s.at]));
  return target.map((scan, i) => {
    const existing = prior.get(scan.title);
    if (existing) return { title: scan.title, place: scan.place, at: existing };
    const back = (target.length - 1 - i) * 6 * 3600 * 1000;
    return { title: scan.title, place: scan.place, at: new Date(now - back).toISOString() };
  });
}

/* ---------------- server-backed store ---------------- */

let cache: ShipmentRecord[] = [];
const listeners = new Set<() => void>();
let hydratePromise: Promise<void> | null = null;
let lastError: string | null = null;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function sortNewestFirst(rows: ShipmentRecord[]): ShipmentRecord[] {
  return [...rows].sort((a, b) => b.createdAt - a.createdAt);
}

export function getShipments(): ShipmentRecord[] {
  return cache;
}

export function shipmentsError(): string | null {
  return lastError;
}

/** Loads shipments from the database. Safe to call repeatedly. */
export async function hydrateShipments(force = false): Promise<void> {
  if (hydratePromise && !force) return hydratePromise;
  hydratePromise = (async () => {
    try {
      const data = await api<{ shipments: ShipmentRecord[] }>("/api/shipments");
      cache = sortNewestFirst(data.shipments);
      lastError = null;
    } catch (err) {
      const status = (err as ApiError).status;
      if (status === 401 || status === 403) {
        cache = [];
        lastError = null;
      } else {
        lastError = errorMessage(err, "Unable to load shipments.");
      }
    } finally {
      emit();
    }
  })();
  return hydratePromise;
}

export function useShipments(): ShipmentRecord[] {
  const shipments = useSyncExternalStore(subscribe, getShipments, getShipments);
  useEffect(() => {
    void hydrateShipments();
  }, []);
  return shipments;
}

export function findShipment(tracking: string): ShipmentRecord | undefined {
  const key = normalizeTracking(tracking);
  if (!key) return undefined;
  return cache.find((s) => normalizeTracking(s.tracking) === key);
}

export interface NewShipmentInput {
  service: string;
  from: ShipmentAddress;
  to: ShipmentAddress;
  weightLbs: number;
  price: number;
  createdBy: string;
}

/** Issues a label: generates the number, then stores the shipment server-side. */
export async function createShipment(input: NewShipmentInput): Promise<ShipmentRecord> {
  const createdAt = Date.now();
  const record: ShipmentRecord = {
    tracking: generateTrackingNumber(input.service),
    service: input.service,
    from: input.from,
    to: input.to,
    weightLbs: input.weightLbs,
    price: input.price,
    status: "Label Created",
    createdAt,
    date: formatDate(createdAt),
    scans: initialScans(createdAt),
    createdBy: input.createdBy,
  };

  const res = await api<{ shipment: ShipmentRecord }>("/api/shipments", {
    method: "POST",
    body: JSON.stringify(record),
  });

  const saved = res.shipment;
  cache = sortNewestFirst([saved, ...cache.filter((s) => s.tracking !== saved.tracking)]);
  emit();
  return saved;
}

export function nextStatus(status: ShipmentStatus): ShipmentStatus | null {
  const i = SHIPMENT_STATUSES.indexOf(status);
  if (i < 0 || i === SHIPMENT_STATUSES.length - 1) return null;
  return SHIPMENT_STATUSES[i + 1];
}

/** Moves a shipment to the next stage (or an explicit one) and resyncs scans. */
export async function advanceShipment(
  tracking: string,
  to?: ShipmentStatus
): Promise<ShipmentRecord | null> {
  const current = findShipment(tracking);
  if (!current) return null;
  const next = to ?? nextStatus(current.status);
  if (!next) return null;

  const scans = scansForStatus(current, next);
  const res = await api<{ shipment: ShipmentRecord }>(
    `/api/shipments/${encodeURIComponent(normalizeTracking(tracking))}`,
    { method: "PATCH", body: JSON.stringify({ status: next, scans }) }
  );

  const saved = res.shipment;
  cache = cache.map((s) =>
    normalizeTracking(s.tracking) === normalizeTracking(saved.tracking) ? saved : s
  );
  emit();
  return saved;
}

export async function deleteShipment(tracking: string): Promise<void> {
  const key = normalizeTracking(tracking);
  await api(`/api/shipments/${encodeURIComponent(key)}`, { method: "DELETE" });
  cache = cache.filter((s) => normalizeTracking(s.tracking) !== key);
  emit();
}
