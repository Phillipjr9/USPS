import { Calculator, MapPin, Package, Truck } from "lucide-react";
import SectionLanding from "../components/SectionLanding";

export default function QuickToolsPage() {
  return (
    <SectionLanding
      navLabel="Quick Tools"
      title="Quick Tools"
      desc="The things people do most often on USPS.com, without hunting for them."
      route="quicktools"
      intro={{
        heading: "Your everyday postal tools in one place",
        body: "Track a package, look up a ZIP Code™, calculate postage, schedule a free pickup and find the nearest Post Office — all from here.",
      }}
      cta={{ label: "Track a package", to: "/track" }}
      secondary={{ label: "Find a location", to: "/locations" }}
      highlights={[
        {
          icon: Package,
          title: "Track a package",
          body: "See the latest scan, expected delivery and the full scan history for any USPS Tracking® number.",
          to: "/track",
          cta: "Track now",
        },
        {
          icon: Calculator,
          title: "Calculate a price",
          body: "Compare Priority Mail Express®, Priority Mail® and Ground Advantage® pricing before you ship.",
          to: "/calculate",
          cta: "Calculate postage",
        },
        {
          icon: Truck,
          title: "Schedule a pickup",
          body: "Your carrier collects prepaid packages from your door during regular delivery — at no charge.",
          to: "/pickup",
          cta: "Schedule pickup",
        },
        {
          icon: MapPin,
          title: "Find a location",
          body: "Post Offices, collection boxes, self-service kiosks and approved retailers near you.",
          to: "/locations",
          cta: "Open the map",
        },
        {
          icon: Package,
          title: "Look up a ZIP Code™",
          body: "Find any ZIP Code or ZIP+4 by address, city or state.",
          to: "/zip",
          cta: "Look up a ZIP",
        },
        {
          icon: Truck,
          title: "Ship from home",
          body: "Pay for postage and print a label with Click-N-Ship® — no trip to the counter.",
          to: "/ship",
          cta: "Start shipping",
        },
      ]}
    />
  );
}
