import type { Metadata } from "next";
import { getTodayAppointments } from "@/lib/db/appointments";
import { OpdBoard } from "./opd-board";

export const metadata: Metadata = { title: "Today's OPD" };
export const dynamic = "force-dynamic";

export default async function OpdPage() {
  const appointments = await getTodayAppointments();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return <OpdBoard appointments={appointments} today={today} />;
}
