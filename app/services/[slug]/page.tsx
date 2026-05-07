import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CheckList from "@/components/ui/CheckList";
import CTABanner from "@/components/ui/CTABanner";
import { homeConfig } from "@/config/home";
import { serviceAccentHero } from "@/config/services";

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
  if (!svc) return {};
  return {
    title: `${svc.name} — Astha Multi Speciality Hospital`,
    description: svc.desc,
  };
}

const SERVICE_HIGHLIGHTS = [
  "Available 24/7",
  "Modern equipment",
  "Trained specialists",
  "Affordable pricing",
];

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = homeConfig.features.find((f) => f.slug === slug);
  if (!svc) notFound();

  const accent = serviceAccentHero[svc.accent] ?? serviceAccentHero.teal;

  return (
    <>
      <div className={`${accent.bg} py-14 sm:py-20`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: svc.name },
            ]}
          />
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${accent.iconBg} flex items-center justify-center shrink-0`}>
              <Icon name={svc.icon as IconName} size={30} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-[36px] sm:text-[46px] font-extrabold text-white font-display leading-tight">
                {svc.name}
              </h1>
              <p className="text-white/70 text-[16px] mt-1">{svc.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-cream py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col gap-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-7">
            <h2 className="text-xl font-extrabold text-navy font-display mb-4">About This Service</h2>
            <p className="text-[15px] text-slate-600 leading-relaxed mb-6">
              {svc.desc} Astha Multi Speciality Hospital provides this service
              round the clock with trained professionals and modern equipment to
              ensure the best care for patients across Himachal Pradesh.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <CheckList items={SERVICE_HIGHLIGHTS} variant="teal" />
            </div>
          </div>

          <CTABanner
            title={`Need ${svc.name}?`}
            body="Book an appointment or call us — our team is ready to help."
          >
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] border border-white/20 text-white font-semibold font-display hover:bg-white/10 transition-colors"
            >
              <Icon name="phone" size={16} stroke={2} />
              Call Us
            </a>
            <Link
              href="/#book"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-sky-400 text-[#04293F] font-semibold font-display hover:bg-sky-500 transition-colors"
            >
              <Icon name="calendar" size={16} stroke={2} />
              Book
            </Link>
          </CTABanner>

        </div>
      </section>
    </>
  );
}
