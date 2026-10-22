import { Link } from "react-router-dom";
import { ListTree, ArrowRight } from "lucide-react";
import { SEARCH_INDEX } from "../data/searchIndex";

const GROUPS: { heading: string; routes: string[] }[] = [
  { heading: "Track & Manage", routes: ["/track", "/redelivery", "/intercept-package", "/find-missing-mail", "/informed"] },
  { heading: "Send & Ship", routes: ["/ship", "/calculate", "/pickup", "/store", "/customs-forms", "/shipping-restrictions", "/insurance-extra-services"] },
  { heading: "Tools", routes: ["/zip", "/locations", "/news"] },
  { heading: "Business & International", routes: ["/business", "/international", "/admin/dashboard"] },
  { heading: "Services", routes: ["/passport-services", "/money-orders", "/file-claim", "/help"] },
  { heading: "Account", routes: ["/login", "/create-account", "/forgot-password", "/account", "/cart"] },
  { heading: "Legal & Info", routes: ["/privacy", "/terms", "/site-index"] },
];

export default function SiteIndexPage() {
  const byRoute = new Map(SEARCH_INDEX.map((e) => [e.route, e]));

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="flex items-center gap-2.5 text-[30px] font-black leading-tight tracking-tight text-usps-darker">
          <ListTree className="h-7 w-7 text-usps-blue" /> Site Index
        </h1>
        <p className="mt-1 text-[14px] text-slate-600">
          Every page on this site, grouped by section. {SEARCH_INDEX.length} pages in total.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <h2 className="border-b-2 border-usps-light pb-2 text-[12px] font-bold uppercase tracking-wider text-usps-blue">
                {g.heading}
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {g.routes.map((r) => {
                  const entry = byRoute.get(r);
                  if (!entry) return null;
                  return (
                    <li key={r}>
                      <Link
                        to={r}
                        className="group inline-flex items-center gap-1.5 text-[13.5px] text-slate-700 transition-colors hover:text-usps-blue"
                      >
                        {entry.title}
                        <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* anything not covered by a group, so nothing is ever missing */}
        {(() => {
          const grouped = new Set(GROUPS.flatMap((g) => g.routes));
          const rest = SEARCH_INDEX.filter((e) => !grouped.has(e.route));
          if (rest.length === 0) return null;
          return (
            <div className="mt-8">
              <h2 className="border-b-2 border-usps-light pb-2 text-[12px] font-bold uppercase tracking-wider text-usps-blue">
                Other
              </h2>
              <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((e) => (
                  <li key={e.route}>
                    <Link to={e.route} className="text-[13.5px] text-slate-700 hover:text-usps-blue">
                      {e.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
