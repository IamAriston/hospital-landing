"use client";

import * as React from "react";
import { lookupAppointments, type AppointmentLookupItem } from "@/lib/actions/lookup";

const inputCls =
  "w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500";

const STATUS_CLS: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 border-amber-200",
  contacted: "bg-sky-50 text-sky-700 border-sky-200",
  confirmed: "bg-teal-50 text-teal-700 border-teal-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Received",
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

function formatDate(iso: string | null) {
  if (!iso) return "Date to be confirmed";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PortalLookupForm() {
  const [pending, startTransition] = React.useTransition();
  const [items, setItems] = React.useState<AppointmentLookupItem[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") ?? "");
    setError(null);
    setItems(null);
    startTransition(async () => {
      const res = await lookupAppointments({ phone });
      if (res.ok) setItems(res.data);
      else setError(res.error);
    });
  }

  if (items) {
    return (
      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-[13.5px] text-slate-600 leading-relaxed">
            We couldn't find any appointments for that number. If you booked recently, please allow a
            little time, or call us for help.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((a, i) => (
              <div key={i} className="rounded-[12px] border border-slate-200 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-bold text-navy">{a.patient_name}</p>
                  <span
                    className={`shrink-0 text-[11.5px] font-semibold px-2.5 py-1 rounded-full border ${
                      STATUS_CLS[a.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {STATUS_LABEL[a.status] ?? a.status}
                  </span>
                </div>
                <p className="text-[12.5px] text-slate-500 mt-1">
                  {formatDate(a.preferred_date)}
                  {a.time_slot ? ` · ${a.time_slot}` : ""}
                </p>
                {(a.department || a.doctor) && (
                  <p className="text-[12.5px] text-slate-500">
                    {[a.doctor, a.department].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setItems(null)}
          className="mt-4 text-[13px] font-semibold text-teal-600 hover:underline"
        >
          Look up another number
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
      <div>
        <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
          Registered phone number
        </label>
        <input name="phone" type="tel" placeholder="+91 98xxx xxxxx" className={inputCls} />
      </div>

      {error && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px] disabled:opacity-60"
      >
        {pending ? "Checking…" : "Track my appointment"}
      </button>
    </form>
  );
}
