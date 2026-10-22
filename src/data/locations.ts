/**
 * USPS location directory.
 *
 * Addresses and coordinates are real New York City postal facilities; the
 * service mix and hours are representative of the published USPS location
 * types. This mirrors how the rest of the site treats data: the shape and the
 * vocabulary match the real thing, the records themselves are a fixed set so
 * the demo works without an API key.
 */

export type LocationType =
  | "Post Office™"
  | "Collection Boxes"
  | "Self-Service Kiosks"
  | "National Retailer"
  | "Contract Postal Unit"
  | "Village Post Office™"
  | "gopost®";

export const LOCATION_TYPES: {
  type: LocationType;
  color: string;
  short: string;
  desc: string;
}[] = [
  {
    type: "Post Office™",
    color: "#004b87",
    short: "Post Office",
    desc: "Staffed by retail associates, has window service hours.",
  },
  {
    type: "Collection Boxes",
    color: "#da291c",
    short: "Collection Box",
    desc: "Freestanding mailboxes such as the familiar USPS Blue Box.",
  },
  {
    type: "Self-Service Kiosks",
    color: "#6d28d9",
    short: "Self-Service Kiosk",
    desc: "Some in large shopping malls. Most kiosks are in a Post Office.",
  },
  {
    type: "National Retailer",
    color: "#0f766e",
    short: "National Retailer",
    desc: "Retail business that sells stamps and some mailing services.",
  },
  {
    type: "Contract Postal Unit",
    color: "#b45309",
    short: "Contract Postal Unit",
    desc: "Contract Postal Units (CPUs) are located within existing businesses.",
  },
  {
    type: "Village Post Office™",
    color: "#be185d",
    short: "Village Post Office",
    desc: "A Village Post Office™ sells a limited selection of Postal products and services.",
  },
  {
    type: "gopost®",
    color: "#4d7c0f",
    short: "gopost",
    desc: "gopost units are automated, secured, self-service parcel lockers.",
  },
];

export const TYPE_COLOR: Record<LocationType, string> = Object.fromEntries(
  LOCATION_TYPES.map((t) => [t.type, t.color])
) as Record<LocationType, string>;

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface UspsLocation {
  id: string;
  name: string;
  type: LocationType;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  phone?: string;
  tty?: string;
  hours: Partial<Record<Day, string>>;
  services: string[];
  /** Open lobby with 24-hour access. */
  lobby24h?: boolean;
}

const WEEKDAY = (o: string, c: string) => ({ Mon: `${o} – ${c}`, Tue: `${o} – ${c}`, Wed: `${o} – ${c}`, Thu: `${o} – ${c}`, Fri: `${o} – ${c}` });

