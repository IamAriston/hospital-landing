"use client";

import * as React from "react";
import { useActionState } from "react";
import { unlockSite, type UnlockState } from "./actions";

const initialState: UnlockState = {};

export function UnlockForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(unlockSite, initialState);
  const [show, setShow] = React.useState(false);

  return (
    <form action={formAction} className="mt-7 flex flex-col gap-3" noValidate>
      <input type="hidden" name="next" value={next} />

      <label htmlFor="site-password" className="sr-only">
        Password
      </label>
      <div className="relative">
        <input
          id="site-password"
          name="password"
          type={show ? "text" : "password"}
          autoComplete="off"
          autoFocus
          placeholder="Enter password"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "site-password-error" : undefined}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-[15px] text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-slate-500 hover:bg-slate-100"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {state.error && (
        <p
          id="site-password-error"
          role="alert"
          className="text-[13px] font-medium text-red-600"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-teal-600 to-sky-500 px-5 py-3 text-[15px] font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Unlocking…" : "Enter site"}
      </button>
    </form>
  );
}
