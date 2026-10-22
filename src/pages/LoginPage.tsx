import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Mail, Phone, ArrowRight, Package, AlertCircle, Eye, EyeOff } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.");
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <section id="login" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Sign In"
          route="help"
          desc="Access your USPS® account to track packages, manage deliveries, and more."
        />

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Sign In form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            <h3 className="text-xl font-black text-usps-darker mb-6">Sign In to your account</h3>

            {redirectTo !== "/account" && (
              <div className="mb-5 flex items-start gap-2.5 bg-usps-light border border-usps-blue/20 rounded-lg p-3">
                <Package className="h-4 w-4 text-usps-blue shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-700">
                  Sign in to continue to <b>{redirectTo}</b>.
                </p>
              </div>
            )}

            {error && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-800">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="signin-email" className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Email or Username
                </label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="signin-password" className="block text-[13px] font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 pr-11 text-sm outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-usps-blue focus:ring-usps-blue" />
                  Keep me signed in
                </label>
                <Link to="/forgot-password" className="text-[13px] text-usps-blue font-medium hover:underline">
                  Forgot username or password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-usps-blue hover:bg-usps-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-colors mt-2"
              >
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="text-[13px] text-slate-600 mb-4 text-center">
                Don't have an account?{" "}
                <Link to="/create-account" className="text-usps-blue font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Info panel */}
          <div className="bg-usps-light rounded-2xl p-8 lg:p-10">
            <h3 className="text-xl font-black text-usps-darker mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-usps-blue" /> Why sign in?
            </h3>
            <div className="space-y-5">
              {[
                {
                  title: "Track all your packages",
                  desc: "See tracking history for every shipment in one place.",
                  icon: Package,
                },
                {
                  title: "Manage your deliveries",
                  desc: "Set delivery instructions, hold mail, and change your address.",
                  icon: Mail,
                },
                {
                  title: "USPS Tracking® alerts",
                  desc: "Get text and email updates when your mail and packages arrive.",
                  icon: Phone,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-[13px] text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-[12.5px] text-slate-600 mb-3">
                New to USPS.com? Create a free account to manage your mail and shipments online.
              </p>
              <Link to="/create-account" className="inline-flex items-center gap-2 bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full transition-colors text-sm">
                Create an account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
