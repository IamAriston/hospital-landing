import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import CTABanner from "@/components/ui/CTABanner";
import DoctorCard from "@/components/cards/DoctorCard";
import { getDepartmentBySlug, getDepartments } from "@/lib/db/departments";
import { getDoctors } from "@/lib/db/doctors";
import { doctorRowToCardProps } from "@/lib/doctor-adapter";
import { formatOpd } from "@/lib/schedule";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const departments = await getDepartments();
    return departments.map((d) => ({ slug: d.slug }));
  } catch {
    // DB not reachable at build time — fall back to fully dynamic rendering.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) return { title: "Department — Aastha Multi Speciality Hospital" };
  return {
    title: `${dept.name} — Aastha Multi Speciality Hospital`,
    description: `${dept.name} at Aastha Hospital: ${dept.description}. Meet our specialists and book a consultation.`,
  };
}

const DETAIL_SECTIONS = [
  { key: "conditions" as const, title: "Conditions we treat", icon: "stethoscope" as IconName },
  { key: "procedures" as const, title: "Procedures & treatments", icon: "activity" as IconName },
  { key: "equipment" as const, title: "Equipment & facilities", icon: "building" as IconName },
];

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);
  if (!dept) notFound();

  const doctors = await getDoctors({ departmentId: dept.id });
  const detail = dept.department_details;
  const opdLabel = detail?.opd_schedule
    ? formatOpd(detail.opd_schedule)
    : "Mon to Sat — 8 AM to 8 PM";

  const hasDetailSections =
    detail &&
    (detail.conditions.length > 0 ||
      detail.procedures.length > 0 ||
      detail.equipment.length > 0);

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Departments", href: "/departments" },
          { label: dept.name },
        ]}
        title={dept.name}
        subtitle={dept.description}
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-10">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 inline-flex items-center justify-center">
                    <Icon name={dept.icon as IconName} size={28} stroke={1.7} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em]">
                      Department
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-navy font-display">
                      {dept.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-5 text-[15px] text-slate-600 leading-relaxed">
                  The {dept.name} department at Aastha Multi Speciality Hospital combines
                  experienced consultants with modern diagnostic and treatment facilities.{" "}
                  {dept.description}. We follow standard-of-care protocols and keep families
                  informed at every step.
                </p>

                {detail?.when_to_visit && (
                  <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-5">
                    <div className="flex items-center gap-2 text-amber-700">
                      <Icon name="badge" size={16} stroke={2} />
                      <span className="text-[11px] font-bold uppercase tracking-[.14em]">
                        When to visit
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] text-slate-700 leading-relaxed">
                      {detail.when_to_visit}.
                    </p>
                  </div>
                )}
              </div>

              <aside className="flex flex-col gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[15px] mb-3">OPD Timings</h3>
                  <p className="text-[14px] text-navy font-semibold leading-snug">{opdLabel}</p>
                  <p className="mt-1 text-[13px] text-slate-500">
                    Walk-ins welcome · Booking recommended
                  </p>
                  <Link
                    href="/#book"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
                  >
                    <Icon name="calendar" size={16} stroke={2} />
                    Book Consultation
                  </Link>
                </div>

                <div className="bg-navy text-white rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="siren" size={16} stroke={2} className="text-red-300" />
                    <span className="text-[11px] font-bold text-red-300 uppercase tracking-[.14em]">
                      Emergency
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-300 leading-relaxed">
                    Need urgent care? Our 24/7 emergency team responds in minutes.
                  </p>
                  <a
                    href="tel:1066"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] bg-red-500 text-white font-semibold font-display hover:bg-red-600 transition-colors text-[14px]"
                  >
                    <Icon name="phone" size={16} stroke={2.2} />
                    Call 1066
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {hasDetailSections && detail && (
          <section className="pb-14 sm:pb-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {DETAIL_SECTIONS.map((section) => {
                  const items = detail[section.key];
                  if (items.length === 0) return null;
                  return (
                    <div
                      key={section.key}
                      className="bg-white border border-slate-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 inline-flex items-center justify-center">
                          <Icon name={section.icon} size={18} stroke={1.8} />
                        </span>
                        <h3 className="font-bold text-navy font-display text-[15px]">
                          {section.title}
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon name="check" size={11} stroke={2.8} />
                            </span>
                            <span className="text-[13.5px] text-slate-700 leading-snug">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="pb-14 sm:pb-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
              <div>
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em] mb-2">
                  Our Specialists
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy font-display">
                  Meet the {dept.name} team
                </h2>
              </div>
              <Link
                href="/doctors"
                className="text-teal-600 font-semibold text-[14px] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
              >
                View all doctors <Icon name="arrowSmall" size={14} stroke={2.4} />
              </Link>
            </div>

            {doctors.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => {
                  const card = doctorRowToCardProps(doc, dept.name);
                  return <DoctorCard key={doc.id} {...card} />;
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 inline-flex items-center justify-center">
                  <Icon name="user" size={22} stroke={1.8} />
                </div>
                <p className="mt-4 text-[15px] text-slate-600">
                  Specialist profiles for {dept.name} are coming soon. Book an appointment and our
                  coordinators will match you with the right consultant for your condition.
                </p>
                <Link
                  href="/#book"
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px]"
                >
                  <Icon name="calendar" size={15} stroke={2} />
                  Book Appointment
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <CTABanner
              title={`Book a ${dept.name} consultation`}
              body="Choose your preferred doctor and slot — confirmation arrives within 30 minutes during OPD hours."
            >
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-sky-400 text-sky-ink font-semibold font-display hover:bg-sky-500 transition-colors"
              >
                <Icon name="calendar" size={18} stroke={2} />
                Book Appointment
              </Link>
              <Link
                href="/departments"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-white/10 text-white font-semibold font-display hover:bg-white/20 transition-colors"
              >
                All departments
              </Link>
            </CTABanner>
          </div>
        </section>
      </div>
    </>
  );
}
