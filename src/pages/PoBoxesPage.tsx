import ServicePage from "../components/ServicePage";

export default function PoBoxesPage() {
  return (
    <ServicePage
      title="PO Boxes"
      desc="A locked box at the Post Office — secure delivery, a real street address, and mail that waits for you."
      route="poboxes"
      intro={{
        heading: "Mail that never sits on a porch",
        body: "A PO Box gives you a private, locked mailbox inside a Post Office. Use it as your only address, or alongside home delivery for packages, business mail and anything you don't want left outside.",
      }}
      facts={[
        { label: "Starting price", value: "$4.33 / month" },
        { label: "Terms", value: "3, 6 or 12 months" },
        { label: "Sizes", value: "4 box sizes" },
        { label: "Street addressing", value: "Included at most offices" },
      ]}
      cta={{ label: "Find a PO Box near me", to: "/locations" }}
      secondary={{ label: "Calculate a price", to: "/calculate" }}
      steps={[
        { title: "Check availability", body: "Search by ZIP Code to see which Post Offices near you have boxes free and what each size costs." },
        { title: "Choose a size", body: "Size 1 fits letters; sizes 3 and 4 handle parcels and high-volume business mail." },
        { title: "Apply online or in person", body: "Bring two forms of ID — one photo ID and one proof of address — to complete the application." },
        { title: "Get two keys", body: "You receive two keys at the counter. Keep one spare somewhere safe; replacements carry a fee." },
      ]}
      notes={[
        { title: "Street addressing", body: "Most offices let you use the Post Office's street address with your box number, so couriers can deliver to you." },
        { title: "Six-month minimum", body: "New boxes are rented for a minimum of three months, and payment renews for the term you select." },
        { title: "Business use", body: "PO Boxes are popular with small businesses — they keep your home address off invoices and hold packages securely." },
        { title: "Package pickup", body: "If a parcel doesn't fit your box, you'll get a notice and collect it at the retail counter." },
        { title: "Free box with Caller Service", body: "High-volume mailers can qualify for Caller Service, which pairs a PO Box with scheduled pickup." },
        { title: "Closing a box", body: "Cancel at the counter before your term ends. Any mail inside is returned to senders once the box closes." },
      ]}
      faqs={[
        { q: "Can I open a PO Box online?", a: "Yes — apply online, pay for your term, then show ID at the office to pick up your keys." },
        { q: "What does a PO Box cost?", a: "Small boxes start around $4.33 a month. Larger boxes and premium locations cost more; the exact price appears when you search your ZIP Code." },
        { q: "Can I get packages delivered to a PO Box?", a: "Yes, when the sender ships via USPS. With street addressing enabled you can also receive UPS and FedEx at some offices." },
        { q: "Do I need to live in the ZIP Code?", a: "No, but the box must be at an office where you can collect mail conveniently." },
      ]}
      related={[
        { label: "Change of Address", to: "/change-of-address" },
        { label: "Hold Mail", to: "/hold-mail" },
        { label: "Find Locations", to: "/locations" },
        { label: "Calculate a Price", to: "/calculate" },
      ]}
    />
  );
}
