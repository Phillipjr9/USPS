import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps routes that require a signed-in session.
 *
 * With `requireAdmin`, visitors who are signed in but are not administrators
 * are sent to their account page rather than the dashboard, so the admin
 * surface is never exposed to a customer session.
 *
 * Unauthenticated visitors go to /login and are returned to the page they
 * originally requested once they sign in.
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin, loading, dbError } = useAuth();
  const location = useLocation();

  // Wait for the session check before deciding — otherwise a signed-in visitor
  // is briefly redirected to /login on every refresh.
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4">
        <p className="text-sm font-semibold text-slate-500">Checking your session…</p>
      </div>
    );
  }

  // Never bounce to a login form that cannot work because the API is down.
  if (dbError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-black text-red-900">The database isn't reachable</h1>
          <p className="mt-2 text-[13.5px] text-red-800">{dbError}</p>
          <p className="mt-3 text-[12.5px] text-red-700">
            On Vercel, connect the Neon database to this project so <code>DATABASE_URL</code> is
            available, then redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname, needsAdmin: requireAdmin }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/account" replace state={{ denied: "admin" }} />;
  }

  return <>{children}</>;
}
