import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import { insurancePage, insurancePartners, prepareChecklist } from "@/config/patients";

export const metadata: Metadata = {
  title: "Insurance & TPA — Aastha Multi Speciality Hospital",
  description: "Cashless treatment with 20+ insurance partners and government schemes at Aastha Hospital.",
};

export default function InsurancePage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Patients", href: "/patients" },
          { label: "Insurance / TPA" },
        ]}
        title="Insurance & TPA Partners"
        subtitle="Cashless treatment with 20+ insurance companies and major government health schemes."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            {/* Hero band */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 grid sm:grid-cols-[auto_1fr_auto] items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 inline-flex items-center justify-center border border-amber-200">
                <Icon name="shield" size={26} stroke={1.7} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-[.14em]">Cashless Facility</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-navy font-display">
                  Pay nothing at admission with cashless approval
                </h2>
                <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">
                  Visit our admissions desk with your insurance card and ID — we'll handle the paperwork with your insurer.
                </p>
              </div>
              <Link
                href="/#book"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-amber-500 text-white font-semibold font-display hover:bg-amber-600 transition-colors text-[14px]"
              >
                <Icon name="calendar" size={15} stroke={2} />
                Book Appointment
              </Link>
            </div>

            {/* Cashless steps */}
            <div className="mt-12">
              <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em]">How cashless works</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy font-display">
                Four simple steps from arrival to discharge
              </h2>
              <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {insurancePage.cashlessSteps.map((step, i) => (
                  <div key={step.title} className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center font-extrabold font-display text-[14px]">
                      {i + 1}
                    </div>
                    <h3 className="mt-4 font-bold text-navy font-display text-[15px]">{step.title}</h3>
                    <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partners + checklist */}
            <div className="mt-14 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 items-start">
              <div>
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em]">Empanelled Partners</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-navy font-display">
                  Insurance & TPA we accept
                </h2>
                <p className="mt-2 text-[14.5px] text-slate-600 leading-relaxed">
                  20+ insurers including government schemes. Don't see your insurer? Call us — we may still be able to assist with reimbursement claims.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-2.5">
                  {insurancePartners.map((ins) => (
                    <div key={ins} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                        <Icon name="check" size={11} stroke={2.8} />
                      </div>
                      <span className="text-[13px] text-navy font-medium">{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7">
                <h3 className="font-bold text-navy font-display text-[16px] mb-4">What to bring</h3>
                <div className="flex flex-col gap-3">
                  {prepareChecklist.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="check" size={11} stroke={2.8} />
                      </div>
                      <span className="text-[13.5px] text-slate-700 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <h4 className="font-bold text-navy font-display text-[14px] mb-2">Reimbursement claims</h4>
                  <p className="text-[12.5px] text-slate-500 leading-relaxed">
                    If your insurer is not empanelled, we provide complete documentation — itemised bills, discharge summary,
                    investigation reports — for self-claim within 3 working days of discharge.
                  </p>
                </div>
              </aside>
            </div>

            {/* CTA */}
            <div className="mt-14">
              <CTABanner
                title="Questions about your coverage?"
                body="Book an appointment and mention your insurer — our insurance desk can pre-verify your cover before you arrive."
              >
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors"
                >
                  <Icon name="calendar" size={18} stroke={2} />
                  Book Appointment
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white/10 text-white font-semibold font-display hover:bg-white/20 transition-colors"
                >
                  Contact us
                </Link>
              </CTABanner>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
