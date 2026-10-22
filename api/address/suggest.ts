import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Address suggestions for the shipment form.
 *
 * Runs server-side so a paid geocoding key never ships in the browser bundle.
 * Two providers, same response shape:
 *
 *   GOOGLE_MAPS_API_KEY set → Google Places (New): autocomplete + place details
 *   otherwise               → OpenStreetMap Nominatim, which needs no key
 *
 * Both return `{ suggestions: [{ id, label, street, city, state, zip }] }` so
 * the form doesn't care which one answered.
 */

export type AddressSuggestion = {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";

const STATE_CODES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  "Puerto Rico": "PR", Guam: "GU", "Virgin Islands": "VI", "American Samoa": "AS",
};

/* ---------------- Google Places (New) ---------------- */

async function googleAutocomplete(q: string): Promise<AddressSuggestion[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_KEY,
    },
    body: JSON.stringify({
      input: q,
      includedRegionCodes: ["us"],
      includedPrimaryTypes: ["street_address", "premise", "subpremise", "route"],
    }),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    suggestions?: {
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
      };
    }[];
  };

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => {
      const main = p.structuredFormat?.mainText?.text ?? p.text?.text ?? "";
      const secondary = p.structuredFormat?.secondaryText?.text ?? "";
      // City / state / ZIP are resolved by the details call on selection.
      return {
        id: p.placeId as string,
        label: [main, secondary].filter(Boolean).join(", "),
        street: main,
        city: "",
        state: "",
        zip: "",
      };
    });
}

/** Resolves a Google place id into street / city / state / ZIP. */
async function googleDetails(placeId: string): Promise<AddressSuggestion | null> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=addressComponents,formattedAddress`,
    { headers: { "X-Goog-Api-Key": GOOGLE_KEY } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as {
    formattedAddress?: string;
    addressComponents?: { longText?: string; shortText?: string; types?: string[] }[];
  };
  const pick = (type: string, short = false) => {
    const c = (data.addressComponents ?? []).find((x) => (x.types ?? []).includes(type));
    return (short ? c?.shortText : c?.longText) ?? "";
  };
  const street = [pick("street_number"), pick("route")].filter(Boolean).join(" ");
  return {
    id: placeId,
    label: data.formattedAddress ?? street,
    street,
    city: pick("locality") || pick("postal_town") || pick("sublocality"),
    state: pick("administrative_area_level_1", true),
    zip: pick("postal_code"),
  };
}

/* ---------------- Nominatim (keyless) ---------------- */

async function nominatimSearch(q: string): Promise<AddressSuggestion[]> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=us&q=" +
    encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      // Nominatim's usage policy wants a real identifier on every request.
      "User-Agent": "USPS-Clone/1.0 (shipment address autocomplete)",
      "Accept-Language": "en-US",
    },
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as {
    place_id?: number;
    display_name?: string;
    address?: Record<string, string>;
  }[];

  return rows.map((row) => {
    const a = row.address ?? {};
    const street = [a.house_number, a.road].filter(Boolean).join(" ");
    const city = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? "";
    const state =
      (a["ISO3166-2-lvl4"] ?? "").replace("US-", "") || STATE_CODES[a.state ?? ""] || (a.state ?? "").slice(0, 2).toUpperCase();
    return {
      id: `osm-${row.place_id ?? street}`,
      label: row.display_name ?? street,
      street: street || (a.road ?? ""),
      city,
      state,
      zip: a.postcode ?? "",
    };
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const placeId = String(req.query.placeId ?? "").trim();
    if (placeId) {
      if (!GOOGLE_KEY) return void res.status(200).json({ suggestion: null });
      const suggestion = await googleDetails(placeId);
      res.status(200).json({ suggestion });
      return;
    }

    const q = String(req.query.q ?? "").trim();
    if (q.length < 4) {
      res.status(200).json({ suggestions: [] });
      return;
    }

    const suggestions = GOOGLE_KEY ? await googleAutocomplete(q) : await nominatimSearch(q);
    res.status(200).json({ suggestions, provider: GOOGLE_KEY ? "google" : "osm" });
  } catch (err) {
    // Suggestions are a convenience — never break the form over them.
    // eslint-disable-next-line no-console
    console.error("[address]", err);
    res.status(200).json({ suggestions: [] });
  }
}
