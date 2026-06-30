import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import { homeConfig } from "@/config/home";
import { serviceAccentHero, serviceAccentIcon, serviceDetails } from "@/config/services";

export function generateStaticParams() {
  return homeConfig.features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = homeConfig.features.find((f) => f.slug === slug);
  if (!svc) return { title: "Service — Aastha Multi Speciality Hospital" };
  return {
    title: `${svc.name} — Aastha Multi Speciality Hospital`,
    description: `${svc.name} at Aastha Hospital: ${svc.desc}`,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = homeConfig.features.find((f) => f.slug === slug);
  if (!svc) notFound();

  const details = serviceDetails[svc.slug];
  const hero = serviceAccentHero[svc.accent] ?? serviceAccentHero.teal;
  const iconAccent = serviceAccentIcon[svc.accent] ?? serviceAccentIcon.teal;
  const isEmergency = svc.slug === "emergency";

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: svc.name },
        ]}
        title={svc.name}
        subtitle={svc.desc}
        compact
      />

      <div className="bg-cream">
        {/* Accent hero card */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className={`${hero.bg} rounded-2xl p-8 sm:p-10 grid sm:grid-cols-[auto_1fr] gap-6 items-center`}>
              <div className={`w-20 h-20 rounded-2xl ${hero.iconBg} inline-flex items-center justify-center`}>
                <Icon name={svc.icon as IconName} size={40} stroke={1.7} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-[.14em]">Service</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white font-display">{svc.name}</h2>
                {details && (
                  <p className="mt-2 text-white/80 text-[14.5px] flex items-center gap-2">
                    <Icon name="clock" size={15} stroke={2} />
                    {details.hours}
                  </p>
                )}
              </div>
            </div>

            {/* What's included + process */}
            <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9">
                <h3 className="font-bold text-navy font-display text-[18px]">What's included</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {(details?.included ?? []).map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center shrink-0 ${iconAccent}`}>
                        <Icon name="check" size={14} stroke={2.6} />
                      </span>
                      <span className="text-[14.5px] text-slate-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {details && (
                  <div className="mt-8 pt-7 border-t border-slate-100">
                    <h3 className="font-bold text-navy font-display text-[18px]">How it works</h3>
                    <div className="mt-5 grid sm:grid-cols-3 gap-4">
                      {details.process.map((step, i) => (
                        <div key={step.title} className="bg-slate-50 rounded-xl p-4">
                          <div className="w-7 h-7 rounded-full bg-white text-navy font-display font-extrabold text-[13px] inline-flex items-center justify-center border border-slate-200">
                            {i + 1}
                          </div>
                          <h4 className="mt-3 font-bold text-navy font-display text-[14.5px]">{step.title}</h4>
                          <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">{step.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="flex flex-col gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[15px] mb-3">Get started</h3>
                  <p className="text-[13.5px] text-slate-600 leading-relaxed mb-4">
                    {isEmergency
                      ? "If this is a medical emergency, call now. Every minute matters."
                      : `Book a slot for ${svc.name.toLowerCase()} or call us with your query.`}
                  </p>
                  {isEmergency ? (
                    <a
                      href="tel:1066"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-red-600 text-white font-semibold font-display hover:bg-red-700 transition-colors text-[14px]"
                    >
                      <Icon name="phone" size={16} stroke={2.2} />
                      Call 1066
                    </a>
                  ) : (
                    <Link
                      href="/#book"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
                    >
                      <Icon name="calendar" size={16} stroke={2} />
                      {svc.cta}
                    </Link>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[15px] mb-3">Other services</h3>
                  <ul className="flex flex-col gap-2">
                    {homeConfig.features
                      .filter((f) => f.slug !== svc.slug)
                      .map((f) => (
                        <li key={f.slug}>
                          <Link
                            href={`/services/${f.slug}`}
                            className="flex items-center gap-2.5 text-[13.5px] text-slate-700 hover:text-teal-600 transition-colors"
                          >
                            <Icon name={f.icon as IconName} size={15} stroke={1.8} />
                            {f.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            {isEmergency ? (
              <div className="bg-red-600 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon name="siren" size={20} stroke={2} className="text-red-200" />
                    <span className="text-[11px] font-bold text-red-200 uppercase tracking-[.14em]">24/7 Emergency</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">Medical Emergency? Call Now</h3>
                  <p className="mt-1.5 text-red-100 text-[15px]">
                    Our trauma-ready emergency team responds round the clock — by ambulance, at your side.
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
            ) : (
              <CTABanner
                title={`Need help with ${svc.name.toLowerCase()}?`}
                body="Book online and our coordinators will be in touch within 30 minutes during OPD hours."
              >
                <Link
                  href="/#book"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors"
                >
                  <Icon name="calendar" size={18} stroke={2} />
                  {svc.cta}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white/10 text-white font-semibold font-display hover:bg-white/20 transition-colors"
                >
                  All services
                </Link>
              </CTABanner>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