export const LOCATIONS: UspsLocation[] = [
  {
    id: "farley",
    name: "James A. Farley Post Office",
    type: "Post Office™",
    street: "421 8th Ave",
    city: "New York",
    state: "NY",
    zip: "10199",
    lat: 40.75066,
    lng: -73.99689,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("7:00 AM", "10:00 PM"), Sat: "7:00 AM – 10:00 PM", Sun: "7:00 AM – 10:00 PM" },
    services: [
      "Passport Appointments",
      "Passport Walk-In",
      "Passport Photo",
      "PO Box",
      "Self-Service Kiosk",
      "Money Order (Domestic)",
      "Stamp Booklet",
      "Priority Mail Express",
      "Label Broker Retail",
      "Carrier Services",
      "Pickup Hold Mail",
      "Pickup Accountable Mail",
    ],
    lobby24h: true,
  },
  {
    id: "grand-central",
    name: "Grand Central Station",
    type: "Post Office™",
    street: "450 Lexington Ave",
    city: "New York",
    state: "NY",
    zip: "10017",
    lat: 40.75366,
    lng: -73.97558,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("7:00 AM", "7:00 PM"), Sat: "9:00 AM – 4:00 PM" },
    services: [
      "PO Box",
      "Self-Service Kiosk",
      "Stamp Booklet",
      "Money Order (Domestic)",
      "Priority Mail Express",
      "Label Broker Retail",
      "Carrier Services",
      "Pickup Hold Mail",
    ],
  },
  {
    id: "radio-city",
    name: "Radio City Station",
    type: "Post Office™",
    street: "1220 6th Ave",
    city: "New York",
    state: "NY",
    zip: "10020",
    lat: 40.75935,
    lng: -73.98128,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("8:00 AM", "6:00 PM"), Sat: "9:00 AM – 3:00 PM" },
    services: ["PO Box", "Stamp Booklet", "Money Order (Domestic)", "Label Broker Retail", "Carrier Services"],
  },
  {
    id: "chelsea",
    name: "Chelsea Station",
    type: "Post Office™",
    street: "217 W 19th St",
    city: "New York",
    state: "NY",
    zip: "10011",
    lat: 40.7421,
    lng: -73.99747,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("9:00 AM", "5:00 PM"), Sat: "9:00 AM – " + "1:00 PM" },
    services: ["PO Box", "Stamp Booklet", "Money Order (Domestic)", "Gift Cards", "Greeting Cards", "Duck Stamp"],
  },
  {
    id: "peter-stuyvesant",
    name: "Peter Stuyvesant Station",
    type: "Post Office™",
    street: "432 E 14th St",
    city: "New York",
    state: "NY",
    zip: "10009",
    lat: 40.73048,
    lng: -73.98028,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("9:00 AM", "5:00 PM"), Sat: "9:00 AM – 1:00 PM" },
    services: ["PO Box", "Stamp Booklet", "Money Order (Domestic)", "General Delivery", "Pickup Notice Left Mail"],
  },
  {
    id: "church-street",
    name: "Church Street Station",
    type: "Post Office™",
    street: "90 Church St",
    city: "New York",
    state: "NY",
    zip: "10007",
    lat: 40.7135,
    lng: -74.0086,
    phone: "212-330-3000",
    tty: "212-967-8569",
    hours: { ...WEEKDAY("8:00 AM", "6:00 PM") },
    services: [
      "Passport Appointments",
      "Passport Walk-In",
      "PO Box",
      "Bulk Mail Acceptance",
      "Call Referral",
      "USPS Connect Local",
      "Priority Mail International",
    ],
  },
  {
    id: "brooklyn-main",
    name: "Brooklyn Main Post Office",
    type: "Post Office™",
    street: "271 Cadman Plaza W",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    lat: 40.69756,
    lng: -73.99124,
    phone: "718-858-7000",
    tty: "718-596-7554",
    hours: { ...WEEKDAY("7:00 AM", "8:00 PM"), Sat: "8:00 AM – 5:00 PM", Sun: "9:00 AM – 2:00 PM" },
    services: [
      "Passport Appointments",
      "Passport Photo",
      "Passport Walk-In",
      "PO Box",
      "Self-Service Kiosk",
      "Bulk Mail Acceptance",
      "Money Order (Domestic)",
      "In-Person Proofing",
      "Pickup Hold Mail",
    ],
    lobby24h: true,
  },
  {
    id: "flushing",
    name: "Flushing Main Post Office",
    type: "Post Office™",
    street: "39-01 Main St",
    city: "Flushing",
    state: "NY",
    zip: "11354",
    lat: 40.75936,
    lng: -73.83034,
    phone: "718-321-6900",
    tty: "718-596-7554",
    hours: { ...WEEKDAY("8:30 AM", "6:00 PM"), Sat: "9:00 AM – 4:00 PM" },
    services: [
      "Passport Appointments",
      "Passport Walk-In",
      "PO Box",
      "Money Order (Domestic)",
      "Priority Mail International",
      "Bulk Mail Acceptance",
      "USPS Smart Locker",
    ],
  },
  {
    id: "lic",
    name: "Long Island City Station",
    type: "Post Office™",
    street: "46-02 21st St",
    city: "Long Island City",
    state: "NY",
    zip: "11101",
    lat: 40.74793,
    lng: -73.94696,
    phone: "718-361-7100",
    tty: "718-596-7554",
    hours: { ...WEEKDAY("8:00 AM", "6:30 PM"), Sat: "9:00 AM – 3:00 PM" },
    services: ["PO Box", "Self-Service Kiosk", "Label Broker Retail", "Carrier Services", "USPS Connect Local", "Priority Mail Express"],
  },
  {
    id: "bronx-gpo",
    name: "Bronx General Post Office",
    type: "Post Office™",
    street: "341 E 149th St",
    city: "Bronx",
    state: "NY",
    zip: "10451",
    lat: 40.81741,
    lng: -73.92296,
    phone: "718-402-1000",
    tty: "718-596-7554",
    hours: { ...WEEKDAY("8:00 AM", "6:00 PM"), Sat: "9:00 AM – 2:00 PM" },
    services: ["PO Box", "Money Order (Domestic)", "Passport Walk-In", "In-Person Proofing", "Biometric Fingerprint Collection"],
  },
  {
    id: "box-penn",
    name: "Collection Box — 8th Ave & W 33rd St",
    type: "Collection Boxes",
    street: "8th Ave & W 33rd St",
    city: "New York",
    state: "NY",
    zip: "10001",
    lat: 40.7506,
    lng: -73.9936,
    hours: { Mon: "Pickup 5:00 PM", Tue: "Pickup 5:00 PM", Wed: "Pickup 5:00 PM", Thu: "Pickup 5:00 PM", Fri: "Pickup 5:00 PM", Sat: "Pickup 12:00 PM" },
    services: ["Blue Box", "Priority Mail Express", "Label Broker Self-Service"],
  },
  {
    id: "box-72nd",
    name: "Collection Box — Broadway & W 72nd St",
    type: "Collection Boxes",
    street: "Broadway & W 72nd St",
    city: "New York",
    state: "NY",
    zip: "10023",
    lat: 40.7786,
    lng: -73.9818,
    hours: { ...WEEKDAY("Pickup 5:30 PM", "Pickup 5:30 PM"), Sat: "Pickup 1:00 PM" } as Partial<Record<Day, string>>,
    services: ["Blue Box", "Priority Mail Express"],
  },
  {
    id: "box-bedford",
    name: "Collection Box — Bedford Ave & N 7th St",
    type: "Collection Boxes",
    street: "Bedford Ave & N 7th St",
    city: "Brooklyn",
    state: "NY",
    zip: "11211",
    lat: 40.7186,
    lng: -73.9573,
    hours: { ...WEEKDAY("Pickup 6:00 PM", "Pickup 6:00 PM"), Sat: "Pickup 2:00 PM" } as Partial<Record<Day, string>>,
    services: ["Blue Box"],
  },
  {
    id: "kiosk-farley",
    name: "Self-Service Kiosk — Farley Lobby",
    type: "Self-Service Kiosks",
    street: "421 8th Ave, Main Lobby",
    city: "New York",
    state: "NY",
    zip: "10199",
    lat: 40.7507,
    lng: -73.9967,
    hours: {},
    services: ["Self-Service Kiosk", "Stamp Booklet", "Priority Mail Express", "Label Broker Self-Service", "After Hours Access"],
    lobby24h: true,
  },
  {
    id: "kiosk-broadway",
    name: "Self-Service Kiosk — 1250 Broadway",
    type: "Self-Service Kiosks",
    street: "1250 Broadway, Lobby",
    city: "New York",
    state: "NY",
    zip: "10001",
    lat: 40.7474,
    lng: -73.9882,
    hours: { ...WEEKDAY("6:00 AM", "11:00 PM"), Sat: "7:00 AM – 9:00 PM", Sun: "8:00 AM – 8:00 PM" },
    services: ["Self-Service Kiosk", "Stamp Booklet", "After Hours Access"],
  },
  {
    id: "retailer-wall",
    name: "Approved Postal Provider — 40 Wall St",
    type: "National Retailer",
    street: "40 Wall St, Concourse Level",
    city: "New York",
    state: "NY",
    zip: "10005",
    lat: 40.7069,
    lng: -74.0095,
    phone: "212-425-1100",
    hours: { ...WEEKDAY("8:00 AM", "7:00 PM"), Sat: "10:00 AM – 4:00 PM" },
    services: ["Label Broker Retail", "Stamp Booklet", "Priority Mail Express", "Greeting Cards"],
  },
  {
    id: "retailer-fifth",
    name: "Approved Postal Provider — 245 5th Ave",
    type: "National Retailer",
    street: "245 5th Ave",
    city: "New York",
    state: "NY",
    zip: "10016",
    lat: 40.7447,
    lng: -73.987,
    phone: "212-532-7700",
    hours: { ...WEEKDAY("9:00 AM", "8:00 PM"), Sat: "10:00 AM – 6:00 PM", Sun: "11:00 AM – 5:00 PM" },
    services: ["Label Broker Retail", "Stamp Booklet", "Gift Cards", "Greeting Cards", "Money Order (Domestic)"],
  },
  {
    id: "cpu-columbia",
    name: "Columbia University Station (CPU)",
    type: "Contract Postal Unit",
    street: "538 W 110th St",
    city: "New York",
    state: "NY",
    zip: "10025",
    lat: 40.806,
    lng: -73.9643,
    phone: "212-854-2222",
    hours: { ...WEEKDAY("9:00 AM", "6:00 PM"), Sat: "10:00 AM – 2:00 PM" },
    services: ["PO Box", "Stamp Booklet", "Label Broker Retail", "Priority Mail Express", "General Delivery"],
  },
  {
    id: "vpo-gristedes",
    name: "Village Post Office™ — W 42nd St",
    type: "Village Post Office™",
    street: "355 W 42nd St",
    city: "New York",
    state: "NY",
    zip: "10036",
    lat: 40.7574,
    lng: -73.9928,
    hours: { Mon: "8:00 AM – 9:00 PM", Tue: "8:00 AM – 9:00 PM", Wed: "8:00 AM – 9:00 PM", Thu: "8:00 AM – 9:00 PM", Fri: "8:00 AM – 9:00 PM", Sat: "8:00 AM – 9:00 PM", Sun: "8:00 AM – 8:00 PM" },
    services: ["Stamp Booklet", "Label Broker Retail"],
  },
  {
    id: "gopost-park",
    name: "gopost® — 300 Park Ave S",
    type: "gopost®",
    street: "300 Park Ave S",
    city: "New York",
    state: "NY",
    zip: "10010",
    lat: 40.7405,
    lng: -73.9872,
    hours: {},
    services: ["USPS Smart Locker", "After Hours Access", "Label Broker Self-Service"],
    lobby24h: true,
  },
];

