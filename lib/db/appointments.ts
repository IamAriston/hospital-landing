import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { rangeFor, sanitizeSearch, type Paginated } from "@/lib/db/paginate";
import type {
  AppointmentRow,
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database";

export const CACHE_TAG_APPOINTMENTS = "appointments";

const APPOINTMENT_SELECT =
  "*, departments(id, name, slug), doctors(id, name, slug, specialty)";

type PagedOpts = {
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  departmentId?: string;
  patientId?: string;
  search?: string; // matches patient_name / patient_phone
  page?: number;
  pageSize?: number;
};

/** Server-paginated appointments list with count, for the dashboard board. */
export const listAppointmentsPaged = cache(
  async (opts: PagedOpts = {}): Promise<Paginated<AppointmentWithRelations>> => {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 10;
    const supabase = createAdminClient();

    let q = supabase
      .from("appointments")
      .select(APPOINTMENT_SELECT, { count: "exact" })
      .order("preferred_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (opts.status) q = q.eq("status", opts.status);
    if (opts.dateFrom) q = q.gte("preferred_date", opts.dateFrom);
    if (opts.dateTo) q = q.lte("preferred_date", opts.dateTo);
    if (opts.departmentId) q = q.eq("department_id", opts.departmentId);
    if (opts.patientId) q = q.eq("patient_id", opts.patientId);

    const search = sanitizeSearch(opts.search);
    if (search) {
      q = q.or(`patient_name.ilike.%${search}%,patient_phone.ilike.%${search}%`);
    }

    const { from, to } = rangeFor(page, pageSize);
    const { data, error, count } = await q.range(from, to);
    if (error) throw new Error(`listAppointmentsPaged: ${error.message}`);
    return {
      rows: (data ?? []) as unknown as AppointmentWithRelations[],
      total: count ?? 0,
      page,
      pageSize,
    };
  },
);

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

export const getAppointmentsForPatient = cache(
  async (patientId: string): Promise<AppointmentWithRelations[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("appointments")
      .select("*, departments(id, name, slug), doctors(id, name, slug, specialty)")
      .eq("patient_id", patientId)
      .order("preferred_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getAppointmentsForPatient: ${error.message}`);
    return (data ?? []) as unknown as AppointmentWithRelations[];
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
