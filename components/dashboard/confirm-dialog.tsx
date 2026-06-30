"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  pending = false,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, pending]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !pending && onClose()}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative bg-dash-surface border border-dash-border rounded-2xl shadow-pop w-full max-w-md p-6 z-[1] text-dash-text"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          aria-label="Close"
          className="absolute top-3 right-3 p-1.5 text-dash-text-mute hover:text-dash-text rounded-md hover:bg-dash-surface-3 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div className="flex gap-4 items-start">
          {destructive && (
            <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-lg font-bold text-dash-text font-display">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-dash-text-dim mt-1.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="px-4 py-2 text-sm font-semibold text-dash-text bg-dash-surface border border-dash-border rounded-lg hover:bg-dash-surface-3 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm()}
            disabled={pending}
            className={cn(
              "px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60",
              destructive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-teal-600 hover:bg-teal-700",
            )}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
