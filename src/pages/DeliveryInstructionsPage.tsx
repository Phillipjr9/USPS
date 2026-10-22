import ServicePage from "../components/ServicePage";

export default function DeliveryInstructionsPage() {
  return (
    <ServicePage
      title="Delivery Instructions"
      desc="Tell your carrier where to leave packages, and manage the day-to-day details of delivery."
      route="instructions"
      intro={{
        heading: "Where should we leave it?",
        body: "Delivery instructions cover the practical side of receiving mail: a safe drop point, gate codes, an authorized neighbor, and what to do when a package needs a signature. Add them once and they apply to future deliveries at that address.",
      }}
      facts={[
        { label: "Cost", value: "Free" },
        { label: "Applies to", value: "Future deliveries" },
        { label: "Per package", value: "Optional overrides" },
        { label: "Editable", value: "Anytime" },
      ]}
      cta={{ label: "Update my delivery preferences", to: "/informed" }}
      secondary={{ label: "Schedule a Redelivery", to: "/redelivery" }}
      steps={[
        { title: "Sign in to your account", body: "Delivery preferences live on your USPS.com account so they follow the address you've verified." },
        { title: "Pick your address", body: "Choose the delivery address you want to manage. Each address keeps its own instructions." },
        { title: "Describe a safe spot", body: "Be specific — “behind the planter by the side door” beats “back yard.” Carriers need to find it in seconds." },
        { title: "Review before each delivery", body: "For a one-off package, use the tracking page to leave instructions for that shipment only." },
      ]}
      notes={[
        { title: "Carriers still use judgment", body: "If the requested spot isn't safe or reachable, the carrier can choose a different location and leave a notice." },
        { title: "Signature items", body: "Instructions can't waive a signature required by the sender. You can authorize release or redirect to a Post Office instead." },
        { title: "Access codes", body: "Gate, garage and building codes are shared only with the carrier on your route." },
        { title: "Neighbor release", body: "You can name a neighbor who may accept packages on your behalf — a common fix for porch theft." },
        { title: "Vacation mode", body: "Going away? Pair instructions with Hold Mail so nothing is left outside at all." },
        { title: "Business delivery", body: "Businesses can set receiving hours so carriers don't arrive before the mailroom opens." },
      ]}
      faqs={[
        { q: "Do delivery instructions cost anything?", a: "No. Setting preferences and leaving per-package instructions are free." },
        { q: "Will instructions apply to every carrier?", a: "They're visible to USPS carriers on your route. Other carriers set their own delivery rules." },
        { q: "Can I change instructions after a package ships?", a: "Yes, until the carrier begins the final delivery. After that, use Redelivery or Hold for Pickup." },
        { q: "What if my package needs a signature?", a: "Leave an authorized-recipient instruction, or redirect the package to a Post Office for pickup." },
      ]}
      related={[
        { label: "Hold Mail", to: "/hold-mail" },
        { label: "Redelivery", to: "/redelivery" },
        { label: "Signature Services", to: "/signature-services" },
        { label: "Tracking Updates", to: "/tracking-updates" },
      ]}
    />
  );
}
