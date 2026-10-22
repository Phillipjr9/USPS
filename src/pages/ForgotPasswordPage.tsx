import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, CheckCircle2 } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [resetDone, setResetDone] = useState(false);
  const [resent, setResent] = useState(false);

  return (
    <section id="forgot-password" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Forgot Password"
          route="help"
          desc="No problem. We'll help you reset your password and get back into your account."
        />

        <div className="max-w-md">
          {/* Step 1: Enter email */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-usps-darker mb-1">Reset your password</h3>
              <p className="text-slate-600 mb-6">Enter the email address associated with your USPS.com account.</p>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border-2 border-slate-300 focus:border-usps-blue rounded-md px-4 py-3 outline-none"
                  />
                </div>
                <button type="submit" className="w-full bg-usps-blue hover:bg-usps-dark text-white font-bold py-3.5 rounded-full transition-colors">
                  Send Reset Link
                </button>
              </form>

              <p className="mt-4 text-center text-[13px] text-slate-600">
                Remember your password?{" "}
                <Link to="/login" className="text-usps-blue font-medium hover:underline">Sign in instead</Link>.
              </p>
            </div>
          )}

          {/* Step 2: Reset link sent */}
          {step === 2 && !resetDone && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-usps-light flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-usps-blue" />
              </div>
              <h3 className="text-2xl font-black text-usps-darker mb-2">Check your email</h3>
              <p className="text-slate-600 mb-6">We've sent a password reset link to <span className="font-medium text-usps-darker">you@example.com</span>.</p>
              <p className="text-[13px] text-slate-600 mb-8">Follow the link in the email to create a new password.</p>
              <button type="button" onClick={() => setResetDone(true)} className="w-full bg-usps-blue hover:bg-usps-dark text-white font-bold py-3.5 rounded-full transition-colors">
                I've reset my password
              </button>
              <p className="mt-4 text-center text-[13px] text-slate-600">
                Didn't receive an email?{" "}
                <button
                  type="button"
                  onClick={() => setResent(true)}
                  className="text-usps-blue font-medium hover:underline"
                >
                  {resent ? "Link sent again" : "Resend link"}
                </button>.
              </p>
            </div>
          )}

          {/* Step 3: Password reset */}
          {resetDone && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-usps-darker mb-2">Password reset!</h3>
              <p className="text-slate-600 mb-8">Your password has been successfully updated.</p>
              <Link to="/login" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-8 py-3 rounded-full transition-colors">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
