"use client";

import * as React from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploadProps {
  /** The currently stored image URL (e.g. when editing). */
  value: string | null;
  /** Clears the stored value — used by the Remove button. */
  onChange: (url: string | null) => void;
  /**
   * Lifts the picked file to the parent. The file is NOT uploaded here; the
   * form uploads it on submit. `null` means the image was removed.
   */
  onFileSelect: (file: File | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onFileSelect,
  label = "Image",
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // Local object-URL preview for a freshly picked (not-yet-uploaded) file.
  const [preview, setPreview] = React.useState<string | null>(null);

  // Revoke the object URL when it changes or the component unmounts.
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(file: File | null) {
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("File must be 5 MB or smaller.");
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      toast.error("Only JPG, PNG, WebP, or GIF.");
      return;
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onFileSelect(file);
  }

  function handleRemove() {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    onFileSelect(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const shown = preview ?? value;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-[13px] font-semibold text-dash-text">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="w-24 h-24 rounded-xl bg-dash-surface-3 border border-dash-border overflow-hidden flex items-center justify-center shrink-0">
          {shown ? (
            // Plain <img>: previews are blob: URLs (unsupported by next/image)
            // and stored images are served from our /assets route.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shown}
              alt={label}
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
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors disabled:opacity-60 self-start dark:bg-teal-900/30 dark:border-teal-800/50 dark:text-teal-300 dark:hover:bg-teal-900/50"
          >
            <Upload size={14} />
            {shown ? "Replace" : "Upload image"}
          </button>
          {shown && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors self-start"
            >
              <Trash2 size={12} /> Remove
            </button>
          )}
          <p className="text-xs text-dash-text-mute">
            JPG, PNG, or WebP. Up to 5 MB. Saved when you submit the form.
          </p>
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
