import { LOCATIONS } from "../data/locations";

/**
 * Address lookup for the shipment form.
 *
 * Post Office suggestions come straight from the locations dataset, so they
 * are instant and work offline. Street-level suggestions come from our own
 * `/api/address/suggest` proxy, which keeps any geocoding key server-side and
 * falls back to OpenStreetMap when no key is configured.
 */

export interface AddressSuggestion {
  id: string;
  /** What the dropdown shows. */
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  /** Where it came from, used for the little badge in the dropdown. */
  source: "post-office" | "address";
}

const looksLikeZip = (v: string) => /^\d{5}$/.test(v.trim());

/** Post Offices matching the typed text — name, street, city or ZIP. */
export function postOfficeSuggestions(query: string, limit = 3): AddressSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  return LOCATIONS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.street.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.zip.startsWith(q)
  )
    .slice(0, limit)
    .map((l) => ({
      id: `po-${l.id}`,
      label: `${l.name} — ${l.street}, ${l.city}, ${l.state} ${l.zip}`,
      street: l.street,
      city: l.city,
      state: l.state,
      zip: l.zip,
      source: "post-office" as const,
    }));
}

/** Street-level suggestions from the server proxy. Failures return []. */
export async function addressSuggestions(
  query: string,
  signal?: AbortSignal
): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 4) return [];
  try {
    const res = await fetch(`/api/address/suggest?q=${encodeURIComponent(q)}`, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      suggestions?: Omit<AddressSuggestion, "source">[];
    };
    return (data.suggestions ?? []).map((s) => ({ ...s, source: "address" as const }));
  } catch {
    return [];
  }
}

/** Google returns only a place id up front; resolve the parts on selection. */
export async function resolveSuggestion(s: AddressSuggestion): Promise<AddressSuggestion> {
  if (s.source !== "address" || (s.city && s.state && s.zip)) return s;
  try {
    const res = await fetch(`/api/address/suggest?placeId=${encodeURIComponent(s.id)}`);
    if (!res.ok) return s;
    const data = (await res.json()) as { suggestion?: AddressSuggestion | null };
    if (!data.suggestion) return s;
    return { ...data.suggestion, source: "address" };
  } catch {
    return s;
  }
}

/**
 * ZIP → city/state, so typing a ZIP fills the rest of the row. Uses
 * zippopotam.us, the same keyless service the Find Locations page relies on.
 */
export async function zipToCityState(
  zip: string
): Promise<{ city: string; state: string } | null> {
  if (!looksLikeZip(zip)) return null;
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      places?: { "place name"?: string; "state abbreviation"?: string }[];
    };
    const place = data.places?.[0];
    if (!place?.["place name"] || !place?.["state abbreviation"]) return null;
    return { city: place["place name"], state: place["state abbreviation"] };
  } catch {
    return null;
  }
}
