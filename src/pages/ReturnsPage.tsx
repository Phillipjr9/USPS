import ServicePage from "../components/ServicePage";

export default function ReturnsPage() {
  return (
    <ServicePage
      title="Returns & Exchanges"
      desc="Send something back, check a refund's progress, or arrange a pickup so you don't have to leave home."
      route="returns"
      intro={{
        heading: "Returns without the queue",
        body: "Most retailers ship a prepaid return label with your order — print it, attach it and hand the parcel to your carrier or drop it in a Collection Box. No printer? Show the QR code at the counter and we'll print the label for you.",
      }}
      facts={[
        { label: "Prepaid label", value: "Print or QR code" },
        { label: "Pickup", value: "Free carrier pickup" },
        { label: "Proof of mailing", value: "Keep your receipt" },
        { label: "Refund timing", value: "Set by the retailer" },
      ]}
      cta={{ label: "Check order status", to: "/track" }}
      secondary={{ label: "Schedule a pickup", to: "/pickup" }}
      steps={[
        { title: "Find the return label", body: "Check the email or packing slip from the retailer. Prepaid labels usually include a barcode and a return address." },
        { title: "Pack and seal", body: "Reuse the original box where you can, remove old labels, and seal every edge with packing tape." },
        { title: "Hand it over", body: "Give it to your carrier, drop it in a Collection Box, or bring it to a Post Office counter." },
        { title: "Keep the receipt", body: "A counter receipt is your proof of mailing — essential if the parcel is lost on the way back." },
      ]}
      notes={[
        { title: "QR code returns", body: "Many retailers issue a QR code instead of a printable label. We scan it at the counter and print the label on the spot." },
        { title: "Ground Advantage® returns", body: "Retailers often use USPS Ground Advantage® return labels for items up to 70 lb." },
        { title: "Free pickup", body: "You can schedule a carrier pickup for a return at no extra charge when it's part of your regular mail." },
        { title: "Refund status", body: "Refunds are issued by the retailer, not USPS. Use the retailer's order page to see if your return has been received." },
        { title: "Bulk returns", body: "Selling or running a shop? Bulk returns and Merchandise Return Service let you pay postage on delivery." },
        { title: "Wrong address", body: "If a package was delivered to the wrong address, open a claim or report it through Find Missing Mail." },
      ]}
      faqs={[
        { q: "How do I check if my return was delivered?", a: "Enter the return tracking number on the Track page. The retailer's label includes it — it's usually in your order email." },
        { q: "Can I return an item without a printer?", a: "Yes. Take the QR code from the retailer to a Post Office counter and we'll print the label." },
        { q: "Who pays for return postage?", a: "Usually the retailer, through a prepaid label. If the label isn't prepaid, you'll pay postage at the counter." },
        { q: "Can I schedule a pickup for a return?", a: "Yes — schedule a pickup and leave the parcel where your carrier will see it." },
      ]}
      related={[
        { label: "Track a Package", to: "/track" },
        { label: "Schedule a Pickup", to: "/pickup" },
        { label: "File a Claim", to: "/file-claim" },
        { label: "Create a Shipping Label", to: "/ship" },
      ]}
    />
  );
}
