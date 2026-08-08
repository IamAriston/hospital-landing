"use client";

import * as React from "react";
import Icon from "@/components/ui/Icon";
import { lookupLabReport, type LabLookupResult } from "@/lib/actions/lookup";

const inputCls =
  "w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500";

const STATUS_META: Record<
  LabLookupResult["status"],
  { label: string; cls: string; note: string }
> = {
  processing: {
    label: "Processing",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    note: "Your sample is being processed. We'll notify you when it's ready.",
  },
  ready: {
    label: "Ready",
    cls: "bg-teal-50 text-teal-700 border-teal-200",
    note: "Your report is ready to download.",
  },
  collected: {
    label: "Collected",
    cls: "bg-slate-100 text-slate-600 border-slate-200",
    note: "This report has already been collected.",
  },
};

export function LabLookupForm() {
  const [pending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<LabLookupResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const report_id = String(form.get("report_id") ?? "");
    const phone = String(form.get("phone") ?? "");
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await lookupLabReport({ report_id, phone });
      if (res.ok) setResult(res.data);
      else setError(res.error);
    });
  }

  if (result) {
    const meta = STATUS_META[result.status];
    return (
      <div className="mt-5">
        <div className="rounded-[12px] border border-slate-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[.12em]">
                {result.report_id}
              </p>
              <p className="text-[15px] font-bold text-navy mt-0.5">{result.test_name}</p>
              <p className="text-[12.5px] text-slate-500">{result.patient_name}</p>
            </div>
            <span
              className={`shrink-0 text-[12px] font-semibold px-2.5 py-1 rounded-full border ${meta.cls}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-3 text-[13px] text-slate-600 leading-relaxed">{meta.note}</p>
          {result.status === "ready" && result.file_url && (
            <a
              href={result.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-teal-600 text-white font-semibold text-[13.5px] hover:bg-teal-700 transition-colors"
            >
              <Icon name="arrowSmall" size={15} stroke={2.4} />
              Download report
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-3 text-[13px] font-semibold text-teal-600 hover:underline"
        >
          Look up another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3" noValidate>
      <div>
        <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
          Phone number
        </label>
        <input name="phone" type="tel" placeholder="+91 98xxx xxxxx" className={inputCls} />
      </div>
      <div>
        <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
          Report ID
        </label>
        <input
          name="report_id"
          type="text"
          placeholder="e.g. AST-2026-04-123456"
          className={inputCls}
        />
      </div>

      {error && (
        <p role="alert" className="text-[13px] font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px] disabled:opacity-60"
      >
        <Icon name="arrowSmall" size={16} stroke={2.4} />
        {pending ? "Checking…" : "Check report status"}
      </button>
    </form>
  );
}
