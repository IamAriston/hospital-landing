import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DashCardProps {
  children: ReactNode;
  className?: string;
  noPad?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export function DashCard({ children, className, noPad = false, onClick, hover = false }: DashCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-dash-surface border border-dash-border rounded-2xl shadow-card",
        !noPad && "p-5",
        hover && "dash-card-hover cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DashCardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-4 border-b border-dash-border",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DashCardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
