"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const hideTimer = setTimeout(() => setVisible(false), 1150);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-white"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 450ms ease",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-teal-600 to-sky-400 flex items-center justify-center text-white font-bold text-3xl font-display shadow-lg shadow-teal-200">
          A
        </div>
        <div className="text-center">
          <div className="text-navy font-bold text-xl font-display tracking-tight">
            Aastha
          </div>
          <div className="text-slate-500 text-[11px] font-medium uppercase tracking-widest mt-0.5">
            Multi Speciality Hospital
          </div>
        </div>
        <div className="flex gap-1.5 mt-1">
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
          <div className="preloader-dot w-2 h-2 rounded-full bg-teal-600" />
        </div>
      </div>
    </div>
  );
}
