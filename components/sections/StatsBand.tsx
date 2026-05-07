"use client";

import Icon from "@/components/ui/Icon";
import { homeConfig } from "@/config/home";
import { useCountUp } from "@/hooks/useCountUp";
import type { IconName } from "@/components/ui/Icon";

function parseStat(raw: string): { value: number; suffix: string } | null {
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { value: parseInt(match[1], 10), suffix: match[2] };
}

function StatItem({ icon, number, label }: { icon: string; number: string; label: string }) {
  const parsed = parseStat(number);
  const { count, elRef } = useCountUp(parsed?.value ?? 0);

  return (
    <div
      ref={elRef as React.RefObject<HTMLDivElement>}
      className="flex flex-col items-center gap-2.5 py-1 px-3"
    >
      <div className="text-sky-200/95">
        <Icon name={icon as IconName} size={26} stroke={1.6} />
      </div>
      <div className="font-display text-[38px] sm:text-[42px] font-extrabold leading-none tracking-tight tabular-nums">
        {parsed ? `${count}${parsed.suffix}` : number}
      </div>
      <div className="text-sky-200 text-[13px] font-medium uppercase tracking-[.08em]">
        {label}
      </div>
    </div>
  );
}

export default function StatsBand() {
  const { stats } = homeConfig;
  return (
    <section className="bg-teal-600 text-white py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={i < stats.length - 1 ? "border-r border-white/20" : ""}
            >
              <StatItem icon={s.icon} number={s.number} label={s.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
