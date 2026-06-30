import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import { siteConfig } from "@/config/site";
import { opdSchedule } from "@/config/patients";

export const metadata: Metadata = {
  title: "OPD Schedule — Aastha Multi Speciality Hospital",
  description: "Outpatient timings across all departments at Aastha Multi Speciality Hospital, Shimla.",
};

export default function OpdSchedulePage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Patients", href: "/patients" },
          { label: "OPD Schedule" },
        ]}
        title="OPD Schedule"
        subtitle="Outpatient timings for all departments. Walk-ins welcome — booking recommended for shorter waits."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            {/* Hours callout */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-teal-600">
                  <Icon name="clock" size={18} stroke={1.8} />
                  <span className="text-[11px] font-bold uppercase tracking-[.14em]">OPD Hours</span>
                </div>
                <p className="mt-2 font-bold text-navy font-display text-[17px]">{siteConfig.hours.opd.label}</p>
                <p className="mt-1 text-[13px] text-slate-500">Sunday: Emergency only</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-red-500">
                  <Icon name="siren" size={18} stroke={1.8} />
                  <span className="text-[11px] font-bold uppercase tracking-[.14em]">Emergency</span>
                </div>
                <p className="mt-2 font-bold text-navy font-display text-[17px]">{siteConfig.hours.emergency}</p>
                <p className="mt-1 text-[13px] text-slate-500">Call {siteConfig.emergency}</p>
              </div>
              <Link
                href="/#book"
                className="bg-sky-50 border border-sky-200 rounded-2xl p-5 group hover:-translate-y-0.5 hover:border-sky-400 transition-all"
              >
                <div className="flex items-center gap-2 text-sky-700">
                  <Icon name="calendar" size={18} stroke={1.8} />
                  <span className="text-[11px] font-bold uppercase tracking-[.14em]">Book Online</span>
                </div>
                <p className="mt-2 font-bold text-navy font-display text-[17px]">Reserve your slot</p>
                <span className="mt-1 text-[13px] text-sky-700 font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Book Appointment <Icon name="arrowSmall" size={13} stroke={2.4} />
                </span>
              </Link>
            </div>

            {/* Schedule table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                <h2 className="font-bold text-navy font-display text-[17px]">Department Timings</h2>
                <span className="text-[12.5px] text-slate-400 hidden sm:inline">All times are local (IST)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-[11.5px] font-bold uppercase tracking-[.12em] text-slate-500">Department</th>
                      <th className="px-6 py-3 text-[11.5px] font-bold uppercase tracking-[.12em] text-slate-500">Days</th>
                      <th className="px-6 py-3 text-[11.5px] font-bold uppercase tracking-[.12em] text-slate-500">Hours</th>
                      <th className="px-6 py-3 text-[11.5px] font-bold uppercase tracking-[.12em] text-slate-500">Consultant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opdSchedule.map((row) => (
                      <tr key={row.dept} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                        <td className="px-6 py-3.5 text-[14px] font-semibold text-navy whitespace-nowrap">{row.dept}</td>
                        <td className="px-6 py-3.5 text-[13.5px] text-slate-600 whitespace-nowrap">{row.days}</td>
                        <td className="px-6 py-3.5 text-[13.5px] text-teal-600 font-semibold whitespace-nowrap">{row.time}</td>
                        <td className="px-6 py-3.5 text-[13.5px] text-slate-500">{row.consultant}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-navy font-display text-[15px] mb-3">Walk-in or pre-booked?</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">
                  Walk-ins are welcome throughout OPD hours, but pre-booking your slot online reduces wait times
                  significantly. Confirmation arrives within 30 minutes during OPD hours.
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-navy font-display text-[15px] mb-3">Schedule changes</h3>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">
                  Doctor availability can change due to emergencies, conferences or surgeries. We'll notify you
                  the moment your slot is affected and offer a same-day rebooking.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <CTABanner
                title="Book Your Slot"
                body="Pick your department & doctor — confirmation arrives within 30 minutes during OPD hours."
              >
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors"
                >
                  <Icon name="calendar" size={18} stroke={2} />
                  Book Appointment
                </Link>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white/10 text-white font-semibold font-display hover:bg-white/20 transition-colors"
                >
                  Browse Doctors
                </Link>
              </CTABanner>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
