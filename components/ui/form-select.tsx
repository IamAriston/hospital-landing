"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/ui/form-field";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  className?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

function FormSelect({
  label,
  error,
  hint,
  required,
  containerClassName,
  className,
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
  id,
}: FormSelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={containerClassName}
      id={selectId}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          className={cn(
            "w-full ",
            error && "border-destructive focus:ring-destructive/30",
            className,
          )}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

export { FormSelect };
export type { SelectOption };
