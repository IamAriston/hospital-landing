import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/components/ui/Icon";

type Accent = "red" | "sky" | "teal";

interface FeatureCardProps {
  icon: string;
  name: string;
  desc: string;
  accent: Accent;
  cta: string;
}

const accentBg: Record<Accent, string> = {
  red: "from-red-200 to-red-300",
  sky: "from-sky-200 to-sky-300",
  teal: "from-teal-200 to-teal-300",
};

const accentIcon: Record<Accent, string> = {
  red: "text-red-600",
  sky: "text-sky-700",
  teal: "text-teal-700",
};

const accentCta: Record<Accent, string> = {
  red: "text-red-600",
  sky: "text-teal-600",
  teal: "text-teal-600",
};

export default function FeatureCard({
  icon,
  name,
  desc,
  accent,
  cta,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 hover:-translate-y-1 hover:shadow-[0_20px_44px_-16px_rgba(12,35,64,.22)] transition-all duration-200">
      <div
        className={cn(
          "h-24 bg-linear-to-br flex items-center justify-center relative",
          accentBg[accent],
          accentIcon[accent],
        )}
      >
        <Icon name={icon as IconName} size={42} stroke={1.5} />
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,.6),transparent_60%)]"
        />
      </div>
      <div className="px-6 pt-5 pb-6">
        <h3 className="text-xl font-bold text-navy font-display">{name}</h3>
        <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">
          {desc}
        </p>
        <button
          className={cn(
            "mt-3.5 inline-flex items-center gap-1 font-semibold text-sm hover:gap-2 transition-all",
            accentCta[accent],
          )}
        >
          {cta} <Icon name="arrowSmall" size={15} stroke={2.2} />
        </button>
      </div>
    </div>
  );
}
