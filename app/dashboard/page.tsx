import { DashboardOverview } from "./dashboard-overview";
import {
  getTodayAppointments,
  getAppointmentStats,
} from "@/lib/db/appointments";
import { getAllDoctorsAdmin } from "@/lib/db/doctors";
import { getAllDepartmentsAdmin } from "@/lib/db/departments";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [profile, todayAppts, stats, doctors, departments] = await Promise.all([
    getCurrentProfile(),
    getTodayAppointments(),
    getAppointmentStats(),
    getAllDoctorsAdmin(),
    getAllDepartmentsAdmin(),
  ]);

  const firstName = (profile?.full_name || "there").split(" ")[0] || "there";
  const doctorsActive = doctors.filter((d) => d.is_active).length;

  return (
    <DashboardOverview
      firstName={firstName}
      todayAppointments={todayAppts}
      totalToday={stats.today}
      newCount={stats.new}
      confirmedCount={stats.confirmed}
      doctorsActive={doctorsActive}
      doctorsTotal={doctors.length}
      departments={departments}
      doctors={doctors}
    />
  );
}