/* ---------------- filtering ---------------- */

export const FILTER_GROUPS: { heading: string; filters: string[] }[] = [
  {
    heading: "Common services / hours",
    filters: ["Sunday Hours", "Pickup Hold Mail", "Passport Appointments"],
  },
  {
    heading: "Hours",
    filters: ["Weekday Hours After 5 PM", "Saturday Hours", "Sunday Hours", "24-Hour Facilities"],
  },
  {
    heading: "Passport services",
    filters: ["Passport Appointments", "Passport Photo", "Passport Walk-In"],
  },
  {
    heading: "Pickup services",
    filters: ["Pickup Accountable Mail", "Pickup Hold Mail", "Pickup Notice Left Mail", "USPS Smart Locker", "After Hours Access"],
  },
  {
    heading: "Mailing services",
    filters: [
      "Carrier Services",
      "General Delivery",
      "Priority Mail International",
      "PO Box",
      "Self-Service Kiosk",
      "Label Broker Retail",
      "Label Broker Self-Service",
      "Blue Box",
      "Priority Mail Express",
    ],
  },
  {
    heading: "Business services",
    filters: ["Bulk Mail Acceptance", "Call Referral", "USPS Connect Local"],
  },
  {
    heading: "Financial services",
    filters: ["Burial Flag", "Duck Stamp", "Gift Cards", "Greeting Cards", "Money Order (Domestic)", "Stamp Booklet"],
  },
  {
    heading: "Identity verification",
    filters: ["Biometric Fingerprint Collection", "In-Person Proofing"],
  },
];

