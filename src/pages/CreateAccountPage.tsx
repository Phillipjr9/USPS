import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function CreateAccountPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  const goToVerify = () => {
    setError(null);
    if (!firstName.trim()) return setError("Enter your first name.");
    if (!lastName.trim()) return setError("Enter your last name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!agreed) return setError("Please accept the Terms of Use and Privacy Policy.");
    setStep(2);
  };

  const handleCodeInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    if (codeRefs.current[index]) codeRefs.current[index]!.value = digit;
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const finishSignUp = async () => {
    setError(null);
    setSubmitting(true);
    const result = await register({ firstName, lastName, email, phone, password });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Unable to create your account.");
      setStep(1);
      return;
    }
    setVerified(true);
    setStep(3);
  };

  const inputCls =
    "w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 outline-none transition-colors";

  return (
    <section id="create-account" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Create an Account"
          route="help"
          desc="Join USPS.com to track packages, manage deliveries, and shop the Postal Store®."
        />

        <div className="max-w-2xl">
          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > s ? "bg-green-600 text-white" : step === s ? "bg-usps-blue text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className="h-[1px] w-8 bg-slate-200" />}
                <span className={`text-[12px] font-medium ${
                  step > s ? "text-slate-400" : "text-usps-darker"
                }`}>{s === 1 ? "Your Info" : s === 2 ? "Verify" : "Done"}</span>
              </div>
            ))}
          </div>

          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Your Info */}
          {step === 1 && (
            <form
              className="space-y-4 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                goToVerify();
              }}
              noValidate
            >
              <h3 className="text-xl font-black text-usps-darker mb-1">Tell us about yourself</h3>
              <p className="text-slate-600 mb-6">We'll use this to create your USPS.com account.</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ca-first" className="block text-[13px] font-medium text-slate-700 mb-1.5">First Name</label>
                  <input id="ca-first" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ca-last" className="block text-[13px] font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input id="ca-last" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className={inputCls} />
                </div>
              </div>

              <div>
                <label htmlFor="ca-email" className="block text-[13px] font-medium text-slate-700 mb-1.5">Email Address</label>
                <input id="ca-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
              </div>

              <div>
                <label htmlFor="ca-phone" className="block text-[13px] font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input id="ca-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className={inputCls} />
              </div>

              <div>
                <label htmlFor="ca-password" className="block text-[13px] font-medium text-slate-700 mb-1.5">Create a Password</label>
                <input id="ca-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
                <p className="text-[12px] text-slate-400 mt-1">Must be at least 8 characters.</p>
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="rounded text-usps-blue focus:ring-usps-blue" />
                  I agree to the <Link to="/terms" className="text-usps-blue font-medium hover:underline">Terms of Use</Link> and <Link to="/privacy" className="text-usps-blue font-medium hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <button type="submit" className="w-full bg-usps-blue hover:bg-usps-dark text-white font-bold py-3.5 rounded-full transition-colors mt-4">
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Verify */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <h3 className="text-xl font-black text-usps-darker mb-1">Verify your email</h3>
              <p className="text-slate-600 mb-6">
                We sent a verification code to <span className="font-medium text-usps-darker">{email}</span>.
              </p>

              <div className="flex justify-center gap-1 mb-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
                        codeRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="w-9 h-11 border-2 border-slate-300 focus:border-usps-blue rounded-md text-center font-mono font-bold outline-none text-lg"
                    autoComplete="one-time-code"
                    aria-label={`Verification digit ${i + 1}`}
                  />
                ))}
              </div>

              <p className="text-[13px] text-slate-600 mb-4">
                Didn't receive the code?{" "}
                <button type="button" onClick={() => setError(null)} className="text-usps-blue font-medium hover:underline">
                  Resend code
                </button>
              </p>

              <button
                type="button"
                onClick={finishSignUp}
                disabled={submitting}
                className="w-full bg-usps-blue hover:bg-usps-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-full transition-colors mt-4"
              >
                Continue
              </button>

              <button type="button" onClick={() => setStep(1)} className="w-full mt-3 border-2 border-slate-300 text-slate-600 font-medium py-3 rounded-full hover:bg-slate-50 transition-colors">
                Back
              </button>
            </div>
          )}

          {/* Step 3: Done */}
          {verified && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-usps-darker mb-2">Account created!</h3>
              <p className="text-slate-600 mb-8">
                Welcome to USPS.com, {firstName}. You can now track packages and manage your deliveries.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/account")}
                  className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
                >
                  Go to My Account
                </button>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold px-8 py-3 rounded-full transition-colors"
                >
                  Open Shipping Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
