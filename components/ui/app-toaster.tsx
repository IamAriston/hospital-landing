"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Site-branded sonner toaster. Maps the four toast types to the
 * teal / sky / amber / red palette used across the landing and dashboard.
 *
 * Styling is done via the global sonner CSS hooks (`[data-sonner-toast]`
 * and friends) in app/globals.css — keep tweaks there so light/dark mode
 * can read the same tokens.
 */
export function AppToaster() {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      expand
      duration={4500}
      gap={10}
      offset={20}
      visibleToasts={4}
      className="aastha-toaster"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: "aastha-toast",
          title: "aastha-toast-title",
          description: "aastha-toast-desc",
          actionButton: "aastha-toast-action",
          cancelButton: "aastha-toast-cancel",
          closeButton: "aastha-toast-close",
          icon: "aastha-toast-icon",
          success: "aastha-toast-success",
          error: "aastha-toast-error",
          info: "aastha-toast-info",
          warning: "aastha-toast-warning",
        },
      }}
    />
  );
}
