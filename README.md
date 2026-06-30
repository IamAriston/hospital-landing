# Aastha Multi Speciality Hospital � Landing Site

Marketing and information website for **Aastha Multi Speciality Hospital**, Shimla, Himachal Pradesh. Built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4.

---

## Tech Stack

| Layer     | Choice                                                      |
| --------- | ----------------------------------------------------------- |
| Framework | Next.js 16.2 (App Router, static export)                    |
| Language  | TypeScript                                                  |
| Styling   | Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline`) |
| Fonts     | Inter (body) + Urbanist (display, `font-display`)           |
| Icons     | Custom Lucide-based `<Icon>` component                      |

---

## Getting Started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production static build
```

---

## Project Structure

```
hospital-landing/
+-- app/                        # Next.js App Router pages
�   +-- page.tsx                # Home page
�   +-- about/page.tsx
�   +-- contact/page.tsx
�   +-- departments/
�   �   +-- page.tsx            # All departments listing
�   �   +-- [slug]/page.tsx     # Individual department page
�   +-- doctors/page.tsx
�   +-- patients/page.tsx
�   +-- services/
�       +-- page.tsx            # All services listing
�       +-- [slug]/page.tsx     # Individual service page
�
+-- config/                     # ? All site data lives here
�   +-- home.ts                 # Hero, stats, features, departments, doctors, testimonials
�   +-- site.ts                 # Hospital name, phone, address, hours, nav links
�   +-- departments.ts          # Per-department conditions, procedures, equipment, OPD schedule
�   +-- services.ts             # Service page accent colour maps
�   +-- about.ts                # Infrastructure stats, accreditations, milestones, leadership
�   +-- contact.ts              # Directions (from / distance / time / via)
�   +-- doctors.ts              # Info points shown on the doctors listing page
�   +-- patients.ts             # Patient quick links, insurance partners, prepare checklist
�
+-- components/
�   +-- layout/                 # Navbar, Footer, UtilityBar, QuickAccess, MobileBottomBar
�   +-- sections/               # Full-width page sections (Hero, Departments, BookAppointment�)
�   +-- cards/                  # DoctorCard, DeptCard, FeatureCard, TestimonialCard, BlogCard
�   +-- inputs/                 # Form fields (TextField, SelectField, DateField, TimePicker�)
�   +-- ui/                     # Reusable primitives (see below)
�
+-- lib/
�   +-- schedule.ts             # Schedule type + all date/time helpers
�   +-- cn.ts                   # Tailwind class merge utility
�
+-- public/assets/              # Images (building-wide.png, interior-blue.png�)
```

---

## The Config Layer � Where to Update Data

**Every piece of visible content comes from a config file.** You never need to touch page or component files just to update text, add a doctor, or change a phone number.

### `config/site.ts` � Hospital identity & contact

Update here for: phone number, emergency number, WhatsApp, email, address, OPD hours, navigation items, footer links.

```ts
export const siteConfig = {
  phone: "+91 12345 67890",
  emergency: "1066",
  address: {
    line1:
      "AASTHA HOSPITAL COMPLEX, NEEL TARA PARIMAHAL ENCLAVE, PANTHAGHATI, KASUMPTI",
    line2: "Shimla, Himachal Pradesh 171009",
  },
  hours: {
    opd: {
      days: [1, 2, 3, 4, 5, 6], // Mon�Sat (0=Sun�6=Sat)
      startHour: 8,
      endHour: 20,
      label: "Mon-Sat / 8 AM - 8 PM", // displayed in footer / OPD badge
    },
    emergency: "24 / 7 / 365",
  },
  // ...
};
```

---

### `config/home.ts` � Home page content

This is the main data file. It drives the home page **and** populates the department, service, and doctor listing pages.

#### Adding a new doctor

```ts
// config/home.ts ? homeConfig.doctors
{
  name: "Dr. Kavita Menon",
  spec: "Endocrinologist",
  dept: "General Medicine",   // must match a name in homeConfig.departments
  yrs: 9,
  rating: 4.8,
  schedule: { days: [2, 4], startHour: 10, endHour: 14 },  // Tue & Thu, 10 AM�2 PM
  initial: "KM",              // shown in the avatar circle
  tone: "#FEF9C3",            // background colour of the avatar (any CSS colour)
},
```

The doctor will automatically appear on:

- The home page doctors section
- `/doctors` listing page
- The relevant `/departments/[slug]` page (matched by `dept`)
- The booking form department/doctor dropdowns

**Schedule days:** `0` = Sunday, `1` = Monday, `2` = Tuesday, `3` = Wednesday, `4` = Thursday, `5` = Friday, `6` = Saturday.

#### Adding a new service

```ts
// config/home.ts ? homeConfig.features
{
  icon: "heart",
  name: "Cardiac Rehab",
  slug: "cardiac-rehab",     // used in the URL: /services/cardiac-rehab
  desc: "Structured recovery programme after heart surgery or cardiac event.",
  accent: "red" as const,    // "teal" | "sky" | "red" � controls card colour
  cta: "Learn More",
},
```

Also add a matching entry in `config/services.ts` under `serviceAccentIcon` and `serviceAccentHero` using the same `accent` key (already covered if you use an existing colour).

#### Adding a new department

