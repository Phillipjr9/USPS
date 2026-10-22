import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Plus,
  Search,
  FileText,
  Printer,
  ArrowRight,
  DollarSign,
  Clock,
  Activity,
  Download,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  Ban,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { calcPostage } from "../data/content";
import { formatTrackingNumber, inspectTracking } from "../data/tracking";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../lib/api";
import {
  advanceShipment,
  createShipment,
  nextStatus,
  SHIPMENT_STATUSES,
  cityLine,
  shipmentsError,
  useShipments,
  type ShipmentRecord,
  type ShipmentStatus,
} from "../data/shipments";
import {
  HOLD_CATEGORIES,
  HOLD_REASONS,
  placeHold,
  releaseHold,
  useHolds,
  holdsError,
  normalizeTracking,
  formatHoldDate,
} from "../data/holds";

/* ---------------- types ---------------- */

type Shipment = ShipmentRecord;

interface FormErrors {
  [key: string]: string;
}


const SERVICES = [
  { name: "Priority Mail Express®", key: "express", tag: "Fastest", color: "bg-usps-red" },
  { name: "Priority Mail®", key: "priority", tag: "Most Popular", color: "bg-usps-blue" },
  { name: "USPS Ground Advantage®", key: "ground", tag: "Best Value", color: "bg-usps-gold" },
  { name: "First-Class Mail®", key: "first", tag: "Letters & Light", color: "bg-slate-400" },
] as const;

const STATUSES: ShipmentStatus[] = SHIPMENT_STATUSES;

/* ---------------- helpers ---------------- */

function statusColor(status: ShipmentStatus): string {
  switch (status) {
    case "Delivered":
      return "bg-green-50 text-green-700 border border-green-200";
    case "In Transit":
      return "bg-usps-light text-usps-blue border border-usps-blue/20";
    case "Out for Delivery":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-50 text-slate-500 border border-slate-200";
  }
}

function priceFor(service: string, fromZip: string, toZip: string, lbs: number): { price: number; time: string; zone: number } {
  const r = calcPostage(fromZip, toZip, lbs, 0, "Package");
  if (service.includes("Express")) return { price: r.express, time: r.days.express, zone: r.zone };
  if (service.includes("Priority Mail®")) return { price: r.priority, time: r.days.priority, zone: r.zone };
  if (service.includes("Ground")) return { price: r.ground, time: r.days.ground, zone: r.zone };
  const first = r.first ?? r.ground;
  return { price: first, time: "1–5 business days", zone: r.zone };
}

