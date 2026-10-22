import { PickupPanel } from "../components/Hero";
import PageHeader from "../components/PageHeader";

export default function PickupPage() {
  return (
    <section id="pickup" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Schedule a Pickup"
          route="pickup"
          desc="Free carrier pickup during regular delivery — just have your prepaid label ready."
        />
        <PickupPanel />
      </div>
    </section>
  );
}
