"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, CalendarDays, Clock } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  "Cardiology", "Neurology", "Orthopaedics", "Paediatrics", "Gynaecology",
  "General Medicine", "Dermatology", "Ophthalmology", "Pulmonology",
  "Nephrology", "Dental", "Pathology", "ENT", "Psychiatry",
];

const DOCTORS = [
  { dept: "Cardiology",      name: "Dr. Anjali Sharma"  },
  { dept: "Orthopaedics",    name: "Dr. Rohan Thakur"   },
  { dept: "Paediatrics",     name: "Dr. Meera Negi"     },
  { dept: "Neurology",       name: "Dr. Vikram Chauhan"  },
  { dept: "Gynaecology",     name: "Dr. Priya Verma"    },
  { dept: "General Medicine",name: "Dr. Sanjay Rana"    },
  { dept: "Dermatology",     name: "Dr. Karan Mehta"    },
  { dept: "Ophthalmology",   name: "Dr. Aarti Kapoor"   },
  { dept: "Pulmonology",     name: "Dr. Nikhil Joshi"   },
  { dept: "ENT",             name: "Dr. Ritu Bansal"    },
  { dept: "Psychiatry",      name: "Dr. Manish Gupta"   },
  { dept: "Dental",          name: "Dr. Shruti Pal"     },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
];

const schema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientId:   z.string().optional(),
  department:  z.string().min(1, "Please select a department"),
  doctor:      z.string().min(1, "Please select a doctor"),
  date:        z.string().min(1, "Please select a date"),
  time:        z.string().min(1, "Please select a time slot"),
  type:        z.enum(["In-person", "Video"], { message: "Select appointment type" }),
  reason:      z.string().min(3, "Please describe the reason for the visit"),
});

type FormData = z.infer<typeof schema>;

interface AppointmentFormProps {
  onSuccess?: (data: FormData) => void;
  onClose?: () => void;
  defaultPatientName?: string;
}

export function AppointmentForm({ onSuccess, onClose, defaultPatientName }: AppointmentFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientName: defaultPatientName ?? "",
      type: "In-person",
    },
  });

  const dept = watch("department");
  const filteredDoctors = dept
    ? DOCTORS.filter((d) => d.dept === dept)
    : DOCTORS;

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
    onSuccess?.(data);
    setTimeout(() => { onClose?.(); }, 1200);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-dash-text">Appointment booked!</p>
        <p className="text-sm text-dash-text-mute">The appointment has been scheduled successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Patient */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Patient Name"
          required
          error={errors.patientName?.message}
          startIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
          {...register("patientName")}
        />
        <FormInput
          label="Patient ID"
          placeholder="P-XXXXX (optional)"
          hint="Leave blank for new patients"
          {...register("patientId")}
        />
      </div>

      {/* Dept + Doctor */}
      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Department"
          required
          error={errors.department?.message}
          placeholder="Select department"
          value={watch("department") ?? ""}
          onValueChange={(v) => {
            setValue("department", v, { shouldValidate: true });
            setValue("doctor", "");
          }}
          options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
        />
        <FormSelect
          label="Doctor"
          required
          error={errors.doctor?.message}
          placeholder="Select doctor"
          value={watch("doctor") ?? ""}
          onValueChange={(v) => setValue("doctor", v, { shouldValidate: true })}
          options={filteredDoctors.map((d) => ({ value: d.name, label: d.name }))}
          disabled={!dept}
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Date"
          type="date"
          required
          error={errors.date?.message}
          startIcon={<CalendarDays size={15} />}
          min={new Date().toISOString().slice(0, 10)}
          {...register("date")}
        />
        <FormSelect
          label="Time Slot"
          required
          error={errors.time?.message}
          placeholder="Select time"
          value={watch("time") ?? ""}
          onValueChange={(v) => setValue("time", v, { shouldValidate: true })}
          options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
        />
      </div>

      {/* Type */}
      <div>
        <p className="text-sm font-semibold text-dash-text mb-2">
          Appointment Type <span className="text-red-500">*</span>
        </p>
        <div className="flex gap-3">
          {(["In-person", "Video"] as const).map((t) => (
            <label
              key={t}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium",
                watch("type") === t
                  ? "border-brand-teal bg-brand-teal-50 text-brand-teal"
                  : "border-dash-border bg-dash-surface text-dash-text-dim hover:border-dash-border-strong"
              )}
            >
              <input
                type="radio"
                value={t}
                className="sr-only"
                {...register("type")}
              />
              {t === "In-person" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              )}
              {t}
            </label>
          ))}
        </div>
        {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
      </div>

      {/* Reason */}
      <FormTextarea
        label="Reason / Chief Complaint"
        required
        error={errors.reason?.message}
        placeholder="Briefly describe the reason for the appointment…"
        rows={3}
        {...register("reason")}
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Booking…" : "Book Appointment"}
        </Button>
      </div>
    </form>
  );
}

/* ── Slide-in panel wrapper ─────────────────────────────────────────────── */
interface AppointmentPanelProps {
  open: boolean;
  onClose: () => void;
  defaultPatientName?: string;
}

export function AppointmentPanel({ open, onClose, defaultPatientName }: AppointmentPanelProps) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-dash-surface z-50 shadow-pop flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-dash-border">
          <div>
            <h2 className="text-[17px] font-bold text-dash-text">New Appointment</h2>
            <p className="text-xs text-dash-text-mute mt-0.5">Fill in the details to book a consultation</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-dash-border text-dash-text-mute hover:text-dash-text hover:bg-dash-surface-3 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AppointmentForm onClose={onClose} defaultPatientName={defaultPatientName} />
        </div>
      </div>
    </>
  );
}
