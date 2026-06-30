"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import FormField from "@/components/inputs/FormField";
import TextField from "@/components/inputs/TextField";
import SelectField from "@/components/inputs/SelectField";
import DateField from "@/components/inputs/DateField";
import TextArea from "@/components/inputs/TextArea";
import { createAppointment } from "@/lib/actions/appointments";
import { homeConfig } from "@/config/home";

type FormState = {
  name: string;
  phone: string;
  email: string;
  department_id: string;
  doctor_id: string;
  preferred_date: string;
  time_slot: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

type BookAppointmentProps = {
  departments: { id: string; name: string }[];
  doctors: { id: string; name: string; department_id: string | null }[];
};

const TIME_SLOTS = [
  { value: "Morning", label: "Morning (8 AM – 12 PM)" },
  { value: "Afternoon", label: "Afternoon (12 PM – 5 PM)" },
  { value: "Evening", label: "Evening (5 PM – 8 PM)" },
];

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  department_id: "",
  doctor_id: "",
  preferred_date: "",
  time_slot: "",
  message: "",
};

export default function BookAppointment({ departments, doctors }: BookAppointmentProps) {
  const { booking } = homeConfig;

  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const visibleDoctors = form.department_id
    ? doctors.filter((d) => d.department_id === form.department_id)
    : doctors;
  const doctorOptions = visibleDoctors.map((d) => ({ value: d.id, label: d.name }));

  const update = (k: keyof FormState, v: string) =>
    setForm((f) => {
      const next = { ...f, [k]: v };
      // Reset doctor when department changes if the doctor doesn't belong to it.
      if (k === "department_id" && f.doctor_id) {
        const stillValid = doctors.some(
          (d) => d.id === f.doctor_id && d.department_id === v,
        );
        if (!stillValid) next.doctor_id = "";
      }
      return next;
    });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "10-digit phone";
    if (!form.preferred_date) e.preferred_date = "Pick a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const result = await createAppointment({
      patient_name: form.name,
      patient_phone: form.phone,
      patient_email: form.email || undefined,
      department_id: form.department_id || null,
      doctor_id: form.doctor_id || null,
      preferred_date: form.preferred_date,
      time_slot: form.time_slot || undefined,
      message: form.message || undefined,
    });
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
      toast.success("Appointment requested — we'll be in touch.");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <section id="book" className="bg-cream py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-12 items-start">
          <div>
            <Pill variant="teal">
              <Icon name="calendar" size={13} stroke={2.2} />
              {booking.pill}
            </Pill>
            <h2 className="text-[36px] sm:text-[40px] font-extrabold text-navy font-display mt-4 leading-[1.15]">
              {booking.headline}
            </h2>
            <p className="text-[17px] text-slate-600 mt-3 leading-relaxed max-w-120">
              {booking.body}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-8">
              {booking.steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-full">
                    <span className="w-6.5 h-6.5 rounded-full bg-teal-600 text-white inline-flex items-center justify-center text-[13px] font-bold font-display">
                      {i + 1}
                    </span>
                    <span className="text-[13.5px] font-semibold text-navy">{label}</span>
                  </div>
                  {i < booking.steps.length - 1 && (
                    <Icon name="arrowSmall" size={16} stroke={2} className="text-slate-400" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-7 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl">
              <div className="text-[12px] text-slate-500 uppercase tracking-[.12em] font-semibold">
                What happens next
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {[
                  "We confirm your slot within 30 minutes during OPD hours.",
                  "Bring an ID and any prior reports to your visit.",
                  "Walk-ins welcome — booking just reduces your wait.",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="check" size={11} stroke={2.8} />
                    </span>
                    <span className="text-[13.5px] text-slate-700">{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl overflow-hidden border border-cream-border aspect-16/10">
              <Image
                src={booking.image}
                alt="Aastha Hospital building"
                width={600}
                height={375}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-card-subtle">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10 px-5">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Icon name="check" size={32} stroke={2.5} />
                </div>
                <h3 className="mt-4 text-[22px] font-extrabold text-navy font-display">
                  Appointment Requested!
                </h3>
                <p className="mt-2.5 text-slate-600 max-w-sm">
                  Thanks {form.name.split(" ")[0]} — our team will confirm your appointment
                  within 30 minutes during OPD hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm(EMPTY);
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-[10px] border border-teal-600 text-teal-600 font-semibold font-display hover:bg-teal-600 hover:text-white transition-colors"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold text-navy font-display">Patient Details</h3>
                <p className="text-[13px] text-slate-500 mt-1 mb-5">
                  Fill in the basics — we&apos;ll handle the rest.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <FormField label="Full Name" error={errors.name}>
                    <TextField
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      hasError={!!errors.name}
                    />
                  </FormField>
                  <FormField label="Phone (+91)" error={errors.phone}>
                    <TextField
                      type="tel"
                      placeholder="98885 45809"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      hasError={!!errors.phone}
                      prefix="+91"
                    />
                  </FormField>
                </div>

                <FormField label="Email (optional)" className="mb-3.5">
                  <TextField
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <FormField label="Department">
                    <SelectField
                      value={form.department_id}
                      onChange={(v) => update("department_id", v)}
                      placeholder="Choose department…"
                      options={deptOptions}
                    />
                  </FormField>
                  <FormField label="Doctor (optional)">
                    <SelectField
                      value={form.doctor_id}
                      onChange={(v) => update("doctor_id", v)}
                      placeholder="Any available doctor"
                      options={doctorOptions}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <FormField label="Preferred Date" error={errors.preferred_date}>
                    <DateField
                      value={form.preferred_date}
                      onChange={(v) => update("preferred_date", v)}
                      hasError={!!errors.preferred_date}
                    />
                  </FormField>
                  <FormField label="Preferred Time">
                    <SelectField
                      value={form.time_slot}
                      onChange={(v) => update("time_slot", v)}
                      placeholder="Pick a slot"
                      options={TIME_SLOTS}
                    />
                  </FormField>
                </div>

                <FormField label="Message (optional)" className="mb-4">
                  <TextArea
                    placeholder="Briefly describe your symptoms or any specific request"
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="min-h-[78px]"
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-4.5 rounded-[10px] bg-sky-400 text-sky-ink text-base font-semibold font-display hover:bg-sky-500 transition-colors disabled:opacity-70"
                >
                  <Icon name="calendar" size={18} stroke={2} />
                  {submitting ? "Submitting…" : "Book Appointment"}
                </button>
                <div className="flex items-center gap-1.5 justify-center mt-3.5 text-slate-500 text-[12.5px]">
                  <Icon name="shield" size={13} stroke={1.8} />
                  Your information is confidential and never shared.
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
