import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  className?: string;
  accent?: "default" | "primary" | "success" | "warning" | "danger";
}

const accentStyles: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  default: "bg-muted/50 text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function MetricCard({ title, value, description, icon, trend, className, accent = "default" }: MetricCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={cn("text-xs font-medium", isPositive ? "text-green-600" : "text-red-500")}>
                  {isPositive ? "+" : ""}{trend.value}%
                </span>
                {trend.label && <span className="text-xs text-muted-foreground">{trend.label}</span>}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn("rounded-xl p-2.5 shrink-0", accentStyles[accent])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { MetricCard };
