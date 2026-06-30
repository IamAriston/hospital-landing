import { AppointmentsBoard } from "./appointments-board";
import { listAppointments } from "@/lib/db/appointments";
import { getAllDepartmentsAdmin } from "@/lib/db/departments";
import { getAllDoctorsAdmin } from "@/lib/db/doctors";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const [appointments, departments, doctors] = await Promise.all([
    listAppointments({ limit: 500 }),
    getAllDepartmentsAdmin(),
    getAllDoctorsAdmin(),
  ]);
  return (
    <AppointmentsBoard
      appointments={appointments}
      departments={departments}
      doctors={doctors}
    />
  );
}
