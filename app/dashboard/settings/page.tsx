import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentProfile } from "@/lib/auth";
import { SettingsBoard } from "./settings-board";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);
  if (!user || !profile) redirect("/login?next=/dashboard/settings");

  return <SettingsBoard email={user.email ?? ""} profile={profile} />;
}
