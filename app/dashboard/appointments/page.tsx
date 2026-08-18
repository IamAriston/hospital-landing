import { AppointmentsBoard } from "./appointments-board";
import { listAppointmentsPaged, getAppointmentStats } from "@/lib/db/appointments";
import { getAllDepartmentsAdmin } from "@/lib/db/departments";
import { getAllDoctorsAdmin } from "@/lib/db/doctors";
import { parsePageParams, firstParam } from "@/lib/db/paginate";
import type { AppointmentStatus } from "@/types/database";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function isoOffset(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** date chip → preferred_date range (undefined = no date filter). */
function dateRange(bucket: string): { from?: string; to?: string } {
  switch (bucket) {
    case "today":
      return { from: isoOffset(0), to: isoOffset(0) };
    case "tomorrow":
      return { from: isoOffset(1), to: isoOffset(1) };
    case "week":
      return { from: isoOffset(0), to: isoOffset(7) };
    default:
      return {};
  }
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize } = parsePageParams(sp);
  const search = firstParam(sp.q);
  const patientId = firstParam(sp.patient);
  const statusRaw = firstParam(sp.status);
  const status =
    statusRaw && statusRaw !== "all" ? (statusRaw as AppointmentStatus) : undefined;
  const departmentId =
    firstParam(sp.department) && firstParam(sp.department) !== "all"
      ? firstParam(sp.department)
      : undefined;

  // Default to "today" unless a search/patient deep-link is active.
  const date = firstParam(sp.date) ?? (search || patientId ? "all" : "today");
  const { from, to } = dateRange(date);

  const [result, stats, departments, doctors] = await Promise.all([
    listAppointmentsPaged({
      status,
      dateFrom: from,
      dateTo: to,
      departmentId,
      patientId,
      search,
      page,
      pageSize,
    }),
    getAppointmentStats(),
    getAllDepartmentsAdmin(),
    getAllDoctorsAdmin(),
  ]);

  return (
    <AppointmentsBoard
      appointments={result.rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      date={date}
      status={statusRaw ?? "all"}
      department={firstParam(sp.department) ?? "all"}
      patientId={patientId}
      stats={stats}
      departments={departments}
      doctors={doctors}
    />
  );
}
