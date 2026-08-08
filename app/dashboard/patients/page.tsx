import { PatientsBoard } from "./patients-board";
import { listPatients } from "@/lib/db/patients";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const patients = await listPatients();
  return <PatientsBoard patients={patients} />;
}
