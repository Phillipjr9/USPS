import { USPS_ASSETS } from "./uspsAssets";
import { findActiveHold, findReason, formatHoldDate } from "./holds";
import {
  findShipment,
  cityLine,
  formatScanDate,
  SHIPMENT_STATUSES,
  type ShipmentRecord,
} from "./shipments";
import { inspectTracking, normalizeTracking, formatTrackingNumber } from "./tracking";
import { formatEtaLong } from "./eta";

const A = USPS_ASSETS;

/** Real icons from the official USPS.com global elements (bundled locally) */
export const ICONS = {
  tracking: A.tracking,
  mailman: A.mailman,
  location: A.location,
  stamps: A.stamps,
  passport: A.passport,
  pickup: A.pickup,
  calculator: A.calculator,
  zip: A.zip,
  holdmail: A.holdmail,
  transit: A.transit,
  address: A.address,
  pobox: A.pobox,
  freeboxes: A.freeboxes,
  clicknship: A.clicknship,
  hscode: A.hscode,
  search: A.search,
  logo: A.logo,
  logoMobile: A.logoMobile,
};

/** Real photography & promo art from the official USPS.com homepage */
export const IMAGES = {
  heroGA: A.heroGA,
  heroGAMobile: A.heroGAMobile,
  giftboxes: A.giftboxes,
  giftBg: A.giftBg,
  informed: A.informed,
  shipFromHome: A.shipFromHome,
  moving: A.moving,
  promo250: A.promo250,
  promo250m: A.promo250m,
  postmark: A.postmark,
  electionMail: A.electionMail,
  goShip: A.goShip,
  goManage: A.goManage,
  goStore: A.goStore,
  goBusiness: A.goBusiness,
  goIntl: A.goIntl,
};

export const SOCIALS_REAL = [
  { name: "Facebook", img: A.facebook, url: "https://www.facebook.com/USPS" },
  { name: "Instagram", img: A.instagram, url: "https://www.instagram.com/usps" },
  { name: "Pinterest", img: A.pinterest, url: "https://www.pinterest.com/usps" },
  { name: "Threads", img: A.threads, url: "https://www.threads.net/@usps" },
  { name: "X", img: A.x, url: "https://twitter.com/usps" },
  { name: "YouTube", img: A.youtube, url: "https://www.youtube.com/usps" },
];

export interface MegaColumn {
  heading: string;
  links: string[];
}

