"use client";

import { cn } from "@/lib/cn";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  prefix?: string;
}

export default function TextField({ hasError, prefix, className, ...props }: TextFieldProps) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[13.5px] font-medium pointer-events-none select-none border-r border-slate-200 pr-2.5">
          {prefix}
        </span>
      )}
      <input
        className={cn(
          "w-full h-11 px-4 rounded-xl border text-navy text-[14.5px] bg-white",
          "placeholder:text-slate-400 font-sans",
          "transition-[border-color,box-shadow] duration-150",
          "hover:border-slate-400",
          hasError
            ? "border-red-400 bg-red-50/40 placeholder:text-red-300"
            : "border-slate-300",
          prefix && "pl-[58px]",
          className,
        )}
        {...props}
      />
    </div>
  );
}
