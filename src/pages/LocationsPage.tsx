import { LocationsPanel } from "../components/Hero";
import PageHeader from "../components/PageHeader";

export default function LocationsPage() {
  return (
    <section id="locations" className="py-14 lg:py-20 bg-white scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader
          title="Find USPS Locations"
          route="locations"
          desc="Search for Post Offices, collection boxes, and approved postal providers near you."
        />
        <LocationsPanel />
      </div>
    </section>
  );
}
