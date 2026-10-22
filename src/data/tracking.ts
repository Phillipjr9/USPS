/**
 * USPS tracking number formats.
 *
 * Source of truth: the official "What does my tracking number look like?"
 * table published at https://tools.usps.com/tracking/
 *
 * Every domestic sample in that table is 22 digits. International products
 * use 13 characters (2 letters + 9 digits + "US").
 *
 * The final digit of a domestic number is a mod-10 check digit using the
 * alternating 3-1 weighting (the UPC/ITF scheme).
 */

export type TrackingFamily = "domestic22" | "international13" | "unknown";

export interface TrackingFormat {
  /** Stable identifier. */
  key: string;
  /** Official service name exactly as published by USPS. */
  service: string;
  family: TrackingFamily;
  /** Service-type prefixes USPS assigns to this series. */
  prefixes: string[];
  /** Sample number published by USPS for this service. */
  example: string;
}

/**
 * The nine series in the official USPS sample table.
 * Priority Mail Express appears twice because USPS issues it as both a
 * 22-digit domestic number (9270) and a 13-character international-style
 * number (EA).
 */
export const TRACKING_FORMATS: TrackingFormat[] = [
  {
    key: "usps-tracking",
    service: "USPS Tracking®",
    family: "domestic22",
    prefixes: ["9400", "9500"],
    example: "9400 1000 0000 0000 0000 00",
  },
  {
    key: "priority",
    service: "Priority Mail®",
    family: "domestic22",
    prefixes: ["9205"],
    example: "9205 5000 0000 0000 0000 00",
  },
  {
    key: "certified",
    service: "Certified Mail®",
    family: "domestic22",
    prefixes: ["9407"],
    example: "9407 3000 0000 0000 0000 00",
  },
  {
    key: "cod",
    service: "Collect On Delivery Hold For Pickup",
    family: "domestic22",
    prefixes: ["9303"],
    example: "9303 3000 0000 0000 0000 00",
  },
  {
    key: "express-intl",
    service: "Priority Mail Express International®",
    family: "international13",
    prefixes: ["EC"],
    example: "EC 000 000 000 US",
  },
  {
    key: "express-22",
    service: "Priority Mail Express®",
    family: "domestic22",
    prefixes: ["9270"],
    example: "9270 1000 0000 0000 0000 00",
  },
  {
    key: "express-13",
    service: "Priority Mail Express®",
    family: "international13",
    prefixes: ["EA"],
    example: "EA 000 000 000 US",
  },
  {
    key: "priority-intl",
    service: "Priority Mail International®",
    family: "international13",
    prefixes: ["CP"],
    example: "CP 000 000 000 US",
  },
  {
    key: "registered",
    service: "Registered Mail™",
    family: "domestic22",
    prefixes: ["9208"],
    example: "9208 8000 0000 0000 0000 00",
  },
  {
    key: "signature",
    service: "Signature Confirmation™",
    family: "domestic22",
    prefixes: ["9202"],
    example: "9202 1000 0000 0000 0000 00",
  },
];

/** Rows for the "What does my tracking number look like?" table. */
export interface SampleNumberRow {
  service: string;
  samples: string[];
}

export const SAMPLE_NUMBER_TABLE: SampleNumberRow[] = [
  { service: "USPS Tracking®", samples: ["9400 1000 0000 0000 0000 00"] },
  { service: "Priority Mail®", samples: ["9205 5000 0000 0000 0000 00"] },
  { service: "Certified Mail®", samples: ["9407 3000 0000 0000 0000 00"] },
  { service: "Collect On Delivery Hold For Pickup", samples: ["9303 3000 0000 0000 0000 00"] },
  { service: "Priority Mail Express International®", samples: ["EC 000 000 000 US"] },
  { service: "Priority Mail Express®", samples: ["9270 1000 0000 0000 0000 00", "EA 000 000 000 US"] },
  { service: "Priority Mail International®", samples: ["CP 000 000 000 US"] },
  { service: "Registered Mail™", samples: ["9208 8000 0000 0000 0000 00"] },
  { service: "Signature Confirmation™", samples: ["9202 1000 0000 0000 0000 00"] },
];

