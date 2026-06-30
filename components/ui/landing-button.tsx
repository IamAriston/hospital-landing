import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "sky" | "tealOutline" | "outline" | "redOutline" | "navy";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  sky: "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-button",
  tealOutline: "border border-teal-600 text-teal-700 bg-white hover:bg-teal-50",
  outline: "border border-slate-300 text-navy bg-white hover:bg-slate-50",
  redOutline: "border border-red-400 text-red-600 bg-white hover:bg-red-50",
  navy: "bg-navy hover:bg-navy-dark text-white",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5 rounded-[10px]",
  md: "h-10 px-5 text-[14px] gap-2 rounded-[10px]",
  lg: "h-11 px-5 text-[14.5px] gap-2 rounded-[11px]",
};

interface LandingButtonProps {
  href?: string;
  variant?: Variant;
  size?: Size;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  children?: React.ReactNode;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function LandingButton({
  href,
  variant = "sky",
  size = "md",
  onClick,
  className,
  children,
  external,
  type = "button",
  disabled,
}: LandingButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center font-semibold font-display transition-all duration-150 shrink-0",
    "disabled:opacity-60 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={base}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={base} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
