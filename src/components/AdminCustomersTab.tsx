import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  ShieldCheck,
  User as UserIcon,
  Users,
} from "lucide-react";
import { api, errorMessage } from "../lib/api";
import { useAuth } from "../context/AuthContext";

/**
 * Administrator account directory.
 *
 * Lists every account on the deployment with the volume each one created, and
 * lets an administrator promote or demote another account. The server refuses
 * self-edits and demoting the bootstrap administrator, so this screen mirrors
 * those rules by disabling the affected buttons.
 */

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "admin" | "customer";
  createdAt: string;
  shipments: number;
  holds: number;
};

const joined = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const fullName = (u: AdminUser) => `${u.firstName} ${u.lastName}`.trim() || u.email;

export default function AdminCustomersTab() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ users: AdminUser[] }>("/api/admin/users");
      setUsers(data.users ?? []);
    } catch (err) {
      setError(errorMessage(err, "Unable to load accounts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const counts = useMemo(
    () => ({
      admins: users.filter((u) => u.role === "admin").length,
      customers: users.filter((u) => u.role === "customer").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQ =
        !q ||
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "") || "\u0000");
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesQ && matchesRole;
    });
  }, [users, query, roleFilter]);

  const changeRole = async (target: AdminUser) => {
    const nextRole = target.role === "admin" ? "customer" : "admin";
    const verb = nextRole === "admin" ? "give administrator access to" : "remove administrator access from";
    if (!window.confirm(`Are you sure you want to ${verb} ${target.email}?`)) return;
    setBusyId(target.id);
    setError(null);
    setNotice(null);
    try {
      const data = await api<{ users: AdminUser[] }>("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ id: target.id, role: nextRole }),
      });
      setUsers(data.users ?? []);
      setNotice(
        `${target.email} is now ${nextRole === "admin" ? "an administrator" : "a customer"}.`
      );
    } catch (err) {
      setError(errorMessage(err, "Unable to change that account's role."));
    } finally {
      setBusyId(null);
    }
  };

  const isSelf = (u: AdminUser) => u.email === user?.email;

  return (
    <div className="space-y-6">
      {notice && (
        <div role="status" className="flex items-start gap-2.5 rounded-xl p-3.5 border bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-[13px] text-green-800">{notice}</p>
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl p-3.5 border bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-[13px] text-red-800">{error}</p>
          <button
            onClick={() => void load()}
            className="ml-auto text-[12px] font-bold text-red-800 underline underline-offset-2 whitespace-nowrap"
          >
            Try again
          </button>
        </div>
      )}

      {/* summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Accounts", value: users.length, icon: Users, tone: "text-usps-blue" },
          { label: "Administrators", value: counts.admins, icon: ShieldCheck, tone: "text-usps-darker" },
          { label: "Customers", value: counts.customers, icon: UserIcon, tone: "text-green-700" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
            <span className={`h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{c.label}</p>
              <p className="text-2xl font-black text-usps-darker leading-tight">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-usps-blue transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "customer"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2.5 rounded-md text-[13px] font-bold capitalize transition-colors ${
                roleFilter === r
                  ? "bg-usps-blue text-white"
                  : "bg-white border border-slate-300 text-slate-600 hover:border-usps-blue hover:text-usps-blue"
              }`}
            >
              {r === "all" ? "All" : `${r}s`}
            </button>
          ))}
          <button
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-2 border border-slate-300 rounded-md px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:border-usps-blue hover:text-usps-blue transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* list */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 text-slate-300 mx-auto mb-3 animate-spin" />
            <p className="text-sm text-slate-500">Loading accounts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700">No accounts match</p>
            <p className="text-sm text-slate-500 mt-1">
              {users.length === 0
                ? "Nobody has registered on this deployment yet."
                : "Try a different search or role filter."}
            </p>
          </div>
        ) : (
          <>
            {/* desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Account", "Email", "Role", "Shipments", "Holds", "Joined", "Access"].map((h) => (
                      <th key={h} className="py-3.5 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const self = isSelf(u);
                    const busy = busyId === u.id;
                    return (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 text-sm font-bold text-slate-900">
                          {fullName(u)}
                          {self && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-usps-blue">You</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                              u.role === "admin" ? "bg-usps-darker text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {u.role === "admin" && <ShieldCheck className="h-3 w-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-sm font-bold text-slate-800">{u.shipments}</td>
                        <td className="py-3.5 px-4 text-sm font-bold text-slate-800">{u.holds}</td>
                        <td className="py-3.5 px-4 text-[12.5px] text-slate-500 whitespace-nowrap">{joined(u.createdAt)}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => void changeRole(u)}
                            disabled={self || busy}
                            title={self ? "You can't change your own role" : undefined}
                            className="inline-flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-md border border-slate-300 text-slate-600 transition-colors whitespace-nowrap hover:border-usps-blue hover:text-usps-blue disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-600"
                          >
                            {busy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                            {u.role === "admin" ? "Make customer" : "Make admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((u) => {
                const self = isSelf(u);
                const busy = busyId === u.id;
                return (
                  <div key={u.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-[14px] text-slate-900 truncate">
                          {fullName(u)}
                          {self && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-usps-blue">You</span>
                          )}
                        </p>
                        <p className="text-[12.5px] text-slate-500 truncate">{u.email}</p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin" ? "bg-usps-darker text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500">
                      <span>{u.shipments} shipments</span>
                      <span>{u.holds} holds</span>
                      <span>joined {joined(u.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => void changeRole(u)}
                      disabled={self || busy}
                      className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-md border border-slate-300 text-slate-600 hover:border-usps-blue hover:text-usps-blue transition-colors disabled:opacity-40"
                    >
                      {busy ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      {u.role === "admin" ? "Make customer" : "Make admin"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <p className="text-[12px] text-slate-400">
        Roles are enforced by the API, not this screen. The built-in administrator can't be demoted, and no
        one can change their own role.
      </p>
    </div>
  );
}
