/**
 * Database row types — mirror of `supabase/schema.sql` + `supabase/migrations/*`.
 *
 * Each table exports:
 *   - <Table>Row    — what SELECT returns
 *   - <Table>Insert — what INSERT accepts (server-generated columns optional)
 *   - <Table>Update — what UPDATE accepts (everything partial)
 *
 * When the schema changes, this file changes alongside the migration.
 */

// ============================================================
// Shared JSONB shapes
// ============================================================

export type Schedule = {
  days: number[]; // 0 = Sun ... 6 = Sat
  startHour: number; // 0..23
  endHour: number; // 0..23
};

// ============================================================
// Profiles
// ============================================================

export type UserRole = "super_admin" | "admin" | "editor";

export type ProfileRow = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};
export type ProfileInsert = Partial<ProfileRow> & { id: string };
export type ProfileUpdate = Partial<ProfileRow>;

// ============================================================
// Settings (key-value)
// ============================================================

export type SettingRow = {
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
};
export type SettingInsert = { key: string; value: unknown; updated_by?: string | null };
export type SettingUpdate = Partial<SettingRow>;

// ============================================================
// Departments + Department Details
// ============================================================

export type DepartmentRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export type DepartmentInsert = Omit<DepartmentRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type DepartmentUpdate = Partial<DepartmentInsert>;

export type DepartmentDetailsRow = {
  id: string;
  department_id: string;
  when_to_visit: string;
  opd_schedule: Schedule | null;
  conditions: string[];
  procedures: string[];
  equipment: string[];
  created_at: string;
  updated_at: string;
};
export type DepartmentDetailsInsert = Omit<
  DepartmentDetailsRow,
  "id" | "created_at" | "updated_at"
> & { id?: string };
export type DepartmentDetailsUpdate = Partial<DepartmentDetailsInsert>;

export type DepartmentWithDetails = DepartmentRow & {
  department_details: DepartmentDetailsRow | null;
};

// ============================================================
// Doctors
// ============================================================

export type DoctorRow = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  department_id: string | null;
  years_experience: number;
  rating: number;
  schedule: Schedule | null;
  initials: string;
  avatar_color: string;
  bio: string | null;
  photo_url: string | null;
  qualifications: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};
export type DoctorInsert = Omit<DoctorRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type DoctorUpdate = Partial<DoctorInsert>;

export type DoctorWithDepartment = DoctorRow & {
  departments: Pick<DepartmentRow, "id" | "name" | "slug"> | null;
};

// ============================================================
// Patients
// ============================================================

export type Sex = "M" | "F" | "Other";
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type PatientRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  sex: Sex | null;
  city: string | null;
  blood_group: BloodGroup | null;
  insurance: string | null;
  allergies: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
export type PatientInsert = Omit<PatientRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type PatientUpdate = Partial<PatientInsert>;

// ============================================================
// Appointments
// ============================================================

export type AppointmentStatus = "new" | "contacted" | "confirmed" | "cancelled";
export type TimeSlot = "Morning" | "Afternoon" | "Evening";

export type AppointmentRow = {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  patient_id: string | null;
  department_id: string | null;
  doctor_id: string | null;
  preferred_date: string | null;
  time_slot: TimeSlot | null;
  message: string | null;
  status: AppointmentStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};
export type AppointmentInsert = Omit<AppointmentRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
export type AppointmentUpdate = Partial<AppointmentInsert>;

export type AppointmentWithRelations = AppointmentRow & {
  departments: Pick<DepartmentRow, "id" | "name" | "slug"> | null;
  doctors: Pick<DoctorRow, "id" | "name" | "slug" | "specialty"> | null;
};

// ============================================================
// Services
// ============================================================

export type ServiceAccent = "teal" | "sky" | "red";

export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  accent: ServiceAccent;
  cta_label: string;
  highlights: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ============================================================
// Testimonials
// ============================================================

export type TestimonialRow = {
  id: string;
  patient_name: string;
  location: string | null;
  treatment: string | null;
  rating: number;
  body: string;
  initials: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ============================================================
// Blog
// ============================================================

export type BlogCategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  author_name: string;
  category_id: string | null;
  tags: string[];
  read_time_minutes: number | null;
  tone: string;
  is_published: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ============================================================
// Misc static tables
// ============================================================

export type StatRow = {
  id: string;
  icon: string;
  number: string;
  label: string;
  is_active: boolean;
  display_order: number;
  updated_at: string;
};

export type InfraStatRow = {
  id: string;
  icon: string;
  label: string;
  value: string;
  is_active: boolean;
  display_order: number;
};

export type AccreditationRow = {
  id: string;
  title: string;
  body: string;
  is_active: boolean;
  display_order: number;
};

export type MilestoneRow = {
  id: string;
  year: string;
  event: string;
  display_order: number;
};

export type LeadershipRow = {
  id: string;
  name: string;
  role: string;
  initials: string;
  tone: string;
  photo_url: string | null;
  bio: string | null;
  is_active: boolean;
  display_order: number;
};

export type WhyUsPointRow = {
  id: string;
  icon: string;
  title: string;
  description: string;
  is_active: boolean;
  display_order: number;
};

export type ContactDirectionRow = {
  id: string;
  origin: string;
  distance: string;
  travel_time: string;
  via: string;
  display_order: number;
};

export type InsurancePartnerRow = {
  id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  display_order: number;
};

export type PatientLinkRow = {
  id: string;
  label: string;
  href: string;
  icon: string;
  color_class: string;
  description: string;
  cta_label: string;
  is_active: boolean;
  display_order: number;
};

export type MediaRow = {
  id: string;
  filename: string;
  url: string;
  bucket: string;
  size_bytes: number | null;
  mime_type: string | null;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
};

// ============================================================
// Action result discriminated union
// ============================================================

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };
