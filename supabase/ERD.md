# Database ERD — Aastha Hospital

## Table Relationships

```
auth.users (Supabase built-in)
    —
    +--- profiles (1:1)
              —
              +--- settings.updated_by (FK, nullable)
              +--- media.uploaded_by (FK, nullable)


departments --------------------------------+
    —                                       —
    +--- department_details (1:1, CASCADE)  —  doctors
    —         opd_schedule (jsonb)          —    —
    —         conditions   (jsonb)          —    +-- department_id ? departments
    —         procedures   (jsonb)          —    +-- schedule (jsonb)
    —         equipment    (jsonb)          —
    —                                       —
    +--- doctors.department_id -------------+
    +--- appointments.department_id (nullable, SET NULL)
    +--- appointments.doctor_id     (nullable, SET NULL)


blog_categories
    +--- blog_posts.category_id (nullable, SET NULL)


patients
    +--- appointments.patient_id (nullable, SET NULL)


Standalone tables (no FK to main entities):
    settings            key-value page config
    stats               homepage stat band
    infra_stats         about page infrastructure cards
    accreditations      about page certifications
    milestones          about page timeline
    leadership          about page team
    why_us_points       home + about value props
    contact_directions  contact page directions
    insurance_partners  patients page insurers
    patient_links       patients page quick links
    testimonials        home page reviews
    media               uploaded file registry
    appointments        booking form submissions (optionally linked to patients)
```

## Table Summary

| Table                | Rows (approx) | Changes                                   |
| -------------------- | ------------- | ----------------------------------------- |
| `settings`           | ~10 keys      | Rare — only when copy/config changes      |
| `departments`        | 12            | Rare — new department added               |
| `department_details` | 12            | Occasional — update conditions/procedures |
| `doctors`            | 6 ? grows     | Frequent — new hires, schedule changes    |
| `services`           | 6             | Rare                                      |
| `appointments`       | grows daily   | Frequent reads, status updates            |
| `testimonials`       | grows         | Moderate — new reviews to approve         |
| `blog_posts`         | grows         | Frequent — new health articles            |
| `blog_categories`    | ~5            | Rare                                      |
| `stats`              | 5             | Rare                                      |
| `infra_stats`        | 6             | Rare                                      |
| `accreditations`     | 4             | Rare                                      |
| `milestones`         | 6 ? grows     | Occasional                                |
| `leadership`         | 4 ? grows     | Rare                                      |
| `why_us_points`      | 4             | Rare                                      |
| `contact_directions` | 4             | Rare                                      |
| `insurance_partners` | 16 ? grows    | Occasional                                |
| `patient_links`      | 6             | Rare                                      |
| `media`              | grows         | Frequent — new uploads                    |
| `patients`           | grows         | Frequent — new registrations              |

## JSONB Shapes Reference

### `schedule` (used in doctors.schedule and department_details.opd_schedule)

```json
{ "days": [1, 3, 5], "startHour": 9, "endHour": 14 }
```

Days: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

### `settings['site']`

```json
{
  "name": "Aastha",
  "fullName": "Aastha Multi Speciality Hospital",
  "phone": "+91 98885 45809",
  "emergency": "1066",
  "emergencyFull": "+91 98765 11066",
  "whatsapp": "+91 98885 45809",
  "email": "care@Aasthahospital.in",
  "address": { "line1": "...", "line2": "..." },
  "hours": {
    "opd": {
      "days": [1, 2, 3, 4, 5, 6],
      "startHour": 8,
      "endHour": 20,
      "label": "Mon—Sat — 8 AM — 8 PM"
    },
    "emergency": "24 / 7 / 365"
  },
  "social": {
    "facebook": "#",
    "instagram": "#",
    "twitter": "#",
    "whatsapp": "#"
  }
}
```

### `settings['hero']`

```json
{
  "pill": "...",
  "headline": ["Advanced Healthcare,", "Amidst the Mountains."],
  "headlineAccent": "Amidst the Mountains.",
  "body": "...",
  "trustPoints": [
    "Multi-Speciality Care",
    "24/7 Emergency",
    "Modern OT & ICU",
    "Expert Doctors"
  ],
  "image": "/assets/building-wide.png",
  "imageBadge": "New Hospital — Modern Facilities"
}
```

### `settings['homepage_sections']`

```json
{
  "hero": true,
  "stats": true,
  "features": true,
  "departments": true,
  "whyUs": true,
  "doctors": true,
  "booking": true,
  "testimonials": true,
  "blogs": true,
  "emergency": true
}
```

### `settings['patients']`

```json
{
  "prepareChecklist": ["...", "..."],
  "visitorPolicy": {
    "visitingHours": "10 AM — 12 PM & 5 PM — 7 PM",
    "maxVisitors": 2,
    "icuPolicy": "By prior permission only",
    "childrenPolicy": "...",
    "maskPolicy": "..."
  },
  "patientRights": ["...", "..."]
}
```

## How to Deploy

1. Create a new Supabase project at supabase.com
2. Go to **SQL Editor** in the dashboard
3. Paste and run `schema.sql`
4. Paste and run every file in `migrations/` in filename order (e.g. `001_phase1.sql`)
5. Paste and run `seed.sql`
6. Done — all tables, indexes, RLS policies, storage buckets, and initial data are live

## Migrations

Schema changes after the initial baseline live in `migrations/` and are append-only.

| File                  | Adds                                                                              |
| --------------------- | --------------------------------------------------------------------------------- |
| `001_phase1.sql`      | `patients` table, `appointments.patient_id` FK, `auth.users → profiles` trigger, `assets` storage bucket |