export interface NavItem {
  label: string;
  columns: MegaColumn[];
  featured?: { title: string; desc: string; cta: string; img?: string };
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Quick Tools",
    columns: [
      { heading: "Track & Confirm", links: ["Track a Package", "Track & Manage", "Text Tracking", "Tracking FAQ"] },
      { heading: "Look Up", links: ["Look Up a ZIP Code™", "Find USPS Locations", "Calculate a Price", "Transit Time Map"] },
      { heading: "Manage Mail", links: ["Hold Mail", "Change Your Address", "Rent a PO Box", "Premium Forwarding"] },
    ],
    featured: { title: "Schedule a Pickup", desc: "Free package pickup from your home or office.", cta: "Schedule Now", img: IMAGES.goShip },
  },
  {
    label: "Send",
    columns: [
      { heading: "Send", links: ["Click-N-Ship®", "Send a Package", "Send Mail", "Postage Prices", "Label Broker®", "USPS Smart Lockers"] },
      { heading: "Services", links: ["Priority Mail Express®", "Priority Mail®", "USPS Ground Advantage®", "First-Class Mail®", "Media Mail®", "Military & Diplomatic Mail"] },
      { heading: "Supplies & Extras", links: ["Free Boxes & Envelopes", "Insurance & Extra Services", "Shipping Restrictions", "Custom Mail & Cards", "Money Orders"] },
    ],
    featured: { title: "USPS Ground Advantage®", desc: "2-5 day ground delivery from $5.85. Tracking included.", cta: "Learn More", img: IMAGES.goShip },
  },
  {
    label: "Receive",
    columns: [
      { heading: "Track & Manage", links: ["Track a Package", "Informed Delivery®", "Delivery Instructions", "Redirect a Package", "Signature Services"] },
      { heading: "Receiving", links: ["Hold Mail", "Forward Mail", "Change of Address", "PO Boxes", "General Delivery"] },
      { heading: "Notifications", links: ["Text & Email Updates", "Delivery Status Alerts", "Manage Notifications", "USPS Tracking® FAQs"] },
    ],
    featured: { title: "Informed Delivery®", desc: "Preview your mail and manage packages from anywhere.", cta: "Sign Up Free", img: IMAGES.goManage },
  },
  {
    label: "Shop",
    columns: [
      { heading: "Shop", links: ["Stamps", "Shipping Supplies", "Packaging & Boxes", "Gifts & Collectibles", "Stationery", "Business Supplies"] },
      { heading: "Stamps", links: ["New Releases", "Forever® Stamps", "Love & Wedding", "Holiday Stamps", "Stamp Gifts"] },
      { heading: "Help", links: ["Order Status", "Returns & Exchanges", "Bulk Orders", "Store FAQs"] },
    ],
    featured: { title: "New Stamp Releases", desc: "Celebrate the season with 2026 Forever® collections.", cta: "Shop Stamps", img: IMAGES.goStore },
  },
  {
    label: "Business",
    columns: [
      { heading: "Solutions", links: ["USPS Connect®", "Every Door Direct Mail®", "Business Customer Gateway", "Bulk & Mass Mailing", "Direct Mail Services"] },
      { heading: "Shipping", links: ["Commercial Pricing", "USPS Ship™ Platform", "Pickup Services", "Returns Services", "Negotiated Rates"] },
      { heading: "Resources", links: ["Postage Calculators", "Mailing Standards", "Address Verification", "Small Business Guide"] },
    ],
    featured: { title: "Every Door Direct Mail®", desc: "Reach every home in a neighborhood from 22¢ per piece.", cta: "Get Started", img: IMAGES.goBusiness },
  },
  {
    label: "International",
    columns: [
      { heading: "Send Abroad", links: ["International Shipping", "Priority Mail Express International®", "Priority Mail International®", "First-Class International®", "GXG® Envelopes"] },
      { heading: "Tools", links: ["Calculate International Prices", "Customs Forms", "Country Restrictions", "International Tracking"] },
      { heading: "Learn", links: ["Mailing Abroad Guide", "Prohibited Items", "Insurance & Claims", "APO/FPO/DPO Mail"] },
    ],
    featured: { title: "Send Worldwide", desc: "Affordable delivery to 180+ countries with tracking.", cta: "Ship International", img: IMAGES.goIntl },
  },
  {
    label: "Help",
    columns: [
      { heading: "Support", links: ["FAQs", "Contact Us", "Find Missing Mail", "File a Claim", "Service Alerts", "Report Fraud"] },
      { heading: "About", links: ["Post Office Jobs", "Postal Inspectors", "Sustainability", "Newsroom", "About USPS"] },
      { heading: "Popular", links: ["Postmarks", "Passport Services", "PO Box Prices", "Holiday Deadlines", "Change of Address FAQs"] },
    ],
    featured: { title: "Need Help?", desc: "Chat with us or call 1-800-ASK-USPS® (1-800-275-8777).", cta: "Contact Support", img: IMAGES.goManage },
  },
];

