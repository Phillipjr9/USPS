import ServicePage from "../components/ServicePage";

export default function TrackingUpdatesPage() {
  return (
    <ServicePage
      title="Tracking Updates"
      desc="Get text and email alerts the moment your package moves — no refreshing required."
      route="updates"
      intro={{
        heading: "Know before you check",
        body: "Turn on tracking notifications for a shipment and USPS will message you at each scan, on the day it's out for delivery, and when it's delivered. Choose text, email, or both, per package or for everything sent to your address.",
      }}
      facts={[
        { label: "Cost", value: "Free" },
        { label: "Channels", value: "Text & email" },
        { label: "Frequency", value: "Every scan" },
        { label: "Limit", value: "Up to 20 numbers" },
      ]}
      cta={{ label: "Track a package", to: "/track" }}
      secondary={{ label: "Manage Informed Delivery®", to: "/informed" }}
      steps={[
        { title: "Open the tracking page", body: "Enter your tracking number on the Track page, or scan the barcode on your receipt." },
        { title: "Add notifications", body: "Choose Text & Email Updates, then enter a mobile number or email address for that shipment." },
        { title: "Confirm the code", body: "A verification code confirms it's your number, so nobody can track a package to your phone." },
        { title: "Manage or stop alerts", body: "Turn alerts off from the same tracking page, or reply STOP to any text." },
      ]}
      notes={[
        { title: "Delivery-day alert", body: "You get a message when the carrier scans your package “Out for Delivery,” usually before 9 a.m." },
        { title: "Delivery confirmed", body: "The final message tells you it was delivered, along with the time and the scan location." },
        { title: "Exceptions", body: "If a package is delayed or misrouted you'll get an exception alert with the reason and next step." },
        { title: "Address-level alerts", body: "Informed Delivery® alerts cover every package and letter arriving at your address, not just one tracking number." },
        { title: "Multiple numbers", body: "You can attach the same phone number to several shipments — useful when you ship often." },
        { title: "Privacy", body: "Your number is used only for the alerts you request and is never shown to the sender or recipient." },
      ]}
      faqs={[
        { q: "Do tracking alerts cost anything?", a: "No. Text and email updates are free; standard message and data rates from your carrier may apply." },
        { q: "Why haven't I received an alert?", a: "Check that the number was confirmed, and that the shipment has been scanned. First scans can take up to 24 hours after drop-off." },
        { q: "Can I get alerts for mail, not just packages?", a: "Yes — Informed Delivery® sends daily email previews of incoming letters and packages." },
        { q: "How do I stop alerts?", a: "Reply STOP to any text message or turn the alert off on the tracking page." },
      ]}
      related={[
        { label: "Track & Manage", to: "/track" },
        { label: "Informed Delivery®", to: "/informed" },
        { label: "Delivery Instructions", to: "/delivery-instructions" },
        { label: "Find Missing Mail", to: "/find-missing-mail" },
      ]}
    />
  );
}
