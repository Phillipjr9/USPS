import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, FileQuestion, Package } from "lucide-react";
import { searchSite, SEARCH_INDEX } from "../data/searchIndex";
import { inspectTracking } from "../data/tracking";

const POPULAR = ["Tracking", "Stamps", "Passport", "Redelivery", "Calculate", "Pickup"];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the URL and results in sync when the header navigates here.
  useEffect(() => {
    const q = params.get("q") ?? "";
    setQuery(q);
    setSubmitted(q);
  }, [params]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => (submitted ? searchSite(submitted) : []), [submitted]);
  const looksLikeTracking = useMemo(() => inspectTracking(submitted).valid, [submitted]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
    setSubmitted(query.trim());
  };

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-[30px] font-black leading-tight tracking-tight text-usps-darker">
          Search USPS.com
        </h1>

        <form onSubmit={submit} className="mt-4" role="search">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tracking, stamps, passports, ZIP Code…"
                aria-label="Search USPS.com"
                className="w-full rounded-md border-2 border-slate-300 py-3 pl-11 pr-4 text-[15px] outline-none transition-colors focus:border-usps-blue"
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-usps-blue px-8 py-3 text-[15px] font-bold text-white transition-colors hover:bg-usps-dark"
            >
              Search
            </button>
          </div>
        </form>

        {/* tracking shortcut */}
        {looksLikeTracking && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-usps-blue/30 bg-usps-light p-4">
            <Package className="h-5 w-5 shrink-0 text-usps-blue" />
            <p className="flex-1 text-[13.5px] text-slate-700">
              That looks like a tracking number.
            </p>
            <Link
              to={`/track?n=${encodeURIComponent(submitted)}`}
              className="rounded-full bg-usps-blue px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-usps-dark"
            >
              Track it
            </Link>
          </div>
        )}

        {/* results */}
        {submitted ? (
          <div className="mt-7">
            <p className="text-[13px] text-slate-500">
              {results.length} {results.length === 1 ? "result" : "results"} for{" "}
              <b className="text-slate-800">“{submitted}”</b>
            </p>

            {results.length > 0 ? (
              <ul className="mt-4 divide-y divide-slate-100 border-y border-slate-100">
                {results.map((r) => (
                  <li key={r.route}>
                    <Link
                      to={r.route}
                      className="group flex items-start justify-between gap-4 py-4 transition-colors hover:bg-slate-50"
                    >
                      <span>
                        <span className="block text-[15px] font-bold text-usps-blue group-hover:underline">
                          {r.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] text-slate-600">{r.description}</span>
                        <span className="mt-0.5 block font-mono text-[11.5px] text-slate-400">{r.route}</span>
                      </span>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-usps-blue" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-lg border border-slate-200 p-8 text-center">
                <FileQuestion className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="font-bold text-slate-800">No results for “{submitted}”</p>
                <p className="mt-1 text-[13px] text-slate-600">
                  Try a different term, or browse the{" "}
                  <Link to="/site-index" className="font-semibold text-usps-blue hover:underline">
                    site index
                  </Link>
                  .
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {POPULAR.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setQuery(p);
                        setSubmitted(p);
                        setParams({ q: p });
                      }}
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-usps-blue hover:text-usps-blue"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* empty state */
          <div className="mt-8">
            <p className="text-[13px] font-bold uppercase tracking-wider text-slate-500">Popular searches</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setQuery(p);
                    setSubmitted(p);
                    setParams({ q: p });
                  }}
                  className="rounded-full border border-slate-300 px-4 py-1.5 text-[12.5px] font-semibold text-slate-700 transition-colors hover:border-usps-blue hover:text-usps-blue"
                >
                  {p}
                </button>
              ))}
            </div>

            <p className="mt-8 text-[13px] font-bold uppercase tracking-wider text-slate-500">
              All pages ({SEARCH_INDEX.length})
            </p>
            <div className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {SEARCH_INDEX.map((e) => (
                <Link
                  key={e.route}
                  to={e.route}
                  className="text-[13.5px] text-usps-blue hover:underline"
                >
                  {e.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