/** The real USPS.com homepage service-link icon row */
export const SERVICE_LINKS: { label: string; desc: string; price?: string; icon: string; alt: string }[] = [
  { label: "Click-N-Ship®", desc: "Pay for and print shipping labels.", icon: ICONS.clicknship, alt: "Printer Icon Link for Click-N-Ship" },
  { label: "Buy Stamps", desc: "Stamps & supplies from the Postal Store.", price: "Forever® $0.82 · Postcard $0.65", icon: ICONS.stamps, alt: "Stamp Icon Link for Buy Stamps" },
  { label: "Informed Delivery®", desc: "Preview mail & manage packages.", icon: ICONS.mailman, alt: "Mail Carrier Icon Link for Informed Delivery" },
  { label: "PO Boxes™", desc: "Rent a secure PO Box today.", icon: ICONS.pobox, alt: "PO Box Icon Link for PO Boxes" },
  { label: "Calculate a Price", desc: "Postage for letters & packages.", icon: ICONS.calculator, alt: "Calculator Icon Link for Calculate a Price" },
  { label: "Hold Mail", desc: "Hold delivery while you're away.", icon: ICONS.holdmail, alt: "Stop mail Icon Link for Hold Mail" },
  { label: "ZIP Code™ Lookup", desc: "Find any ZIP+4 Code.", icon: ICONS.zip, alt: "ZIP Code Location Finder Icon Link for Look up a ZIP Code" },
  { label: "Change My Address", desc: "Forward mail to a new address.", icon: ICONS.address, alt: "House Icon Link for Change My Address" },
  { label: "Schedule a Pickup", desc: "Free carrier pickup service.", icon: ICONS.pickup, alt: "Box and clock Icon Link for Schedule a Pickup" },
  { label: "Find Locations", desc: "Post Offices & collection boxes.", icon: ICONS.location, alt: "Location Icon Link for Find USPS Locations" },
];

/** Real "Featured USPS® Products & Services" cards */
export const FEATURED_PRODUCTS = [
  {
    title: "Informed Delivery® Emails",
    desc: "See what's arriving before it gets to your mailbox with free daily digest emails.",
    img: IMAGES.informed,
    alt: "An Informed Delivery preview email on a smartphone.",
    cta: "Sign Up for Free",
  },
  {
    title: "Ship from Home in 3 Easy Steps",
    desc: "Pay, print your label with Click-N-Ship®, and schedule a free carrier pickup.",
    img: IMAGES.shipFromHome,
    alt: "A Click-N-Ship label in a printer tray on a desk.",
    cta: "Start Shipping",
  },
  {
    title: "Moving Soon?",
    desc: "File a Change of Address in minutes and forward your mail to your new home.",
    img: IMAGES.moving,
    alt: "A family carrying moving boxes together.",
    cta: "Change Address",
  },
];

/** Real Postal Store® carousel slides from usps.com */
export const STORE_CAROUSEL = [
  { title: "USPS Stamps", desc: "Forever Stamps available from The Postal Store.", img: A.carStamps, alt: "Forever Stamps available from The Postal Store.", price: "from $15.60", badge: "Best Seller" },
  { title: "Priority Mail Supplies", desc: "Priority Mail Supplies available in The Postal Store.", img: A.carSupplies, alt: "Priority Mail Supplies available in The Postal Store.", price: "Free", badge: "Free Supplies" },
  { title: "Free Supplies", desc: "Sustainable Priority Mail packaging, free.", img: A.carSustain, alt: "Priority Mail Supplies available in The Postal Store.", price: "Free", badge: "Eco-Friendly" },
  { title: "Barbie Mementos", desc: "Barbie Mementos available in The Postal Store.", img: A.carCards, alt: "Barbie Mementos available in The Postal Store.", price: "from $9.95", badge: "New" },
  { title: "Kid & Pet Costumes", desc: "Kid and pet costumes available in the Postal Store.", img: A.carGifts, alt: "Kid and pet costumes available in the Postal Store.", price: "from $12.95", badge: "Seasonal" },
];

/** Real "USPS Updates" items */
export const UPDATES = [
  {
    tag: "Postmarks",
    title: "Get your mail hand-canceled for free",
    desc: "Ask a retail associate at a Post Office counter to hand-cancel your mail on the day you send it.",
    img: IMAGES.postmark,
    alt: "A postmark stamp that shows a cancellation date of January 13, 2026, in New York, NY.",
  },
  {
    tag: "Holidays",
    title: "Upcoming USPS holidays & hours",
    desc: "See holiday closures and deadlines so your cards and gifts arrive right on time.",
    img: IMAGES.giftboxes,
    alt: "Shipping boxes being offered to ship this Season's Greetings.",
  },
  {
    tag: "Careers",
    title: "Jobs with USPS — now hiring nationwide",
    desc: "Join 640,000+ employees delivering for America. Carriers, clerks, drivers and more.",
    img: IMAGES.promo250,
    alt: "USPS 250th anniversary. Delivering since 1775.",
  },
];

