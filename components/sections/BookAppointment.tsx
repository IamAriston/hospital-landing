"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import FormField from "@/components/inputs/FormField";
import TextField from "@/components/inputs/TextField";
import SelectField from "@/components/inputs/SelectField";
import DateField from "@/components/inputs/DateField";
import TextArea from "@/components/inputs/TextArea";
import TimePicker from "@/components/inputs/TimePicker";
import { homeConfig } from "@/config/home";

type FormState = {
  name: string;
  phone: string;
  dept: string;
  doctor: string;
  date: string;
  time: string;
  msg: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function BookAppointment() {
  const { booking, departments, doctors } = homeConfig;
  const deptOptions = departments.map((d) => ({ value: d.name, label: d.name }));
  const doctorOptions = doctors.map((d) => ({ value: d.name, label: d.name }));
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    dept: "",
    doctor: "",
    date: "",
    time: "",
    msg: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const update = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "10-digit phone";
    if (!form.dept) e.dept = "Pick one";
    if (!form.date) e.date = "Pick a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <section id="book" className="bg-cream py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-12 items-start">
          {/* Left */}
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

            {/* Steps */}
            <div className="flex flex-wrap items-center gap-2 mt-8">
              {booking.steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200 rounded-full">
                    <span className="w-6.5 h-6.5 rounded-full bg-teal-600 text-white inline-flex items-center justify-center text-[13px] font-bold font-display">
                      {i + 1}
                    </span>
                    <span className="text-[13.5px] font-semibold text-navy">
                      {label}
                    </span>
                  </div>
                  {i < booking.steps.length - 1 && (
                    <Icon
                      name="arrowSmall"
                      size={16}
                      stroke={2}
                      className="text-slate-400"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Call card */}
            <div className="mt-7 p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl">
              <div className="text-[12px] text-slate-500 uppercase tracking-[.12em] font-semibold">
                Or call us directly
              </div>
              <div className="flex items-center gap-2.5 mt-2">
                <Icon
                  name="headset"
                  size={22}
                  stroke={1.8}
                  className="text-teal-600"
                />
                <span className="font-display font-bold text-[24px] text-teal-600">
                  +91 98885 45809
                </span>
              </div>
              <button className="mt-3.5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-whatsapp text-white font-semibold text-sm font-display hover:bg-[#1a8c3a] transition-colors">
                <Icon name="whatsapp" size={18} stroke={1.8} />
                Book via WhatsApp
              </button>
            </div>

            {/* Photo */}
            <div className="mt-6 rounded-2xl overflow-hidden border border-[#EDE5D5] aspect-16/10">
              <Image
                src={booking.image}
                alt="Aastha Hospital building"
                width={600}
                height={375}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-[0_1px_2px_rgba(12,35,64,.04),0_4px_16px_rgba(12,35,64,.04)]">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-10 px-5">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Icon name="check" size={32} stroke={2.5} />
                </div>
                <h3 className="mt-4 text-[22px] font-extrabold text-navy font-display">
                  Appointment Requested!
                </h3>
                <p className="mt-2.5 text-slate-600 max-w-sm">
                  Thanks {form.name.split(" ")[0]} — our team will confirm via
                  WhatsApp on +91 {form.phone} within 30 minutes.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      phone: "",
                      dept: "",
                      doctor: "",
                      date: "",
                      time: "",
                      msg: "",
                    });
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-[10px] border border-teal-600 text-teal-600 font-semibold font-display hover:bg-teal-600 hover:text-white transition-colors"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold text-navy font-display">
                  Patient Details
                </h3>
                <p className="text-[13px] text-slate-500 mt-1 mb-5">
                  Fill in the basics — we'll handle the rest.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <FormField label="Department" error={errors.dept}>
                    <SelectField
                      value={form.dept}
                      onChange={(v) => update("dept", v)}
                      hasError={!!errors.dept}
                      placeholder="Choose department…"
                      options={deptOptions}
                    />
                  </FormField>
                  <FormField label="Doctor (optional)">
                    <SelectField
                      value={form.doctor}
                      onChange={(v) => update("doctor", v)}
                      placeholder="Any available doctor"
                      options={doctorOptions}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <FormField label="Preferred Date" error={errors.date}>
                    <DateField
                      value={form.date}
                      onChange={(v) => update("date", v)}
                      hasError={!!errors.date}
                    />
                  </FormField>
                  <FormField label="Time">
                    <TimePicker
                      value={form.time}
                      onChange={(v) => update("time", v)}
                    />
                  </FormField>
                </div>

                <FormField label="Message (optional)" className="mb-4">
                  <TextArea
                    placeholder="Briefly describe your symptoms or any specific request"
                    rows={3}
                    value={form.msg}
                    onChange={(e) => update("msg", e.target.value)}
                    style={{ minHeight: 78 }}
                  />
                </FormField>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-4.5 rounded-[10px] bg-sky-400 text-[#04293F] text-base font-semibold font-display hover:bg-sky-500 transition-colors"
                >
                  <Icon name="calendar" size={18} stroke={2} />
                  Book Appointment
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