/** Parses the closing time out of a display string like "8:00 AM – 6:30 PM". */
function closesAfter(hours: Partial<Record<Day, string>>, hour: number): boolean {
  return (["Mon", "Tue", "Wed", "Thu", "Fri"] as Day[]).some((d) => {
    const raw = hours[d];
    if (!raw) return false;
    const m = raw.match(/–\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
    if (!m) return false;
    let h = Number(m[1]);
    const pm = m[3].toUpperCase() === "PM";
    if (pm && h !== 12) h += 12;
    if (!pm && h === 12) h = 0;
    return h >= hour;
  });
}

/** True when the location satisfies a derived (hours-based) filter. */
export function hasDerivedFilter(loc: UspsLocation, filter: string): boolean {
  switch (filter) {
    case "Weekday Hours After 5 PM":
      return closesAfter(loc.hours, 17);
    case "Saturday Hours":
      return Boolean(loc.hours.Sat);
    case "Sunday Hours":
      return Boolean(loc.hours.Sun);
    case "24-Hour Facilities":
      return Boolean(loc.lobby24h);
    default:
      return false;
  }
}

const DERIVED = new Set([
  "Weekday Hours After 5 PM",
  "Saturday Hours",
  "Sunday Hours",
  "24-Hour Facilities",
]);

export function matchesFilters(loc: UspsLocation, filters: string[]): boolean {
  return filters.every((f) =>
    DERIVED.has(f) ? hasDerivedFilter(loc, f) : loc.services.includes(f)
  );
}

/* ---------------- geo ---------------- */

export const DEFAULT_ORIGIN = { lat: 40.7484, lng: -73.9857, label: "New York, NY 10001" };

/** Straight-line distance in miles. */
export function distanceMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export const RADIUS_OPTIONS = [1, 3, 5, 10, 20, 50, 100];

export const STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AS", "American Samoa"], ["AZ", "Arizona"],
  ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"],
  ["DE", "Delaware"], ["DC", "District of Columbia"], ["FM", "Federated States of Micronesia"],
  ["FL", "Florida"], ["GA", "Georgia"], ["GU", "Guam"], ["HI", "Hawaii"], ["ID", "Idaho"],
  ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"],
  ["LA", "Louisiana"], ["ME", "Maine"], ["MH", "Marshall Islands"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["MP", "Northern Mariana Islands"],
  ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PW", "Palau"], ["PA", "Pennsylvania"],
  ["PR", "Puerto Rico"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"],
  ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"],
  ["VI", "Virgin Islands"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"], ["AA", "Armed Forces Americas"],
  ["AE", "Armed Forces Europe"], ["AP", "Armed Forces Pacific"],
] as const;

/** Coordinates for the cities this demo can search by name. */
export const CITY_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  "new york, ny": { lat: 40.7484, lng: -73.9857, label: "New York, NY" },
  "brooklyn, ny": { lat: 40.6782, lng: -73.9442, label: "Brooklyn, NY" },
  "queens, ny": { lat: 40.7282, lng: -73.7949, label: "Queens, NY" },
  "bronx, ny": { lat: 40.8448, lng: -73.8648, label: "Bronx, NY" },
  "staten island, ny": { lat: 40.5795, lng: -74.1502, label: "Staten Island, NY" },
  "long island city, ny": { lat: 40.7447, lng: -73.9485, label: "Long Island City, NY" },
  "flushing, ny": { lat: 40.7674, lng: -73.8331, label: "Flushing, NY" },
  "jersey city, nj": { lat: 40.7178, lng: -74.0431, label: "Jersey City, NJ" },
  "newark, nj": { lat: 40.7357, lng: -74.1724, label: "Newark, NJ" },
  "philadelphia, pa": { lat: 39.9526, lng: -75.1652, label: "Philadelphia, PA" },
  "boston, ma": { lat: 42.3601, lng: -71.0589, label: "Boston, MA" },
  "washington, dc": { lat: 38.9072, lng: -77.0369, label: "Washington, DC" },
  "chicago, il": { lat: 41.8781, lng: -87.6298, label: "Chicago, IL" },
  "atlanta, ga": { lat: 33.749, lng: -84.388, label: "Atlanta, GA" },
  "miami, fl": { lat: 25.7617, lng: -80.1918, label: "Miami, FL" },
  "houston, tx": { lat: 29.7604, lng: -95.3698, label: "Houston, TX" },
  "dallas, tx": { lat: 32.7767, lng: -96.797, label: "Dallas, TX" },
  "los angeles, ca": { lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
  "san francisco, ca": { lat: 37.7749, lng: -122.4194, label: "San Francisco, CA" },
  "seattle, wa": { lat: 47.6062, lng: -122.3321, label: "Seattle, WA" },
  "denver, co": { lat: 39.7392, lng: -104.9903, label: "Denver, CO" },
  "phoenix, az": { lat: 33.4484, lng: -112.074, label: "Phoenix, AZ" },
  "detroit, mi": { lat: 42.3314, lng: -83.0458, label: "Detroit, MI" },
  "cleveland, oh": { lat: 41.4993, lng: -81.6944, label: "Cleveland, OH" },
};
