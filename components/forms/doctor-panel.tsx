"use client";

import * as React from "react";
import { DoctorForm } from "./doctor-form";
import type { DepartmentRow, DoctorRow } from "@/types/database";

interface DoctorPanelProps {
  open: boolean;
  onClose: () => void;
  doctor?: DoctorRow | null;
  departments: DepartmentRow[];
  onSaved?: (doctor: DoctorRow) => void;
}

export function DoctorPanel({ open, onClose, doctor, departments, onSaved }: DoctorPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[640px] bg-dash-surface border-l border-dash-border z-50 shadow-pop flex flex-col overflow-hidden text-dash-text">
        <DoctorForm
          doctor={doctor}
          departments={departments}
          onClose={onClose}
          onSaved={onSaved}
        />
      </div>
    </>
  );
}
