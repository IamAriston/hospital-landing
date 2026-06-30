"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerClassName?: string;
  className?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
  id?: string;
}

function FormDatePicker({
  label,
  error,
  hint,
  required,
  containerClassName,
  className,
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  fromDate,
  toDate,
  id,
}: FormDatePickerProps) {
  const pickerId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <FormField label={label} error={error} hint={hint} required={required} className={containerClassName} id={pickerId}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={pickerId}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive/30",
              className
            )}
            aria-invalid={!!error}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {value ? format(value, "PPP") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => {
              if (fromDate && date < fromDate) return true;
              if (toDate && date > toDate) return true;
              return false;
            }}
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
}

export { FormDatePicker };
