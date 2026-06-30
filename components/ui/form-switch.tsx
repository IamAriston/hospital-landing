"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormSwitchProps {
  label?: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function FormSwitch({
  label,
  description,
  error,
  checked,
  onCheckedChange,
  disabled,
  className,
  id,
}: FormSwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5 shrink-0"
      />
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <Label htmlFor={switchId} className="cursor-pointer leading-none">
              {label}
            </Label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}

export { FormSwitch };
