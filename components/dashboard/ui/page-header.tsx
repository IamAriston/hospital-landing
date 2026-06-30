import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-5 mb-7 flex-wrap",
        className
      )}
    >
      <div>
        <h1 className="text-[28px] font-extrabold text-dash-text tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-dash-text-dim mt-1.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex gap-2.5 items-center flex-wrap">{actions}</div>
      )}
    </div>
  );
}
