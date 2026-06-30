"use client";

import { DepartmentForm } from "./department-form";
import type { DepartmentWithDetails } from "@/types/database";

interface DepartmentPanelProps {
  open: boolean;
  onClose: () => void;
  department?: DepartmentWithDetails | null;
}

export function DepartmentPanel({ open, onClose, department }: DepartmentPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[640px] bg-dash-surface border-l border-dash-border z-50 shadow-pop flex flex-col overflow-hidden text-dash-text">
        <DepartmentForm department={department} onClose={onClose} />
      </div>
    </>
  );
}
