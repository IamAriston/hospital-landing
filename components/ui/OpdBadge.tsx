"use client";

import { siteConfig } from "@/config/site";
import { isOpenNow } from "@/lib/schedule";

export default function OpdBadge() {
  const open = isOpenNow(siteConfig.hours.opd);
  return (
    <div className="inline-flex items-center gap-2.5 bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-slate-200/60">
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${open ? "bg-green-500 animate-pulse" : "bg-slate-400"}`}
      />
      <div>
        <div
          className={`text-[13px] font-bold font-display ${open ? "text-green-700" : "text-slate-600"}`}
        >
          {open ? "OPD Open Now" : "OPD Closed"}
        </div>
        <div className="text-[11px] text-slate-500 leading-none mt-0.5">
          {open
            ? "Walk-ins welcome · Mon–Sat"
            : `Opens ${siteConfig.hours.opd.startHour} AM Mon–Sat`}
        </div>
      </div>
    </div>
  );
}
