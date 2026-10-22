import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  Search,
  Loader2,
  Package,
  ArrowRight,
  Copy,
  Check,
  Mail,
  MessageSquare,
} from "lucide-react";
import { mockTracking } from "../data/content";
import { lookupTracking } from "../lib/trackingLookup";
import { errorMessage } from "../lib/api";
import {
  inspectTracking,
  SAMPLE_NUMBER_TABLE,
} from "../data/tracking";
import { HoldNotice } from "../components/Hero";

/* ---------------- official page content ---------------- */

const SERVICE_ALERT =
  "IMPACTS FROM A HAZARDOUS CHEMICAL LEAK IN TOLEDO, OHIO MAY DELAY FINAL DELIVERY OF YOUR MAIL AND PACKAGES.";

const WHERE_TO_FIND = [
  "Your Post Office™ shipping receipt",
  "Your sales receipt if you bought insurance at the Post Office™",
  "Your email confirmation if you shipped from USPS.com",
  "The shipping confirmation email you received from an online retailer",
  "The bottom peel-off portion of your USPS Tracking® label",
];

const INSTRUCTION_ELIGIBILITY = [
  "Already left the Post Office for delivery",
  "A Hold Mail request",
  "A Forward Mail request",
  "A military (APO/FPO) or DPO address",
  "An international sender",
  "A Delivery Signature request",
  "A Collect on Delivery (COD) request",
  "An active USPS Package Intercept® order",
  "Insurance for $500 or more",
];

const TRACKING_PLUS_DURATIONS = [
  { label: "6 months", price: "$1.95" },
  { label: "1 year", price: "$2.95" },
  { label: "3 years", price: "$5.95" },
];

/* ---------------- building blocks ---------------- */

