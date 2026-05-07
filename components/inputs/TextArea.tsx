"use client";

import { cn } from "@/lib/cn";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export default function TextArea({ hasError, className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-4 py-3 rounded-xl border text-navy text-[14.5px] bg-white",
        "placeholder:text-slate-400 resize-vertical font-sans",
        "transition-[border-color,box-shadow] duration-150",
        "hover:border-slate-400",
        hasError
          ? "border-red-400 bg-red-50/40 placeholder:text-red-300"
          : "border-slate-300",
        className,
      )}
      {...props}
    />
  );
}
