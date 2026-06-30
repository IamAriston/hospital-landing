import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import { labPage } from "@/config/patients";

export const metadata: Metadata = {
  title: "Labs & Reports — Aastha Multi Speciality Hospital",
  description: "Sample collection, turnaround times and online report access at Aastha Hospital.",
};

export default function LabsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Patients", href: "/patients" },
          { label: "Labs & Reports" },
        ]}
        title="Labs & Reports"
        subtitle="Sample collection from 7 AM, reports delivered to your phone — often within 24 hours."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {labPage.features.map((f) => (
                <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 inline-flex items-center justify-center">
                    <Icon name={f.icon} size={20} stroke={1.8} />
                  </div>
                  <h3 className="mt-4 font-bold text-navy font-display text-[15px]">{f.title}</h3>
                  <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>

            {/* Two-column: turnaround + access reports */}
            <div className="grid lg:grid-cols-[1fr_420px] gap-6 lg:gap-8 items-start">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-navy font-display text-[17px]">Turnaround Times</h2>
                  <p className="text-[12.5px] text-slate-400 mt-0.5">Indicative — actual times depend on sample receipt.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {labPage.turnaround.map((row) => (
                    <div key={row.test} className="px-6 py-3.5 flex items-center justify-between gap-4">
                      <span className="text-[14px] text-navy font-medium">{row.test}</span>
                      <span className="text-[13px] font-semibold text-teal-600 whitespace-nowrap">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 inline-flex items-center justify-center">
                    <Icon name="user" size={20} stroke={1.8} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-sky-600 uppercase tracking-[.14em]">Online</p>
                    <h3 className="font-bold text-navy font-display text-[16px]">Access Your Reports</h3>
                  </div>
                </div>
                <p className="mt-4 text-[13.5px] text-slate-600 leading-relaxed">
                  Enter your registered phone number and the Report ID printed on your collection slip.
                  We'll email you a secure link.
                </p>

                <form className="mt-5 flex flex-col gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Phone number</label>
                    <input
                      type="tel"
                      placeholder="+91 98xxx xxxxx"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Report ID</label>
                    <input
                      type="text"
                      placeholder="e.g. AST-2026-04-123456"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px]"
                  >
                    <Icon name="arrowSmall" size={16} stroke={2.4} />
                    Send report link
                  </button>
                </form>

                <p className="mt-4 text-[12px] text-slate-400 leading-relaxed">
                  Can't find your Report ID? Email <span className="font-semibold text-navy">care@Aasthahospital.in</span> with your name and visit date.
                </p>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-10 bg-navy rounded-2xl p-7 sm:p-9 grid sm:grid-cols-[1fr_auto] gap-5 items-center">
              <div>
                <h3 className="text-xl font-extrabold text-white font-display">Need a lab test?</h3>
                <p className="mt-1.5 text-slate-400 text-[14.5px]">
                  Book online for home collection or walk in any time between 7 AM and 8 PM, Mon to Sat.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
                >
                  <Icon name="calendar" size={16} stroke={2} />
                  Book home collection
                </Link>
                <Link
                  href="/services/diagnostics"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-white/10 text-white font-semibold font-display hover:bg-white/20 transition-colors text-[14px]"
                >
                  About diagnostics
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
