import type { IconName } from "@/components/ui/Icon";

export type PatientLink = {
  icon: IconName;
  label: string;
  desc: string;
  href: string;
  cta: string;
  color: string;
  /** Show this entry in the navbar Patients dropdown. */
  inNav?: boolean;
};

/**
 * Canonical list of patient-facing services.
 *
 * - `/patients` renders the full set as cards.
 * - Navbar Patients dropdown derives from `navPatientItems` below (entries with `inNav: true`).
 * - Footer "Patient Services" column derives from `footerPatientLinks` below.
 */
export const patientLinks: PatientLink[] = [
  {
    icon: "calendar",
    label: "Book Appointment",
    desc: "Schedule a consultation with any of our specialists — confirmation within 30 minutes during OPD hours.",
    href: "/#book",
    cta: "Book Now",
    color: "bg-sky-50 text-sky-600",
    inNav: true,
  },
  {
    icon: "clock",
    label: "OPD Schedule",
    desc: "View timings for all outpatient departments — Mon to Sat, 8 AM to 8 PM.",
    href: "/patients/opd",
    cta: "View Schedule",
    color: "bg-teal-50 text-teal-600",
    inNav: true,
  },
  {
    icon: "flask",
    label: "Labs & Reports",
    desc: "Access your test reports online. Sample collection from 7 AM, reports available within 24 hours.",
    href: "/patients/labs",
    cta: "Access Reports",
    color: "bg-purple-50 text-purple-600",
    inNav: true,
  },
  {
    icon: "shield",
    label: "Insurance / TPA",
    desc: "Cashless facility with 20+ insurance providers. Pre-authorisation available at admission desk.",
    href: "/patients/insurance",
    cta: "See Insurers",
    color: "bg-amber-50 text-amber-600",
    inNav: true,
  },
  {
    icon: "user",
    label: "Patient Portal",
    desc: "Manage your records, past prescriptions, and upcoming appointments online.",
    href: "/patients/portal",
    cta: "Login / Register",
    color: "bg-slate-100 text-navy",
    inNav: true,
  },
  {
    icon: "chat",
    label: "Feedback",
    desc: "Your experience helps us improve. Share your feedback — we read and act on every response.",
    href: "/patients/feedback",
    cta: "Give Feedback",
    color: "bg-green-50 text-green-600",
  },
];

/** Subset shown in the navbar Patients dropdown. */
export const navPatientItems = patientLinks
  .filter((p) => p.inNav)
  .map(({ icon, label, href }) => ({ icon, label, href }));

/** Subset shown in the footer "Patient Services" column. */
export const footerPatientLinks = patientLinks.map(({ label, href }) => ({ label, href }));

export const insurancePartners = [
  "Ayushman Bharat (PMJAY)",
  "HIMCARE (HP State Scheme)",
  "CGHS (Central Govt Employees)",
  "ECHS (Ex-Servicemen)",
  "Star Health Insurance",
  "HDFC Ergo Health",
  "Niva Bupa (Max Bupa)",
  "Care Health Insurance",
  "ICICI Lombard",
  "Bajaj Allianz Health",
  "New India Assurance",
  "National Insurance",
  "United India Insurance",
  "Aditya Birla Health",
  "Reliance Health Insurance",
  "SBI Health Insurance",
];

export const prepareChecklist = [
  "Government-issued ID (Aadhaar, Passport, Voter ID)",
  "Previous medical records or prescriptions",
  "Insurance / TPA card and policy number",
  "List of current medications",
  "Emergency contact details",
  "Blood group card (if available)",
];

