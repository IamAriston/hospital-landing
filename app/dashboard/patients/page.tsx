import { PatientsBoard } from "./patients-board";
import { listPatients, getPatientById } from "@/lib/db/patients";
import { parsePageParams, firstParam } from "@/lib/db/paginate";
import type { Sex } from "@/types/database";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const { page, pageSize } = parsePageParams(sp);
  const search = firstParam(sp.q);
  const sex = (firstParam(sp.sex) as Sex | "all" | undefined) ?? "all";
  const patientId = firstParam(sp.patient);

  const [result, selected] = await Promise.all([
    listPatients({ search, sex, page, pageSize }),
    patientId ? getPatientById(patientId) : Promise.resolve(null),
  ]);

  return (
    <PatientsBoard
      patients={result.rows}
      total={result.total}
      page={result.page}
      pageSize={result.pageSize}
      search={search ?? ""}
      sex={sex}
      initialSelected={selected}
    />
  );
}
