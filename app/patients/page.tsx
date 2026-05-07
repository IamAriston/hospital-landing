import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import { patientLinks, insurancePartners, prepareChecklist } from "@/config/patients";

export const metadata: Metadata = {
  title: "Patient Information — Astha Multi Speciality Hospital",
  description: "Book appointments, view OPD schedules, access lab reports, insurance info and more at Astha Hospital.",
};

export default function PatientsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Patients" }]}
        title="Patient Information"
        subtitle="Everything you need before, during, and after your visit — appointments, reports, insurance, and more."
      />

      <div className="bg-cream">

        {/* Quick links */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {patientLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-white border border-slate-200 rounded-2xl p-6 group hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_10px_24px_-14px_rgba(13,148,136,.2)] transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl inline-flex items-center justify-center ${item.color}`}>
                    <Icon name={item.icon as IconName} size={22} stroke={1.8} />
                  </div>
                  <h3 className="mt-4 text-[16px] font-bold text-navy font-display">{item.label}</h3>
                  <p className="mt-2 text-[13.5px] text-slate-500 leading-relaxed">{item.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                    {item.cta} <Icon name="arrowSmall" size={14} stroke={2.4} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em] mb-2">Cashless Facility</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy font-display mb-3">Insurance &amp; TPA Partners</h2>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
                  We have empanelled with 20+ insurance companies and government health schemes to offer cashless treatment. Visit our admission desk with your insurance card for pre-authorisation.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {insurancePartners.map((ins) => (
                    <div key={ins} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <div className="w-4 h-4 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <Icon name="check" size={10} stroke={2.8} />
                      </div>
                      <span className="text-[12.5px] text-navy font-medium leading-tight">{ins}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-slate-400 italic">
                  Don&apos;t see your insurer? Call us — we may still be able to assist with reimbursement claims.
                </p>
              </div>

              {/* Prepare + Visitor policy */}
              <div className="flex flex-col gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[16px] mb-4">What to Bring</h3>
                  <div className="flex flex-col gap-2.5">
                    {prepareChecklist.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                          <Icon name="check" size={11} stroke={2.8} />
                        </div>
                        <span className="text-[13.5px] text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[16px] mb-3">Visitor Policy</h3>
                  <div className="flex flex-col gap-2.5 text-[13.5px] text-slate-600">
                    <p>• Visiting hours: <strong className="text-navy">10 AM – 12 PM &amp; 5 PM – 7 PM</strong></p>
                    <p>• Maximum <strong className="text-navy">2 visitors</strong> per patient at any time</p>
                    <p>• ICU / NICU visitors by <strong className="text-navy">prior permission</strong> only</p>
                    <p>• Children under 12 discouraged in inpatient wards</p>
                    <p>• Masks are compulsory in ICU and operation areas</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[16px] mb-3">Patient Rights</h3>
                  <div className="flex flex-col gap-2 text-[13.5px] text-slate-600">
                    <p>• Right to transparent information on diagnosis and treatment</p>
                    <p>• Right to a second opinion from any specialist</p>
                    <p>• Right to confidentiality of medical records</p>
                    <p>• Right to a detailed itemised bill at discharge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="bg-red-600 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="siren" size={18} stroke={2} className="text-red-200" />
                  <span className="text-[11px] font-bold text-red-200 uppercase tracking-[.14em]">24/7 Emergency</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">Medical Emergency?</h3>
                <p className="mt-1.5 text-red-100 text-[15px]">
                  Our trauma-ready emergency team and ambulance fleet respond round the clock. Don&apos;t wait.
                </p>
              </div>
              <a
                href="tel:1066"
                className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-[10px] bg-white text-red-600 font-bold font-display hover:bg-red-50 transition-colors text-[16px]"
              >
                <Icon name="phone" size={20} stroke={2.2} />
                Call 1066
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
