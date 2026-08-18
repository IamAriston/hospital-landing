import { DepartmentsBoard } from "./departments-board";
import {
  listDepartmentsAdmin,
  getDepartmentStats,
  type DepartmentStatusFilter,
} from "@/lib/db/departments";
import { parsePageParams, firstParam } from "@/lib/db/paginate";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

const STATUS_VALUES: DepartmentStatusFilter[] = ["active", "inactive"];

export default async function DepartmentsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize } = parsePageParams(sp);
  const search = firstParam(sp.q);
  const statusRaw = firstParam(sp.status);
  const status = STATUS_VALUES.includes(statusRaw as DepartmentStatusFilter)
    ? (statusRaw as DepartmentStatusFilter)
    : undefined;

  const [result, stats] = await Promise.all([
    listDepartmentsAdmin({ search, status, page, pageSize }),
    getDepartmentStats(),
  ]);

  return (
    <DepartmentsBoard
      departments={result.rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      search={search ?? ""}
      status={statusRaw ?? "all"}
      stats={stats}
    />
  );
}
