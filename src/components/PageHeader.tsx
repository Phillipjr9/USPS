import { Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, Calculator, Truck, Building2, Mail, HelpCircle, Globe, Newspaper } from "lucide-react";

const ICONS: Record<string, typeof Package> = {
  track: Package,
  zip: MapPin,
  calculate: Calculator,
  pickup: Truck,
  locations: Building2,
  ship: Truck,
  store: Package,
  informed: Mail,
  help: HelpCircle,
  news: Newspaper,
  business: Globe,
  international: Globe,
};

export default function PageHeader({
  title,
  route,
  desc,
}: {
  title: string;
  route: keyof typeof ICONS;
  desc?: string;
}) {
  const Icon = ICONS[route];
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/" className="text-[12px] text-usps-blue hover:underline flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
      </div>
      <h2 className="text-3xl lg:text-[36px] font-black text-usps-darker tracking-tight mb-2 flex items-center gap-3">
        <Icon className="h-7 w-7 text-usps-blue" /> {title}
      </h2>
      {desc && <p className="text-slate-600 text-[14.5px]">{desc}</p>}
    </div>
  );
}
