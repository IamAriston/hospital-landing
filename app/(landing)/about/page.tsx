import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import SectionLabel from "@/components/ui/SectionLabel";
import CheckList from "@/components/ui/CheckList";
import CTABanner from "@/components/ui/CTABanner";
import MilestoneTimeline from "@/components/ui/MilestoneTimeline";
import { homeConfig } from "@/config/home";
import { siteConfig } from "@/config/site";
import { infra, keyTechnologies, accreditations, milestones, leadership } from "@/config/about";

export const metadata: Metadata = {
  title: "About Us — Aastha Multi Speciality Hospital",
  description:
    "Learn about Aastha Multi Speciality Hospital — Himachal Pradesh's most modern hospital, built to serve the hills.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="About Aastha Hospital"
        subtitle="Himachal Pradesh's most modern multi-speciality hospital — built from the ground up to bring world-class healthcare to the hills."
      />

      <div className="bg-cream">

        {/* Mission */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <SectionLabel
                  label="Our Mission"
                  heading="World-Class Care at the Heart of the Himalayas"
                />
                <p className="mt-5 text-[16px] text-slate-600 leading-relaxed">
                  Aastha Multi Speciality Hospital was born from a simple truth:
                  the people of Himachal Pradesh deserve healthcare that
                  doesn&apos;t require a 5-hour journey to Delhi or Chandigarh.
                </p>
                <p className="mt-4 text-[16px] text-slate-600 leading-relaxed">
                  We have built a fully-equipped multi-speciality hospital —
                  120+ beds, 45+ specialist doctors, 22+ departments, 4 modular
                  OTs, and an in-house cath lab — all within Shimla.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-4">
                    <div className="text-[28px] font-extrabold text-teal-600 font-display">2026</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">Year founded — HP&apos;s newest hospital</div>
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-4">
                    <div className="text-[28px] font-extrabold text-teal-600 font-display">22+</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">Speciality departments under one roof</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-cream-border aspect-4/3 shadow-image-card">
                <Image
                  src="/assets/building-wide.png"
                  alt="Aastha Hospital exterior"
                  width={720}
                  height={540}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="mb-10">
              <SectionLabel label="Infrastructure" heading="Built to International Standards" center />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {infra.map((item) => (
                <div key={item.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center">
                  <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center">
                    <Icon name={item.icon as IconName} size={20} stroke={1.7} />
                  </div>
                  <div className="mt-3 text-[22px] font-extrabold text-navy font-display leading-none">{item.value}</div>
                  <div className="mt-1 text-[12px] text-slate-500 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-navy font-display mb-5">Key Technologies &amp; Equipment</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CheckList items={keyTechnologies} variant="sky" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="mb-10">
              <SectionLabel label="Our Values" heading="What Drives Us" center />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {homeConfig.whyUs.points.map((pt) => (
                <div key={pt.title} className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center">
                    <Icon name={pt.icon as IconName} size={22} stroke={1.7} />
                  </div>
                  <h3 className="mt-4 font-bold text-navy font-display text-[16px]">{pt.title}</h3>
                  <p className="mt-2 text-[13.5px] text-slate-500 leading-relaxed">{pt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Accreditations + Milestones */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">

              <div>
                <SectionLabel label="Certifications" heading="Accreditations &amp; Standards" />
                <div className="flex flex-col gap-4 mt-6">
                  {accreditations.map((acc) => (
                    <div key={acc.title} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
                      <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="badge" size={18} stroke={1.8} />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-[15px]">{acc.title}</h4>
                        <p className="mt-1 text-[13.5px] text-slate-500 leading-relaxed">{acc.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <SectionLabel label="Our Journey" heading="Milestones" />
                <div className="mt-6">
                  <MilestoneTimeline items={milestones} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="mb-10">
              <SectionLabel label="Leadership" heading="Our Leadership Team" center />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {leadership.map((person) => (
                <div key={person.name} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full inline-flex items-center justify-center text-2xl font-extrabold font-display text-navy mx-auto ${person.tone}`}
                  >
                    {person.initial}
                  </div>
                  <h3 className="mt-3 font-bold text-navy font-display text-[15px]">{person.name}</h3>
                  <p className="text-[13px] text-slate-500 mt-0.5">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 border-t border-[#E7DFCF]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <CTABanner
              title="Visit Aastha Hospital"
              body={`${siteConfig.address.line1}, ${siteConfig.address.line2}`}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] border border-white/20 text-white font-semibold font-display hover:bg-white/10 transition-colors text-[14px]"
              >
                <Icon name="map" size={16} stroke={2} />
                Directions
              </Link>
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
              >
                <Icon name="calendar" size={16} stroke={2} />
                Book Appointment
              </Link>
            </CTABanner>
          </div>
        </section>

      </div>
    </>
  );
}
