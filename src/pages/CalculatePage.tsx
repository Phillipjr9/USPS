import { CalcPanel } from "../components/Hero";
import PageHeader from "../components/PageHeader";

export default function CalculatePage() {
  return (
    <section id="calculate" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Calculate a Price"
          route="calculate"
          desc="Get postage prices for letters, flats, and packages by destination, weight, and shape."
        />
        <CalcPanel />
      </div>
    </section>
  );
}
