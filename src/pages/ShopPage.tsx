import { Gift, Package, Stamp } from "lucide-react";
import SectionLanding from "../components/SectionLanding";

export default function ShopPage() {
  return (
    <SectionLanding
      navLabel="Shop"
      title="Shop Stamps & Supplies"
      desc="Forever® stamps, free Priority Mail® supplies and gifts from the Postal Store."
      route="shop"
      intro={{
        heading: "Stamps, supplies and gifts — delivered",
        body: "Forever® stamps are $0.82 and postcard stamps are $0.65. Shipping supplies are free, and orders of 10–25 packs arrive in 7–10 days at no charge.",
      }}
      cta={{ label: "Visit the Postal Store", to: "/store" }}
      secondary={{ label: "See new releases", to: "/store" }}
      highlights={[
        {
          icon: Stamp,
          title: "Forever® stamps",
          body: "$0.82 each and always valid for a 1 oz First-Class Mail® letter, whatever the rate becomes.",
          to: "/store",
          cta: "Shop stamps",
        },
        {
          icon: Package,
          title: "Free shipping supplies",
          body: "Priority Mail® and Priority Mail Express® boxes and envelopes cost nothing, ever.",
          to: "/store",
          cta: "Order free supplies",
        },
        {
          icon: Gift,
          title: "Gifts & collectibles",
          body: "Framed stamps, stationery and seasonal sets for the people who still send letters.",
          to: "/store",
          cta: "Browse gifts",
        },
      ]}
    />
  );
}
