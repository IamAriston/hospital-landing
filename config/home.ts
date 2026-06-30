export const homeConfig = {
  sections: {
    hero: true,
    stats: true,
    features: true,
    departments: true,
    whyUs: true,
    doctors: true,
    booking: true,
    testimonials: true,
    blogs: true,
    emergency: true,
  },

  meta: {
    title:
      "Aastha Multi Speciality Hospital — Advanced Care, Amidst the Mountains",
    description:
      "World-class medical care in Himachal Pradesh. Expert specialists, modern facilities, and compassionate service.",
  },

  hero: {
    bgFade: true,
    topoLines: "medium" as "small" | "medium" | "large",
    pill: "Himachal Pradesh's Newest Multi-Speciality Hospital",
    headline: ["Advanced Healthcare,", "Amidst the Mountains."],
    headlineAccent: "Amidst the Mountains.",
    body: "Aastha Multi Speciality Hospital brings world-class medical care to the hills — expert specialists, modern facilities, and compassionate service for the people of Himachal Pradesh.",
    trustPoints: [
      "Multi-Speciality Care",
      "24/7 Emergency",
      "Modern OT & ICU",
      "Expert Doctors",
    ],
    image: "/assets/building-wide.png",
    imageBadge: "New Hospital · Modern Facilities",
  },

  stats: [
    { icon: "bed", number: "120+", label: "Beds" },
    { icon: "stethoscope", number: "45+", label: "Specialists" },
    { icon: "building", number: "22+", label: "Departments" },
    { icon: "clock", number: "24/7", label: "Emergency" },
    { icon: "mountain", number: "HP", label: "Serving Himachal" },
  ],

  features: [
    {
      icon: "siren",
      name: "Emergency Care",
      slug: "emergency",
      desc: "24/7 emergency response with trauma-ready ICU and dedicated ambulance fleet.",
      accent: "red" as const,
      cta: "Call Emergency",
    },
    {
      icon: "stethoscope",
      name: "OPD & Consultations",
      slug: "opd",
      desc: "Walk-in and scheduled consultations with specialists across 22 departments.",
      accent: "sky" as const,
      cta: "Book Now",
    },
    {
      icon: "flask",
      name: "Diagnostics & Labs",
      slug: "diagnostics",
      desc: "Advanced imaging, pathology and reports delivered straight to your phone.",
      accent: "teal" as const,
      cta: "View Tests",
    },
    {
      icon: "pill",
      name: "Pharmacy",
      slug: "pharmacy",
      desc: "In-house pharmacy with on-campus dispensing. Open 24/7.",
      accent: "sky" as const,
      cta: "Order Meds",
    },
    {
      icon: "blood",
      name: "Blood Bank",
      slug: "blood-bank",
      desc: "Licensed blood bank with all groups available. Donor camps every month.",
      accent: "red" as const,
      cta: "Donate",
    },
    {
      icon: "heart",
      name: "Homecare Services",
      slug: "homecare",
      desc: "Skilled nurses, physio and post-op care delivered to your doorstep.",
      accent: "teal" as const,
      cta: "Learn More",
    },
  ],

  departments: [
    { icon: "heart",    name: "Cardiology",       slug: "cardiology",       desc: "Heart care, ECG, echo & cath lab" },
    { icon: "brain",    name: "Neurology",         slug: "neurology",         desc: "Stroke care and nerve disorders" },
    { icon: "bone",     name: "Orthopaedics",      slug: "orthopaedics",      desc: "Joint replacement & sports injury" },
    { icon: "baby",     name: "Paediatrics",       slug: "paediatrics",       desc: "Newborn to teen care" },
    { icon: "eye",      name: "Ophthalmology",     slug: "ophthalmology",     desc: "Cataract, retina & lasik" },
    { icon: "tooth",    name: "Dental & Oral",     slug: "dental-oral",       desc: "Family dentistry & implants" },
    { icon: "lung",     name: "Pulmonology",       slug: "pulmonology",       desc: "Asthma, COPD & sleep clinic" },
    { icon: "kidney",   name: "Nephrology",        slug: "nephrology",        desc: "Dialysis & kidney care" },
    { icon: "users",    name: "Gynaecology",       slug: "gynaecology",       desc: "Women's health & maternity" },
    { icon: "activity", name: "General Medicine",  slug: "general-medicine",  desc: "Primary care & diabetes" },
    { icon: "shield",   name: "Dermatology",       slug: "dermatology",       desc: "Skin, hair & cosmetic" },
    { icon: "flask",    name: "Pathology",         slug: "pathology",         desc: "Blood, biopsy & molecular tests" },
  ],

  whyUs: {
    pill: "Why Aastha",
    headline: "Why Aastha Multi Speciality Hospital?",
    body: "A brand new hospital built for the future of healthcare in Himachal Pradesh — where modern medicine meets the warmth of the mountains.",
    image: "/assets/interior-blue.png",
    imageCaption: {
      pill: "Building Tour",
      title: "Modern Facilities,\nBuilt New for Himachal",
    },
    points: [
      {
        icon: "building",
        title: "Brand New Facilities",
        desc: "State-of-the-art equipment in a newly built hospital, designed for modern protocols.",
      },
      {
        icon: "badge",
        title: "Expert Specialists",
        desc: "Experienced consultants across all major specialties — many trained at AIIMS & PGI.",
      },
      {
        icon: "mountain",
        title: "Easily Accessible",
        desc: "Located in the heart of the hills, serving Shimla, Mandi, Solan and the entire region.",
      },
      {
        icon: "heart",
        title: "Patient-First Care",
        desc: "Every decision made with your wellbeing in mind — clear pricing, no surprises.",
      },
    ],
  },

  doctors: [
    {
      name: "Dr. Anjali Sharma",
      spec: "Cardiologist",
      dept: "Cardiology",
      yrs: 18,
      rating: 4.9,
      schedule: { days: [1, 3, 5], startHour: 9, endHour: 14 }, // Mon, Wed, Fri
      initial: "AS",
      tone: "from-pink-100", toneBg: "bg-pink-100",
    },
    {
      name: "Dr. Rohan Thakur",
      spec: "Orthopaedic Surgeon",
      dept: "Orthopaedics",
      yrs: 14,
      rating: 4.8,
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 13 }, // Mon–Sat
      initial: "RT",
      tone: "from-blue-100", toneBg: "bg-blue-100",
    },
    {
      name: "Dr. Meera Negi",
      spec: "Paediatrician",
      dept: "Paediatrics",
      yrs: 11,
      rating: 4.9,
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 8, endHour: 12 }, // Mon–Sat
      initial: "MN",
      tone: "from-green-100", toneBg: "bg-green-100",
    },
    {
      name: "Dr. Vikram Chauhan",
      spec: "Neurologist",
      dept: "Neurology",
      yrs: 16,
      rating: 4.8,
      schedule: { days: [2, 4, 6], startHour: 10, endHour: 14 }, // Tue, Thu, Sat
      initial: "VC",
      tone: "from-amber-100", toneBg: "bg-amber-100",
    },
    {
      name: "Dr. Priya Verma",
      spec: "Gynaecologist",
      dept: "Gynaecology",
      yrs: 13,
      rating: 4.9,
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 13 }, // Mon–Sat
      initial: "PV",
      tone: "from-violet-100", toneBg: "bg-violet-100",
    },
    {
      name: "Dr. Sanjay Rana",
      spec: "General Physician",
      dept: "General Medicine",
      yrs: 22,
      rating: 4.7,
      schedule: { days: [1, 2, 3, 4, 5, 6], startHour: 8, endHour: 20 }, // Mon–Sat
      initial: "SR",
      tone: "from-rose-100", toneBg: "bg-rose-100",
    },
  ],

  booking: {
    pill: "Book Online",
    headline: "Book Your Consultation",
    body: "Choose your department, pick a doctor and confirm in under 2 minutes. We'll confirm your appointment within 30 minutes during OPD hours.",
    steps: ["Choose Dept", "Pick Doctor", "Confirm"],
    image: "/assets/building-portrait.png",
    timeSlots: ["Morning", "Afternoon", "Evening"] as const,
  },

  testimonials: [
    {
      name: "Suresh Kumar",
      treatment: "Knee Replacement",
      text: "After years of pain I can finally walk the hills again. Dr. Thakur and the OT team were exceptional, and the recovery rooms are spotless.",
      initial: "SK",
    },
    {
      name: "Priya Devi",
      treatment: "Maternity Care",
      text: "Welcomed our daughter at Aastha — the gynae team and nurses made what could have been scary feel safe and warm. Forever grateful.",
      initial: "PD",
    },
    {
      name: "Rakesh Verma",
      treatment: "Cardiac Consult",
      text: "Got a same-day appointment when I had chest pain. Honest opinion, clear pricing, and the cath lab is genuinely modern. Highly recommend.",
      initial: "RV",
    },
  ],

  blogs: [
    {
      featured: true,
      category: "Cardiology",
      title: "Heart Health at High Altitude: What Hill Residents Should Know",
      doctor: "Dr. Anjali Sharma",
      date: "Apr 28, 2026",
      readTime: "6 min",
      tone: "from-red-200",
    },
    {
      featured: false,
      category: "Paediatrics",
      title: "5 Signs Your Child Needs to See a Specialist",
      doctor: "Dr. Meera Negi",
      date: "Apr 22, 2026",
      readTime: "4 min",
      tone: "from-green-100",
    },
    {
      featured: false,
      category: "Orthopaedics",
      title: "Winter Joint Pain: Relief Strategies That Actually Work",
      doctor: "Dr. Rohan Thakur",
      date: "Apr 18, 2026",
      readTime: "5 min",
      tone: "from-blue-100",
    },
  ],

  emergency: {
    pill: "24/7 EMERGENCY",
    headline: "Medical Emergency? We're Here 24/7",
    body: "Our emergency team and ambulances are ready to respond. Don't wait — every minute matters.",
    number: "1066 / +91 98765 11066",
  },
};
