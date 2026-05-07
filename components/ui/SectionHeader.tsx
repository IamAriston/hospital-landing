import { cn } from "@/lib/cn";
import Pill from "./Pill";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center"
          ? "flex flex-col items-center text-center"
          : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left",
        className
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {eyebrow && <Pill variant="teal" className="mb-3.5">{eyebrow}</Pill>}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-navy font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-[17px] text-slate-600 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