/**
 * Which official barcode series each mail class is issued under.
 *
 * Ground Advantage and First-Class Mail are not enumerated in the official
 * sample table — USPS issues them under the general USPS Tracking® (9400)
 * series, so that is what we generate for them.
 */
export const MAIL_CLASS_FORMATS: Record<string, string> = {
  "Priority Mail Express®": "express-13",
  "Priority Mail®": "priority",
  "USPS Ground Advantage®": "usps-tracking",
  "First-Class Mail®": "usps-tracking",
  "Certified Mail®": "certified",
  "Registered Mail™": "registered",
  "Signature Confirmation™": "signature",
  "Collect On Delivery": "cod",
  "Priority Mail Express International®": "express-intl",
  "Priority Mail International®": "priority-intl",
};

/* ------------------------------------------------------------------ */
/*  Normalizing / formatting                                          */
/* ------------------------------------------------------------------ */

/** Uppercase and strip everything that isn't a letter or digit. */
export function normalizeTracking(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

/**
 * Apply USPS's conventional grouping:
 *   22 digits → 4 4 4 4 4 2
 *   13 chars  → XX NNN NNN NNN US
 */
export function formatTrackingNumber(value: string): string {
  const n = normalizeTracking(value);
  if (/^\d{22}$/.test(n)) {
    return [n.slice(0, 4), n.slice(4, 8), n.slice(8, 12), n.slice(12, 16), n.slice(16, 20), n.slice(20)].join(" ");
  }
  if (/^[A-Z]{2}\d{9}US$/.test(n)) {
    return `${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8, 11)} ${n.slice(11)}`;
  }
  return value;
}

/** Display helper used by tracking results and admin tables. */
export function displayTracking(value: string): string {
  return formatTrackingNumber(value) || value;
}

/* ------------------------------------------------------------------ */
/*  Check digit                                                       */
/* ------------------------------------------------------------------ */

/** Mod-10 check digit with alternating 3-1 weighting, applied right-to-left. */
export function computeCheckDigit(dataDigits: string): number {
  let sum = 0;
  let weight = 3;
  for (let i = dataDigits.length - 1; i >= 0; i--) {
    sum += Number(dataDigits[i]) * weight;
    weight = weight === 3 ? 1 : 3;
  }
  return (10 - (sum % 10)) % 10;
}

/* ------------------------------------------------------------------ */
/*  Inspection                                                        */
/* ------------------------------------------------------------------ */

export interface TrackingMeta {
  /**
   * True when the value matches a USPS tracking-number structure
   * (22 digits, or 2 letters + 9 digits + US). Prefix and check digit
   * are reported separately and never gate this flag.
   */
  valid: boolean;
  family: TrackingFamily;
  /** Official service name for the detected series, or "" if unrecognized. */
  service: string;
  /** Registry key of the detected series, or "" if unrecognized. */
  formatKey: string;
  /** Short human-readable description of the matched structure. */
  formatLabel: string;
  normalized: string;
  display: string;
  /** Whether the prefix maps to a known USPS series. */
  recognizedPrefix: boolean;
  /** Advisory mod-10 result. */
  checkDigitOk?: boolean;
}

function resolveFormat(prefix: string, family: TrackingFamily): TrackingFormat | undefined {
  return TRACKING_FORMATS.find((f) => f.family === family && f.prefixes.includes(prefix));
}

/** Parse a tracking number: detects family, official series, and check digit. */
export function inspectTracking(value: string): TrackingMeta {
  const n = normalizeTracking(value);
  const base = { normalized: n, display: formatTrackingNumber(n) || value };

  if (/^[A-Z]{2}\d{9}US$/.test(n)) {
    const fmt = resolveFormat(n.slice(0, 2), "international13");
    return {
      ...base,
      family: "international13",
      service: fmt?.service ?? "",
      formatKey: fmt?.key ?? "",
      formatLabel: "13-character format",
      valid: true,
      recognizedPrefix: Boolean(fmt),
      checkDigitOk: computeCheckDigit(n.slice(2, 10)) === Number(n[10]),
    };
  }

  if (/^\d{22}$/.test(n)) {
    const fmt = resolveFormat(n.slice(0, 4), "domestic22");
    return {
      ...base,
      family: "domestic22",
      service: fmt?.service ?? "",
      formatKey: fmt?.key ?? "",
      formatLabel: "22-digit format",
      valid: true,
      recognizedPrefix: Boolean(fmt),
      checkDigitOk: computeCheckDigit(n.slice(0, 21)) === Number(n[21]),
    };
  }

  // 20-digit legacy numbers still exist in the wild; recognized structurally
  // but they predate the current 22-digit series.
  if (/^\d{20}$/.test(n)) {
    return {
      ...base,
      family: "domestic22",
      service: "",
      formatKey: "",
      formatLabel: "20-digit legacy format",
      valid: true,
      recognizedPrefix: false,
      checkDigitOk: computeCheckDigit(n.slice(0, 19)) === Number(n[19]),
    };
  }

  return {
    ...base,
    valid: false,
    family: "unknown",
    service: "",
    formatKey: "",
    formatLabel: "Unrecognized format",
    recognizedPrefix: false,
  };
}

/** Quick boolean form of {@link inspectTracking}. */
export function isValidTrackingNumber(value: string): boolean {
  return inspectTracking(value).valid;
}

/* ------------------------------------------------------------------ */
/*  Generation                                                        */
/* ------------------------------------------------------------------ */

const randDigits = (count: number): string =>
  Array.from({ length: count }, () => Math.floor(Math.random() * 10)).join("");

export interface GenerateOptions {
  /** Force a specific registry series by key (e.g. "express-22"). */
  formatKey?: string;
  /** Force a specific service-type prefix. */
  prefix?: string;
}

/**
 * Generate a well-formed USPS tracking number for a mail class, including a
 * correct check digit. Always domestic-format unless the class is
 * international-only or a 13-character series is forced.
 */
export function generateTrackingNumber(service: string, options: GenerateOptions = {}): string {
  const byKey = options.formatKey
    ? TRACKING_FORMATS.find((f) => f.key === options.formatKey)
    : undefined;
  const fmt =
    byKey ??
    TRACKING_FORMATS.find((f) => f.key === MAIL_CLASS_FORMATS[service]) ??
    TRACKING_FORMATS.find((f) => f.service === service) ??
    TRACKING_FORMATS[0];

  const prefix =
    options.prefix && fmt.prefixes.includes(options.prefix)
      ? options.prefix
      : fmt.prefixes[Math.floor(Math.random() * fmt.prefixes.length)];

  let raw: string;
  if (fmt.family === "international13") {
    const data = randDigits(8);
    raw = `${prefix}${data}${computeCheckDigit(data)}US`;
  } else {
    const data = prefix + randDigits(17); // 21 digits
    raw = data + computeCheckDigit(data);
  }

  return formatTrackingNumber(raw);
}

/* ------------------------------------------------------------------ */
/*  Reference data for the UI                                         */
/* ------------------------------------------------------------------ */

/**
 * Reference numbers used by the tracking page's example table.
 * Each is a valid number in the correct official series.
 */
export const SAMPLE_TRACKING = {
  /** USPS Tracking® / Ground Advantage series, 22 digits. */
  tracking: "9400 5483 1381 3152 3762 23",
  /** Priority Mail Express®, 13-character. */
  express: "EA 852 988 419 US",
  /** Priority Mail®, 22 digits. */
  priority: "9205 7561 5176 0394 5987 30",
  /** Signature Confirmation™, 22 digits. */
  signature: "9202 7494 8002 0284 0023 46",
  /** Real live shipment (Ground Advantage) supplied as the design reference. */
  liveExample: "9500 1265 2487 6262 7854 63",
} as const;

/** Numbers offered as "try a sample" links on the tracking page. */
export const SAMPLE_TRACKING_LIST: string[] = [SAMPLE_TRACKING.tracking, SAMPLE_TRACKING.express, SAMPLE_TRACKING.liveExample];
