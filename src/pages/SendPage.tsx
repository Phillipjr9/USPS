import { Box, FileText, Globe2, Printer } from "lucide-react";
import SectionLanding from "../components/SectionLanding";

export default function SendPage() {
  return (
    <SectionLanding
      navLabel="Send"
      title="Send Mail & Packages"
      desc="Print a label at home, compare services and get your package on its way."
      route="send"
      intro={{
        heading: "Ship from home in three steps",
        body: "Pay for postage online, print your label with Click-N-Ship®, and schedule a free carrier pickup. No scale, no printer, no problem — self-service kiosks and retail counters work too.",
      }}
      cta={{ label: "Start a shipment", to: "/ship" }}
      secondary={{ label: "Compare prices", to: "/calculate" }}
      highlights={[
        {
          icon: Box,
          title: "USPS Ground Advantage®",
          body: "From $5.85. 2–5 business days, up to 70 lbs, USPS Tracking® included at no extra cost.",
          to: "/calculate",
          cta: "Compare pricing",
        },
        {
          icon: Printer,
          title: "Click-N-Ship®",
          body: "Buy and print postage at home, then hand the package to your carrier on the next route.",
          to: "/ship",
          cta: "Create a label",
        },
        {
          icon: FileText,
          title: "Customs forms",
          body: "Anything leaving the country needs a customs declaration. Most can be completed online.",
          to: "/customs-forms",
          cta: "Customs forms",
        },
        {
          icon: Box,
          title: "Free boxes & envelopes",
          body: "Priority Mail® and Priority Mail Express® supplies ship free — order packs of 10–25.",
          to: "/store",
          cta: "Order supplies",
        },
        {
          icon: FileText,
          title: "Shipping restrictions",
          body: "Hazardous materials, liquids, batteries and perishables have rules. Check before you seal the box.",
          to: "/shipping-restrictions",
          cta: "Check restrictions",
        },
        {
          icon: Globe2,
          title: "International shipping",
          body: "Delivery to more than 180 countries with tracking on most services.",
          to: "/international",
          cta: "Go international",
        },
      ]}
    />
  );
}