```ts
// config/home.ts ? homeConfig.departments
{ icon: "pill", name: "Oncology", slug: "oncology", desc: "Cancer diagnosis and treatment" },
```

Then add the full detail entry in `config/departments.ts`:

```ts
// config/departments.ts ? deptDetails["Oncology"]
Oncology: {
  conditions: ["Breast Cancer", "Lung Cancer", �],
  procedures: ["Chemotherapy", "Radiation Therapy", �],
  equipment: ["Linear Accelerator", "PET-CT Scanner"],
  opd: { days: [1, 3, 5], startHour: 10, endHour: 14 },
  whenToVisit: "Unexplained weight loss, persistent lumps, abnormal bleeding�",
},
```

The department name in `deptDetails` must **exactly match** the `name` in `homeConfig.departments`.

---

### `config/departments.ts` � Department detail pages

Each entry powers the `/departments/[slug]` page. The OPD schedule uses the `Schedule` type from `lib/schedule.ts` � the system auto-calculates whether the OPD is open today and what day it next runs.

```ts
opd: { days: [1, 3, 5], startHour: 9, endHour: 14 }
// ? displayed as "Mon, Wed, Fri � 9 AM to 2 PM"
// ? shows "Available Today" badge if today is Mon/Wed/Fri, otherwise "Next: Wednesday"
```

---

### `config/about.ts` � About page content

| Export            | What it controls                                        |
| ----------------- | ------------------------------------------------------- |
| `infra`           | Infrastructure stat cards (beds, OTs, ICU, etc.)        |
| `keyTechnologies` | Equipment checklist                                     |
| `accreditations`  | Certification cards                                     |
| `milestones`      | Timeline of hospital milestones (`{ year, event }`)     |
| `leadership`      | Leadership team cards (`{ name, role, initial, tone }`) |

---

### `config/contact.ts` � Directions

```ts
export const directions = [
  {
    from: "Shimla Bus Stand",
    distance: "3 km",
    time: "10 min",
    via: "Cart Rd",
  },
  // ...
];
```

---

### `config/patients.ts` � Patient info page

| Export              | What it controls                                 |
| ------------------- | ------------------------------------------------ |
| `patientLinks`      | Quick-link cards at the top of the patients page |
| `insurancePartners` | List of insurance / TPA partner names            |
| `prepareChecklist`  | "What to Bring" list items                       |

---

## Schedule System (`lib/schedule.ts`)

All date and time logic is centralised here. No page hard-codes an availability string.

```ts
type Schedule = {
  days: number[]; // 0=Sun, 1=Mon, �, 6=Sat
  startHour: number; // 24-h start, e.g. 9
  endHour: number; // 24-h end (exclusive), e.g. 14
};

formatOpd(s); // ? "Mon, Wed, Fri � 9 AM to 2 PM"
isOpenNow(s); // ? true if current day+time falls within schedule
isAvailableToday(s); // ? true if today is in s.days (regardless of hour)
availabilityLabel(s); // ? "Available Today" | "Next: Wednesday" | "By Appointment"
```

Components that call these helpers (`OpdBadge`, `DoctorCard`) are marked `"use client"` so they always use the user's current time.

---

## Reusable UI Components (`components/ui/`)

| Component           | Props                                                         | Use for                                               |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `PageHero`          | `breadcrumb`, `title`, `subtitle?`, `compact?`, `children?`   | Top navy hero on every inner page                     |
| `CTABanner`         | `title`, `body`, `children` (buttons)                         | Navy call-to-action strip at page bottom              |
| `Breadcrumb`        | `items: { label, href? }[]`, `light?`                         | Navigation trail                                      |
| `CheckList`         | `items: string[]`, `variant?` (`teal`/`sky`/`green`), `size?` | Bullet lists with coloured check icons                |
| `SectionLabel`      | `label`, `heading`, `body?`, `center?`                        | Teal pill label + h2 heading pattern                  |
| `MilestoneTimeline` | `items: { year, event }[]`                                    | Vertical timeline with teal dots                      |
| `OpdBadge`          | �                                                             | Live "OPD Open / Closed" badge in hero                |
| `Button`            | `href`, `variant?`, `size?`, `icon?`                          | Uses `<Link>` for internal routes, `<a>` for external |
| `Icon`              | `name`, `size?`, `stroke?`, `className?`                      | Lucide-based icon set                                 |

---

## Adding a New Page

1. Create `app/your-page/page.tsx`.
2. Export `metadata` for SEO.
3. Use `<PageHero>` for the top section and `<CTABanner>` at the bottom � keeps styling consistent with every other page.
4. Pull data from a config file rather than defining arrays inline.

---

## Icon Names

Icons are Lucide-based. Available names include: `activity`, `ambulance`, `arrowSmall`, `baby`, `badge`, `bed`, `blood`, `bone`, `brain`, `building`, `calendar`, `check`, `clock`, `eye`, `flask`, `heart`, `kidney`, `lung`, `mail`, `map`, `mountain`, `phone`, `pill`, `pin`, `search`, `siren`, `star`, `stethoscope`, `tooth`, `users`, `whatsapp`, and more. See `components/ui/Icon.tsx` for the full list.

---

## Deployment

The project statically pre-renders all pages at build time (`generateStaticParams` covers all department and service slugs). It can be deployed to any static host (Vercel, Netlify, S3+CloudFront).

```bash
npm run build   # outputs to .next/
```
