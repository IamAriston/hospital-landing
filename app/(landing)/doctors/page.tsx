import { getDoctors } from "@/lib/db/doctors";
import { getDepartments } from "@/lib/db/departments";
import { DoctorsList } from "./doctors-list";
import PageHero from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const [doctors, departments] = await Promise.all([getDoctors(), getDepartments()]);
  const deptById = new Map(departments.map((d) => [d.id, d.name] as const));

  const items = doctors.map((d) => ({
    row: d,
    departmentName: d.department_id ? deptById.get(d.department_id) ?? null : null,
  }));

  const deptNames = Array.from(
    new Set(items.map((i) => i.departmentName).filter((n): n is string => !!n)),
  );

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Doctors" }]}
        title="Our Specialists"
        subtitle="Experienced consultants across every major department — trained at leading institutions across India."
      />
      <DoctorsList items={items} deptNames={deptNames} />
    </>
  );
}
