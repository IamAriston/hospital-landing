"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { FormSwitch } from "@/components/ui/form-switch";
import { FormSelect } from "@/components/ui/form-select";
import { FormTextarea } from "@/components/ui/form-textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChipRow } from "@/components/dashboard/ui/filter-bar";
import { cn } from "@/lib/utils";

type Tab = "profile" | "notifications" | "security" | "preferences";

const TABS: { value: Tab; label: string }[] = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
  { value: "preferences", label: "Preferences" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("profile");

  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [smsNotifs, setSmsNotifs] = React.useState(true);
  const [appointmentAlerts, setAppointmentAlerts] = React.useState(true);
  const [labAlerts, setLabAlerts] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [timezone, setTimezone] = React.useState("asia-kolkata");
  const [language, setLanguage] = React.useState("en");

  return (
    <main className="p-5 md:p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-dash-text">Settings</h1>
        <p className="text-sm text-dash-text-mute mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Chip-style tab row */}
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
                    AD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-dash-text">Admin User</p>
                  <p className="text-sm text-dash-text-mute">
                    admin@aastha.in
                  </p>
                  <Badge variant="secondary" className="mt-1.5 text-xs">
                    Administrator
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  Change photo
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="First name" defaultValue="Admin" required />
                <FormInput label="Last name" defaultValue="User" required />
                <FormInput
                  label="Email address"
                  type="email"
                  defaultValue="admin@aastha.in"
                  required
                />
                <FormInput
                  label="Phone number"
                  type="tel"
                  defaultValue="+91 98765 00000"
                />
                <FormInput
                  label="Role / Designation"
                  defaultValue="Hospital Administrator"
                />
                <FormInput
                  label="Employee ID"
                  defaultValue="EMP-001"
                  hint="Assigned by HR. Read-only."
                  readOnly
                />
              </div>
              <FormTextarea
                label="Bio / Notes"
                className="mt-4"
                placeholder="Brief description of your role…"
              />

              <div className="flex justify-end mt-4">
                <Button>Save changes</Button>
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
              <CardDescription>
                Choose how you want to be notified.
              </CardDescription>
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
              <CardDescription>
                Select which events trigger notifications.
              </CardDescription>
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
                <Button>Save preferences</Button>
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
              <FormInput label="Current password" type="password" required />
              <FormInput
                label="New password"
                type="password"
                hint="Minimum 8 characters with a number and symbol."
                required
              />
              <FormInput
                label="Confirm new password"
                type="password"
                required
              />
              <div className="flex justify-end">
                <Button>Update password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormSwitch
                label="Enable 2FA"
                description="Require a verification code on each login."
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
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
                <Button>Save preferences</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
