// Icon background style used on the services list page
export const serviceAccentIcon: Record<string, string> = {
  red: "bg-red-50 text-red-600",
  sky: "bg-sky-50 text-sky-600",
  teal: "bg-teal-50 text-teal-600",
};

// Hero accent used on each service's detail page
export const serviceAccentHero: Record<string, { bg: string; iconBg: string }> = {
  red: { bg: "bg-red-600", iconBg: "bg-white/10 text-white" },
  sky: { bg: "bg-sky-500", iconBg: "bg-white/10 text-white" },
  teal: { bg: "bg-teal-600", iconBg: "bg-white/10 text-white" },
};

export type ServiceDetail = {
  included: string[];
  process: { title: string; body: string }[];
  hours: string;
};

/**
 * Per-service detail content rendered by `app/(landing)/services/[slug]/page.tsx`.
 * Keys must match `slug` values in `homeConfig.features`.
 */
export const serviceDetails: Record<string, ServiceDetail> = {
  emergency: {
    included: [
      "24/7 trauma-ready ICU and resuscitation bay",
      "Dedicated ambulance fleet covering Shimla & nearby districts",
      "Emergency surgeons, anaesthetists & critical-care nurses on-call",
      "Direct admission to ICU / OT without OPD wait",
      "Stroke, cardiac & poly-trauma protocols",
    ],
    process: [
      { title: "Call 1066", body: "Our emergency hotline is staffed 24/7. We dispatch the nearest ambulance." },
      { title: "Stabilise en route", body: "Paramedics begin care during transit — oxygen, IV access, monitoring." },
      { title: "Direct admission", body: "Skip OPD. You're triaged straight into ICU or OT as needed." },
    ],
    hours: "24 / 7 / 365",
  },
  opd: {
    included: [
      "Walk-in & scheduled consultations across 22 departments",
      "Online booking with 30-minute confirmation",
      "Digital prescriptions delivered to your phone",
      "In-house diagnostics & pharmacy on the same visit",
      "Follow-up reminders and reports access online",
    ],
    process: [
      { title: "Book online", body: "Pick department, doctor & slot in under 2 minutes." },
      { title: "Visit & consult", body: "Arrive 15 minutes early — registration is quick with your ID." },
      { title: "Reports & follow-up", body: "Reports, prescriptions & next-visit advice arrive on your phone." },
    ],
    hours: "Mon – Sat · 8 AM – 8 PM",
  },
  diagnostics: {
    included: [
      "NABL-accredited pathology lab — blood, biopsy & molecular tests",
      "Digital X-ray, ultrasound, CT & MRI",
      "ECG, echo, TMT & 2D echo on-site",
      "Sample collection from 7 AM, home-collection available",
      "Reports delivered to your phone within 24 hours for most tests",
    ],
    process: [
      { title: "Get the prescription", body: "Either from our OPD or any external doctor — we accept all." },
      { title: "Sample / scan", body: "Walk in or schedule home-collection for blood work." },
      { title: "Reports online", body: "Reports land on your phone with a doctor's note when needed." },
    ],
    hours: "Mon – Sat · 7 AM – 8 PM",
  },
  pharmacy: {
    included: [
      "Full-range in-house pharmacy — branded & generic",
      "24/7 availability for inpatients & walk-ins",
      "Home delivery across Shimla & nearby areas",
      "Doorstep refills for chronic prescriptions",
      "Discounts on government scheme & insurance prescriptions",
    ],
    process: [
      { title: "Share prescription", body: "Walk in or upload your prescription — digital or paper." },
      { title: "We confirm", body: "Our pharmacist verifies stock, dosage & alternatives if needed." },
      { title: "Pickup or delivery", body: "Collect from our counter or get delivery within 90 minutes nearby." },
    ],
    hours: "Open 24 / 7",
  },
  "blood-bank": {
    included: [
      "Licensed blood bank — all groups available",
      "Component separation: PRBC, platelets, plasma, cryo",
      "Donor camps every month across the region",
      "Walk-in voluntary donation with health check & refreshments",
      "Cross-match & transfusion services on-site",
    ],
    process: [
      { title: "Register", body: "Walk in with ID — a quick health check confirms eligibility." },
      { title: "Donate", body: "Donation takes ~10 minutes. Trained staff and screened equipment." },
      { title: "Rest & refuel", body: "Light refreshments after — and a thank-you note from a recipient." },
    ],
    hours: "Mon – Sat · 9 AM – 6 PM",
  },
  homecare: {
    included: [
      "Skilled nurses for IV, wound care & elderly support",
      "Physiotherapy & post-op rehabilitation at home",
      "Doctor home visits for non-mobile patients",
      "Medical equipment rental: oxygen, beds, monitors",
      "Care plans coordinated with your treating consultant",
    ],
    process: [
      { title: "Request care", body: "Tell us the care type, duration & location — we'll match a caregiver." },
      { title: "Assessment visit", body: "A coordinator visits to set up equipment & plan the schedule." },
      { title: "Daily care", body: "Trained staff arrive on schedule. Updates shared with the family." },
    ],
    hours: "Available across Shimla, Solan, Mandi & nearby",
  },
};
