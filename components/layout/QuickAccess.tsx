import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import type { IconName } from "@/components/ui/Icon";

export default function QuickAccess() {
  return (
    <div className="bg-white border-b-[3px] border-teal-600">
      <div className="max-w-7xl mx-auto grid grid-cols-3 md:grid-cols-6">
        {siteConfig.quickAccess.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className={[
              "flex flex-col items-center justify-center gap-2 py-5 px-2",
              "hover:bg-sky-50 transition-colors group",
              i < siteConfig.quickAccess.length - 1 ? "border-r border-slate-200" : "",
            ].join(" ")}
          >
            <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-teal-600 group-hover:text-teal-700 transition-colors">
              <Icon name={item.icon as IconName} size={28} stroke={1.6} />
            </div>
            <span className="font-display text-navy font-semibold text-[13px] sm:text-sm text-center leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
