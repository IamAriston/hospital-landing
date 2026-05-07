import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import type { IconName } from "@/components/ui/Icon";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 border-t-[3px] border-teal-600">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10.5 h-10.5 rounded-[10px] bg-linear-to-br from-teal-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-xl font-display">
                A
              </div>
              <div>
                <div className="text-white font-extrabold text-[22px] font-display tracking-tight">
                  Astha
                </div>
                <div className="text-slate-400 text-[11px] uppercase tracking-[0.12em]">
                  Multi Speciality Hospital
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              {siteConfig.tagline} A modern multi-specialty hospital built for
              the people of Himachal Pradesh.
            </p>
            <div className="flex gap-2 mt-5">
              {(["facebook", "instagram", "whatsapp", "twitter"] as const).map((s) => (
                <a
                  key={s}
                  href={siteConfig.social[s]}
                  aria-label={s}
                  className="w-9.5 h-9.5 rounded-[10px] bg-sky-400/10 text-sky-300 inline-flex items-center justify-center hover:bg-sky-400/20 transition-colors"
                >
                  <Icon name={s} size={16} stroke={1.6} />
                </a>
              ))}
            </div>
            {/* App store buttons */}
            <div className="flex gap-2.5 mt-6">
              {[
                { icon: "apple" as const, top: "Download on", bottom: "App Store" },
                { icon: "play2" as const, top: "Get it on", bottom: "Google Play" },
              ].map(({ icon, top, bottom }) => (
                <a
                  key={bottom}
                  href="#"
                  className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] bg-white/6 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <Icon name={icon} size={icon === "apple" ? 22 : 20} stroke={1.6} />
                  <div className="flex flex-col leading-[1.05] text-left">
                    <span className="text-[9.5px] text-slate-400 uppercase tracking-[.08em]">{top}</span>
                    <span className="text-[13px] font-bold">{bottom}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <FooterColumn title="Quick Links" items={siteConfig.footerLinks.quick} />
          <FooterColumn title="Patient Services" items={siteConfig.footerLinks.patient} />

          {/* Contact */}
          <div>
            <div className="text-white text-sm font-bold uppercase tracking-[.12em] font-display">
              Contact
            </div>
            <ul className="mt-4.5 flex flex-col gap-3.5">
              <li className="flex gap-2.5">
                <Icon name="pin" size={16} stroke={1.8} className="text-sky-300 shrink-0 mt-0.5" />
                <span className="text-[13.5px] text-slate-300 leading-[1.55]">
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Icon name="phone" size={16} stroke={1.8} className="text-sky-300" />
                <a href={`tel:${siteConfig.phone}`} className="text-sm text-sky-300 font-semibold hover:text-sky-200 transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Icon name="ambulance" size={16} stroke={1.8} className="text-red-300" />
                <a href={`tel:${siteConfig.emergency}`} className="text-sm text-red-300 font-bold hover:text-red-200 transition-colors">
                  {siteConfig.emergency} (Emergency)
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Icon name="mail" size={16} stroke={1.8} className="text-sky-300" />
                <a href={`mailto:${siteConfig.email}`} className="text-[13.5px] hover:text-sky-300 transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Icon name="clock" size={16} stroke={1.8} className="text-sky-300 shrink-0 mt-0.5" />
                <span className="text-[13.5px] text-slate-300 leading-[1.55]">
                  OPD: {siteConfig.hours.opd.label}
                  <br />
                  Emergency: {siteConfig.hours.emergency}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between gap-4 text-[13px] text-slate-500">
          <div>© 2026 {siteConfig.fullName}. All rights reserved.</div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms & Conditions", "Disclaimer"].map((l) => (
              <Link key={l} href="#" className="hover:text-sky-300 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-white text-sm font-bold uppercase tracking-[.12em] font-display">
        {title}
      </div>
      <ul className="mt-4.5 flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="text-sm text-slate-300 hover:text-sky-300 transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
