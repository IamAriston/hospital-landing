import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CheckList from "@/components/ui/CheckList";
import CTABanner from "@/components/ui/CTABanner";
import { homeConfig } from "@/config/home";
import { deptDetails } from "@/config/departments";
import { formatOpd, isAvailableToday, availabilityLabel } from "@/lib/schedule";

export function generateStaticParams() {
  return homeConfig.departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dept = homeConfig.departments.find((d) => d.slug === slug);
  if (!dept) return {};
  return {
    title: `${dept.name} — Astha Multi Speciality Hospital`,
    description: `${dept.name} at Astha Hospital, Shimla: ${dept.desc}`,
  };
}

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dept = homeConfig.departments.find((d) => d.slug === slug);
  if (!dept) notFound();

  const details = deptDetails[dept.name];
  const deptDoctors = homeConfig.doctors.filter(
    (d) => d.dept.toLowerCase() === dept.name.toLowerCase(),
  );

  return (
    <>
      {/* Hero — custom layout with icon beside title */}
      <div className="bg-navy py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Departments", href: "/departments" },
            { label: dept.name },
          ]} />
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
              <Icon name={dept.icon as IconName} size={30} stroke={1.6} />
            </div>
            <div>
              <h1 className="text-[36px] sm:text-[48px] font-extrabold text-white font-display leading-tight">
                {dept.name}
              </h1>
              <p className="text-slate-400 text-[16px] mt-2 max-w-xl leading-relaxed">
                {dept.desc}
              </p>
              {details && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/8 rounded-full px-4 py-2">
                  <Icon name="clock" size={14} stroke={2} className="text-sky-300" />
                  <span className="text-[13px] text-sky-200 font-medium">
                    OPD: {formatOpd(details.opd)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col gap-8">

            {details && (
              <>
                {/* When to visit */}
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Icon name="activity" size={18} stroke={1.8} />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy font-display text-[15px]">
                      When to Visit {dept.name}
                    </h3>
                    <p className="mt-1 text-[14px] text-slate-600 leading-relaxed">
                      {details.whenToVisit}
                    </p>
                  </div>
                </div>

                {/* Conditions + Procedures */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-navy font-display text-[16px] mb-4">Conditions We Treat</h3>
                    <CheckList items={details.conditions} variant="teal" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h3 className="font-bold text-navy font-display text-[16px] mb-4">Key Procedures &amp; Treatments</h3>
                    <CheckList items={details.procedures} variant="sky" />
                  </div>
                </div>

                {/* Equipment */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-navy font-display text-[16px] mb-4">Equipment &amp; Technology</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {details.equipment.map((eq) => (
                      <div key={eq} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3">
                        <Icon name="building" size={14} stroke={1.8} className="text-teal-600 shrink-0" />
                        <span className="text-[13.5px] text-navy font-medium">{eq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Doctors */}
            {deptDoctors.length > 0 && (
              <div>
                <h2 className="mb-5 text-xl font-extrabold text-navy font-display">
                  {dept.name} Specialists at Astha
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {deptDoctors.map((doc) => {
                    const today = isAvailableToday(doc.schedule);
                    const label = availabilityLabel(doc.schedule);
                    return (
                      <div
                        key={doc.name}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-200 hover:shadow-[0_8px_24px_-12px_rgba(12,35,64,.18)] transition-all"
                      >
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold font-display text-navy"
                          style={{ background: doc.tone }}
                        >
                          {doc.initial}
                        </div>
                        <h3 className="mt-3 text-[16px] font-bold text-navy font-display">{doc.name}</h3>
                        <p className="text-[13.5px] text-sky-600 font-semibold">{doc.spec}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-full px-3 py-1 ${today ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${today ? "bg-green-500" : "bg-slate-400"}`} />
                            {label}
                          </span>
                          <span className="text-[12.5px] text-slate-400">{doc.yrs} yrs exp</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Book CTA */}
            <CTABanner
              title={`Book a ${dept.name} Consultation`}
              body="Available Mon–Sat. Get a WhatsApp confirmation within 30 minutes of booking."
            >
              <a
                href={`tel:${homeConfig.emergency?.number ?? "+919876543210"}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] border border-white/20 text-white font-semibold font-display hover:bg-white/10 transition-colors text-[14px]"
              >
                <Icon name="phone" size={16} stroke={2} />
                Call Us
              </a>
              <Link
                href="/#book"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-sky-400 text-[#04293F] font-semibold font-display hover:bg-sky-500 transition-colors text-[14px]"
              >
                <Icon name="calendar" size={16} stroke={2} />
                Book Online
              </Link>
            </CTABanner>

            {/* Related departments */}
            <div>
              <h3 className="font-bold text-navy font-display text-[16px] mb-4">Other Departments</h3>
              <div className="flex flex-wrap gap-2.5">
                {homeConfig.departments
                  .filter((d) => d.name !== dept.name)
                  .slice(0, 8)
                  .map((d) => (
                    <Link
                      key={d.name}
                      href={`/departments/${d.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-[13px] font-medium text-navy hover:border-teal-600 hover:text-teal-600 transition-colors"
                    >
                      <Icon name={d.icon as IconName} size={13} stroke={1.8} />
                      {d.name}
                    </Link>
                  ))}
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
