import ServicePage from "../components/ServicePage";

export default function SignatureServicesPage() {
  return (
    <ServicePage
      title="Signature Services"
      desc="Proof of delivery you can point to — from a simple signature to a full notarized record."
      route="signature"
      intro={{
        heading: "Extra confirmation for important mail",
        body: "Signature services add a record of who received a shipment and when. Choose the level of proof you need: a signature at the door, an adult signature, or signature plus an electronic copy of the signed receipt.",
      }}
      facts={[
        { label: "Options", value: "3 levels" },
        { label: "Add to", value: "Priority Mail®, Ground Advantage™" },
        { label: "Record", value: "Who signed, when, where" },
        { label: "Claim support", value: "Included" },
      ]}
      cta={{ label: "Ship with signature confirmation", to: "/ship" }}
      secondary={{ label: "Check a shipment", to: "/track" }}
      steps={[
        { title: "Pick a shipping service", body: "Start a shipment in Click-N-Ship® or at the counter and choose a service that supports signatures." },
        { title: "Add the signature option", body: "Signature Confirmation, Signature Confirmation Restricted Delivery, or Adult Signature Required." },
        { title: "The carrier collects it", body: "Your carrier obtains the signature at the delivery address for the exact recipient you specified." },
        { title: "Review the record", body: "Signature details appear on the tracking page and can be printed for your files." },
      ]}
      notes={[
        { title: "Signature Confirmation", body: "A signature is captured at delivery and the name plus date and time appear in tracking." },
        { title: "Restricted Delivery", body: "Only the named addressee — or their authorized agent — can sign. No neighbors, no roommates." },
        { title: "Adult Signature Required", body: "Recipients must be 21 or older with valid ID, and the signature is captured electronically." },
        { title: "Signature + electronic receipt", body: "For an image of the signed receipt, pair Signature Confirmation with a certified record option." },
        { title: "Tobacco and alcohol", body: "Age-restricted shipments must ship with Adult Signature Required regardless of the service chosen." },
        { title: "Fees", body: "Signature services are charged per piece on top of postage and are shown before you pay." },
      ]}
      faqs={[
        { q: "Can a signature be waived?", a: "A sender can authorize release in some cases; otherwise the carrier must obtain a signature or leave a notice." },
        { q: "What if nobody is home?", a: "The carrier leaves a notice and the item is held at the Post Office for pickup with photo ID." },
        { q: "Is Signature Confirmation available for international shipments?", a: "Some destinations offer a signature option; availability is shown when you build the shipment." },
        { q: "Can I add a signature after mailing?", a: "No. The option must be selected before the label is purchased." },
      ]}
      related={[
        { label: "Delivery Instructions", to: "/delivery-instructions" },
        { label: "Redelivery", to: "/redelivery" },
        { label: "Insurance & Extra Services", to: "/insurance-extra-services" },
        { label: "Create a Shipping Label", to: "/ship" },
      ]}
    />
  );
}
