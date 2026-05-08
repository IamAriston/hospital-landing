import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import { homeConfig } from "@/config/home";

export const metadata: Metadata = {
  title: "Departments — Aastha Multi Speciality Hospital",
  description: "Explore all 22 speciality departments at Aastha Multi Speciality Hospital, Himachal Pradesh.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Departments" }]}
        title="Our Departments"
        subtitle="22 specialities under one roof — each staffed by experienced consultants with modern diagnostic support."
        compact
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {homeConfig.departments.map((dept) => (
              <Link
                key={dept.name}
                href={`/departments/${dept.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 group hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_10px_24px_-14px_rgba(13,148,136,.25)] transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center">
                  <Icon name={dept.icon as IconName} size={24} stroke={1.7} />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy font-display">{dept.name}</h3>
                <p className="mt-1 text-[13.5px] text-slate-500">{dept.desc}</p>
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
                  View Department <Icon name="arrowSmall" size={14} stroke={2.4} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <CTABanner
              title="Not Sure Which Department?"
              body="Book a General Medicine consultation and our doctors will guide you to the right specialist."
            >
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-sky-400 text-[#04293F] font-semibold font-display hover:bg-sky-500 transition-colors"
              >
                <Icon name="calendar" size={18} stroke={2} />
                Book Appointment
              </Link>
            </CTABanner>
          </div>
        </div>
      </section>
    </>
  );
}