export interface ShipService {
  name: string;
  tag: string;
  price: string;
  time: string;
  features: string[];
  popular?: boolean;
}

export const SHIP_SERVICES: ShipService[] = [
  {
    name: "Priority Mail Express®",
    tag: "Fastest",
    price: "$31.40",
    time: "Overnight to 2 days",
    features: ["Date-certain delivery", "$100 insurance included", "Tracking + signature options"],
  },
  {
    name: "Priority Mail®",
    tag: "Most Popular",
    price: "$10.40",
    time: "1–3 business days",
    features: ["Free Flat Rate® boxes", "$100 insurance included", "Free tracking"],
    popular: true,
  },
  {
    name: "USPS Ground Advantage®",
    tag: "Best Value",
    price: "$5.85",
    time: "2–5 business days",
    features: ["Up to 70 lbs", "Tracking included", "Free returns option"],
  },
  {
    name: "First-Class Mail®",
    tag: "Letters",
    price: "$0.78",
    time: "1–5 business days",
    features: ["Postcards & letters", "Forever® stamps", "Metered mail savings"],
  },
];

export const NEWS_ITEMS = [
  {
    tag: "Service Update",
    title: "Postmarks: get your mail hand-canceled for free",
    desc: "Ask any retail associate at a Post Office counter to hand-cancel your mail on the day you send it.",
    date: "Oct 14, 2026",
  },
  {
    tag: "Alert: Text & Email Scams",
    title: "Don't click suspicious USPS texts",
    desc: "USPS never texts about delivery fees or personal info. Report smishing to 7726 and delete the message.",
    date: "Oct 8, 2026",
  },
  {
    tag: "International",
    title: "New EU requirement for packages up to €150",
    desc: "Shipments to European Union countries now need updated customs data — learn what's required.",
    date: "Sep 30, 2026",
  },
];

export const FAQS = [
  { q: "How do I track a package?", a: "Enter your tracking number (up to 35 at once) in the Track tool above. You'll see the latest scan, expected delivery date, and full history. Enable text or email updates for real-time alerts." },
  { q: "Where can I get free boxes?", a: "Priority Mail® and Priority Mail Express® boxes and envelopes are free at any Post Office or orderable online. You can order packs of 10–25 delivered to your door at no charge." },
  { q: "How do I schedule a free package pickup?", a: "Use the Schedule a Pickup tool: tell us where your packages are, choose a date, and your carrier will collect them during regular delivery — free with any prepaid label." },
  { q: "What is Informed Delivery®?", a: "A free service that emails you grayscale previews of letter mail and package tracking each morning, so you know what's arriving before it gets to your mailbox." },
  { q: "How do I change my address or hold my mail?", a: "File a Change of Address online in minutes ($1.10 identity verification), or place a Hold Mail request for 3–30 days while you're away. Both are available under Track & Manage." },
];

export const POST_OFFICES = [
  { name: "Main Post Office — Downtown Station", addr: "100 Postal Plaza, New York, NY 10001", dist: "0.4 mi", hours: "Mon–Fri 8AM–7PM · Sat 9AM–4PM", services: ["Passport", "PO Boxes", "Self-Service Kiosk"] },
  { name: "Midtown Station", addr: "450 8th Ave, New York, NY 10001", dist: "0.9 mi", hours: "Mon–Fri 9AM–6PM · Sat 10AM–2PM", services: ["Pickup", "Stamps", "Money Orders"] },
  { name: "Chelsea Station", addr: "200 W 18th St, New York, NY 10011", dist: "1.3 mi", hours: "Mon–Fri 9AM–5PM · Sat Closed", services: ["PO Boxes", "Business Mail", "Notary"] },
  { name: "Village Contract Unit", addr: "88 Bleecker St, New York, NY 10012", dist: "1.8 mi", hours: "Mon–Sat 10AM–8PM", services: ["Stamps", "Shipping", "Returns"] },
];

/**
 * Determine the mail class from the tracking number's service-type prefix.
 * Falls back to a generic label when the prefix is outside the registry.
 */
