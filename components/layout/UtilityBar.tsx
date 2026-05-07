import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";

export default function UtilityBar() {
  return (
    <div className="bg-sky-400 text-[#04293F] text-[13px] font-medium h-9.5 hidden sm:flex items-center">
      <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="mountain" size={15} stroke={2} />
          <span>
            Serving the Hills Since 2026 · Now Open — {siteConfig.fullName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Icon name="phone" size={14} stroke={2.2} />
            Helpline: {siteConfig.phone}
          </span>
          <div className="w-px h-4.5 bg-[rgba(4,41,63,.18)]" />
          <span className="flex items-center gap-1.5 text-white font-bold">
            <Icon name="ambulance" size={15} stroke={2.2} />
            Emergency: {siteConfig.emergency}
          </span>
          <div className="w-px h-4.5 bg-[rgba(4,41,63,.18)]" />
          <div className="flex gap-1">
            {(["facebook", "instagram", "whatsapp"] as const).map((s) => (
              <a
                key={s}
                href={siteConfig.social[s]}
                aria-label={s}
                className="w-7 h-7 rounded-md inline-flex items-center justify-center text-[#04293F] hover:bg-[rgba(4,41,63,.1)] transition-colors"
              >
                <Icon name={s} size={16} stroke={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
