import { cn } from "@/lib/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold text-navy uppercase tracking-[.06em]">
          {label}
        </span>
        {error && (
          <span className="text-[11.5px] font-medium text-red-500">{error}</span>
        )}
      </span>
      {children}
    </label>
  );
}
