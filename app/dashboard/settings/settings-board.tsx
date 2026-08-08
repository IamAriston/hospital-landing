"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Separator } from "@/components/ui/separator";
import { RefreshButton } from "@/components/dashboard/ui/refresh-button";
import { useServerAction } from "@/hooks/use-server-action";
import {
  updateProfile,
  updatePreferences,
  updatePassword,
} from "@/lib/actions/profile";
import { cn } from "@/lib/utils";
import type { ProfileRow } from "@/types/database";

type Tab = "profile" | "notifications" | "security" | "preferences";

const TABS: { value: Tab; label: string }[] = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
  { value: "preferences", label: "Preferences" },
];

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  editor: "Editor",
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export function SettingsBoard({
  email,
  profile,
}: {
  email: string;
  profile: ProfileRow;
}) {
  const [activeTab, setActiveTab] = React.useState<Tab>("profile");
  const prefs = profile.preferences ?? {};
  const notif = prefs.notifications ?? {};

  // Profile fields
  const [fullName, setFullName] = React.useState(profile.full_name);
  const [phone, setPhone] = React.useState(prefs.phone ?? "");
  const [title, setTitle] = React.useState(prefs.title ?? "");
  const [bio, setBio] = React.useState(prefs.bio ?? "");

  // Notification prefs
  const [emailNotifs, setEmailNotifs] = React.useState(notif.email ?? true);
  const [smsNotifs, setSmsNotifs] = React.useState(notif.sms ?? true);
  const [appointmentAlerts, setAppointmentAlerts] = React.useState(
    notif.appointment ?? true,
  );
  const [labAlerts, setLabAlerts] = React.useState(notif.lab ?? false);

  // Security
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  // Regional
  const [timezone, setTimezone] = React.useState(prefs.timezone ?? "asia-kolkata");
  const [language, setLanguage] = React.useState(prefs.language ?? "en");

  const profileAction = useServerAction(updateProfile, {
    successMessage: "Profile updated",
  });
  const notifAction = useServerAction(updatePreferences, {
    successMessage: "Notification preferences saved",
  });
  const prefsAction = useServerAction(updatePreferences, {
    successMessage: "Preferences saved",
  });
  const passwordAction = useServerAction(updatePassword, {
    successMessage: "Password updated",
    onSuccess: () => {
      setCurrent("");
      setNext("");
      setConfirm("");
    },
  });

  return (
    <main className="p-5 md:p-6 max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dash-text">Settings</h1>
          <p className="text-sm text-dash-text-mute mt-1">
            Manage your account and preferences
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="dash-chip-row mb-6">
        {TABS.map((t) => (
          <button
            key={t.value}
            className={cn("dash-chip", activeTab === t.value && "active")}
            onClick={() => setActiveTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and professional details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-bold bg-brand-teal-50 text-brand-teal">
                    {initials(fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-dash-text">
                    {fullName || "Unnamed user"}
                  </p>
                  <p className="text-sm text-dash-text-mute">{email}</p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    {ROLE_LABEL[profile.role] ?? profile.role}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={profileAction.fieldErrors.full_name?.[0]}
                  required
                />
                <FormInput
                  label="Email address"
                  type="email"
                  value={email}
                  hint="Managed by your account — contact an admin to change."
                  readOnly
                />
                <FormInput
                  label="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                />
                <FormInput
                  label="Role / Designation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Reception, Front Office"
                />
              </div>
              <FormTextarea
                label="Bio / Notes"
                className="mt-4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief description of your role…"
              />

              <div className="flex justify-end mt-4">
                <Button
                  disabled={profileAction.pending}
                  onClick={() =>
                    profileAction.run({ full_name: fullName, phone, title, bio })
                  }
                >
                  {profileAction.pending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormSwitch
                label="Email notifications"
                description="Receive alerts and summaries to your email."
                checked={emailNotifs}
                onCheckedChange={setEmailNotifs}
              />
              <Separator />
              <FormSwitch
                label="SMS notifications"
                description="Get urgent alerts via SMS."
                checked={smsNotifs}
                onCheckedChange={setSmsNotifs}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>Select which events trigger notifications.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormSwitch
                label="Appointment alerts"
                description="New bookings, cancellations, and confirmations."
                checked={appointmentAlerts}
                onCheckedChange={setAppointmentAlerts}
              />
              <Separator />
              <FormSwitch
                label="Lab result alerts"
                description="Notify when lab results are ready or overdue."
                checked={labAlerts}
                onCheckedChange={setLabAlerts}
              />
              <div className="flex justify-end mt-2">
                <Button
                  disabled={notifAction.pending}
                  onClick={() =>
                    notifAction.run({
                      notifications: {
                        email: emailNotifs,
                        sms: smsNotifs,
                        appointment: appointmentAlerts,
                        lab: labAlerts,
                      },
                    })
                  }
                >
                  {notifAction.pending ? "Saving…" : "Save preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Use a strong, unique password.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormInput
                label="Current password"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                error={passwordAction.fieldErrors.current?.[0]}
                required
              />
              <FormInput
                label="New password"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                error={passwordAction.fieldErrors.next?.[0]}
                hint="Minimum 8 characters, including a number."
                required
              />
              <FormInput
                label="Confirm new password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={passwordAction.fieldErrors.confirm?.[0]}
                required
              />
              <div className="flex justify-end">
                <Button
                  disabled={passwordAction.pending}
                  onClick={() => passwordAction.run({ current, next, confirm })}
                >
                  {passwordAction.pending ? "Updating…" : "Update password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preferences */}
      {activeTab === "preferences" && (
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Regional</CardTitle>
              <CardDescription>Set your timezone and language.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormSelect
                label="Timezone"
                value={timezone}
                onValueChange={setTimezone}
                options={[
                  { value: "asia-kolkata", label: "Asia/Kolkata (IST)" },
                  { value: "utc", label: "UTC" },
                  { value: "asia-dubai", label: "Asia/Dubai" },
                ]}
              />
              <FormSelect
                label="Language"
                value={language}
                onValueChange={setLanguage}
                options={[
                  { value: "en", label: "English" },
                  { value: "hi", label: "Hindi" },
                ]}
              />
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  disabled={prefsAction.pending}
                  onClick={() => prefsAction.run({ timezone, language })}
                >
                  {prefsAction.pending ? "Saving…" : "Save preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
