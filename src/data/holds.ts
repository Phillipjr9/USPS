import { useEffect, useSyncExternalStore } from "react";
import { api, errorMessage, type ApiError } from "../lib/api";

/* ------------------------------------------------------------------ */
/*  Reason catalog — every reason the customer will see on tracking    */
/* ------------------------------------------------------------------ */

export type HoldAction = "hold" | "stop";
export type HoldSeverity = "warning" | "critical";

export interface HoldReason {
  code: string;
  category: string;
  label: string;
  /** Customer-facing explanation shown on the tracking page. */
  description: string;
  severity: HoldSeverity;
  /** Suggested next step shown to the customer. */
  nextStep: string;
}

export const HOLD_CATEGORIES = [
  "Address & Delivery",
  "Postage & Payment",
  "Customs & International",
  "Contents & Condition",
  "Safety & Access",
  "Security & Legal",
  "Operations",
  "Customer Request",
] as const;

export const HOLD_REASONS: HoldReason[] = [
  /* ---- Address & Delivery ---- */
  {
    code: "ADDR_INCOMPLETE",
    category: "Address & Delivery",
    label: "Incomplete or missing address",
    description:
      "The delivery address on this item is incomplete. A unit, apartment, or suite number may be missing.",
    severity: "warning",
    nextStep: "Confirm the full delivery address, including any apartment or suite number.",
  },
  {
    code: "ADDR_INVALID",
    category: "Address & Delivery",
    label: "Address could not be validated",
    description:
      "The destination address could not be validated as a deliverable location. Movement is paused pending address verification.",
    severity: "warning",
    nextStep: "Verify the address with the sender, or update it using Package Intercept.",
  },
  {
    code: "ADDR_VACANT",
    category: "Address & Delivery",
    label: "Vacant or abandoned premises",
    description:
      "The destination address appears to be vacant. Delivery has been suspended pending confirmation of occupancy.",
    severity: "warning",
    nextStep: "Contact the local Post Office to confirm delivery instructions.",
  },
  {
    code: "ADDR_MOVED",
    category: "Address & Delivery",
    label: "Recipient moved — no forwarding order",
    description:
      "The recipient appears to have moved and no Change of Address order is on file for this address.",
    severity: "warning",
    nextStep: "File a Change of Address, or contact the sender to update the destination.",
  },
  {
    code: "ACCESS",
    category: "Address & Delivery",
    label: "No access to delivery location",
    description:
      "The carrier was unable to access the delivery location. This may be due to a locked gate, secured building, or blocked driveway.",
    severity: "warning",
    nextStep: "Provide an access code or alternate delivery instructions, or schedule a Redelivery.",
  },

  /* ---- Postage & Payment ---- */
  {
    code: "POSTAGE_DUE",
    category: "Postage & Payment",
    label: "Postage due",
    description:
      "Additional postage is required before this item can be released for delivery. The amount due will be collected at delivery.",
    severity: "warning",
    nextStep: "Pay the postage due at your local Post Office or to your carrier at delivery.",
  },
  {
    code: "POSTAGE_INVALID",
    category: "Postage & Payment",
    label: "Invalid or counterfeit postage",
    description:
      "The postage applied to this item could not be validated. The item is being held for postage review.",
    severity: "critical",
    nextStep: "Contact the sender. Counterfeit postage items may be subject to disposal.",
  },
  {
    code: "PAYMENT_DISPUTE",
    category: "Postage & Payment",
    label: "Payment dispute under review",
    description:
      "A payment dispute associated with this shipment is under review. Delivery is paused until the dispute is resolved.",
    severity: "warning",
    nextStep: "Resolve the open dispute in your account, or contact Customer Service.",
  },

  /* ---- Customs & International ---- */
  {
    code: "CUSTOMS_HOLD",
    category: "Customs & International",
    label: "Held by U.S. Customs and Border Protection",
    description:
      "This item is being inspected by U.S. Customs and Border Protection. Delivery timelines may change while the inspection is completed.",
    severity: "warning",
    nextStep: "No action is required. Inspections are typically completed within 45 business days.",
  },
  {
    code: "CUSTOMS_DOCS",
    category: "Customs & International",
    label: "Missing customs documentation",
    description:
      "Required customs forms or declarations are missing or incomplete for this international shipment.",
    severity: "warning",
    nextStep: "Provide a completed customs declaration (PS Form 2976 or 2976-R) to release the item.",
  },
  {
    code: "RESTRICTED_ITEM",
    category: "Customs & International",
    label: "Contains a prohibited or restricted item",
    description:
      "This item may contain contents that are restricted or prohibited for mailing. It is being held pending inspection.",
    severity: "critical",
    nextStep: "Review the Shipping Restrictions guide. Prohibited items may be returned or disposed of.",
  },

  /* ---- Contents & Condition ---- */
  {
    code: "DAMAGED",
    category: "Contents & Condition",
    label: "Damaged in transit",
    description:
      "The package was damaged in transit and is being held for inspection and possible repackaging before delivery.",
    severity: "warning",
    nextStep: "File a claim for damaged contents if the item is not delivered in good condition.",
  },
  {
    code: "CONTENTS_LEAK",
    category: "Contents & Condition",
    label: "Leaking or hazardous contents",
    description:
      "The package appears to contain leaking or hazardous material and has been isolated for safety.",
    severity: "critical",
    nextStep: "Contact Customer Service. Hazardous items may be disposed of per federal regulation.",
  },
  {
    code: "CONTENTS_INSPECTION",
    category: "Contents & Condition",
    label: "Contents require inspection",
    description:
      "The contents of this package require inspection before it can continue to its destination.",
    severity: "warning",
    nextStep: "No action is required. You will be notified when the inspection is complete.",
  },

  /* ---- Safety & Access ---- */
  {
    code: "WEATHER",
    category: "Safety & Access",
    label: "Severe weather or natural disaster",
    description:
      "Delivery operations in the destination area are suspended due to severe weather or a natural disaster.",
    severity: "warning",
    nextStep: "Monitor local service alerts. Delivery resumes when conditions are safe.",
  },
  {
    code: "SAFETY",
    category: "Safety & Access",
    label: "Safety concern at delivery location",
    description:
      "A safety concern at the delivery location has paused delivery of this item until the area is cleared.",
    severity: "critical",
    nextStep: "Contact your local Post Office once the location is safe to resume delivery.",
  },
  {
    code: "ANIMAL",
    category: "Safety & Access",
    label: "Animal interference",
    description:
      "The carrier was unable to safely deliver this item because of an animal at the delivery address.",
    severity: "warning",
    nextStep: "Secure the animal, then schedule a Redelivery for a safe attempt.",
  },

  /* ---- Security & Legal ---- */
  {
    code: "FRAUD_REVIEW",
    category: "Security & Legal",
    label: "Under fraud and security review",
    description:
      "This shipment is under review by the USPS fraud and security team. Movement is suspended until the review is complete.",
    severity: "critical",
    nextStep: "Contact Customer Service with your tracking number for the status of the review.",
  },
  {
    code: "LAW_ENFORCEMENT",
    category: "Security & Legal",
    label: "Held at the request of law enforcement",
    description:
      "This item is being held at the request of law enforcement. Additional details cannot be disclosed.",
    severity: "critical",
    nextStep: "Contact Customer Service. USPS cannot release items held under legal order.",
  },
  {
    code: "INVESTIGATION",
    category: "Security & Legal",
    label: "Missing mail investigation in progress",
    description:
      "This item is part of an active investigation and its movement has been paused while the case is worked.",
    severity: "warning",
    nextStep: "Monitor your missing mail case for updates, or call 1-800-275-8777.",
  },

  /* ---- Operations ---- */
  {
    code: "OPS_DELAY",
    category: "Operations",
    label: "Operational delay at a USPS facility",
    description:
      "A temporary operational delay at a USPS processing facility has paused movement of this item.",
    severity: "warning",
    nextStep: "No action is required. Tracking updates when the item moves again.",
  },
  {
    code: "ADMIN_STOP",
    category: "Operations",
    label: "Administrative stop placed by USPS",
    description:
      "USPS has placed an administrative stop on this item. Movement is suspended pending resolution.",
    severity: "warning",
    nextStep: "Contact Customer Service at 1-800-275-8777 and reference this tracking number.",
  },
  {
    code: "UNDELIVERABLE",
    category: "Operations",
    label: "Undeliverable — return to sender pending",
    description:
      "This item could not be delivered and is being held pending return to the sender.",
    severity: "warning",
    nextStep: "Update your address or instructions to avoid return, or track the return shipment.",
  },

  /* ---- Customer Request ---- */
  {
    code: "CUSTOMER_REQUEST",
    category: "Customer Request",
    label: "Held at the customer's request",
    description:
      "Delivery and tracking updates for this item have been paused at the customer's request.",
    severity: "warning",
    nextStep: "Request a release to resume normal delivery and tracking updates.",
  },
  {
    code: "CUSTOMER_PICKUP",
    category: "Customer Request",
    label: "Held for pickup at your Post Office",
    description:
      "This item is being held at your local Post Office for pickup. Bring a valid photo ID.",
    severity: "warning",
    nextStep: "Visit your local Post Office within 15 days to collect the item.",
  },
  {
    code: "RECALL",
    category: "Customer Request",
    label: "Recalled by the sender",
    description:
      "The sender has requested that this package be returned. Its movement is stopped pending return to origin.",
    severity: "warning",
    nextStep: "Contact the sender for a refund or replacement shipment.",
  },
];