function detectService(clean: string): string {
  const meta = inspectTracking(clean);
  if (meta.service) return meta.service;
  if (meta.family === "international13") return "International Mail";
  return "USPS Package Service";
}

/**
 * Canonical scan timeline, mirroring the wording and locations USPS actually
 * publishes on a tracking results page.
 */
const SCAN_TIMELINE = [
  { title: "Shipping Label Created, USPS Awaiting Item", loc: "MCALLEN, TX 78504" },
  { title: "USPS in possession of item", loc: "MCALLEN, TX 78504" },
  { title: "Arrived at USPS Facility", loc: "MCALLEN TX DISTRIBUTION CENTER" },
  { title: "In Transit to Next Facility", loc: "" },
  { title: "Arrived at USPS Facility", loc: "SAN ANTONIO TX DISTRIBUTION CENTER" },
  { title: "Departed USPS Facility", loc: "SAN ANTONIO TX DISTRIBUTION CENTER" },
  { title: "In Transit to Next Facility", loc: "" },
  { title: "Arrived at USPS Facility", loc: "KANSAS CITY KS DISTRIBUTION CENTER" },
  { title: "Arrived at Post Office", loc: "LAWRENCE, KS 66049" },
  { title: "Out for Delivery", loc: "LAWRENCE, KS 66049" },
  { title: "Delivered, Front Door/Porch", loc: "LAWRENCE, KS 66049" },
];

/** How many timeline entries each stage has produced. */
const STAGE_EVENT_COUNT = [1, 2, 5, 10, 11];

/**
 * Demo seeding: the reference shipment used to compare against the real USPS
 * results page always resolves to "Delivered" with a full history, so the two
 * designs can be compared like for like.
 */
const DEMO_STAGE_OVERRIDES: Record<string, number> = {
  "9500126524876262785463": 4,
};

function mockTrackingBase(num: string) {
  const clean = normalizeTracking(num) || "9400548313813152376223";
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash * 31 + clean.charCodeAt(i)) % 997;

  const stages = ["Label Created", "Accepted", "In Transit", "Out for Delivery", "Delivered"];
  const idx = DEMO_STAGE_OVERRIDES[clean] ?? 1 + (hash % 4);
  const status = stages[idx];
  const count = STAGE_EVENT_COUNT[idx];

  const now = new Date();
  const events = [];
  for (let i = 0; i < count; i++) {
    const scan = SCAN_TIMELINE[i];
    // Most recent scan is "now"; each earlier scan steps further back.
    const d = new Date(now.getTime() - (count - 1 - i) * 6 * 3600 * 1000);
    events.push({
      title: scan.title,
      desc: scan.loc ? `${scan.title} — ${scan.loc}` : scan.title,
      loc: scan.loc || "—",
      date:
        d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
        " " +
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    });
  }

  return {
    number: formatTrackingNumber(clean).slice(0, 34),
    status,
    stageIndex: idx,
    eta:
      status === "Delivered"
        ? "Delivered"
        : new Date(Date.now() + (4 - idx) * 86400000).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          }),
    service: detectService(clean),
    events: events.reverse(),
  };
}



/**
 * Turns an admin-created shipment into the tracking result shape.
 *
 * This is what makes an admin-created label genuinely trackable: the scans,
 * origin, destination, service, and weight all come from the label the admin
 * filled in rather than from a hash of the tracking number.
 */
