import { cn } from "@/lib/cn";

type PillVariant = "teal" | "sky" | "cream" | "green" | "red" | "custom";

interface PillProps {
  variant?: PillVariant;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const variants: Record<PillVariant, string> = {
  teal: "bg-teal-50 text-teal-700 border border-teal-200",
  sky: "bg-sky-50 text-sky-700 border border-sky-200",
  cream: "bg-cream text-navy border border-cream-border",
  green: "bg-green-100 text-green-700 border border-green-200",
  red: "bg-red-100 text-red-600 border border-red-200",
  custom: "",
};

export default function Pill({ variant = "teal", children, className, style }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-semibold",
        variants[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
