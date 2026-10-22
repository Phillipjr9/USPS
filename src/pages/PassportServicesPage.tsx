import { Link } from "react-router-dom";
import { MapPin, Mail, Clock, ArrowRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function PassportServicesPage() {
  return (
    <section id="passport" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Passport Services"
          route="locations"
          desc="Apply for or renew a U.S. passport at a Post Office near you."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Apply for a Passport</h3>
              <p className="text-slate-600 mb-6">
                Many Post Offices™ accept passport applications. You can apply for a new passport,
                renew your passport, or get a child's passport at select locations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Find a Passport Acceptance Facility</p>
                    <p className="text-[13px] text-slate-600">Search for Post Offices that accept passport applications near you.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Passport Application Forms</p>
                    <p className="text-[13px] text-slate-600">Download and print DS-11, DS-82, and other passport forms.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-usps-blue shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">Passport Fees & Processing Times</p>
                    <p className="text-[13px] text-slate-600">See current fees and estimated processing times for passport services.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-usps-light border border-usps-blue/20">
                <p className="text-sm font-bold text-usps-darker">Important:</p>
                <p className="text-[13px] text-slate-600 mt-1">
                  Passport services are available at select Post Office locations. Call ahead to confirm
                  availability and hours before your visit.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-usps-darker mb-6">Renew Your Passport</h3>
              <p className="text-slate-600 mb-6">
                If your passport is expired or expiring soon, you may be eligible to renew by mail
                using Form DS-82.
              </p>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span> Your previous passport was issued within the last 15 years
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span> You were 16 or older when it was issued
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span> Your previous passport was not lost, stolen, or damaged
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span> You still have the same name (or can document your name change)
                </li>
              </ul>
              <Link to="/locations" className="bg-usps-blue hover:bg-usps-dark text-white font-bold px-6 py-3 rounded-full inline-block transition-colors text-sm">
                Find a Post Office <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-usps-blue rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-black text-white mb-6">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/locations" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Find Passport Acceptance Locations
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Passport Fees & Processing Times
                </Link>
                <Link to="/help" className="block p-3 rounded-xl border border-white/20 text-white/90 hover:bg-white/10 transition-colors text-sm">
                  Download Passport Forms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
