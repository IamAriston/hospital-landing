import SectionHeader from "@/components/ui/SectionHeader";
import { DoctorsCarousel } from "./DoctorsCarousel";
import { getFeaturedDoctors } from "@/lib/db/doctors";
import { getDepartments } from "@/lib/db/departments";
import { doctorRowToCardProps } from "@/lib/doctor-adapter";

export default async function DoctorsSection() {
  const [doctors, departments] = await Promise.all([
    getFeaturedDoctors(8),
    getDepartments(),
  ]);
  const deptById = new Map(departments.map((d) => [d.id, d.name] as const));

  const cards = doctors.map((d) =>
    doctorRowToCardProps(d, d.department_id ? deptById.get(d.department_id) ?? null : null),
  );

  if (cards.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="left"
          title="Meet Our Specialists"
          subtitle="Experienced consultants across every major specialty — many trained at India's leading institutions."
        />
        <DoctorsCarousel cards={cards} />
      </div>
    </section>
  );
}
