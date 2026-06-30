"use client";

import * as React from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { upload, uploading } = useUpload({
    folder,
    onSuccess: (url) => onChange(url),
  });

  async function handleFile(file: File | null) {
    if (!file) return;
    await upload(file);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-[13px] font-semibold text-dash-text">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-24 h-24 rounded-xl bg-dash-surface-3 border border-dash-border overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <Image
              src={value}
              alt={label}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={28} className="text-dash-text-mute" />
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-60 self-start dark:bg-teal-900/30 dark:border-teal-800/50 dark:text-teal-300 dark:hover:bg-teal-900/50"
          >
            <Upload size={14} />
            {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors self-start"
            >
              <Trash2 size={12} /> Remove
            </button>
          )}
          <p className="text-xs text-dash-text-mute">JPG, PNG, or WebP. Up to 5 MB.</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
