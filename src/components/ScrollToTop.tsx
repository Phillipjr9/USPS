import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Per-route page titles — used for browser tabs, bookmarks, and history. */
const TITLES: Record<string, string> = {
  "/": "Welcome | USPS",
  "/track": "Track a Package | USPS",
  "/zip": "Look Up a ZIP Code | USPS",
  "/calculate": "Calculate Postage | USPS",
  "/pickup": "Schedule a Pickup | USPS",
  "/locations": "Find USPS Locations | USPS",
  "/ship": "Ship & Mail | USPS",
  "/store": "The Postal Store | USPS",
  "/informed": "Informed Delivery | USPS",
  "/help": "Help & Support | USPS",
  "/news": "USPS News | USPS",
  "/business": "Business Solutions | USPS",
  "/international": "International Shipping | USPS",
  "/admin/dashboard": "Shipping Admin Dashboard | USPS",
  "/login": "Sign In | USPS",
  "/create-account": "Create an Account | USPS",
  "/forgot-password": "Reset Your Password | USPS",
  "/account": "My Account | USPS",
  "/cart": "Shopping Cart | USPS",
  "/passport-services": "Passport Services | USPS",
  "/money-orders": "Money Orders | USPS",
  "/redelivery": "Schedule Redelivery | USPS",
  "/intercept-package": "Package Intercept | USPS",
  "/insurance-extra-services": "Insurance & Extra Services | USPS",
  "/shipping-restrictions": "Shipping Restrictions | USPS",
  "/customs-forms": "Customs Forms | USPS",
  "/file-claim": "File a Claim | USPS",
  "/find-missing-mail": "Find Missing Mail | USPS",
  "/search": "Search Results | USPS",
  "/privacy": "Privacy Policy | USPS",
  "/terms": "Terms of Use | USPS",
  "/site-index": "Site Index | USPS",
  "/250": "250 Years of USPS | USPS",
  "/quick-tools": "Quick Tools | USPS",
  "/send": "Send Mail & Packages | USPS",
  "/receive": "Receive Mail & Packages | USPS",
  "/shop": "Shop Stamps & Supplies | USPS",
};

/**
 * Resets scroll position on navigation and keeps document.title in sync.
 * Without this, HashRouter retains the previous page's scroll offset and
 * every route shares one static tab title.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  useEffect(() => {
    document.title = TITLES[pathname] ?? "Page Not Found | USPS";
  }, [pathname]);

  return null;
}
