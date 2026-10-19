import { ICONS } from "../data/content";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#" className="flex items-center shrink-0" aria-label="USPS.com Home Page">
      {/* Official USPS.com header logo */}
      <img
        src={ICONS.logo}
        alt="USPS.com"
        className={`${compact ? "h-7" : "h-9 sm:h-10"} w-auto`}
        draggable={false}
      />
    </a>
  );
}
