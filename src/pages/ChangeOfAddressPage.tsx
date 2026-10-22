import ServicePage from "../components/ServicePage";

export default function ChangeOfAddressPage() {
  return (
    <ServicePage
      title="Change of Address"
      desc="Forward your mail to a new home — or into a Post Office box — starting on the day you move."
      route="address"
      intro={{
        heading: "Move your mail, not just your furniture",
        body: "A Change of Address sends everything addressed to your old place to your new one for up to 12 months. Update it once and letters, magazines and packages follow you automatically.",
      }}
      facts={[
        { label: "Online fee", value: "$1.10 identity verification" },
        { label: "In person", value: "Free with photo ID" },
        { label: "Duration", value: "12 months" },
        { label: "Processing", value: "Starts within 7–10 days" },
      ]}
      cta={{ label: "Sign in to change my address", to: "/login" }}
      secondary={{ label: "Set up Informed Delivery®", to: "/informed" }}
      steps={[
        { title: "Tell us the old and new address", body: "Both addresses must be entered exactly as they appear on your mail — including apartment or unit numbers." },
        { title: "Pick your start date", body: "Choose the date the forwarding should begin. Mail sent before that date continues to the old address." },
        { title: "Verify your identity", body: "Online requests use a $1.10 card charge to confirm you're authorized to move mail from that address." },
        { title: "Update senders", body: "Forwarding is a safety net, not a substitute for telling banks, employers and subscriptions your new address." },
      ]}
      notes={[
        { title: "Individual vs. family", body: "An individual move forwards only the names you list. A family move forwards everyone at the address." },
        { title: "Business moves", body: "Businesses change addresses at the Post Office in person — online change of address is for individuals and families." },
        { title: "Premium Forwarding Service", body: "For a temporary move of 2 weeks to 1 year, Premium Forwarding reships your mail weekly in one Priority Mail® envelope." },
        { title: "Forward to a PO Box", body: "You can forward to a PO Box, General Delivery or a new street address." },
        { title: "Package forwarding", body: "Packages are forwarded too, though some services (like returns) may be returned to the sender instead." },
        { title: "Cancel anytime", body: "If you move back, file a new change of address — the old forwarding stops when the new one starts." },
      ]}
      faqs={[
        { q: "How much does it cost?", a: "The online request costs $1.10 for identity verification. Filing in person at a Post Office is free — bring photo ID." },
        { q: "How long does forwarding last?", a: "12 months for most mail. Magazines and periodicals are forwarded for 60 days and then returned to the publisher with your new address." },
        { q: "Can I forward mail for someone else?", a: "Only if you're authorized. Moving a family? List every name on the request." },
        { q: "Will my packages follow me?", a: "Yes, most packages are forwarded. Items with a return-service label may go back to the shipper instead." },
      ]}
      related={[
        { label: "Hold Mail", to: "/hold-mail" },
        { label: "PO Boxes", to: "/po-boxes" },
        { label: "General Delivery", to: "/general-delivery" },
        { label: "Informed Delivery®", to: "/informed" },
      ]}
    />
  );
}
