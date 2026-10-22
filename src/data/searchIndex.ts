/**
 * Site search index.
 *
 * Every registered page with the terms a visitor is likely to type.
 * Kept in one place so the header search, the site index, and the
 * "no results" suggestions all read from the same source.
 */

export interface SearchEntry {
  route: string;
  title: string;
  /** Short description shown under the title in results. */
  description: string;
  /** Extra terms that should match this page. */
  keywords: string[];
}

export const SEARCH_INDEX: SearchEntry[] = [
  {
    route: "/",
    title: "USPS.com Home",
    description: "Track packages, buy stamps, calculate postage, and find locations.",
    keywords: ["home", "homepage", "usps"],
  },
  {
    route: "/track",
    title: "Track a Package",
    description: "See the latest scan, expected delivery date, and full tracking history.",
    keywords: ["tracking", "track", "where is my package", "status", "delivery", "scan", "on hold", "stopped"],
  },
  {
    route: "/zip",
    title: "Look Up a ZIP Code™",
    description: "Find the ZIP+4 Code for any U.S. address.",
    keywords: ["zip", "zip code", "postal code", "zip+4"],
  },
  {
    route: "/calculate",
    title: "Calculate a Price",
    description: "Compare postage prices for every mail class and package size.",
    keywords: ["calculate", "postage", "price", "rates", "cost", "shipping cost"],
  },
  {
    route: "/pickup",
    title: "Schedule a Pickup",
    description: "Have your carrier collect packages from your door for free.",
    keywords: ["pickup", "pick up", "carrier pickup", "schedule"],
  },
  {
    route: "/locations",
    title: "Find USPS Locations",
    description: "Locate Post Offices, collection boxes, and Approved Postal Providers.",
    keywords: ["locations", "post office", "near me", "hours", "drop off"],
  },
  {
    route: "/ship",
    title: "Click-N-Ship®",
    description: "Create shipping labels and pay for postage online.",
    keywords: ["ship", "click n ship", "label", "print label", "shipping"],
  },
  {
    route: "/store",
    title: "The Postal Store®",
    description: "Buy stamps, shipping supplies, and collectibles.",
    keywords: ["stamps", "store", "buy stamps", "supplies", "boxes", "envelopes", "forever"],
  },
  {
    route: "/informed",
    title: "Informed Delivery®",
    description: "Preview your incoming mail and track packages in one daily digest.",
    keywords: ["informed delivery", "mail preview", "digest", "notifications"],
  },
  {
    route: "/help",
    title: "Help & Support",
    description: "Answers to common questions, plus contact options.",
    keywords: ["help", "support", "contact", "faq", "customer service"],
  },
  {
    route: "/news",
    title: "USPS News",
    description: "Service alerts, deadlines, and announcements.",
    keywords: ["news", "updates", "alerts", "announcements"],
  },
  {
    route: "/business",
    title: "USPS for Business",
    description: "Commercial pricing, shipping tools, and business solutions.",
    keywords: ["business", "commercial", "bulk", "connect", "eddm"],
  },
  {
    route: "/international",
    title: "International Shipping",
    description: "Ship to 180+ countries with customs guidance.",
    keywords: ["international", "overseas", "customs", "global"],
  },
  {
    route: "/admin/dashboard",
    title: "Shipping Admin Dashboard",
    description: "Create labels, manage shipments, and place holds or stops.",
    keywords: ["admin", "dashboard", "shipping admin", "holds", "label"],
  },
  {
    route: "/login",
    title: "Sign In",
    description: "Access your USPS.com account.",
    keywords: ["login", "sign in", "account"],
  },
  {
    route: "/create-account",
    title: "Create an Account",
    description: "Register for a free USPS.com account.",
    keywords: ["register", "sign up", "create account"],
  },
  {
    route: "/forgot-password",
    title: "Reset Your Password",
    description: "Recover access to your account.",
    keywords: ["forgot password", "reset", "recover"],
  },
  {
    route: "/account",
    title: "My Account",
    description: "Manage your profile, tracking, and preferences.",
    keywords: ["account", "profile", "my usps"],
  },
  {
    route: "/cart",
    title: "Shopping Cart",
    description: "Review items before checkout.",
    keywords: ["cart", "checkout", "basket"],
  },
  {
    route: "/passport-services",
    title: "Passport Services",
    description: "Apply for or renew a passport at a Post Office.",
    keywords: ["passport", "passports", "renew", "apply"],
  },
  {
    route: "/money-orders",
    title: "Money Orders",
    description: "Buy and cash money orders at a Post Office.",
    keywords: ["money order", "money orders", "payment"],
  },
  {
    route: "/redelivery",
    title: "Schedule Redelivery",
    description: "Ask USPS to redeliver a package that was missed.",
    keywords: ["redelivery", "re-delivery", "missed delivery", "reschedule"],
  },
  {
    route: "/intercept-package",
    title: "Package Intercept®",
    description: "Redirect or hold a package that is already in transit.",
    keywords: ["intercept", "redirect", "reroute", "hold package"],
  },
  {
    route: "/insurance-extra-services",
    title: "Insurance & Extra Services",
    description: "Add insurance, signature confirmation, and more.",
    keywords: ["insurance", "extra services", "signature", "certified"],
  },
  {
    route: "/shipping-restrictions",
    title: "Shipping Restrictions",
    description: "What you can and cannot mail, including hazardous materials.",
    keywords: ["restrictions", "prohibited", "hazardous", "what can i mail"],
  },
  {
    route: "/customs-forms",
    title: "Customs Forms",
    description: "Complete customs declarations for international mail.",
    keywords: ["customs", "forms", "2976", "declaration"],
  },
  {
    route: "/file-claim",
    title: "File a Claim",
    description: "Request reimbursement for lost or damaged mail.",
    keywords: ["claim", "file claim", "damaged", "lost", "refund"],
  },
  {
    route: "/find-missing-mail",
    title: "Find Missing Mail",
    description: "Start a Missing Mail search for a package that has not arrived.",
    keywords: ["missing mail", "lost package", "where is my package", "search"],
  },
  {
    route: "/privacy",
    title: "Privacy Policy",
    description: "How USPS collects, uses, and protects your information.",
    keywords: ["privacy", "policy", "data"],
  },
  {
    route: "/terms",
    title: "Terms of Use",
    description: "The terms that govern use of this site.",
    keywords: ["terms", "terms of use", "legal"],
  },
  {
    route: "/site-index",
    title: "Site Index",
    description: "Every page on this site, in one place.",
    keywords: ["site index", "sitemap", "all pages", "directory"],
  },
];

/** Score an entry against a query. Higher is better; 0 means no match. */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const terms = q.split(/\s+/).filter(Boolean);
  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const keys = entry.keywords.join(" ").toLowerCase();

  let score = 0;
  for (const t of terms) {
    if (title === t) score += 100;
    else if (title.startsWith(t)) score += 60;
    else if (title.includes(t)) score += 40;
    if (keys.split(" ").includes(t)) score += 30;
    else if (keys.includes(t)) score += 20;
    if (desc.includes(t)) score += 10;
    if (entry.route.includes(t)) score += 5;
  }
  return score;
}

export function searchSite(query: string): SearchEntry[] {
  return SEARCH_INDEX.map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.e);
}
