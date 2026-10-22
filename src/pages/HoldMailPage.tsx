import ServicePage from "../components/ServicePage";

export default function HoldMailPage() {
  return (
    <ServicePage
      title="Hold Mail"
      desc="Pause delivery while you're away and have everything arrive at once when you're back."
      route="holdmail"
      intro={{
        heading: "Stop delivery for 3 to 30 days",
        body: "Tell us the dates and we'll hold every piece of mail addressed to your home — letters, magazines and packages — at your local Post Office. On the end date your carrier delivers the whole stack in one drop.",
      }}
      facts={[
        { label: "Cost", value: "Free" },
        { label: "Hold period", value: "3 to 30 days" },
        { label: "Start date", value: "Earliest next delivery day" },
        { label: "Per request", value: "One address" },
      ]}
      cta={{ label: "Start a Hold Mail request", to: "/help" }}
      secondary={{ label: "Sign up for Informed Delivery®", to: "/informed" }}
      steps={[
        { title: "Enter your address", body: "Use the address where you normally receive mail. Hold Mail covers everything delivered there, not just first-class letters." },
        { title: "Choose your dates", body: "Pick a start date at least one delivery day out, and an end date no more than 30 days later." },
        { title: "Confirm your identity", body: "We verify the request by email or phone so nobody else can suspend your delivery." },
        { title: "Collect on your return", body: "Held mail is delivered on the end date. Back early? Pick it up at the Post Office with photo ID." },
      ]}
      notes={[
        { title: "Packages are held too", body: "Hold Mail covers parcels as well as letters. Carriers will not leave packages at a held address." },
        { title: "One request per address", body: "If you receive mail at more than one address, file a separate request for each one." },
        { title: "Longer absences", body: "For trips longer than 30 days, file a second request or ask about Premium Forwarding Service." },
        { title: "Businesses can use it", body: "A business can hold mail at its business address for the same 3–30 day window." },
        { title: "Pick up early", body: "Bring photo ID to the retail counter and ask for the mail held for your address." },
        { title: "No forwarding", body: "Hold Mail pauses delivery. It does not send mail to a different address — that's Change of Address." },
      ]}
      faqs={[
        { q: "How far in advance should I file?", a: "At least one delivery day before you leave. Same-day requests may not reach your carrier in time." },
        { q: "Does Hold Mail cost anything?", a: "No. Hold Mail is a free service for residential and business addresses." },
        { q: "What happens to packages that need a signature?", a: "They're held with the rest of your mail. If the sender required a signature, you'll sign when the carrier delivers after the hold ends." },
        { q: "Can I cancel a hold once it starts?", a: "Yes — end the hold early and normal delivery resumes on the next delivery day." },
      ]}
      related={[
        { label: "Change of Address", to: "/change-of-address" },
        { label: "Informed Delivery®", to: "/informed" },
        { label: "Redelivery", to: "/redelivery" },
        { label: "Find a Post Office", to: "/locations" },
      ]}
    />
  );
}
