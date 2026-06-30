import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import DeptCard from "@/components/cards/DeptCard";
import Icon from "@/components/ui/Icon";
import { getDepartments } from "@/lib/db/departments";

export default async function Departments() {
  const departments = await getDepartments();

  if (departments.length === 0) return null;

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="left"
          title="Our Departments"
          subtitle={`${departments.length} specialities under one roof, staffed by experienced consultants and supported by modern diagnostics.`}
          action={
            <Link
              href="/departments"
              className="inline-flex items-center gap-1.5 text-teal-600 font-semibold hover:gap-3 transition-all"
            >
              View All <Icon name="arrowSmall" size={16} stroke={2.2} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {departments.slice(0, 12).map((d) => (
            <Link key={d.id} href={`/departments/${d.slug}`}>
              <DeptCard icon={d.icon} name={d.name} desc={d.description} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] border border-teal-600 text-teal-600 font-semibold text-[15px] font-display hover:bg-teal-600 hover:text-white transition-colors"
          >
            View All Departments <Icon name="arrowSmall" size={16} stroke={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
