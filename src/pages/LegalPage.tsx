import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface Section {
  heading: string;
  body: string[];
}

const PRIVACY: Section[] = [
  {
    heading: "Information we collect",
    body: [
      "When you create an account, track a package, or buy postage, we collect the information you provide — such as your name, email address, phone number, and the addresses on your shipments.",
      "We also collect technical information automatically, including your browser type, device, and the pages you visit on this site.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "Your information is used to provide the services you request: delivering mail and packages, tracking shipments, processing payments, and responding to your questions.",
      "We may also use it to send service updates, such as delivery notifications and changes to the expected delivery date.",
    ],
  },
  {
    heading: "When we share it",
    body: [
      "We do not sell your personal information. We disclose it only to facilitate a transaction you requested, to act on your behalf, or where required by law.",
      "This includes disclosures incident to legal proceedings, to law enforcement where USPS becomes aware of a potential violation of law, and to contractors providing services on our behalf.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can review and update your profile at any time from your account page, and you can opt out of marketing communications without affecting service messages about your shipments.",
    ],
  },
  {
    heading: "About this site",
    body: [
      "This site presents a USPS-style experience. It is not operated by the United States Postal Service, and no data entered here is transmitted to USPS or to any third party — everything is stored locally in your own browser.",
    ],
  },
];

const TERMS: Section[] = [
  {
    heading: "Acceptance",
    body: [
      "By using this site you agree to these terms. If you do not agree, please do not use the site.",
    ],
  },
  {
    heading: "Not affiliated with USPS",
    body: [
      "This is an independent project. It is not affiliated with, endorsed by, or operated by the United States Postal Service.",
      "Tracking information on this site is simulated. Tracking numbers, scan histories, holds, and delivery dates are generated locally and do not reflect real shipments.",
    ],
  },
  {
    heading: "No real transactions",
    body: [
      "Labels, stamps, money orders, and postage calculated on this site are illustrative only. Nothing purchased or created here is valid for mailing, and no payment is processed.",
    ],
  },
  {
    heading: "Trademarks",
    body: [
      "USPS®, Priority Mail®, Priority Mail Express®, Ground Advantage®, First-Class Mail®, Forever®, Informed Delivery®, Click-N-Ship®, and the Eagle logo are trademarks of the United States Postal Service®. They are used here only to describe the services shown on this site.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "This site is provided “as is” without warranties of any kind. The authors are not liable for any loss arising from its use.",
    ],
  },
];

export default function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const sections = isPrivacy ? PRIVACY : TERMS;
  const title = isPrivacy ? "Privacy Policy" : "Terms of Use";
  const updated = "October 2026";

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-usps-blue hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>

        <h1 className="mt-3 flex items-center gap-2.5 text-[30px] font-black leading-tight tracking-tight text-usps-darker">
          <ShieldCheck className="h-7 w-7 text-usps-blue" /> {title}
        </h1>
        <p className="mt-1 text-[13px] text-slate-500">Last updated {updated}</p>

        <div className="mt-7 space-y-7">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-[17px] font-bold text-usps-darker">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 text-[14px] leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap gap-4 border-t border-slate-200 pt-5 text-[13px] font-semibold text-usps-blue">
          <Link to={isPrivacy ? "/terms" : "/privacy"} className="hover:underline">
            {isPrivacy ? "Terms of Use" : "Privacy Policy"}
          </Link>
          <Link to="/site-index" className="hover:underline">
            Site Index
          </Link>
          <Link to="/help" className="hover:underline">
            Help &amp; Support
          </Link>
        </div>
      </div>
    </section>
  );
}
