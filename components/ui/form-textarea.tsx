"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, required, containerClassName, className, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <FormField label={label} error={error} hint={hint} required={required} className={containerClassName} id={textareaId}>
        <Textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "resize-none min-h-[100px]",
            error && "border-destructive focus-visible:ring-destructive/30",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
      </FormField>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