export function trackingFromShipment(s: ShipmentRecord) {
  const origin = cityLine(s.from);
  const destination = cityLine(s.to);
  const stageIndex = Math.max(0, SHIPMENT_STATUSES.indexOf(s.status));

  const events = [...s.scans].reverse().map((scan) => ({
    title: scan.title,
    desc: scan.title,
    loc: scan.place === "origin" ? origin : scan.place === "destination" ? destination : "—",
    date: formatScanDate(scan.at),
  }));

  let eta: string;
  if (s.status === "Delivered") {
    eta = "Delivered";
  } else if (s.status === "Out for Delivery") {
    eta = events[0]?.date.split(" ").slice(0, 4).join(" ") ?? "Today";
  } else if (s.eta) {
    // The date quoted when the label was issued.
    eta = formatEtaLong(s.eta);
  } else {
    const expected = new Date(Math.max(s.createdAt + 3 * 86400000, Date.now() + 86400000));
    eta = expected.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return {
    number: s.tracking,
    status: s.status,
    stageIndex,
    eta,
    service: s.service,
    events,
  };
}

/**
 * Public tracking lookup.
 *
 * Wraps the deterministic base result and applies any active administratively
 * placed hold or stop, so the customer sees the status, reason, and notes.
 */
/** Minimal hold shape needed to overlay a hold onto a tracking result. */
export interface HoldOverlay {
  id: string;
  action: "hold" | "stop";
  reasonCode: string;
  reasonLabel?: string;
  notes: string;
  createdAt: string;
  createdBy?: string;
}

/** Applies an administrative hold on top of a tracking result. */
export function applyHold(
  base: ReturnType<typeof mockTrackingBase> | ReturnType<typeof trackingFromShipment>,
  hold: HoldOverlay
) {
  const reason = findReason(hold.reasonCode);
  const reasonLabel = hold.reasonLabel ?? reason?.label ?? hold.reasonCode;
  const isStop = hold.action === "stop";

  const holdEvent = {
    title: isStop ? "Tracking stopped by USPS" : "Delivery placed on hold",
    desc: `${reasonLabel}${hold.notes ? ` — ${hold.notes}` : ""}`,
    loc: "—",
    date: formatHoldDate(hold.createdAt),
    isHold: true,
  };

  return {
    ...base,
    status: isStop ? "Stopped" : "On Hold",
    eta: "Delayed — see the hold notice below",
    isHeld: true as const,
    hold: {
      id: hold.id,
      action: hold.action,
      reasonCode: hold.reasonCode,
      reasonLabel,
      reasonDescription: reason?.description ?? reasonLabel,
      nextStep: reason?.nextStep ?? "Contact Customer Service at 1-800-275-8777 for assistance.",
      category: reason?.category ?? "General",
      severity: reason?.severity ?? ("warning" as const),
      notes: hold.notes,
      since: hold.createdAt,
      createdBy: hold.createdBy ?? "",
    },
    // Hold notice becomes the most recent scan.
    events: [holdEvent, ...base.events],
  };
}

/**
 * Local tracking result for a number that has no stored shipment.
 * Used as a fallback when the database has nothing for that number.
 */
export function mockTracking(num: string) {
  const shipment = findShipment(num);
  const base = shipment ? trackingFromShipment(shipment) : mockTrackingBase(num);
  const hold = findActiveHold(base.number);
  return hold ? applyHold(base, hold) : { ...base, isHeld: false as const, hold: null };
}

export function calcPostage(fromZip: string, toZip: string, lbs: number, oz: number, shape: string) {
  const totalOz = Math.max(1, lbs * 16 + oz);
  const zone = Math.abs((parseInt(fromZip.slice(0, 3)) || 100) - (parseInt(toZip.slice(0, 3)) || 900)) % 8 + 1;
  const shapeMult = shape === "Flat Rate Box" ? 0 : shape === "Large Envelope" ? 0.8 : shape === "Package" ? 1.15 : 1;
  const base = 3.2 + zone * 0.55 + totalOz * 0.32;
  const ground = shape === "Flat Rate Box" ? 10.4 : +(base * shapeMult).toFixed(2);
  const priority = shape === "Flat Rate Box" ? 17.05 : +(ground * 1.75 + 1.5).toFixed(2);
  const express = +(priority * 2.1 + 3).toFixed(2);
  const first = totalOz <= 13 ? +(0.78 + Math.max(0, totalOz - 1) * 0.28).toFixed(2) : null;
  return { ground, priority, express, first, zone, days: { ground: zone > 5 ? "4–5 days" : "2–3 days", priority: zone > 6 ? "3 days" : "1–2 days", express: "Overnight*" } };
}

export function zipLookup(city: string, state: string) {
  const s = (city + state).toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 100000;
  const base = 10000 + (h % 89999);
  return [String(base), String(base + 1), String(base + 12)];
}
