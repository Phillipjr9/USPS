import { SERVICE_LINKS } from "../data/content";

export default function QuickTools() {
  return (
    <section id="tools" className="bg-slate-50 border-b border-slate-200 scroll-mt-36">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Real USPS.com service-link icon grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6">
          {SERVICE_LINKS.map((t) => (
            <a key={t.label} href="#tools" className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white hover:shadow-md transition-all">
              <img
                src={t.icon}
                alt={t.alt}
                className="h-12 w-12 object-contain shrink-0 group-hover:scale-110 transition-transform"
                loading="lazy"
              />
              <span>
                <span className="block font-bold text-[14.5px] text-usps-blue leading-tight group-hover:underline underline-offset-2">
                  {t.label}
                </span>
                <span className="block text-[12.5px] text-slate-500 mt-1 leading-snug">{t.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
