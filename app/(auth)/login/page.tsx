"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }
    // Full reload so middleware picks up the new session cookie.
    window.location.href = next.startsWith("/") ? next : "/dashboard";
  }

  return (
    <div className="grid grid-cols-[1.05fr_1fr] min-h-screen font-sans">
      {/* ── LEFT: brand panel ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col relative bg-[linear-gradient(160deg,#0C2340_0%,#13315C_55%,#0F766E_100%)] text-white overflow-hidden px-14 py-10">
        {/* Ambient glow orbs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,.22)_0%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[100px] -left-[60px] w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,.18)_0%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-[40%] left-[30%] w-[180px] h-[180px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,.12)_0%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Topo lines */}
        <svg
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g stroke="#5EEAD4" fill="none" strokeWidth="1">
            {[80, 130, 180, 230, 280, 330, 380, 430, 480].map((y) => (
              <path
                key={y}
                d={`M -50 ${y} Q 150 ${y - 50} 320 ${y + 20} T 700 ${y}`}
              />
            ))}
          </g>
        </svg>

        {/* Mountain silhouette */}
        <svg
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          viewBox="0 0 800 220"
          preserveAspectRatio="none"
          aria-hidden="true"
          height="220"
        >
          <path
            d="M0 180 L120 80 L210 130 L320 50 L420 110 L540 40 L660 110 L760 70 L800 100 L800 220 L0 220 Z"
            fill="#0D9488"
            opacity="0.4"
          />
          <path
            d="M0 200 L100 140 L200 170 L300 110 L420 160 L520 100 L650 160 L760 120 L800 140 L800 220 L0 220 Z"
            fill="#38BDF8"
            opacity="0.25"
          />
          <circle cx="540" cy="40" r="10" fill="#FFFFFF" opacity="0.4" />
        </svg>

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-[2]">
          <div className="w-11 h-11 rounded-[11px] bg-[linear-gradient(135deg,#38BDF8,#14B8A6)] flex items-center justify-center text-white font-display font-extrabold text-[21px] shadow-[inset_0_-2px_0_rgba(0,0,0,.15)]">
            A
          </div>
          <div>
            <div className="font-display font-extrabold text-[22px] text-white leading-[1.05]">
              Aastha
            </div>
            <div className="text-[11px] text-[#7DD3FC] uppercase tracking-[.14em] mt-0.5">
              Multi Speciality Hospital
            </div>
          </div>
        </div>

        {/* Body copy */}
        <div className="mt-auto mb-8 relative z-[2] max-w-[520px]">
          <div className="inline-flex items-center gap-[7px] bg-[rgba(56,189,248,.14)] border border-[rgba(56,189,248,.3)] text-[#7DD3FC] px-3 py-[6px] rounded-full text-[12px] font-semibold tracking-[.02em]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 20 6-9 4 5 3-4 5 8z" />
              <circle cx="17" cy="6" r="1.5" />
            </svg>
            Staff Portal · v2.4
          </div>

          <h1 className="text-[42px] leading-[1.12] text-white font-extrabold mt-[18px] font-display">
            Care that runs
            <br />
            on <em className="text-[#5EEAD4] not-italic">clarity</em>.
          </h1>
          <p className="text-[16px] text-[#BAE6FD] mt-[14px] leading-[1.6]">
            One place to manage appointments, OPD schedules, patient records and
            doctor rosters — built for the people who keep Astha running every
            day.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-[14px] mt-[30px]">
            {[
              { num: "128", lab: "Appts Today" },
              { num: "22", lab: "Departments" },
              { num: "45", lab: "Doctors On" },
            ].map((s) => (
              <div
                key={s.lab}
                className="bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.08)] rounded-xl px-4 py-[14px] [backdrop-filter:blur(6px)]"
              >
                <div className="text-[26px] font-extrabold text-white leading-none tracking-[-0.02em] font-display">
                  {s.num}
                </div>
                <div className="text-[11.5px] text-[#94A3B8] mt-1 uppercase tracking-[.08em]">
                  {s.lab}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="flex gap-4 items-center text-[#94A3B8] text-[13px] relative z-[2]">
          <span>© 2026 Astha Hospital</span>
          <span className="opacity-40">·</span>
          <a href="#" className="text-[#BAE6FD] no-underline">
            Help
          </a>
          <a href="#" className="text-[#BAE6FD] no-underline">
            Privacy
          </a>
          <Link href="/" className="text-[#BAE6FD] no-underline">
            ← Public site
          </Link>
        </div>
      </aside>

      {/* ── RIGHT: form panel ─────────────────────────────── */}
      <main className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px] flex flex-col">
          <Link
            href="/"
            className="inline-flex items-center gap-[6px] text-[13px] text-[#475569] no-underline mb-6 self-start transition-colors duration-[150ms] hover:text-teal-600"
          >
            <ArrowLeft size={14} />
            Back to homepage
          </Link>

          <div className="text-[12px] font-semibold text-[#0D9488] uppercase tracking-[.14em]">
            Welcome back
          </div>
          <h2 className="text-[32px] font-extrabold mt-2 text-[#0C2340] font-display tracking-[-0.015em]">
            Sign in to Aastha
          </h2>
          <p className="text-[15px] text-[#475569] mt-2">
            Use your staff credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-[7px] mt-[22px]">
              <label
                htmlFor="email"
                className="text-[13px] font-semibold text-[#0C2340]"
              >
                Email 
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reception@asthahospital.in"
                  className="w-full py-[13px] pr-[14px] pl-[44px] border border-[#E2E8F0] rounded-[10px] bg-white text-[14.5px] text-[#0C2340] transition-[border-color,box-shadow] duration-[150ms] outline-none focus:border-[#0D9488] focus:shadow-[0_0_0_3px_rgba(13,148,136,.14)]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[7px] mt-[18px]">
              <label
                htmlFor="password"
                className="text-[13px] font-semibold text-[#0C2340]"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-[13px] px-[44px] border border-[#E2E8F0] rounded-[10px] bg-white text-[14.5px] text-[#0C2340] transition-[border-color,box-shadow] duration-[150ms] outline-none focus:border-[#0D9488] focus:shadow-[0_0_0_3px_rgba(13,148,136,.14)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#94A3B8] cursor-pointer p-[6px] rounded-[6px] flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            {/* <div className="flex items-center justify-between mt-[14px] text-[13.5px]">
              <label className="inline-flex items-center gap-2 cursor-pointer text-[#0C2340] font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#0D9488]"
                />
                Remember me on this device
              </label>
              <a href="#" className="text-[#0D9488] font-semibold no-underline">
                Forgot password?
              </a>
            </div> */}

            {/* Error */}
            {error && (
              <div className="mt-[10px] px-3 py-[10px] rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[13px] flex items-center gap-2">
                <Info size={16} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "dash-btn-shimmer mt-[22px] w-full px-4 py-[14px] text-white border-none rounded-[10px] font-bold text-[15px] font-display inline-flex items-center justify-center gap-2 transition-[opacity,transform] duration-[150ms] shadow-[0_4px_16px_rgba(13,148,136,.3),inset_0_-2px_0_rgba(0,0,0,.08)] relative overflow-hidden",
                loading
                  ? "bg-[#0F766E] opacity-[0.85] cursor-not-allowed"
                  : "bg-[linear-gradient(90deg,#0F766E_0%,#0D9488_30%,#14B8A6_50%,#0D9488_70%,#0F766E_100%)] cursor-pointer",
              )}
            >
              {loading ? "Signing in…" : "Sign In to Dashboard"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
