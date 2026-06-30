"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ActionBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
}

export function ActionBtn({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  disabled,
  ...props
}: ActionBtnProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] font-semibold transition-all duration-150 cursor-pointer border",
        size === "md" && "px-3.5 py-[9px] text-[13.5px]",
        size === "sm" && "px-2.5 py-1.5 text-xs",
        variant === "primary" && [
          "text-white border-transparent",
          "[background:var(--grad-teal)] shadow-[0_2px_8px_rgba(13,148,136,.28)]",
          "hover:opacity-90 hover:-translate-y-px",
          "disabled:opacity-60 disabled:cursor-not-allowed",
        ],
        variant === "secondary" && [
          "bg-dash-surface border-dash-border text-dash-text",
          "hover:border-dash-border-strong",
        ],
        variant === "ghost" && [
          "bg-transparent border-transparent text-dash-text-dim",
          "hover:bg-dash-surface-3 hover:text-dash-text",
        ],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

interface ActionLinkProps {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function ActionLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[9px] font-semibold transition-all duration-150 border",
        size === "md" && "px-3.5 py-[9px] text-[13.5px]",
        size === "sm" && "px-2.5 py-1.5 text-xs",
        variant === "primary" && [
          "text-white border-transparent",
          "[background:var(--grad-teal)] shadow-[0_2px_8px_rgba(13,148,136,.28)]",
          "hover:opacity-90 hover:-translate-y-px",
        ],
        variant === "secondary" && [
          "bg-dash-surface border-dash-border text-dash-text",
          "hover:border-dash-border-strong",
        ],
        variant === "ghost" && [
          "bg-transparent border-transparent text-dash-text-dim",
          "hover:bg-dash-surface-3 hover:text-dash-text",
        ],
        className
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
