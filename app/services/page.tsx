import type { Metadata } from "next";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import { homeConfig } from "@/config/home";
import { serviceAccentIcon } from "@/config/services";

export const metadata: Metadata = {
  title: "Services — Astha Multi Speciality Hospital",
  description: "Comprehensive healthcare services at Astha Hospital: emergency, OPD, diagnostics, pharmacy, blood bank and homecare.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title="Our Services"
        subtitle="Comprehensive healthcare designed for the people of Himachal Pradesh — from emergencies to routine care."
        compact
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeConfig.features.map((svc) => {
              const accentClass = serviceAccentIcon[svc.accent] ?? serviceAccentIcon.teal;
              return (
                <a
                  key={svc.name}
                  href={`/services/${svc.slug}`}
                  className="bg-white border border-slate-200 rounded-2xl p-6 group hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_10px_24px_-14px_rgba(13,148,136,.25)] transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl inline-flex items-center justify-center ${accentClass}`}>
                    <Icon name={svc.icon as IconName} size={22} stroke={1.8} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy font-display">{svc.name}</h3>
                  <p className="mt-2 text-[14px] text-slate-500 leading-relaxed">{svc.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                    {svc.cta} <Icon name="arrowSmall" size={14} stroke={2.4} />
                  </span>
                </a>
              );
            })}
          </div>

          {/* Emergency call-out */}
          <div className="mt-14 bg-red-600 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <Icon name="siren" size={20} stroke={2} className="text-red-200" />
                <span className="text-[11px] font-bold text-red-200 uppercase tracking-[.14em]">24/7 Emergency</span>
              </div>
              <h3 className="text-xl font-extrabold text-white font-display">Medical Emergency? Call Now</h3>
              <p className="mt-1.5 text-red-100 text-[15px]">Our emergency team and ambulances are on standby round the clock.</p>
            </div>
            <a
              href="tel:1066"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white text-red-600 font-bold font-display hover:bg-red-50 transition-colors text-[16px]"
            >
              <Icon name="phone" size={18} stroke={2.2} />
              Call 1066
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
