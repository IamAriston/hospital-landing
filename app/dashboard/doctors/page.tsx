import { DoctorsBoard } from "./doctors-board";
import { listDoctorsAdmin, getDoctorStats, type DoctorStatusFilter } from "@/lib/db/doctors";
import { getAllDepartmentsAdmin } from "@/lib/db/departments";
import { parsePageParams, firstParam } from "@/lib/db/paginate";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const STATUS_VALUES: DoctorStatusFilter[] = ["active", "inactive", "featured"];

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize } = parsePageParams(sp);
  const search = firstParam(sp.q);
  const statusRaw = firstParam(sp.status);
  const status = STATUS_VALUES.includes(statusRaw as DoctorStatusFilter)
    ? (statusRaw as DoctorStatusFilter)
    : undefined;
  const departmentRaw = firstParam(sp.department);
  const departmentId =
    departmentRaw && departmentRaw !== "all" ? departmentRaw : undefined;

  const [result, stats, departments] = await Promise.all([
    listDoctorsAdmin({ search, status, departmentId, page, pageSize }),
    getDoctorStats(),
    getAllDepartmentsAdmin(),
  ]);

  return (
    <DoctorsBoard
      doctors={result.rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      search={search ?? ""}
      status={statusRaw ?? "all"}
      department={departmentRaw ?? "all"}
      stats={stats}
      departments={departments}
    />
  );
}
