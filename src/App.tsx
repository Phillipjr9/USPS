import { useEffect, useState } from "react";
import { Link, HashRouter as Router, Routes, Route } from "react-router-dom";
import { ArrowUp, CheckCircle2, X } from "lucide-react";
import { useCart } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import TrackPage from "./pages/TrackPage";
import ZipPage from "./pages/ZipPage";
import CalculatePage from "./pages/CalculatePage";
import PickupPage from "./pages/PickupPage";
import LocationsPage from "./pages/LocationsPage";
import ShipPage from "./pages/ShipPage";
import StorePage from "./pages/StorePage";
import InformedDeliveryPage from "./pages/InformedDeliveryPage";
import HelpPage from "./pages/HelpPage";
import NewsPage from "./pages/NewsPage";
import BusinessPage from "./pages/BusinessPage";
import InternationalPage from "./pages/InternationalPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import PassportServicesPage from "./pages/PassportServicesPage";
import MoneyOrdersPage from "./pages/MoneyOrdersPage";
import RedeliveryPage from "./pages/RedeliveryPage";
import InterceptPackagePage from "./pages/InterceptPackagePage";
import InsuranceExtraServicesPage from "./pages/InsuranceExtraServicesPage";
import ShippingRestrictionsPage from "./pages/ShippingRestrictionsPage";
import CustomsFormsPage from "./pages/CustomsFormsPage";
import FileClaimPage from "./pages/FileClaimPage";
import FindMissingMailPage from "./pages/FindMissingMailPage";
import SearchPage from "./pages/SearchPage";
import LegalPage from "./pages/LegalPage";
import SiteIndexPage from "./pages/SiteIndexPage";
import AnniversaryPage from "./pages/AnniversaryPage";
import QuickToolsPage from "./pages/QuickToolsPage";
import SendPage from "./pages/SendPage";
import ReceivePage from "./pages/ReceivePage";
import ShopPage from "./pages/ShopPage";
import HoldMailPage from "./pages/HoldMailPage";
import ChangeOfAddressPage from "./pages/ChangeOfAddressPage";
import PoBoxesPage from "./pages/PoBoxesPage";
import DeliveryInstructionsPage from "./pages/DeliveryInstructionsPage";
import SignatureServicesPage from "./pages/SignatureServicesPage";
import TrackingUpdatesPage from "./pages/TrackingUpdatesPage";
import GeneralDeliveryPage from "./pages/GeneralDeliveryPage";
import ReturnsPage from "./pages/ReturnsPage";

export default function App() {
  const [showTop, setShowTop] = useState(false);
  const [cookies, setCookies] = useState(true);
  const {
    addToCart,
    ordered,
    setOrdered,
    toast,
  } = useCart();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
          {/*
            NOTE: must not be href="#main-content". Under HashRouter any "#..."
            href is interpreted as a route and would land on the 404 page.
          */}
          <div className="fixed top-2 left-2 z-[100] flex gap-2">
            <button
              type="button"
              onClick={() => {
                const main = document.getElementById("main-content");
                main?.scrollIntoView({ behavior: "smooth", block: "start" });
                main?.focus();
              }}
              className="sr-only focus:not-sr-only focus:bg-usps-blue focus:text-white focus:font-bold focus:px-4 focus:py-2 focus:rounded-md"
            >
              Skip to main content
            </button>
            <button
              type="button"
              onClick={() => {
                const nav = document.getElementById("main-nav");
                nav?.scrollIntoView({ block: "start" });
                nav?.focus();
              }}
              className="sr-only focus:not-sr-only focus:bg-usps-blue focus:text-white focus:font-bold focus:px-4 focus:py-2 focus:rounded-md"
            >
              Skip all utility navigation
            </button>
          </div>
          <Header />

          <main id="main-content" tabIndex={-1} className="outline-none">
            <Routes>
              <Route path="/" element={<HomePage onAdd={addToCart} />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/zip" element={<ZipPage />} />
              <Route path="/calculate" element={<CalculatePage />} />
              <Route path="/pickup" element={<PickupPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/ship" element={<ShipPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/informed" element={<InformedDeliveryPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/international" element={<InternationalPage />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/passport-services" element={<PassportServicesPage />} />
              <Route path="/money-orders" element={<MoneyOrdersPage />} />
              <Route path="/redelivery" element={<RedeliveryPage />} />
              <Route path="/intercept-package" element={<InterceptPackagePage />} />
              <Route path="/insurance-extra-services" element={<InsuranceExtraServicesPage />} />
              <Route path="/shipping-restrictions" element={<ShippingRestrictionsPage />} />
              <Route path="/customs-forms" element={<CustomsFormsPage />} />
              <Route path="/file-claim" element={<FileClaimPage />} />
              <Route path="/find-missing-mail" element={<FindMissingMailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/privacy" element={<LegalPage kind="privacy" />} />
              <Route path="/terms" element={<LegalPage kind="terms" />} />
              <Route path="/site-index" element={<SiteIndexPage />} />
              <Route path="/250" element={<AnniversaryPage />} />
              <Route path="/quick-tools" element={<QuickToolsPage />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/receive" element={<ReceivePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/hold-mail" element={<HoldMailPage />} />
              <Route path="/change-of-address" element={<ChangeOfAddressPage />} />
              <Route path="/po-boxes" element={<PoBoxesPage />} />
              <Route path="/delivery-instructions" element={<DeliveryInstructionsPage />} />
              <Route path="/signature-services" element={<SignatureServicesPage />} />
              <Route path="/tracking-updates" element={<TrackingUpdatesPage />} />
              <Route path="/general-delivery" element={<GeneralDeliveryPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />

          {/* Order confirmation */}
          {ordered && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-usps-darker/70 backdrop-blur-sm" onClick={() => setOrdered(false)} />
              <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl fade-slide">
                <button onClick={() => setOrdered(false)} className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto fill-green-100" />
                <h3 className="font-black text-xl mt-4">Order Placed!</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Confirmation <b className="font-mono">#USPS-{Math.floor(100000 + Math.random() * 899999)}</b><br />
                  A receipt was sent to your email. Stamps ship in 3–5 days.
                </p>
                <button onClick={() => setOrdered(false)} className="mt-5 w-full bg-usps-blue hover:bg-usps-dark text-white font-bold py-3 rounded-full text-sm transition-colors">
                  Continue Browsing
                </button>
              </div>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[75] bg-usps-darker text-white text-[13.5px] font-semibold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 fade-slide max-w-[90vw] truncate">
              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> {toast}
            </div>
          )}

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className={`fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-usps-blue hover:bg-usps-dark text-white shadow-xl flex items-center justify-center transition-all ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
          >
            <ArrowUp className="h-5 w-5" />
          </button>

          {/* Cookie banner */}
          {cookies && (
            <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-usps-blue shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
              <div className="mx-auto max-w-7xl px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-[12.5px] text-slate-600 flex-1">
                  <b className="text-slate-900">We use cookies.</b> USPS.com uses cookies to improve your experience, analyze traffic, and remember preferences. See our{" "}
                  <Link to="/help" className="text-usps-blue font-semibold hover:underline">Privacy Policy</Link>.
                </p>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setCookies(false)} className="text-[13px] font-bold border-2 border-slate-200 hover:border-slate-400 px-4 py-2 rounded-full transition-colors">
                    Manage
                  </button>
                  <button onClick={() => setCookies(false)} className="text-[13px] font-bold bg-usps-blue hover:bg-usps-dark text-white px-5 py-2 rounded-full transition-colors">
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Router>
  );
}