export const opdSchedule = [
  { dept: "Cardiology",       days: "Mon, Wed, Fri",       time: "9:00 AM – 2:00 PM",  consultant: "Dr. Anjali Sharma" },
  { dept: "Orthopaedics",     days: "Mon – Sat",            time: "9:00 AM – 1:00 PM",  consultant: "Dr. Rohan Thakur" },
  { dept: "Paediatrics",      days: "Mon – Sat",            time: "8:00 AM – 12:00 PM", consultant: "Dr. Meera Negi" },
  { dept: "Neurology",        days: "Tue, Thu, Sat",        time: "10:00 AM – 2:00 PM", consultant: "Dr. Vikram Chauhan" },
  { dept: "Gynaecology",      days: "Mon – Sat",            time: "9:00 AM – 1:00 PM",  consultant: "Dr. Priya Verma" },
  { dept: "General Medicine", days: "Mon – Sat",            time: "8:00 AM – 8:00 PM",  consultant: "Dr. Sanjay Rana" },
  { dept: "Ophthalmology",    days: "Mon, Wed, Fri",        time: "10:00 AM – 3:00 PM", consultant: "On rotation" },
  { dept: "Dental & Oral",    days: "Tue – Sat",            time: "10:00 AM – 6:00 PM", consultant: "On rotation" },
  { dept: "Dermatology",      days: "Mon, Thu, Sat",        time: "11:00 AM – 4:00 PM", consultant: "On rotation" },
  { dept: "Pulmonology",      days: "Tue, Thu",             time: "10:00 AM – 1:00 PM", consultant: "On rotation" },
  { dept: "Nephrology",       days: "Wed, Sat",             time: "11:00 AM – 2:00 PM", consultant: "On rotation" },
  { dept: "Pathology Lab",    days: "Mon – Sat",            time: "7:00 AM – 8:00 PM",  consultant: "Sample collection" },
];

/** Content for `/patients/labs`. */
export const labPage = {
  features: [
    { icon: "flask",  title: "NABL-accredited lab",    body: "Blood, biopsy, hormones & molecular tests under one roof." },
    { icon: "home",   title: "Home collection",        body: "Phlebotomist visits within 60 minutes for Shimla city addresses." },
    { icon: "clock",  title: "24-hour turnaround",     body: "Most reports delivered online within a day." },
    { icon: "shield", title: "Privacy first",          body: "Reports encrypted in transit. Shared only with you & your doctor." },
  ] satisfies ReadonlyArray<{ icon: IconName; title: string; body: string }>,

  turnaround: [
    { test: "CBC, ESR, BSF/PP",              time: "Same day — 4 hrs" },
    { test: "Liver, Kidney & Lipid panels",  time: "Same day — 6 hrs" },
    { test: "Thyroid (T3, T4, TSH)",          time: "24 hrs" },
    { test: "HbA1c, Vit D, Vit B12",          time: "24 hrs" },
    { test: "Histopathology / Biopsy",        time: "3 – 5 days" },
    { test: "Molecular (PCR, viral load)",    time: "24 – 48 hrs" },
  ],
};

/** Content for `/patients/portal`. */
export const portalPage = {
  features: [
    { icon: "calendar", title: "Appointment history", body: "View past and upcoming visits, reschedule with one tap." },
    { icon: "flask",    title: "Lab reports archive", body: "All your reports in one place — shareable with your doctor." },
    { icon: "pill",     title: "Prescriptions",       body: "Active medications, refills due, and dosage instructions." },
    { icon: "user",     title: "Family profiles",     body: "Manage records for spouse, kids and elderly family members." },
    { icon: "shield",   title: "Insurance & TPA",     body: "Cards, policy numbers and pre-auth status at a glance." },
    { icon: "chat",     title: "Care messaging",      body: "Send non-urgent queries to your care team and get replies within a day." },
  ] satisfies ReadonlyArray<{ icon: IconName; title: string; body: string }>,
};

/** Content for `/patients/insurance`. */
export const insurancePage = {
  cashlessSteps: [
    { title: "Inform the desk",        body: "Show your insurance / TPA card at the admission desk on arrival." },
    { title: "Pre-authorisation",      body: "We submit the request to your insurer with our diagnosis & estimate." },
    { title: "Approval",                body: "Most insurers respond in 4 – 6 hours. You'll be kept informed." },
    { title: "Treatment & discharge",  body: "Receive care without paying out of pocket — only co-pay if applicable." },
  ],
};
