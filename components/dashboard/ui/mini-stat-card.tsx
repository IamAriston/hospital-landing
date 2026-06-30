import * as React from "react";
import { cn } from "@/lib/utils";
import { DashCard } from "./dash-card";

export type StatColor = "teal" | "green" | "amber" | "sky" | "muted";

const BAR_CLS: Record<StatColor, string> = {
  teal:  "bg-brand-teal",
  green: "bg-brand-green",
  amber: "bg-brand-amber",
  sky:   "bg-brand-sky",
  muted: "bg-dash-text-mute",
};

interface MiniStatCardProps {
  label: string;
  value: number | string;
  color: StatColor;
  live?: boolean;
}

export function MiniStatCard({ label, value, color, live = false }: MiniStatCardProps) {
  return (
    <DashCard className="flex items-center gap-3.5 !p-[14px_18px]">
      <div className={cn("w-[3px] self-stretch rounded-full", BAR_CLS[color])} />
      <div>
        <div className="dash-stat-num text-[26px] flex items-center gap-1.5">
          {value}
          {live && <span className={cn("dash-live-dot w-2 h-2", BAR_CLS[color])} />}
        </div>
        <div className="text-[12.5px] text-dash-text-mute mt-0.5">{label}</div>
      </div>
    </DashCard>
  );
}
