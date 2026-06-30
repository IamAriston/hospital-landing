import { DoctorsBoard } from "./doctors-board";
import { getAllDoctorsAdmin } from "@/lib/db/doctors";
import { getAllDepartmentsAdmin } from "@/lib/db/departments";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const [doctors, departments] = await Promise.all([
    getAllDoctorsAdmin(),
    getAllDepartmentsAdmin(),
  ]);

  return <DoctorsBoard doctors={doctors} departments={departments} />;
}
