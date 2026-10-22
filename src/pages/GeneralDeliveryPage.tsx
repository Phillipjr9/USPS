import ServicePage from "../components/ServicePage";

export default function GeneralDeliveryPage() {
  return (
    <ServicePage
      title="General Delivery"
      desc="Mail service for people who are between addresses or travelling through — collected at the Post Office counter."
      route="general"
      intro={{
        heading: "A temporary address at the counter",
        body: "General Delivery is a free service for customers who can't receive at a street address or PO Box. Mail is addressed to the Post Office in the destination city and held at the retail counter for you to collect in person.",
      }}
      facts={[
        { label: "Cost", value: "Free" },
        { label: "Hold time", value: "Up to 30 days" },
        { label: "Addressed to", value: "One Post Office" },
        { label: "Collection", value: "In person, with ID" },
      ]}
      cta={{ label: "Find a Post Office", to: "/locations" }}
      secondary={{ label: "Hold Mail", to: "/hold-mail" }}
      steps={[
        { title: "Confirm the office accepts it", body: "Not every office offers General Delivery. Call ahead or check the location details before telling a sender to use it." },
        { title: "Format the address", body: "Use the recipient's full name, “General Delivery,” the city, state and ZIP Code — never the street address of the Post Office." },
        { title: "Pick up at the counter", body: "Bring photo ID that matches the name on the mail. Ask for General Delivery by name." },
        { title: "Collect within 30 days", body: "Items not picked up within 30 days are returned to the sender." },
      ]}
      notes={[
        { title: "Address format", body: "Jane Q. Customer / General Delivery / Austin, TX 78701-9999. The ZIP +4 9999 suffix routes it to the right office." },
        { title: "One office only", body: "General Delivery is tied to a single Post Office. If you move to another city, use that city's office." },
        { title: "No packages over 70 lb", body: "Standard size and weight limits apply, and some services can't be sent General Delivery." },
        { title: "Photo ID required", body: "You must show valid photo identification each time you collect." },
        { title: "Not for businesses", body: "General Delivery is for individuals without a permanent address — businesses should use a PO Box or street address." },
        { title: "Travelling?", body: "Heading somewhere for a season? General Delivery is a common option for RVers and long-term travellers." },
      ]}
      faqs={[
        { q: "Does General Delivery cost anything?", a: "No — there's no fee to receive mail this way. Senders pay normal postage." },
        { q: "How long will the Post Office hold my mail?", a: "Up to 30 days from arrival. After that it's returned to the sender." },
        { q: "Can packages be sent General Delivery?", a: "Yes, within normal size and weight limits. Bring ID and collect during retail hours." },
        { q: "How do I know it arrived?", a: "Ask the sender for a tracking number, then enter it on the Track page — the scan will show the Post Office holding it." },
      ]}
      related={[
        { label: "PO Boxes", to: "/po-boxes" },
        { label: "Hold Mail", to: "/hold-mail" },
        { label: "Find Locations", to: "/locations" },
        { label: "Track a Package", to: "/track" },
      ]}
    />
  );
}
