import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Package, Mail, Clock, MapPin, Settings, ArrowRight, LogOut, Truck, Check, ShieldAlert, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const QUICK_LINKS = [
  { label: "Track a Package", to: "/track", icon: Package },
  { label: "Schedule a Pickup", to: "/pickup", icon: Clock },
  { label: "Find Locations", to: "/locations", icon: MapPin },
  { label: "Calculate a Price", to: "/calculate", icon: Settings },
  { label: "Shipping Admin", to: "/admin/dashboard", icon: Truck },
  { label: "Help & Support", to: "/help", icon: Mail },
];

const ACTIVITY = [
  { title: "Package Delivered", desc: "9400 5483 1381 3152 3762 23", time: "2 hours ago", status: "Delivered" },
  { title: "Package In Transit", desc: "EA 852 988 419 US", time: "1 day ago", status: "In Transit" },
  { title: "Label Created", desc: "9205 7561 5176 0394 5987 30", time: "3 days ago", status: "Label Created" },
];

export default function AccountPage() {
  const { user, logout, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const deniedAdmin = (location.state as { denied?: string } | null)?.denied === "admin";

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!user) return null; // ProtectedRoute guarantees a session

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const handleSignOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    const result = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    });
    if (!result.ok) {
      setSaveError(result.error ?? "Unable to save your changes.");
      return;
    }
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const stats = [
    { label: "Member Since", value: new Date().getFullYear().toString(), desc: "USPS.com account" },
    { label: "Hold Mail", value: "0", desc: "Requests scheduled" },
    { label: "Saved Addresses", value: "3", desc: "In your address book" },
  ];

  return (
    <section id="account" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="My USPS Account"
          route="help"
          desc="Manage your profile, track shipments, and update your preferences."
        />

        {deniedAdmin && (
          <div role="alert" className="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 max-w-xl">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[13px] text-amber-900">
              The Shipping Admin dashboard requires an administrator account. This account is a
              customer, so it can't open the dashboard.
            </p>
          </div>
        )}

        {saveError && (
          <div role="alert" className="mb-6 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 max-w-xl">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" />
            <p className="text-[13px] text-red-900">{saveError}</p>
          </div>
        )}

        {saved && (
          <div role="status" className="mb-6 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg p-3 max-w-xl">
            <Check className="h-4 w-4 text-green-600" />
            <p className="text-[13px] text-green-800">Profile updated successfully.</p>
          </div>
        )}

        {isAdmin && (
          <div className="mb-6 rounded-2xl border border-usps-blue/30 bg-usps-light p-5 flex flex-wrap items-center gap-4">
            <ShieldCheck className="h-5 w-5 text-usps-blue shrink-0" />
            <div className="flex-1 min-w-[200px]">
              <p className="font-bold text-usps-darker text-[14px]">Admin tools</p>
              <p className="text-[12.5px] text-slate-600">Create a shipping label and track every shipment you have created.</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-usps-blue px-4 py-2.5 text-[13px] font-bold text-white hover:bg-usps-dark"
            >
              <Package className="h-4 w-4" /> Create a shipment
            </Link>
          </div>
        )}

        <div className="mb-8 grid sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-usps-light rounded-2xl p-6">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-black text-usps-darker">{s.value}</p>
              <p className="text-[12.5px] text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-usps-blue text-white flex items-center justify-center font-black text-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {[
                  { label: "Account Overview", to: "/account", active: true },
                  { label: "Tracking History", to: "/track" },
                  { label: "Shipping Admin", to: "/admin/dashboard" },
                  { label: "Help & Support", to: "/help" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-colors ${
                      item.active
                        ? "bg-usps-blue text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-usps-blue"
                    }`}
                  >
                    {item.label}
                    {item.active && <ArrowRight className="ml-auto h-4 w-4" />}
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Profile */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-usps-darker flex items-center gap-2">
                  <User className="h-5 w-5 text-usps-blue" /> Profile
                </h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-[13px] font-bold text-usps-blue hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={saveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="acct-first" className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">First Name</label>
                      <input id="acct-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label htmlFor="acct-last" className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Last Name</label>
                      <input id="acct-last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-2.5 text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="acct-phone" className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
                    <input id="acct-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email (read-only)</label>
                    <input value={user.email} readOnly className="w-full border-2 border-slate-200 bg-slate-50 rounded-md px-4 py-2.5 text-sm text-slate-500 outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-usps-blue hover:bg-usps-dark text-white font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="border-2 border-slate-200 hover:border-slate-400 text-slate-600 font-bold text-sm px-6 py-2.5 rounded-full transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { k: "Name", v: `${user.firstName} ${user.lastName}` },
                    { k: "Email", v: user.email },
                    { k: "Phone", v: user.phone || "Not provided" },
                    { k: "Account Type", v: "Personal" },
                  ].map((row) => (
                    <div key={row.k}>
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{row.k}</dt>
                      <dd className="text-sm text-slate-800 mt-0.5">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black text-usps-darker mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-usps-blue" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {ACTIVITY.map((item, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 last:border-none last:pb-0">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-[12.5px] text-slate-500">{item.desc}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Delivered"
                          ? "bg-green-50 text-green-700"
                          : item.status === "In Transit"
                          ? "bg-usps-light text-usps-blue"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black text-usps-darker mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-usps-blue" /> Quick Links
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-usps-blue hover:border-usps-blue transition-colors"
                  >
                    <link.icon className="h-4 w-4 text-usps-blue shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
