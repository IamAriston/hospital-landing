import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import { homeConfig } from "@/config/home";
import { siteConfig } from "@/config/site";

export default function EmergencyCTA() {
  const { emergency } = homeConfig;

  return (
    <section className="bg-navy text-white py-20 sm:py-24 relative overflow-hidden">
      <svg
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0 320 L240 200 L420 280 L640 160 L820 260 L1040 140 L1240 220 L1440 160 L1440 400 L0 400 Z"
          fill="#0D9488"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
        <Pill
          variant="custom"
          className="bg-red-600/18 text-red-300 border border-red-600/30"
        >
          <Icon name="siren" size={13} stroke={2.2} />
          {emergency.pill}
        </Pill>

        <h2 className="text-white text-[40px] sm:text-[48px] font-extrabold font-display mt-4 leading-[1.15]">
          {emergency.headline}
        </h2>
        <p className="text-sky-200 text-lg mt-3 max-w-2xl mx-auto">
          {emergency.body}
        </p>

        {/* Phone number box */}
        <div className="mt-8 inline-flex items-center gap-2.5 bg-red-600/12 border border-red-600/35 px-7 py-4 rounded-2xl">
          <Icon name="phone" size={28} stroke={2} className="text-red-300" />
          <div className="text-left">
            <div className="text-[12px] text-red-300 font-semibold uppercase tracking-widest">
              Emergency
            </div>
            <div className="text-[34px] sm:text-[38px] font-display font-extrabold text-white tracking-tight leading-none mt-0.5">
              {emergency.number}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3.5 justify-center mt-8">
          <a
            href={`tel:${siteConfig.emergency}`}
            className="inline-flex items-center gap-2 px-7 py-4.5 rounded-[10px] text-base font-semibold font-display bg-sky-400 text-sky-ink hover:bg-sky-500 transition-colors"
          >
            <Icon name="phone" size={18} stroke={2} /> Call Now
          </a>
          <button className="inline-flex items-center gap-2 px-7 py-4.5 rounded-[10px] text-base font-semibold font-display border border-white/50 text-white hover:bg-white hover:text-navy transition-colors">
            <Icon name="map" size={18} stroke={2} /> Get Directions
          </button>
        </div>
      </div>
    </section>
  );
}
