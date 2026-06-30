import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { DashCard } from "./dash-card";

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: string;
  trend?: "up" | "down" | null;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  animateClass?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  iconBg,
  iconColor,
  animateClass,
  className,
}: StatCardProps) {
  return (
    <DashCard className={cn("dash-card-hover", animateClass, className)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("dash-icon-box", iconBg, iconColor)}>
          <Icon size={20} strokeWidth={1.7} />
        </div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
              trend === "up" && "text-green-700 bg-green-50",
              trend === "down" && "text-red-700 bg-red-50",
              !trend && "text-dash-text-mute bg-dash-surface-3"
            )}
          >
            {trend === "up" && <TrendingUp size={11} strokeWidth={2.4} />}
            {trend === "down" && <TrendingDown size={11} strokeWidth={2.4} />}
            {delta}
          </span>
        )}
      </div>
      <div className="dash-stat-num">{value}</div>
      <div className="text-[13px] text-dash-text-dim mt-1">{label}</div>
    </DashCard>
  );
}
