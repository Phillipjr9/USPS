import { Home, Mail, MapPin, PackageSearch, RefreshCw } from "lucide-react";
import SectionLanding from "../components/SectionLanding";

export default function ReceivePage() {
  return (
    <SectionLanding
      navLabel="Receive"
      title="Receive Mail & Packages"
      desc="See what's coming, redirect a delivery and keep your mail safe while you're away."
      route="receive"
      intro={{
        heading: "Know what's arriving before it gets there",
        body: "Informed Delivery® emails you previews of letter mail each morning and lets you manage packages from one dashboard — free for every mailbox in America.",
      }}
      cta={{ label: "Sign up for Informed Delivery®", to: "/informed" }}
      secondary={{ label: "Track a package", to: "/track" }}
      highlights={[
        {
          icon: Mail,
          title: "Informed Delivery®",
          body: "Daily digest emails with grayscale previews of your letter mail plus package tracking.",
          to: "/informed",
          cta: "Sign up free",
        },
        {
          icon: Home,
          title: "Hold Mail",
          body: "Pause delivery for 3–30 days while you're away, then have everything delivered at once.",
          to: "/help",
          cta: "Request a hold",
        },
        {
          icon: RefreshCw,
          title: "Redelivery",
          body: "Missed a delivery? Schedule redelivery to your address instead of collecting it in person.",
          to: "/redelivery",
          cta: "Schedule redelivery",
        },
        {
          icon: MapPin,
          title: "Intercept a package",
          body: "Redirect or hold a package already in the mail stream with Package Intercept®.",
          to: "/intercept-package",
          cta: "Intercept a package",
        },
        {
          icon: PackageSearch,
          title: "Find missing mail",
          body: "Start a Missing Mail search if tracking has stalled for more than seven days.",
          to: "/find-missing-mail",
          cta: "Start a search",
        },
      ]}
    />
  );
}
