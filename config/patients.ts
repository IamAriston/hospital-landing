// Subset shown in the navbar dropdown (no Feedback link)
export const navPatientItems = [
  { icon: "calendar", label: "Book Appointment",  href: "/#book" },
  { icon: "clock",    label: "OPD Schedule",       href: "/patients/opd" },
  { icon: "flask",    label: "Labs & Reports",     href: "/patients/labs" },
  { icon: "shield",   label: "Insurance / TPA",    href: "/patients/insurance" },
  { icon: "user",     label: "Patient Portal",     href: "/patients/portal" },
];

export const patientLinks = [
  {
    icon: "calendar",
    label: "Book Appointment",
    desc: "Schedule a consultation with any of our specialists — get a WhatsApp confirmation in 30 minutes.",
    href: "/#book",
    cta: "Book Now",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: "clock",
    label: "OPD Schedule",
    desc: "View timings for all outpatient departments — Mon to Sat, 8 AM to 8 PM.",
    href: "/patients/opd",
    cta: "View Schedule",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: "flask",
    label: "Labs & Reports",
    desc: "Access your test reports online. Sample collection from 7 AM, reports available within 24 hours.",
    href: "/patients/labs",
    cta: "Access Reports",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "shield",
    label: "Insurance / TPA",
    desc: "Cashless facility with 20+ insurance providers. Pre-authorisation available at admission desk.",
    href: "/patients/insurance",
    cta: "See Insurers",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "user",
    label: "Patient Portal",
    desc: "Manage your records, past prescriptions, and upcoming appointments online.",
    href: "/patients/portal",
    cta: "Login / Register",
    color: "bg-slate-100 text-navy",
  },
  {
    icon: "chat",
    label: "Feedback",
    desc: "Your experience helps us improve. Share your feedback — we read and act on every response.",
    href: "/patients/feedback",
    cta: "Give Feedback",
    color: "bg-green-50 text-green-600",
  },
] as const;

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
