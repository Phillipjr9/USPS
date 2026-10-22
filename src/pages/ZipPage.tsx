import { ZipPanel } from "../components/Hero";
import PageHeader from "../components/PageHeader";

export default function ZipPage() {
  return (
    <section id="zip" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Look Up a ZIP Code™"
          route="zip"
          desc="Find the ZIP+4 Code for any U.S. address."
        />
        <ZipPanel />
      </div>
    </section>
  );
}