function Accordion({
  title,
  children,
  defaultOpen = false,
  id,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-left transition-colors hover:text-usps-blue"
      >
        <span className="text-[16px] font-bold text-usps-darker">{title}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-usps-blue transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function CopyButton({ value, onCopied }: { value: string; onCopied?: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
    } catch {
      /* clipboard blocked — still confirm visually */
    }
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 text-[13px] font-semibold text-usps-blue hover:underline"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ---------------- results panels ---------------- */

function TextEmailUpdates({ tracking }: { tracking: string }) {
  const [choice, setChoice] = useState("activity");
  const [channels, setChannels] = useState({ text: true, email: false });
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const options = [
    {
      id: "date",
      title: "Delivery Date Updates",
      body: "Receive a message when the expected delivery date or time window is available or changes. When USPS delivers, transfers, returns, or holds your package for any reason, you will no longer receive expected delivery information.",
    },
    {
      id: "activity",
      title: "Delivery Activity",
      body: "Receive a message when package has been delivered, delayed, or action is needed (e.g. Schedule Redelivery or Pickup) related to your package.",
    },
    {
      id: "all",
      title: "All Updates (Including Options Above)",
      body: "Receive a message any time there is a new tracking update.",
    },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setSent(true);
  };

  return (
    <div>
      <p className="text-[13.5px] text-slate-700">
        <b>Select what types of updates you'd like to receive and how.</b> Send me a notification for:
      </p>

      <div className="mt-3 flex gap-5">
        <label className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={channels.text}
            onChange={(e) => setChannels((c) => ({ ...c, text: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-400 text-usps-blue focus:ring-usps-blue"
          />
          Text
        </label>
        <label className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={channels.email}
            onChange={(e) => setChannels((c) => ({ ...c, email: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-400 text-usps-blue focus:ring-usps-blue"
          />
          Email
        </label>
      </div>

      <div className="mt-4 space-y-3">
        {options.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-start gap-2.5">
            <input
              type="radio"
              name="update-type"
              checked={choice === o.id}
              onChange={() => setChoice(o.id)}
              className="mt-0.5 h-4 w-4 text-usps-blue focus:ring-usps-blue"
            />
            <span>
              <span className="block text-[13.5px] font-bold text-usps-darker">{o.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-600">{o.body}</span>
            </span>
          </label>
        ))}
      </div>

      {sent ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-md border border-green-200 bg-green-50 p-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <div>
            <p className="text-[13px] font-bold text-green-900">Confirmation - We Received Your Request</p>
            <p className="mt-0.5 text-[12.5px] text-green-800">
              Your updates will be sent to {channels.text ? phone || "your phone" : email || "your email"}.
              {channels.text && " To finish signup, you must reply YES to the welcome message."}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4">
          {channels.text && (
            <div>
              <label htmlFor="upd-phone" className="mb-1 block text-[12.5px] text-slate-700">
                Enter the phone number where you'd like to receive updates on your package:
              </label>
              <p className="mb-1 text-[11.5px] text-slate-500">
                *Phone number (US or Canadian only, valid text message enabled number)
              </p>
              <input
                id="upd-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full max-w-xs rounded-md border-2 border-slate-300 px-3 py-2 text-sm outline-none focus:border-usps-blue"
              />
            </div>
          )}

          {channels.email && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="upd-name" className="mb-1 block text-[12.5px] text-slate-700">
                  *Name
                </label>
                <input
                  id="upd-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 px-3 py-2 text-sm outline-none focus:border-usps-blue"
                />
              </div>
              <div>
                <label htmlFor="upd-email" className="mb-1 block text-[12.5px] text-slate-700">
                  *Email Address
                </label>
                <input
                  id="upd-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-300 px-3 py-2 text-sm outline-none focus:border-usps-blue"
                />
              </div>
            </div>
          )}

          <p className="text-[11.5px] text-slate-500">
            Message frequency is based on the request type; packages may have up to 11 tracking events.
            Standard Message and Data rates may apply.
          </p>

          <label className="flex items-start gap-2 text-[12.5px] text-slate-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-400 text-usps-blue focus:ring-usps-blue"
            />
            <span>
              I have read, understand, and agree to the{" "}
              <Link to="/help" className="font-semibold text-usps-blue hover:underline">
                Terms and Conditions
              </Link>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed}
            className="rounded-full bg-usps-blue px-7 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-usps-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Get Updates
          </button>
        </form>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
        Updates apply to tracking number {tracking}.
      </p>
    </div>
  );
}

function TrackingPlus({ tracking }: { tracking: string }) {
  const [months, setMonths] = useState(TRACKING_PLUS_DURATIONS[0].label);
  const [added, setAdded] = useState(false);
  const price = TRACKING_PLUS_DURATIONS.find((d) => d.label === months)?.price ?? "";

  return (
    <div>
      <p className="text-[13.5px] leading-relaxed text-slate-700">
        Your item is eligible for USPS Tracking Plus. This feature allows you to buy extended access to your
        tracking history and receive a statement via email upon request. Without this feature, your regular
        tracking history is only available on this site for a limited time.
      </p>
      <p className="mt-2 text-[12.5px] text-slate-600">
        You can only purchase extended history once, so all orders are final and are not eligible for a refund.
      </p>

      <label htmlFor="plus-duration" className="mt-4 block text-[12.5px] font-bold text-slate-700">
        Select the length of time you would like
      </label>
      <select
        id="plus-duration"
        value={months}
        onChange={(e) => {
          setMonths(e.target.value);
          setAdded(false);
        }}
        className="mt-1 w-full max-w-xs rounded-md border-2 border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-usps-blue"
      >
        {TRACKING_PLUS_DURATIONS.map((d) => (
          <option key={d.label} value={d.label}>
            {d.label} — {d.price}
          </option>
        ))}
      </select>

      {added ? (
        <p className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-[12.5px] text-green-800">
          <b>{months} of USPS Tracking Plus Extended History</b> at <b>{price}</b> for {tracking} has been
          selected for purchase and is in your cart.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setAdded(true)}
          className="mt-4 rounded-full bg-usps-blue px-7 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-usps-dark"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

function ProductInformation({ service }: { service: string }) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">Postal Product:</p>
      <p className="mt-1 text-[13.5px] text-slate-800">{service} - Retail</p>

      <p className="mt-4 text-[12px] font-bold uppercase tracking-wider text-slate-500">Features:</p>
      <p className="mt-1 text-[13.5px] text-slate-800">USPS Tracking®</p>
      <p className="text-[13.5px] text-slate-800">Up to $100 insurance included</p>
    </div>
  );
}

/* ---------------- results view ---------------- */

function TrackingResult({
  result,
  onReset,
  onCopied,
}: {
  result: ReturnType<typeof mockTracking>;
  onReset: () => void;
  onCopied: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const held = Boolean(result.hold);
  const critical = result.hold?.severity === "critical";
  const latest = result.events[0];
  const rest = result.events.slice(1);
  const PREVIEW = 4;
  const visible = showAll ? rest : rest.slice(0, PREVIEW);

  // "Your item was delivered at the front door or porch at 4:15 pm on ... in LAWRENCE, KS 66049."
  const latestSentence = held
    ? `Your item is currently ${result.status.toLowerCase()} — ${result.hold?.reasonLabel.toLowerCase()}.`
    : result.status === "Delivered"
    ? `Your item was delivered at ${latest.date}${latest.loc !== "—" ? ` in ${latest.loc}` : ""}.`
    : `Your item is ${latest.title} as of ${latest.date}${latest.loc !== "—" ? ` in ${latest.loc}` : ""}.`;

  return (
    <div className="fade-slide">
      {/* Remove / tracking number row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-usps-blue hover:underline"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Remove
        </button>
      </div>

      <div className="mt-3">
        <p className="text-[13px] font-bold text-slate-600">Tracking Number:</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p className="font-mono text-[17px] font-bold tracking-wide text-usps-darker">{result.number}</p>
          <CopyButton value={result.number} onCopied={onCopied} />
          <Link to="/informed" className="text-[13px] font-semibold text-usps-blue hover:underline">
            Add to Informed Delivery
          </Link>
        </div>
      </div>

      {/* Latest update */}
      <div className="mt-5">
        <h3 className="text-[19px] font-black text-usps-darker">Latest Update</h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-slate-700">{latestSentence}</p>
      </div>

      <hr className="my-5 border-slate-200" />

      {/* Tracking Plus cross-sell */}
      <p className="text-[13.5px] text-slate-700">
        <b>Get More Out of USPS Tracking:</b>{" "}
        <button
          type="button"
          onClick={() => {
            // Must not be href="#tracking-plus": HashRouter treats that as a route.
            const el = document.getElementById("tracking-plus");
            if (!el) return;
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            const trigger = el.querySelector("button");
            if (trigger && trigger.getAttribute("aria-expanded") === "false") {
              trigger.click();
            }
          }}
          className="font-semibold text-usps-blue hover:underline"
        >
          USPS Tracking Plus®
        </button>
      </p>

      {/* Current status card */}
      <div
        className={`mt-5 rounded-md border-l-4 bg-white p-4 shadow-sm ${
          held ? (critical ? "border-red-600" : "border-amber-500") : "border-usps-blue"
        }`}
      >
        <p
          className={`text-[20px] font-black leading-tight ${
            held ? (critical ? "text-red-700" : "text-amber-700") : result.status === "Delivered" ? "text-green-700" : "text-usps-darker"
          }`}
        >
          {result.status}
        </p>
        <p className="mt-1 text-[14px] font-semibold text-slate-800">{latest.title}</p>
        {latest.loc !== "—" && (
          <p className="mt-1 text-[13px] uppercase tracking-wide text-slate-600">{latest.loc}</p>
        )}
        <p className="mt-0.5 text-[13px] text-slate-500">{latest.date}</p>
        {!held && result.eta && (
          <p className="mt-2 inline-flex flex-wrap items-baseline gap-1.5 rounded bg-usps-light px-2.5 py-1 text-[12.5px] text-usps-darker">
            <span className="font-bold uppercase tracking-wider text-[10.5px] text-slate-500">
              {result.status === "Delivered" ? "Delivered" : "Expected Delivery"}
            </span>
            <span className="font-bold">{result.eta}</span>
          </p>
        )}
      </div>

      {/* Hold notice */}
      {result.hold && (
        <div className="mt-5">
          <HoldNotice hold={result.hold} />
        </div>
      )}

      {/* Scan list */}
      <ul className="mt-6 space-y-5">
        {visible.map((ev, i) => (
          <li key={i} className="border-b border-slate-100 pb-4 last:border-0">
            <p className="text-[14px] font-bold text-usps-darker">{ev.title}</p>
            {ev.loc !== "—" && (
              <p className="mt-0.5 text-[12.5px] uppercase tracking-wide text-slate-600">{ev.loc}</p>
            )}
            <p className="mt-0.5 text-[12.5px] text-slate-500">{ev.date}</p>
          </li>
        ))}
      </ul>

      {rest.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="mt-4 rounded-full border-2 border-usps-blue px-6 py-2.5 text-[13px] font-bold text-usps-blue transition-colors hover:bg-usps-blue hover:text-white"
        >
          {showAll ? "Show Less" : `See All Tracking History (${rest.length})`}
        </button>
      )}

      <p className="mt-4">
        <a
          href="https://faq.usps.com/s/article/Where-is-my-package"
          target="_blank"
          rel="noreferrer"
          className="text-[13px] font-semibold text-usps-blue hover:underline"
        >
          What Do USPS Tracking Statuses Mean?
        </a>
      </p>

      {/* Accordions on the result */}
      <div className="mt-8">
        <Accordion title="Text & Email Updates">
          <TextEmailUpdates tracking={result.number} />
        </Accordion>

        <div id="tracking-plus">
          <Accordion title="USPS Tracking Plus®">
            <TrackingPlus tracking={result.number} />
          </Accordion>
        </div>

        <Accordion title="Product Information">
          <ProductInformation service={result.service} />
        </Accordion>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-usps-blue px-7 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-usps-dark"
        >
          Track Another Package
        </button>
      </div>

      <div className="mt-8 rounded-md bg-slate-50 p-5">
        <h3 className="text-[17px] font-black text-usps-darker">Need More Help?</h3>
        <p className="mt-1 text-[13px] text-slate-600">Contact USPS Tracking support for further assistance.</p>
        <a
          href="https://faq.usps.com/s/article/Where-is-my-package"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-usps-blue px-5 py-2 text-[12.5px] font-bold text-usps-blue transition-colors hover:bg-usps-blue hover:text-white"
        >
          FAQs <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function TrackPage() {
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof mockTracking> | null>(null);
  const [tab, setTab] = useState<"tracking" | "faqs">("tracking");
  const [toast, setToast] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [params] = useSearchParams();

  const runLookup = async (value: string) => {
    setLoading(true);
    setResult(null);
    setLookupError(null);
    try {
      const found = await lookupTracking(value);
      setResult(found);
    } catch (err) {
      setLookupError(errorMessage(err, "Unable to look up that tracking number."));
    } finally {
      setLoading(false);
    }
  };

  // Deep link support: /track?n=<number> prefills and runs the lookup.
  useEffect(() => {
    const n = params.get("n");
    if (!n) return;
    setNum(n);
    void runLookup(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e?: React.FormEvent, preset?: string) => {
    e?.preventDefault();
    const val = preset ?? num;
    if (!val.trim()) return;
    void runLookup(val.trim());
  };

  const reset = () => {
    setResult(null);
    setNum("");
  };

  const meta = num.trim() ? inspectTracking(num) : null;

  return (
    <div className="bg-white">
      {/* copy toast (mirrors the real page) */}
      {toast && (
        <div className="fixed left-1/2 top-4 z-[90] -translate-x-1/2 rounded-full bg-usps-darker px-5 py-2.5 text-[13px] font-semibold text-white shadow-xl">
          Tracking Number Copied
        </div>
      )}

      {/* service alert */}
      <div className="border-b border-slate-200 bg-usps-light">
        <div className="mx-auto flex max-w-7xl items-start gap-2.5 px-4 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-usps-blue" />
          <p className="text-[12.5px] leading-snug text-slate-700">
            <b className="font-bold">Alert:</b> {SERVICE_ALERT}{" "}
            <a
              href="https://about.usps.com/newsroom/service-alerts/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-usps-blue hover:underline"
            >
              Read more ›
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:py-10">
        <h1 className="text-[32px] font-black leading-tight tracking-tight text-usps-darker lg:text-[38px]">
          USPS Tracking®
        </h1>
        <div className="mt-3 flex items-center gap-5 border-b border-slate-200">
          {[
            { id: "tracking" as const, label: "Tracking" },
            { id: "faqs" as const, label: "FAQs" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-4 px-1 pb-2.5 text-[14px] font-bold transition-colors ${
                tab === t.id
                  ? "border-usps-blue text-usps-blue"
                  : "border-transparent text-slate-500 hover:text-usps-darker"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* ---------- main column ---------- */}
          <div>
            {tab === "tracking" ? (
              result ? (
                <TrackingResult
                  result={result}
                  onReset={reset}
                  onCopied={() => {
                    setToast(true);
                    window.setTimeout(() => setToast(false), 1800);
                  }}
                />
              ) : (
                <>
                  <form onSubmit={(e) => submit(e)}>
                    <label htmlFor="track-input" className="block text-[15px] font-bold text-usps-darker">
                      Please enter a tracking number.
                    </label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        id="track-input"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        placeholder="Enter up to 35 tracking numbers"
                        className="flex-1 rounded-md border-2 border-slate-300 px-4 py-3 font-mono text-[15px] outline-none transition-colors focus:border-usps-blue"
                      />
                      <button
                        type="submit"
                        disabled={loading || !num.trim()}
                        className="flex items-center justify-center gap-2 rounded-md bg-usps-blue px-10 py-3 text-[15px] font-bold text-white transition-colors hover:bg-usps-dark disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Tracking…
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4" /> Track
                          </>
                        )}
                      </button>
                    </div>

                    {meta && (
                      <p className={`mt-2 text-[12.5px] ${meta.valid ? "text-green-700" : "text-slate-500"}`}>
                        <span
                          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${
                            meta.valid ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        {meta.valid
                          ? meta.service
                            ? `Recognized as ${meta.service}`
                            : "Recognized USPS number"
                          : "This doesn't look like a standard USPS tracking number."}
                      </p>
                    )}

                  </form>

                  {lookupError && (
                    <div
                      role="alert"
                      className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <div className="text-[13px] text-red-900">
                        <p className="font-bold">Tracking isn't available right now.</p>
                        <p className="mt-0.5">{lookupError}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <Accordion title="What does my tracking number look like?">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b-2 border-slate-300">
                            <th className="py-2 pr-3 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                              Service
                            </th>
                            <th className="py-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                              Sample Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_NUMBER_TABLE.map((row) => (
                            <tr key={row.service} className="border-b border-slate-100 align-top">
                              <td className="py-2.5 pr-3 text-[13px] text-slate-700">{row.service}</td>
                              <td className="py-2.5">
                                {row.samples.map((s) => (
                                  <p key={s} className="font-mono text-[12.5px] text-slate-800">
                                    {s}
                                  </p>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Accordion>

                    <Accordion title="Where do I find my tracking number?">
                      <p className="mb-2 text-[13.5px] text-slate-700">
                        Your tracking number can be found in the following places:
                      </p>
                      <ul className="list-disc space-y-1.5 pl-5 text-[13.5px] text-slate-700">
                        {WHERE_TO_FIND.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Accordion>

                    <Accordion title="How can I leave delivery instructions?">
                      <p className="text-[13.5px] leading-relaxed text-slate-700">
                        If a package qualifies for the USPS Delivery Instructions™ service, you can tell USPS
                        where to leave a package at your address, send it to a different address, or send it to
                        your Post Office.
                      </p>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
                        Click <b>Change Delivery Instructions</b> on the tracking results page to leave your
                        request. If you do not see the <b>Change Delivery Instructions</b> link, your package is
                        not eligible for the Delivery Instructions service.
                      </p>
                      <h4 className="mt-4 text-[13.5px] font-bold text-usps-darker">
                        No “Delivery Instructions” link
                      </h4>
                      <p className="mt-1 text-[13.5px] text-slate-700">
                        There are several reasons a package may not be eligible. Ineligible packages may have:
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13.5px] text-slate-700">
                        {INSTRUCTION_ELIGIBILITY.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </Accordion>
                  </div>
                </>
              )
            ) : (
              <div className="max-w-3xl">
                <h2 className="text-[22px] font-black text-usps-darker">Tracking FAQs</h2>
                <p className="mt-1 text-[14px] text-slate-600">
                  Answers to the most common questions about USPS Tracking®.
                </p>
                <div className="mt-5">
                  <Accordion title="When will my package arrive?" defaultOpen>
                    <p className="text-[13.5px] leading-relaxed text-slate-700">
                      Enter your tracking number to see the expected delivery date. Delivery times vary by mail
                      class: Priority Mail Express® is overnight to 2 days, Priority Mail® is 1–3 business days,
                      and USPS Ground Advantage® is 2–5 business days.
                    </p>
                  </Accordion>
                  <Accordion title="Why has my tracking status not updated?">
                    <p className="text-[13.5px] leading-relaxed text-slate-700">
                      Tracking events are recorded when a package is scanned. A package can be in transit between
                      facilities without a new scan for up to 24 hours. If there has been no update for more than
                      7 days, you can start a Missing Mail search.
                    </p>
                    <Link
                      to="/find-missing-mail"
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-usps-blue hover:underline"
                    >
                      Start a Missing Mail search <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Accordion>
                  <Accordion title="What if my package shows as delivered but I don't have it?">
                    <p className="text-[13.5px] leading-relaxed text-slate-700">
                      Check around your property, with neighbors, and with your building manager. Carriers
                      sometimes place packages in a secure location. If you still cannot locate it, contact your
                      local Post Office or file a claim.
                    </p>
                    <Link
                      to="/file-claim"
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-usps-blue hover:underline"
                    >
                      File a claim <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Accordion>
                  <Accordion title="Can I stop or hold a package that is in transit?">
                    <p className="text-[13.5px] leading-relaxed text-slate-700">
                      Yes. Package Intercept® lets you redirect a package to a different address or hold it at a
                      Post Office. Some mail classes are not eligible.
                    </p>
                    <Link
                      to="/intercept-package"
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-usps-blue hover:underline"
                    >
                      Package Intercept® <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Accordion>
                  <Accordion title="Why does my tracking show “On Hold” or “Stopped”?">
                    <p className="text-[13.5px] leading-relaxed text-slate-700">
                      USPS may place a hold or administrative stop on a shipment — for example an incomplete
                      address, postage due, a customs inspection, or a security review. The tracking results page
                      shows the specific reason, any carrier notes, and what you can do next.
                    </p>
                    <Link
                      to="/help"
                      className="mt-2 inline-flex items-center gap-1 text-[13px] font-bold text-usps-blue hover:underline"
                    >
                      Contact Customer Service <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Accordion>
                </div>
              </div>
            )}
          </div>

          {/* ---------- promo column ---------- */}
          <aside className="lg:pt-1">
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-[15px] font-bold text-usps-darker">Track Packages</p>
              <p className="text-[15px] font-bold text-usps-darker">Anytime, Anywhere</p>
              <div className="my-4 flex justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-usps-light">
                  <Package className="h-8 w-8 text-usps-blue" />
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed text-slate-600">
                Get the free Informed Delivery® feature to receive automated notifications on your packages.
              </p>
              <Link
                to="/informed"
                className="mt-4 inline-block rounded-full bg-usps-blue px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-usps-dark"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                Can't find what you're looking for?
              </h3>
              <p className="mt-2 text-[12.5px] text-slate-600">
                Go to our FAQs section to find answers to your tracking questions.
              </p>
              <button
                onClick={() => setTab("faqs")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-usps-blue px-4 py-2 text-[12.5px] font-bold text-usps-blue transition-colors hover:bg-usps-blue hover:text-white"
              >
                FAQs <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-5">
              <h3 className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-slate-500">
                <MessageSquare className="h-3.5 w-3.5" /> Text Tracking
              </h3>
              <p className="mt-2 text-[12.5px] text-slate-600">
                Text <b>HELP</b> to 2USPS (28777) for help, or <b>STOP</b> to opt out.
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-slate-600">
                <Mail className="h-3.5 w-3.5" /> Standard message and data rates may apply.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
