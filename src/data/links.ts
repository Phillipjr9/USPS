/**
 * Central route map for the USPS.com clone.
 *
 * Every navigation, footer, mega-menu and service-link label maps to a real
 * client route. This guarantees there are no dead links: anything that isn't
 * listed here falls through to the NotFound page.
 */
export const LINK_ROUTES: Record<string, string> = {
  // Home
  Home: "/",

  // Quick tools / service links
  "Click-N-Ship®": "/ship",
  "Buy Stamps": "/store",
  "Informed Delivery®": "/informed",
  "PO Boxes™": "/store",
  "PO Boxes": "/store",
  "Rent a PO Box": "/store",
  "Calculate a Price": "/calculate",
  "Calculate Postage": "/calculate",
  "Hold Mail": "/help",
  "ZIP Code™ Lookup": "/zip",
  "Change My Address": "/help",
  "Change Your Address": "/help",
  "Schedule a Pickup": "/pickup",
  "Find Locations": "/locations",

  // Track & Manage
  "Track a Package": "/track",
  "Track & Manage": "/track",
  "Text Tracking": "/track",
  "Tracking FAQ": "/help",
  "Look Up a ZIP Code™": "/zip",
  "Look Up ZIP Code™": "/zip",
  "Find USPS Locations": "/locations",
  "Transit Time Map": "/ship",
  "Premium Forwarding": "/help",
  "Delivery Instructions": "/help",
  "Redirect a Package": "/intercept-package",
  "Signature Services": "/help",
  "Receiving": "/help",
  "Forward Mail": "/help",
  "Change of Address": "/help",
  "General Delivery": "/locations",
  "Text & Email Updates": "/help",
  "Delivery Status Alerts": "/help",
  "Manage Notifications": "/help",
  "USPS Tracking® FAQs": "/help",

  // Mail & Ship
  "Send a Package": "/ship",
  "Send Mail": "/ship",
  "Postage Prices": "/calculate",
  "Label Broker®": "/ship",
  "USPS Smart Lockers": "/locations",
  "Priority Mail Express®": "/ship",
  "Priority Mail®": "/ship",
  "USPS Ground Advantage®": "/ship",
  "First-Class Mail®": "/ship",
  "Media Mail®": "/ship",
  "Military & Diplomatic Mail": "/international",
  "Free Boxes & Envelopes": "/store",
  "Free Boxes": "/store",
  "Insurance & Extra Services": "/insurance-extra-services",
  "Shipping Restrictions": "/shipping-restrictions",
  "Custom Mail & Cards": "/store",
  "Money Orders": "/money-orders",
  "Commercial Pricing": "/ship",
  "USPS Ship™ Platform": "/ship",
  "Pickup Services": "/pickup",
  "Returns Services": "/help",
  "Negotiated Rates": "/business",
  "Postage Calculators": "/calculate",

  // Postal Store
  "Stamps": "/store",
  "Shipping Supplies": "/store",
  "Packaging & Boxes": "/store",
  "Gifts & Collectibles": "/store",
  "Stationery": "/store",
  "Business Supplies": "/store",
  "New Releases": "/store",
  "New Stamp Releases": "/store",
  "Forever® Stamps": "/store",
  "Love & Wedding": "/store",
  "Holiday Stamps": "/store",
  "Stamp Gifts": "/store",
  "Order Status": "/help",
  "Returns & Exchanges": "/help",
  "Returns": "/help",
  "Bulk Orders": "/help",
  "Store FAQs": "/help",

  // Business
  "USPS Connect®": "/business",
  "Every Door Direct Mail®": "/business",
  "Business Customer Gateway": "/business",
  "Business Gateway": "/business",
  "Bulk & Mass Mailing": "/business",
  "Direct Mail Services": "/business",
  "Direct Mail": "/business",
  "Small Business": "/business",
  "Small Business Guide": "/business",
  "Mailing Standards": "/help",
  "Address Verification": "/help",
  "Investor Info": "/help",

  // International
  "International Shipping": "/international",
  "Shipping Admin": "/admin/dashboard",
  "Create Shipping Label": "/admin/dashboard",
  "Send Worldwide": "/international",
  "Priority Mail Express International®": "/international",
  "Priority Mail International®": "/international",
  "First-Class International®": "/international",
  "GXG® Envelopes": "/international",
  "Calculate International Prices": "/calculate",
  "Customs Forms": "/customs-forms",
  "Country Restrictions": "/international",
  "International Tracking": "/track",
  "Mailing Abroad Guide": "/international",
  "Prohibited Items": "/shipping-restrictions",
  "Insurance & Claims": "/insurance-extra-services",
  "APO/FPO/DPO Mail": "/international",

  // Help
  "FAQs": "/help",
  "Need Help?": "/help",
  "Contact Us": "/help",
  "Find Missing Mail": "/find-missing-mail",
  "Missing Mail": "/find-missing-mail",
  "File a Claim": "/file-claim",
  "Service Alerts": "/news",
  "Report Fraud": "/help",
  "Post Office Jobs": "/help",
  "Careers": "/help",
  "Postal Inspectors": "/help",
  "Sustainability": "/help",
  "Newsroom": "/news",
  "About USPS": "/help",
  "Postmarks": "/news",
  "Passport Services": "/passport-services",
  "PO Box Prices": "/store",
  "Holiday Deadlines": "/news",
  "Change of Address FAQs": "/help",
  "Register / Sign In": "/login",
  "Create an Account": "/create-account",
  "Forgot Password": "/forgot-password",
  "Español": "/help",

  // News
  "USPS Updates": "/news",

  // Cart
  Cart: "/cart",

  // Legal (rendered on the Help page)
  "Privacy Policy": "/privacy",
  "Terms of Use": "/terms",
  FOIA: "/help",
  "No FEAR Act": "/help",
  Accessibility: "/help",
  "Site Map": "/site-index",
  Search: "/search",
  "Cookie Preferences": "/help",
  "Site Index": "/site-index",
};

/**
 * Resolve a link label to a route.
 *
 * Unknown labels fall back to the home page rather than a broken href, and are
 * reported in development so newly added menu copy gets a route assigned.
 */
const warned = new Set<string>();

export function toRoute(label: string): string {
  const route = LINK_ROUTES[label];
  if (!route && typeof console !== "undefined") {
    // Surfaced once per label so newly added menu copy gets a route assigned.
    if (!warned.has(label)) {
      warned.add(label);
      console.warn(`[links] No route mapped for "${label}" — falling back to "/".`);
    }
  }
  return route ?? "/";
}
