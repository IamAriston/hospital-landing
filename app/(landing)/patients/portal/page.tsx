import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import { portalPage } from "@/config/patients";

export const metadata: Metadata = {
  title: "Patient Portal — Aastha Multi Speciality Hospital",
  description: "Manage appointments, records and prescriptions through the Aastha patient portal.",
};

export default function PortalPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Patients", href: "/patients" },
          { label: "Patient Portal" },
        ]}
        title="Patient Portal"
        subtitle="One secure place for your appointments, reports and prescriptions — for you and your family."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-[420px_1fr] gap-6 lg:gap-10 items-start">
              {/* Login card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 lg:sticky lg:top-24">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 inline-flex items-center justify-center">
                    <Icon name="user" size={22} stroke={1.8} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-sky-600 uppercase tracking-[.14em]">Sign in</p>
                    <h3 className="font-extrabold text-navy font-display text-[18px]">Welcome back</h3>
                  </div>
                </div>

                <form className="mt-6 flex flex-col gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Phone or Email</label>
                    <input
                      type="text"
                      placeholder="+91 98xxx xxxxx"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px]"
                  >
                    Sign in
                  </button>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <button type="button" className="text-teal-600 font-semibold hover:underline">Forgot password?</button>
                    <button type="button" className="text-slate-500 hover:text-navy">New here? <span className="font-semibold text-navy">Register</span></button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100 bg-amber-50 -mx-7 -mb-7 sm:-mx-8 sm:-mb-8 px-7 sm:px-8 py-4 rounded-b-2xl">
                  <p className="text-[12.5px] text-amber-800 leading-relaxed">
                    <strong className="font-bold">Heads-up:</strong> The patient portal is launching soon. Sign-in here
                    is a preview. For now, please book an appointment online to access your records.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy font-display">What you can do here</h2>
                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed max-w-2xl">
                  The portal puts your full healthcare picture in your pocket. Built for patients, family
                  caregivers, and visiting doctors who need quick access to your records.
                </p>

                <div className="mt-7 grid sm:grid-cols-2 gap-5">
                  {portalPage.features.map((f) => (
                    <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 text-navy inline-flex items-center justify-center">
                        <Icon name={f.icon} size={20} stroke={1.8} />
                      </div>
                      <h3 className="mt-4 font-bold text-navy font-display text-[15px]">{f.title}</h3>
                      <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">{f.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 bg-navy rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold text-white font-display">Need help right now?</h3>
                    <p className="mt-1.5 text-slate-400 text-[14px]">
                      Book an appointment online — our coordinators will help with records, appointments and reports.
                    </p>
                  </div>
                  <Link
                    href="/#book"
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
                  >
                    <Icon name="calendar" size={15} stroke={2} />
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