export function findReason(code: string): HoldReason | undefined {
  return HOLD_REASONS.find((r) => r.code === code);
}

/* ------------------------------------------------------------------ */
/*  Store                                                             */
/* ------------------------------------------------------------------ */

export interface TrackingHold {
  id: string;
  tracking: string;
  action: HoldAction;
  reasonCode: string;
  reasonLabel: string;
  category: string;
  severity: HoldSeverity;
  notes: string;
  createdAt: string;
  createdBy: string;
  releasedAt?: string;
  releasedBy?: string;
  releaseNote?: string;
}

/* ------------------------------------------------------------------ */
/*  Server-backed store                                                */
/* ------------------------------------------------------------------ */

/** Shape returned by /api/holds — labels are derived on the client. */
type RawHold = {
  id: string;
  tracking: string;
  action: HoldAction;
  reasonCode: string;
  notes: string;
  createdBy: string;
  createdAt: string;
  releasedAt?: string;
  releasedBy?: string;
  releaseNote?: string;
};

let cache: TrackingHold[] = [];
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

/** Strips spaces/dashes and uppercases so lookups are forgiving. */
export function normalizeTracking(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/** Attaches the human-readable catalog entry to a stored hold. */
export function decorateHold(row: RawHold): TrackingHold {
  const reason = findReason(row.reasonCode);
  return {
    ...row,
    // A hold stored against a reason that has since been renamed still has to
    // read as customer copy — never fall back to the raw reason code.
    reasonLabel: reason?.label ?? "Delivery exception",
    category: reason?.category ?? "General",
    severity: reason?.severity ?? "warning",
  };
}

export function getHolds(): TrackingHold[] {
  return cache;
}

export function holdsError(): string | null {
  return lastError;
}

/** Loads holds from the database. Safe to call repeatedly. */
export async function hydrateHolds(force = false): Promise<void> {
  if (hydratePromise && !force) return hydratePromise;
  hydratePromise = (async () => {
    try {
      const data = await api<{ holds: RawHold[] }>("/api/holds");
      cache = data.holds.map(decorateHold);
      lastError = null;
    } catch (err) {
      const status = (err as ApiError).status;
      // Anonymous visitors can't list holds; that is not an error state.
      if (status === 401 || status === 403) {
        cache = [];
        lastError = null;
      } else {
        lastError = errorMessage(err, "Unable to load holds.");
      }
    } finally {
      emit();
    }
  })();
  return hydratePromise;
}

export function findActiveHold(tracking: string): TrackingHold | undefined {
  const key = normalizeTracking(tracking);
  return cache.find((h) => h.tracking === key && !h.releasedAt);
}

export interface PlaceHoldInput {
  tracking: string;
  action: HoldAction;
  reasonCode: string;
  notes: string;
  createdBy: string;
}

export async function placeHold(
  input: PlaceHoldInput
): Promise<{ ok: boolean; error?: string; hold?: TrackingHold }> {
  try {
    const res = await api<{ hold: RawHold }>("/api/holds", {
      method: "POST",
      body: JSON.stringify({
        tracking: normalizeTracking(input.tracking),
        action: input.action,
        reasonCode: input.reasonCode,
        notes: input.notes,
      }),
    });
    const hold = decorateHold(res.hold);
    cache = [hold, ...cache];
    emit();
    return { ok: true, hold };
  } catch (err) {
    return { ok: false, error: errorMessage(err, "Unable to place the hold.") };
  }
}

export async function releaseHold(
  id: string,
  releasedBy = "",
  note = ""
): Promise<boolean> {
  try {
    const res = await api<{ hold: RawHold }>(`/api/holds/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ releaseNote: note, releasedBy }),
    });
    const updated = decorateHold(res.hold);
    cache = cache.map((h) => (h.id === id ? updated : h));
    emit();
    return true;
  } catch {
    return false;
  }
}

export async function clearHoldForTracking(tracking: string, releasedBy = "", note = ""): Promise<boolean> {
  const active = findActiveHold(tracking);
  return active ? releaseHold(active.id, releasedBy, note) : false;
}

/** React binding — re-renders callers whenever the store changes. */
export function useHolds(): TrackingHold[] {
  const holds = useSyncExternalStore(subscribe, getHolds, getHolds);
  useEffect(() => {
    void hydrateHolds();
  }, []);
  return holds;
}

export function useActiveHold(tracking: string | null | undefined): TrackingHold | undefined {
  const holds = useHolds();
  if (!tracking) return undefined;
  const key = normalizeTracking(tracking);
  return holds.find((h) => h.tracking === key && !h.releasedAt);
}

export function formatHoldDate(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}, ${d.toLocaleTimeString(
    "en-US",
    { hour: "numeric", minute: "2-digit" }
  )}`;
}
