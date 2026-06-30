"use client";

import * as React from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/types/database";

type AnyAction<TArgs extends unknown[], TData> = (
  ...args: TArgs
) => Promise<ActionResult<TData>>;

type Options<TData> = {
  /** Toast text on success. Set to `false` to suppress. */
  successMessage?: string | false;
  /** Toast text prefix on error (the server error is appended). */
  errorMessage?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: string, fieldErrors?: Record<string, string[]>) => void;
};

/**
 * Wraps a Next.js server action with pending state + sonner toasts.
 *
 * Usage:
 *   const { run, pending } = useServerAction(deleteDoctor, {
 *     successMessage: "Doctor deleted",
 *     onSuccess: () => setOpen(false),
 *   });
 *   <button onClick={() => run(doctor.id)} disabled={pending}>Delete</button>
 */
export function useServerAction<TArgs extends unknown[], TData>(
  action: AnyAction<TArgs, TData>,
  options: Options<TData> = {},
) {
  const {
    successMessage,
    errorMessage = "Something went wrong",
    onSuccess,
    onError,
  } = options;

  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const run = React.useCallback(
    (...args: TArgs): Promise<ActionResult<TData> | undefined> => {
      return new Promise((resolve) => {
        setError(null);
        setFieldErrors({});
        startTransition(async () => {
          const result = await action(...args);
          if (result.ok) {
            if (successMessage !== false) toast.success(successMessage ?? "Saved");
            onSuccess?.(result.data);
          } else {
            setError(result.error);
            setFieldErrors(result.fieldErrors ?? {});
            toast.error(`${errorMessage}: ${result.error}`);
            onError?.(result.error, result.fieldErrors);
          }
          resolve(result);
        });
      });
    },
    [action, successMessage, errorMessage, onSuccess, onError],
  );

  return { run, pending, error, fieldErrors };
}
