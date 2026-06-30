import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import { siteConfig } from "@/config/site";
import { directions } from "@/config/contact";

export const metadata: Metadata = {
  title: "Contact — Aastha Multi Speciality Hospital",
  description: "Contact Aastha Multi Speciality Hospital — book an appointment, email us, or visit us in Shimla, Himachal Pradesh.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Contact Us"
        subtitle="Book your appointment online, email us, or come see us in Shimla. Emergency care available 24/7."
      />

      <div className="bg-cream">

        {/* Contact cards */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

              <Link
                href="/#book"
                className="bg-sky-50 border border-sky-200 rounded-2xl p-6 group hover:-translate-y-0.5 hover:border-sky-400 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-400 text-sky-ink flex items-center justify-center">
                  <Icon name="calendar" size={20} stroke={1.8} />
                </div>
                <h3 className="mt-4 font-bold text-navy font-display text-[16px]">Book Appointment</h3>
                <p className="mt-1 text-[13px] text-slate-500">The fastest way to reach us</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-bold text-sky-700 group-hover:gap-2.5 transition-all">
                  Start booking <Icon name="arrowSmall" size={14} stroke={2.4} />
                </span>
                <p className="mt-2 text-[12px] text-slate-400">Confirmation within 30 minutes</p>
              </Link>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Icon name="siren" size={20} stroke={1.8} />
                </div>
                <h3 className="mt-4 font-bold text-navy font-display text-[16px]">Emergency</h3>
                <p className="mt-1 text-[13px] text-slate-500">24/7 — never closed</p>
                <a href={`tel:${siteConfig.emergency}`} className="mt-2.5 block text-[22px] font-extrabold text-red-600 hover:underline font-display leading-snug">
                  {siteConfig.emergency}
                </a>
                <a href={`tel:${siteConfig.emergencyFull}`} className="block text-[13px] font-semibold text-red-400 hover:underline mt-0.5">
                  {siteConfig.emergencyFull}
                </a>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Icon name="mail" size={20} stroke={1.8} />
                </div>
                <h3 className="mt-4 font-bold text-navy font-display text-[16px]">Email</h3>
                <p className="mt-1 text-[13px] text-slate-500">Non-urgent queries</p>
                <a href={`mailto:${siteConfig.email}`} className="mt-2.5 block text-[15px] font-bold text-sky-600 hover:underline font-display leading-snug break-all">
                  {siteConfig.email}
                </a>
                <p className="mt-1.5 text-[12px] text-slate-400">Response within 24 hours</p>
              </div>
            </div>

            {/* Address + Map */}
            <div className="grid lg:grid-cols-[1fr_340px] gap-5 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Icon name="pin" size={20} stroke={1.8} />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy font-display text-[16px]">Our Location</h3>
                    <p className="mt-2 text-[15px] text-slate-700 font-semibold">{siteConfig.fullName}</p>
                    <p className="text-[14px] text-slate-500 leading-relaxed">
                      {siteConfig.address.line1}
                      <br />
                      {siteConfig.address.line2}
                    </p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl overflow-hidden border border-slate-200 h-52 bg-slate-100 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <Icon name="map" size={36} className="mx-auto mb-2 opacity-25" />
                    <p className="text-[13px]">Interactive map coming soon</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-bold text-navy font-display text-[16px] mb-5">Working Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                      <div className="font-semibold text-navy text-[14.5px]">OPD</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">Mon – Sat</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-teal-600 text-[14.5px]">8 AM – 8 PM</div>
                      <div className="text-[12px] text-slate-400 mt-0.5">Walk-ins welcome</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                      <div className="font-semibold text-navy text-[14.5px]">Emergency</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">Every day</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 text-[14.5px]">24/7/365</div>
                      <div className="text-[12px] text-slate-400 mt-0.5">Always open</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                      <div className="font-semibold text-navy text-[14.5px]">Pharmacy</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">Every day</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-teal-600 text-[14.5px]">24 hrs</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-navy text-[14.5px]">Pathology Lab</div>
                      <div className="text-[13px] text-slate-500 mt-0.5">Mon – Sat</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-teal-600 text-[14.5px]">7 AM – 8 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
              <h3 className="font-bold text-navy font-display text-[17px] mb-5">Getting Here</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {directions.map((d) => (
                  <div key={d.from} className="bg-slate-50 rounded-xl p-4">
                    <div className="font-bold text-navy text-[14px]">{d.from}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {d.distance}
                      </span>
                      <span className="text-[12.5px] text-slate-500">{d.time}</span>
                    </div>
                    <div className="mt-1.5 text-[12px] text-slate-400 flex items-center gap-1">
                      <Icon name="map" size={12} stroke={1.8} />
                      via {d.via}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100 grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Icon name="ambulance" size={18} stroke={1.8} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-navy text-[14px]">Ambulance Coverage</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">We cover Shimla, Solan, Mandi, Kullu, Kinnaur and nearby districts. Call {siteConfig.emergencyFull}.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="building" size={18} stroke={1.8} className="text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-navy text-[14px]">Parking</div>
                    <div className="text-[13px] text-slate-500 mt-0.5">Free parking for 200 vehicles on campus. Separate parking for emergency drop-offs.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Book CTA */}
        <section className="pb-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <CTABanner
              title="Ready to Book an Appointment?"
              body="Fill the form online and our team will confirm within 30 minutes during OPD hours."
            >
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[15px]"
              >
                <Icon name="calendar" size={18} stroke={2} />
                Book Appointment
              </Link>
            </CTABanner>
          </div>
        </section>

      </div>
    </>
  );
}
