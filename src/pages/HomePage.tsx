import Hero from "../components/Hero";
import QuickTools from "../components/QuickTools";
import { HolidayBanner, FeaturedProducts, InformedDelivery, BusinessBanner, EDDMBand, Promo250 } from "../components/FeatureSections";
import Store from "../components/Store";
import { News, Help } from "../components/NewsHelp";
import ShipSection from "../components/ShipSection";

export default function HomePage({ onAdd }: { onAdd: (name: string, price: string) => void }) {
  return (
    <main>
      <Hero />
      <QuickTools />
      <HolidayBanner />
      <FeaturedProducts />
      <ShipSection />
      <InformedDelivery />
      <Store onAdd={onAdd} />
      <Promo250 />
      <BusinessBanner />
      <EDDMBand />
      <News />
      <Help />
    </main>
  );
}