/* ---------------- component ---------------- */

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"create" | "history" | "holds">("create");
  const shipments = useShipments();

  // holds & stops
  const { user, isAdmin, logout } = useAuth();
  const holds = useHolds();
  const activeHolds = useMemo(() => holds.filter((h) => !h.releasedAt), [holds]);
  const releasedHolds = useMemo(() => holds.filter((h) => h.releasedAt), [holds]);
  const activeHoldMap = useMemo(() => {
    const m = new Map<string, (typeof activeHolds)[number]>();
    activeHolds.forEach((h) => m.set(h.tracking, h));
    return m;
  }, [activeHolds]);

  const [holdTracking, setHoldTracking] = useState("");
  const [holdAction, setHoldAction] = useState<"hold" | "stop">("hold");
  const [holdCategory, setHoldCategory] = useState<string>(HOLD_CATEGORIES[0]);
  const [holdReason, setHoldReason] = useState<string>(
    HOLD_REASONS.find((r) => r.category === HOLD_CATEGORIES[0])?.code ?? HOLD_REASONS[0].code
  );
  const [holdNotes, setHoldNotes] = useState("");
  const [holdMsg, setHoldMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const reasonsForCategory = useMemo(
    () => HOLD_REASONS.filter((r) => r.category === holdCategory),
    [holdCategory]
  );
  const selectedReason = HOLD_REASONS.find((r) => r.code === holdReason);
  const adminEmail = user?.email ?? "";

  // form state
  const [fromName, setFromName] = useState("");
  const [fromCompany, setFromCompany] = useState("");
  const [fromAddr, setFromAddr] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [fromState, setFromState] = useState("");
  const [fromZip, setFromZip] = useState("");
  const [toName, setToName] = useState("");
  const [toCompany, setToCompany] = useState("");
  const [toAddr, setToAddr] = useState("");
  const [toCity, setToCity] = useState("");
  const [toState, setToState] = useState("");
  const [toZip, setToZip] = useState("");
  const [weight, setWeight] = useState("1");
  const [service, setService] = useState<string>(SERVICES[2].name);
  const [errors, setErrors] = useState<FormErrors>({});
  const [created, setCreated] = useState<Shipment | null>(null);

  // history state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const lbs = parseFloat(weight) || 0;
  const estimate = useMemo(() => {
    if (fromZip.length === 5 && toZip.length === 5 && lbs > 0) {
      return priceFor(service, fromZip, toZip, lbs);
    }
    return null;
  }, [fromZip, toZip, lbs, service]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const spend = shipments.reduce((s, x) => s + x.price, 0);
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const moving = shipments.filter((s) => s.status === "In Transit" || s.status === "Out for Delivery").length;
    return { total, spend, delivered, moving };
  }, [shipments]);

  const byService = useMemo(() => {
    return SERVICES.map((svc) => ({
      name: svc.name,
      count: shipments.filter((s) => s.service === svc.name).length,
      color: svc.color,
    }));
  }, [shipments]);
  const maxServiceCount = Math.max(1, ...byService.map((s) => s.count));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shipments.filter((s) => {
      const matchesQ =
        !q ||
        s.tracking.toLowerCase().includes(q) ||
        cityLine(s.to).toLowerCase().includes(q) ||
        s.to.name.toLowerCase().includes(q) ||
        s.service.toLowerCase().includes(q);
      const matchesS = statusFilter === "All" || s.status === statusFilter;
      return matchesQ && matchesS;
    });
  }, [shipments, query, statusFilter]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!fromName.trim()) e.fromName = "Sender name is required";
    if (!fromAddr.trim()) e.fromAddr = "Street address is required";
    if (!fromCity.trim()) e.fromCity = "City is required";
    if (!fromState.trim()) e.fromState = "State is required";
    if (!/^\d{5}$/.test(fromZip)) e.fromZip = "Enter a valid 5-digit ZIP";
    if (!toName.trim()) e.toName = "Recipient name is required";
    if (!toAddr.trim()) e.toAddr = "Street address is required";
    if (!toCity.trim()) e.toCity = "City is required";
    if (!toState.trim()) e.toState = "State is required";
    if (!/^\d{5}$/.test(toZip)) e.toZip = "Enter a valid 5-digit ZIP";
    if (lbs < 0.1 || lbs > 70) e.weight = "Weight must be 0.1–70 lbs";
    if (service.includes("First-Class") && lbs > 0.8) e.weight = "First-Class Mail® packages must weigh 13 oz (0.8 lbs) or less";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const createLabel = async () => {
    if (!validate()) return;
    setActionError(null);
    const p = priceFor(service, fromZip, toZip, lbs);
    let shipment: ShipmentRecord;
    try {
      shipment = await createShipment({
        service,
        from: {
          name: fromName.trim(),
          company: fromCompany.trim(),
          street: fromAddr.trim(),
          city: fromCity.trim(),
          state: fromState.toUpperCase(),
          zip: fromZip,
        },
        to: {
          name: toName.trim(),
          company: toCompany.trim(),
          street: toAddr.trim(),
          city: toCity.trim(),
          state: toState.toUpperCase(),
          zip: toZip,
        },
        weightLbs: lbs,
        price: p.price,
        createdBy: adminEmail,
      });
    } catch (err) {
      setActionError(errorMessage(err, "Unable to create the shipment."));
      return;
    }
    setCreated(shipment);
    setActiveTab("create");
  };

  /** Posts the next scan for a shipment and keeps the confirmation card in sync. */
  const advanceStatus = async (tracking: string) => {
    const key = normalizeTracking(tracking);
    setActionError(null);
    try {
      const updated = await advanceShipment(tracking);
      if (!updated) return;
      setCreated((c) => (c && normalizeTracking(c.tracking) === key ? updated : c));
    } catch (err) {
      setActionError(errorMessage(err, "Unable to update the shipment."));
    }
  };

  const resetForm = () => {
    setFromName(""); setFromCompany(""); setFromAddr(""); setFromCity(""); setFromState(""); setFromZip("");
    setToName(""); setToCompany(""); setToAddr(""); setToCity(""); setToState(""); setToZip("");
    setWeight("1");
    setService(SERVICES[2].name);
    setErrors({});
    setCreated(null);
  };

  const exportCsv = () => {
    const header = "Tracking Number,Service,From,To,Ship Date,Status,Weight,Price\n";
    const rows = shipments
      .map(
        (s) =>
          `"${s.tracking}","${s.service}","${cityLine(s.from)}","${cityLine(s.to)}","${s.date}","${s.status}","${s.weightLbs.toFixed(1)} lbs","$${s.price.toFixed(2)}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "usps-shipment-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitHold = async () => {
    setHoldMsg(null);
    const result = await placeHold({
      tracking: holdTracking,
      action: holdAction,
      reasonCode: holdReason,
      notes: holdNotes,
      createdBy: adminEmail,
    });
    if (!result.ok) {
      setHoldMsg({ type: "error", text: result.error ?? "Unable to place the hold." });
      return;
    }
    setHoldMsg({
      type: "ok",
      text: `${holdAction === "stop" ? "Tracking stopped" : "Hold placed"} for ${formatTrackingNumber(holdTracking)} — visible on tracking immediately.`,
    });
    setHoldTracking("");
    setHoldNotes("");
  };

  const doRelease = async (id: string) => {
    const ok = await releaseHold(id, adminEmail, "Released from admin dashboard");
    setHoldMsg(
      ok
        ? { type: "ok", text: "Hold released. Normal tracking and delivery have resumed." }
        : { type: "error", text: "That hold was already released." }
    );
  };

  const manageShipment = (tracking: string) => {
    setHoldTracking(normalizeTracking(tracking));
    setHoldMsg(null);
    setActiveTab("holds");
  };

  const inputCls = (bad?: string) =>
    `w-full border-2 rounded-md px-4 py-3 text-sm outline-none transition-colors ${
      bad ? "border-red-400 bg-red-50" : "border-slate-300 focus:border-usps-blue"
    }`;

  return (
    <section id="admin" className="py-10 lg:py-14 bg-slate-50 min-h-screen scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader title="Shipping Admin Dashboard" route="business" desc="Create shipments, print labels, and monitor outgoing packages." />

        {(actionError || shipmentsError() || holdsError()) && (
          <div role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div className="text-[13px] text-red-900">
              <p className="font-bold">The dashboard couldn't reach the database.</p>
              <p className="mt-0.5">{actionError ?? shipmentsError() ?? holdsError()}</p>
            </div>
          </div>
        )}

        {/* Primary action — visible on every tab so creating a shipment is never buried */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-usps-darker p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-usps-red">
              <Truck className="h-5 w-5 text-white" />
            </span>
            <div>
              <p className="text-[15px] font-black text-white">Ship a package</p>
              <p className="text-[12.5px] leading-snug text-white/70">
                Enter the addresses, pick a service, and we'll issue a printable label with a live tracking number.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (created) resetForm();
              setActiveTab("create");
            }}
            className="shrink-0 rounded-full bg-usps-red px-6 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-usps-reddark"
          >
            + New Shipment
          </button>
        </div>

        {/* signed-in role banner */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-usps-blue/25 bg-usps-light p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-usps-blue text-white">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[13.5px] font-bold text-usps-darker">
                Signed in as {user?.firstName} {user?.lastName}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    isAdmin ? "bg-usps-blue text-white" : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {isAdmin ? "Admin" : "Customer"}
                </span>
              </p>
              <p className="text-[12px] text-slate-600">
                {user?.email} · Shipping Admin access
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={logout}
              className="rounded-full border-2 border-slate-300 bg-white px-4 py-2 text-[12.5px] font-bold text-slate-700 transition-colors hover:border-usps-blue hover:text-usps-blue"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* ===== Stats row ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: Package, label: "Total Shipments", value: stats.total, sub: "all time", tint: "bg-usps-blue/10 text-usps-blue" },
            { icon: DollarSign, label: "Total Postage Spend", value: `$${stats.spend.toFixed(2)}`, sub: "all time", tint: "bg-usps-gold/15 text-usps-darker" },
            { icon: CheckCircle2, label: "Delivered", value: stats.delivered, sub: `${stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0}% success`, tint: "bg-green-600/10 text-green-700" },
            { icon: Truck, label: "In Transit", value: stats.moving, sub: "moving now", tint: "bg-usps-red/10 text-usps-red" },
            { icon: ShieldAlert, label: "On Hold / Stopped", value: activeHolds.length, sub: "admin actions", tint: "bg-amber-500/15 text-amber-700" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
              <span className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${c.tint}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{c.label}</p>
                <p className="text-2xl font-black text-usps-darker leading-tight">{c.value}</p>
                <p className="text-[11px] text-slate-400">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Tabs ===== */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "create" ? "bg-usps-blue text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Plus className="h-4 w-4" /> Create Shipment
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "history" ? "bg-usps-blue text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-4 w-4" /> Shipment History
            <span className="text-[11px] bg-white/20 rounded-full px-2 py-0.5">{shipments.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("holds")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "holds" ? "bg-usps-blue text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ShieldAlert className="h-4 w-4" /> Holds &amp; Stops
            <span className={`text-[11px] rounded-full px-2 py-0.5 ${activeHolds.length > 0 ? "bg-amber-400 text-amber-950" : "bg-white/20"}`}>
              {activeHolds.length}
            </span>
          </button>
        </div>

        {/* ===== CREATE LABEL TAB ===== */}
        {activeTab === "create" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {created ? (
                /* ---- success / label preview ---- */
                <div className="space-y-6">
                  <div className="no-print bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-bold text-green-900">Shipment created — label ready!</p>
                      <p className="text-sm text-green-700">Tracking number {created.tracking} has been added to your shipment history.</p>
                    </div>
                  </div>

                  {/* printable label */}
                  <div className="print-label bg-white rounded-2xl shadow-sm border-2 border-slate-300 overflow-hidden">
                    <div className="bg-usps-darker px-6 py-3 flex items-center justify-between">
                      <p className="text-white font-black tracking-wide">USPS® SHIPPING LABEL</p>
                      <p className="text-usps-gold text-xs font-bold">{created.service}</p>
                    </div>
                    <div className="p-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">From</p>
                        <p className="font-bold text-slate-900">{fromName}{fromCompany ? ` / ${fromCompany}` : ""}</p>
                        <p className="text-sm text-slate-600">{fromAddr}</p>
                        <p className="text-sm font-semibold text-slate-800">{created.from.name}</p>
                        <p className="text-sm text-slate-600">{created.from.street}</p>
                        <p className="text-sm text-slate-600">{cityLine(created.from)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">To</p>
                        <p className="font-bold text-slate-900">{toName}{toCompany ? ` / ${toCompany}` : ""}</p>
                        <p className="text-sm text-slate-600">{toAddr}</p>
                        <p className="text-sm font-semibold text-slate-800">{created.to.name}</p>
                        <p className="text-sm text-slate-600">{created.to.street}</p>
                        <p className="text-sm text-slate-600">{cityLine(created.to)}</p>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      {/* barcode */}
                      <div className="h-14 rounded-md bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 [background-size:4px_100%] [background-repeat:repeat-x] opacity-90 mb-2" aria-hidden="true" />
                      <p className="text-center font-mono font-bold text-lg tracking-[0.2em] text-usps-darker">{created.tracking}</p>
                      {(() => {
                        const meta = inspectTracking(created.tracking);
                        return (
                          <p className="text-center text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                            {meta.service || "USPS"}
                          </p>
                        );
                      })()}
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="font-bold text-slate-900">{created.weightLbs.toFixed(1)} lbs</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ship Date</p>
                          <p className="font-bold text-slate-900">{created.date}</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Postage</p>
                          <p className="font-bold text-usps-blue">${created.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* status lifecycle */}
                  <div className="no-print rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shipment status</p>
                        <p className="mt-1 flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusColor(created.status)}`}>
                            {created.status}
                          </span>
                          <span className="text-[11.5px] text-slate-500">
                            {nextStatus(created.status)
                              ? `Next scan: ${nextStatus(created.status)}`
                              : "Final status reached"}
                          </span>
                        </p>
                      </div>
                      {nextStatus(created.status) && (
                        <button
                          onClick={() => advanceStatus(created.tracking)}
                          className="inline-flex items-center gap-2 rounded-full bg-usps-darker px-5 py-2.5 text-[12.5px] font-bold text-white transition-colors hover:bg-usps-blue"
                        >
                          <PlayCircle className="h-4 w-4" /> Mark {nextStatus(created.status)}
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-[11.5px] leading-snug text-slate-500">
                      Each step posts a scan that shows on the customer tracking page immediately.
                    </p>
                  </div>

                  <div className="no-print flex gap-3">
                    <button onClick={() => window.print()} className="flex-1 bg-usps-red hover:bg-usps-reddark text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Printer className="h-4 w-4" /> Print Label
                    </button>
                    <button onClick={resetForm} className="flex-1 border-2 border-slate-300 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4" /> Create Another
                    </button>
                    <Link
                      to={`/track?n=${encodeURIComponent(normalizeTracking(created.tracking))}`}
                      className="flex-1 bg-usps-blue hover:bg-usps-dark text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      Track Package <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                /* ---- create form ---- */
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
                  <h3 className="text-lg font-black text-usps-darker flex items-center gap-2">
                    <Package className="h-5 w-5 text-usps-blue" /> Create a Shipment
                  </h3>

                  {/* From */}
                  <div>
                    <p className="text-sm font-bold text-usps-darker mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-usps-blue" /> Sender Address</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name *</label>
                        <input value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="John Smith" className={`mt-1 ${inputCls(errors.fromName)}`} />
                        {errors.fromName && <p className="text-xs text-red-600 mt-1">{errors.fromName}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Company (optional)</label>
                        <input value={fromCompany} onChange={(e) => setFromCompany(e.target.value)} placeholder="Company name (optional)" className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Street Address *</label>
                      <input value={fromAddr} onChange={(e) => setFromAddr(e.target.value)} placeholder="123 Main Street, Apt 4B" className={`mt-1 ${inputCls(errors.fromAddr)}`} />
                      {errors.fromAddr && <p className="text-xs text-red-600 mt-1">{errors.fromAddr}</p>}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">City *</label>
                        <input value={fromCity} onChange={(e) => setFromCity(e.target.value)} placeholder="New York" className={`mt-1 ${inputCls(errors.fromCity)}`} />
                        {errors.fromCity && <p className="text-xs text-red-600 mt-1">{errors.fromCity}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">State *</label>
                        <input value={fromState} onChange={(e) => setFromState(e.target.value)} placeholder="NY" maxLength={2} className={`mt-1 ${inputCls(errors.fromState)} uppercase`} />
                        {errors.fromState && <p className="text-xs text-red-600 mt-1">{errors.fromState}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ZIP Code *</label>
                        <input value={fromZip} onChange={(e) => setFromZip(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="10001" inputMode="numeric" className={`mt-1 ${inputCls(errors.fromZip)} font-mono`} />
                        {errors.fromZip && <p className="text-xs text-red-600 mt-1">{errors.fromZip}</p>}
                      </div>
                    </div>
                  </div>

                  {/* To */}
                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm font-bold text-usps-darker mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-usps-red" /> Recipient Address</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Full Name *</label>
                        <input value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Jane Doe" className={`mt-1 ${inputCls(errors.toName)}`} />
                        {errors.toName && <p className="text-xs text-red-600 mt-1">{errors.toName}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Company (optional)</label>
                        <input value={toCompany} onChange={(e) => setToCompany(e.target.value)} placeholder="Company name (optional)" className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Street Address *</label>
                      <input value={toAddr} onChange={(e) => setToAddr(e.target.value)} placeholder="456 Broadway Ave" className={`mt-1 ${inputCls(errors.toAddr)}`} />
                      {errors.toAddr && <p className="text-xs text-red-600 mt-1">{errors.toAddr}</p>}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">City *</label>
                        <input value={toCity} onChange={(e) => setToCity(e.target.value)} placeholder="Los Angeles" className={`mt-1 ${inputCls(errors.toCity)}`} />
                        {errors.toCity && <p className="text-xs text-red-600 mt-1">{errors.toCity}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">State *</label>
                        <input value={toState} onChange={(e) => setToState(e.target.value)} placeholder="CA" maxLength={2} className={`mt-1 ${inputCls(errors.toState)} uppercase`} />
                        {errors.toState && <p className="text-xs text-red-600 mt-1">{errors.toState}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ZIP Code *</label>
                        <input value={toZip} onChange={(e) => setToZip(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="90210" inputMode="numeric" className={`mt-1 ${inputCls(errors.toZip)} font-mono`} />
                        {errors.toZip && <p className="text-xs text-red-600 mt-1">{errors.toZip}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Package & service */}
                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm font-bold text-usps-darker mb-3 flex items-center gap-2"><Truck className="h-4 w-4 text-usps-blue" /> Package & Service</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Weight (lbs) *</label>
                        <input type="number" min={0.1} max={70} step={0.1} value={weight} onChange={(e) => setWeight(e.target.value)} className={`mt-1 ${inputCls(errors.weight)}`} />
                        {errors.weight && <p className="text-xs text-red-600 mt-1">{errors.weight}</p>}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Service *</label>
                        <div className="relative">
                          <select value={service} onChange={(e) => setService(e.target.value)} className="mt-1 w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none transition-colors bg-white appearance-none">
                            {SERVICES.map((s) => (
                              <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* live estimate */}
                    <div className="mt-4 p-4 rounded-xl bg-usps-light border border-usps-blue/20 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Activity className="h-4 w-4 text-usps-blue" />
                        {estimate ? (
                          <span>Live estimate · Zone {estimate.zone} · {estimate.time}</span>
                        ) : (
                          <span>Enter valid 5-digit origin & destination ZIPs for a live price estimate</span>
                        )}
                      </div>
                      <p className="font-black text-xl text-usps-blue">{estimate ? `$${estimate.price.toFixed(2)}` : "—"}</p>
                    </div>

                    <button
                      onClick={createLabel}
                      className="w-full mt-4 bg-usps-blue hover:bg-usps-dark text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Truck className="h-5 w-5" />
                      Create Shipment{estimate ? ` · $${estimate.price.toFixed(2)}` : ""}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* service picker */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-24 space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Select Service</h3>
                {SERVICES.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setService(s.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      service === s.name ? "bg-usps-blue/10 border border-usps-blue text-usps-blue" : "border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-usps-blue"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                      <span>
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.tag}</span>
                        <span className="block font-semibold text-slate-900 text-sm">{s.name}</span>
                      </span>
                    </span>
                    {estimate && <span className="font-bold text-usps-blue text-sm">{service === s.name ? `$${priceFor(s.name, fromZip, toZip, lbs).price.toFixed(2)}` : ""}</span>}
                  </button>
                ))}
                <p className="text-[11px] text-slate-400 text-center pt-2">Commercial pricing available for business accounts.</p>
              </div>

              {/* service mix chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Shipments by Service</h3>
                <div className="space-y-3">
                  {byService.map((s) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-semibold text-slate-700">{s.name.replace("®", "")}</span>
                        <span className="font-bold text-slate-900">{s.count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${(s.count / maxServiceCount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* quick actions */}
              <div className="bg-usps-darker rounded-2xl p-6">
                <h3 className="text-sm font-bold text-usps-gold uppercase tracking-wider mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "Schedule a Pickup", to: "/pickup" },
                    { label: "Calculate a Price", to: "/calculate" },
                    { label: "Find Locations", to: "/locations" },
                    { label: "Buy Stamps & Supplies", to: "/store" },
                  ].map((q) => (
                    <Link key={q.label} to={q.to} className="flex items-center justify-between bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                      {q.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-white/50 text-center">Order free Priority Mail® boxes — delivered in 7–10 days.</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== HISTORY TAB ===== */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* toolbar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by tracking number, destination, or service..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-usps-blue transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none border border-slate-300 rounded-md pl-4 pr-9 py-2.5 text-sm outline-none focus:border-usps-blue bg-white"
                  >
                    <option>All</option>
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button onClick={exportCsv} className="flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold text-sm px-5 py-2.5 rounded-md transition-colors">
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              </div>
            </div>

            {/* table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No shipments found</p>
                  <p className="text-sm text-slate-500 mt-1">Try a different search or filter — or create a new label.</p>
                  <button onClick={() => setActiveTab("create")} className="mt-4 bg-usps-blue hover:bg-usps-dark text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
                    Create a Shipment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[980px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {["Tracking Number", "Service", "From", "To", "Ship Date", "Weight", "Status", "Price", "Action"].map((h) => (
                          <th key={h} className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => (
                        <tr key={s.tracking} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4">
                            <Link
                              to={`/track?n=${encodeURIComponent(normalizeTracking(s.tracking))}`}
                              className="font-mono text-sm font-bold text-usps-blue hover:underline"
                              title="Open this shipment in tracking"
                            >
                              {s.tracking}
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-700">{s.service}</td>
                          <td className="py-4 px-4 text-sm text-slate-500">{cityLine(s.from)}</td>
                          <td className="py-4 px-4 text-sm text-slate-700">{cityLine(s.to)}</td>
                          <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">{s.date}</td>
                          <td className="py-4 px-4 text-sm text-slate-500 whitespace-nowrap">{s.weightLbs.toFixed(1)} lbs</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${statusColor(s.status)}`}>{s.status}</span>
                              {activeHoldMap.get(normalizeTracking(s.tracking)) && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                                    activeHoldMap.get(normalizeTracking(s.tracking))!.action === "stop"
                                      ? "bg-red-600 text-white"
                                      : "bg-amber-500 text-white"
                                  }`}
                                >
                                  <ShieldAlert className="h-3 w-3" />
                                  {activeHoldMap.get(normalizeTracking(s.tracking))!.action === "stop" ? "Stopped" : "On Hold"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-slate-900 whitespace-nowrap">${s.price.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col items-start gap-1.5">
                              <button
                                onClick={() => manageShipment(s.tracking)}
                                className={`inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-md border transition-colors whitespace-nowrap ${
                                  activeHoldMap.get(normalizeTracking(s.tracking))
                                    ? "border-green-600 text-green-700 hover:bg-green-50"
                                    : "border-slate-300 text-slate-600 hover:border-usps-blue hover:text-usps-blue"
                                }`}
                              >
                                <ShieldAlert className="h-3.5 w-3.5" />
                                {activeHoldMap.get(normalizeTracking(s.tracking)) ? "Held" : "Hold"}
                              </button>
                              {nextStatus(s.status) ? (
                                <button
                                  onClick={() => advanceStatus(s.tracking)}
                                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 transition-colors whitespace-nowrap hover:border-usps-blue hover:text-usps-blue"
                                  title={`Post the ${nextStatus(s.status)} scan`}
                                >
                                  <PlayCircle className="h-3.5 w-3.5" /> {nextStatus(s.status)}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-green-700">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* recent activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2"><Clock className="h-4 w-4 text-usps-blue" /> Recent Activity</h3>
              <div className="space-y-3">
                {shipments.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No activity yet. Shipments you create will appear here.
                  </p>
                )}
                {shipments.slice(0, 5).map((s) => (
                  <div key={s.tracking} className="flex items-center gap-3 text-sm">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${s.status === "Delivered" ? "bg-green-500" : s.status === "Label Created" ? "bg-slate-400" : "bg-usps-blue"}`} />
                    <p className="text-slate-700 flex-1 truncate">
                      <span className="font-bold font-mono text-xs">{s.tracking}</span> · {s.service} → {cityLine(s.to)}
                    </p>
                    <p className="text-slate-400 text-xs whitespace-nowrap">{s.date}</p>
                    <p className="font-bold text-usps-darker text-xs whitespace-nowrap">${s.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== HOLDS & STOPS TAB ===== */}
        {activeTab === "holds" && (
          <div className="space-y-6">
            {holdMsg && (
              <div
                role="status"
                className={`flex items-start gap-2.5 rounded-xl p-3.5 border ${
                  holdMsg.type === "ok" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                {holdMsg.type === "ok" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <p className={`text-[13px] ${holdMsg.type === "ok" ? "text-green-800" : "text-red-800"}`}>{holdMsg.text}</p>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* ---------- Place a hold / stop ---------- */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-black text-usps-darker mb-1 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-usps-red" /> Place a Hold or Stop
                </h3>
                <p className="text-[13px] text-slate-500 mb-6">
                  The reason you select here is shown to the customer on the tracking results page, along with any notes.
                </p>

                {/* action toggle */}
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => setHoldAction("hold")}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      holdAction === "hold" ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className={`flex items-center gap-2 font-bold text-sm ${holdAction === "hold" ? "text-amber-800" : "text-slate-700"}`}>
                      <PauseCircle className="h-4 w-4" /> Hold
                    </span>
                    <span className="block text-[12px] text-slate-500 mt-1">Pause movement temporarily. Can be released.</span>
                  </button>
                  <button
                    onClick={() => setHoldAction("stop")}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      holdAction === "stop" ? "border-red-600 bg-red-50" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className={`flex items-center gap-2 font-bold text-sm ${holdAction === "stop" ? "text-red-800" : "text-slate-700"}`}>
                      <Ban className="h-4 w-4" /> Stop Tracking
                    </span>
                    <span className="block text-[12px] text-slate-500 mt-1">Halt the shipment. Shown as "Stopped" on tracking.</span>
                  </button>
                </div>

                {/* tracking number */}
                <div className="mb-4">
                  <label htmlFor="hold-tracking" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Tracking Number *
                  </label>
                  <input
                    id="hold-tracking"
                    list="shipment-tracking-options"
                    value={holdTracking}
                    onChange={(e) => setHoldTracking(e.target.value)}
                    placeholder="9400 1118 9922 3040 0018"
                    className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm font-mono outline-none transition-colors"
                  />
                  <datalist id="shipment-tracking-options">
                    {shipments.map((sh) => (
                      <option key={sh.tracking} value={normalizeTracking(sh.tracking)} />
                    ))}
                  </datalist>
                  {holdTracking.trim() && (() => {
                    const meta = inspectTracking(holdTracking);
                    return (
                      <div className="mt-1.5 space-y-1">
                        <p className="text-[12px] font-mono text-slate-500">
                          Stored as: {normalizeTracking(holdTracking)}
                          {activeHoldMap.get(normalizeTracking(holdTracking)) && (
                            <span className="ml-2 text-amber-700 font-sans font-bold">— already on hold</span>
                          )}
                        </p>
                        <p className={`text-[12px] ${meta.valid ? "text-green-700" : "text-slate-500"}`}>
                          {meta.valid ? (
                            <>
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 align-middle" />
                              {meta.service || "Not a recognized USPS product"}
                            </>
                          ) : (
                            <>
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300 mr-1.5 align-middle" />
                              Not a standard USPS format — you can still place a hold.
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* category + reason */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="hold-category" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Reason Category *
                    </label>
                    <div className="relative">
                      <select
                        id="hold-category"
                        value={holdCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setHoldCategory(cat);
                          const first = HOLD_REASONS.find((r) => r.category === cat);
                          if (first) setHoldReason(first.code);
                        }}
                        className="w-full appearance-none border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none bg-white"
                      >
                        {HOLD_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hold-reason" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Reason ({reasonsForCategory.length} available) *
                    </label>
                    <div className="relative">
                      <select
                        id="hold-reason"
                        value={holdReason}
                        onChange={(e) => setHoldReason(e.target.value)}
                        className="w-full appearance-none border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none bg-white pr-9"
                      >
                        {reasonsForCategory.map((r) => (
                          <option key={r.code} value={r.code}>{r.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* preview of what the customer sees */}
                {selectedReason && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Customer sees on tracking
                    </p>
                    <p className="text-[13px] font-bold text-slate-900">{selectedReason.label}</p>
                    <p className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{selectedReason.description}</p>
                    <p className="text-[12px] text-slate-500 mt-2">
                      <span className="font-semibold">Next step shown:</span> {selectedReason.nextStep}
                    </p>
                    <span
                      className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        selectedReason.severity === "critical" ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                      }`}
                    >
                      {selectedReason.severity === "critical" ? "Critical notice" : "Standard notice"}
                    </span>
                  </div>
                )}

                {/* notes */}
                <div className="mb-5">
                  <label htmlFor="hold-notes" className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Carrier Notes (optional)
                  </label>
                  <textarea
                    id="hold-notes"
                    value={holdNotes}
                    onChange={(e) => setHoldNotes(e.target.value)}
                    rows={3}
                    placeholder="Details shown to the customer under the reason…"
                    className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  onClick={submitHold}
                  disabled={!holdTracking.trim()}
                  className={`w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    holdAction === "stop" ? "bg-usps-red hover:bg-usps-reddark" : "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {holdAction === "stop" ? <Ban className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                  {holdAction === "stop" ? "Stop Tracking" : "Place Hold"}
                </button>
              </div>

              {/* ---------- sidebar: reason catalog ---------- */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Reason Catalog</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto thin-scroll pr-1">
                    {HOLD_CATEGORIES.map((cat) => {
                      const list = HOLD_REASONS.filter((r) => r.category === cat);
                      return (
                        <div key={cat}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-3 mb-1">{cat} ({list.length})</p>
                          {list.map((r) => (
                            <button
                              key={r.code}
                              onClick={() => {
                                setHoldCategory(cat);
                                setHoldReason(r.code);
                              }}
                              className={`w-full text-left text-[12px] px-2 py-1.5 rounded-md transition-colors ${
                                holdReason === r.code ? "bg-usps-blue/10 text-usps-blue font-semibold" : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    {HOLD_REASONS.length} reasons across {HOLD_CATEGORIES.length} categories.
                  </p>
                </div>

                <div className="bg-usps-darker rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-usps-gold uppercase tracking-wider mb-3">How it works</h3>
                  <ul className="space-y-2 text-[12.5px] text-white/70 leading-relaxed">
                    <li>• The hold appears instantly on the customer's tracking page.</li>
                    <li>• Status changes to <b className="text-white">On Hold</b> or <b className="text-white">Stopped</b>.</li>
                    <li>• The reason, notes, and next steps are all visible.</li>
                    <li>• Release the hold to restore normal tracking.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ---------- active holds ---------- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-600" /> Active Holds &amp; Stops
                </h3>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full px-2.5 py-0.5">
                  {activeHolds.length} active
                </span>
              </div>

              {activeHolds.length === 0 ? (
                <div className="p-10 text-center">
                  <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">No active holds</p>
                  <p className="text-[13px] text-slate-500 mt-1">All shipments are moving normally.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        {["Tracking Number", "Action", "Reason", "Notes", "Placed", "By", ""].map((h) => (
                          <th key={h} className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeHolds.map((h) => (
                        <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[13px] font-bold text-slate-900">{h.tracking}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                h.action === "stop" ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                              }`}
                            >
                              {h.action === "stop" ? <Ban className="h-3 w-3" /> : <PauseCircle className="h-3 w-3" />}
                              {h.action === "stop" ? "Stopped" : "On Hold"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-[13px] text-slate-800 font-medium">{h.reasonLabel}</p>
                            <p className="text-[11px] text-slate-400">{h.category}</p>
                          </td>
                          <td className="py-3.5 px-4 text-[12px] text-slate-600 max-w-[220px]">
                            {h.notes || <span className="text-slate-300">—</span>}
                          </td>
                          <td className="py-3.5 px-4 text-[12px] text-slate-500 whitespace-nowrap">{formatHoldDate(h.createdAt)}</td>
                          <td className="py-3.5 px-4 text-[12px] text-slate-500">{h.createdBy}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => doRelease(h.id)}
                              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                            >
                              <PlayCircle className="h-3.5 w-3.5" /> Release
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ---------- released history ---------- */}
            {releasedHolds.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" /> Released History
                  </h3>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5">
                    {releasedHolds.length}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {releasedHolds.map((h) => (
                    <div key={h.id} className="px-6 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-mono text-[12.5px] font-bold text-slate-700">{h.tracking}</span>
                      <span className="text-[12px] text-slate-500">{h.reasonLabel}</span>
                      <span className="text-[11px] text-slate-400">
                        held {formatHoldDate(h.createdAt)} → released {h.releasedAt ? formatHoldDate(h.releasedAt) : "—"}
                      </span>
                      <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                        Released
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
