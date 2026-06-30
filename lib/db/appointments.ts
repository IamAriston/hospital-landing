import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  AppointmentRow,
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database";

export const CACHE_TAG_APPOINTMENTS = "appointments";

type ListOpts = {
  status?: AppointmentStatus;
  dateFrom?: string; // ISO date
  dateTo?: string; // ISO date
  search?: string; // matches patient_name ilike
  departmentId?: string;
  doctorId?: string;
  limit?: number;
};

export const listAppointments = cache(
  async (opts: ListOpts = {}): Promise<AppointmentWithRelations[]> => {
    const supabase = createAdminClient();
    let q = supabase
      .from("appointments")
      .select("*, departments(id, name, slug), doctors(id, name, slug, specialty)")
      .order("created_at", { ascending: false });

    if (opts.status) q = q.eq("status", opts.status);
    if (opts.dateFrom) q = q.gte("preferred_date", opts.dateFrom);
    if (opts.dateTo) q = q.lte("preferred_date", opts.dateTo);
    if (opts.departmentId) q = q.eq("department_id", opts.departmentId);
    if (opts.doctorId) q = q.eq("doctor_id", opts.doctorId);
    if (opts.search) q = q.ilike("patient_name", `%${opts.search}%`);
    if (opts.limit) q = q.limit(opts.limit);

    const { data, error } = await q;
    if (error) throw new Error(`listAppointments: ${error.message}`);
    return (data ?? []) as unknown as AppointmentWithRelations[];
  },
);

export const getAppointmentStats = cache(async () => {
  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: total },
    { count: newCount },
    { count: confirmed },
    { count: cancelled },
    { count: todayCount },
  ] = await Promise.all([
    supabase.from("appointments").select("id", { count: "exact", head: true }),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "confirmed"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "cancelled"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("preferred_date", today),
  ]);

  return {
    total: total ?? 0,
    new: newCount ?? 0,
    confirmed: confirmed ?? 0,
    cancelled: cancelled ?? 0,
    today: todayCount ?? 0,
  };
});

export const getTodayAppointments = cache(
  async (): Promise<AppointmentWithRelations[]> => {
    const today = new Date().toISOString().slice(0, 10);
    return listAppointments({ dateFrom: today, dateTo: today, limit: 20 });
  },
);

export const getAppointmentById = cache(
  async (id: string): Promise<AppointmentRow | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`getAppointmentById: ${error.message}`);
    return (data as AppointmentRow | null) ?? null;
  },
);
