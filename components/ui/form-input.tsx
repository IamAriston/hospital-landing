"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, required, containerClassName, startIcon, endIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} hint={hint} required={required} className={containerClassName} id={inputId}>
        <div className="relative">
          {startIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </span>
          )}
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive/30",
              startIcon && "pl-9",
              endIcon && "pr-9",
              className
            )}
            aria-invalid={!!error}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </span>
          )}
        </div>
      </FormField>
    );
  }
);
FormInput.displayName = "FormInput";

export { FormInput };
