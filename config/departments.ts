import type { Schedule } from "@/lib/schedule";

export const deptDetails: Record<
  string,
  {
    conditions: string[];
    procedures: string[];
    equipment: string[];
    opd: Schedule;
    whenToVisit: string;
  }
> = {
  Cardiology: {
    conditions: [
      "Coronary Artery Disease",
      "Heart Failure",
      "Hypertension",
      "Arrhythmias",
      "Valve Disorders",
      "Chest Pain",
    ],
    procedures: [
      "ECG & Echocardiography",
      "Treadmill Stress Test",
      "Coronary Angiography",
      "Angioplasty / Stenting",
      "Pacemaker Implantation",
    ],
    equipment: [
      "Cardiac Catheterisation Lab",
      "Colour Doppler Echo",
      "Holter Monitor",
      "12-Lead Digital ECG",
    ],
    opd: { days: [1, 3, 5], startHour: 9, endHour: 14 }, // Mon, Wed, Fri
    whenToVisit:
      "Chest pain or pressure, shortness of breath, palpitations, leg swelling, high blood pressure readings",
  },

  Neurology: {
    conditions: [
      "Stroke & TIA",
      "Epilepsy",
      "Parkinson's Disease",
      "Migraine",
      "Neuropathy",
      "Dementia",
    ],
    procedures: [
      "EEG (Electroencephalogram)",
      "Nerve Conduction Studies / EMG",
      "Brain MRI / CT",
      "Lumbar Puncture",
      "Botox for Migraine",
    ],
    equipment: [
      "Digital EEG System",
      "EMG & NCS Machine",
      "3 Tesla MRI",
      "64-Slice CT Scanner",
    ],
    opd: { days: [2, 4, 6], startHour: 10, endHour: 14 }, // Tue, Thu, Sat
    whenToVisit:
      "Sudden weakness or numbness, slurred speech, severe headaches, seizures, memory loss, dizziness or tremors",
  },

  Orthopaedics: {
    conditions: [
      "Fractures & Trauma",
      "Osteoarthritis",
      "Spine Disorders (Slip Disc)",
      "Sports Injuries",
      "Bone Tumours",
      "Clubfoot",
    ],
    procedures: [
      "Total Knee & Hip Replacement",
      "Arthroscopy",
      "Spine Surgery",
      "Fracture Fixation (ORIF)",
      "Ligament Reconstruction",
    ],
    equipment: [
      "C-Arm Fluoroscopy",
      "Arthroscopy Tower",
      "Bone Densitometer (DEXA)",
      "Digital X-Ray Suite",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 13 }, // Mon–Sat
    whenToVisit:
      "Joint pain, fractures, back or neck pain, sports injuries, difficulty walking, bone deformities",
  },

  Paediatrics: {
    conditions: [
      "Newborn & Neonatal Care",
      "Fever & Infections",
      "Asthma & Respiratory",
      "Malnutrition",
      "Developmental Delays",
      "Childhood Vaccinations",
    ],
    procedures: [
      "Neonatal Intensive Care (NICU)",
      "Growth Monitoring",
      "Developmental Assessment",
      "Paediatric Bronchoscopy",
      "Vaccine Administration",
    ],
    equipment: [
      "NICU with 8 Beds",
      "Paediatric Ventilators",
      "Incubators",
      "Phototherapy Units",
      "Paediatric Monitors",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 8, endHour: 12 }, // Mon–Sat
    whenToVisit:
      "High fever, difficulty breathing, poor weight gain, rashes, ear infections, vaccine schedule, developmental concerns",
  },

  Ophthalmology: {
    conditions: [
      "Cataracts",
      "Glaucoma",
      "Diabetic Retinopathy",
      "Refractive Errors",
      "Dry Eye Syndrome",
      "Retinal Detachment",
    ],
    procedures: [
      "Phacoemulsification (Cataract Surgery)",
      "LASIK & Refractive Surgery",
      "Retinal Laser Photocoagulation",
      "Trabeculectomy for Glaucoma",
      "Squint Correction",
    ],
    equipment: [
      "Slit Lamp Biomicroscope",
      "Optical Coherence Tomography (OCT)",
      "Fundus Camera",
      "Phacoemulsification Machine",
    ],
    opd: { days: [1, 3, 5], startHour: 9, endHour: 13 }, // Mon, Wed, Fri
    whenToVisit:
      "Blurred vision, eye pain or redness, floaters or flashes, sudden vision loss, difficulty reading, frequent eye rubbing",
  },

  "Dental & Oral": {
    conditions: [
      "Tooth Decay & Cavities",
      "Gum Disease (Periodontitis)",
      "Missing Teeth",
      "Malocclusion (Misaligned Teeth)",
      "TMJ Disorders",
      "Oral Lesions",
    ],
    procedures: [
      "Root Canal Treatment",
      "Dental Implants",
      "Orthodontics (Braces & Aligners)",
      "Tooth Extraction",
      "Scaling & Polishing",
      "Dentures & Crowns",
    ],
    equipment: [
      "Digital OPG & CBCT X-Ray",
      "Intraoral Camera",
      "Dental Operating Microscope",
      "Piezoelectric Scaler",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 10, endHour: 19 }, // Mon–Sat
    whenToVisit:
      "Toothache, bleeding gums, broken or chipped tooth, bad breath, jaw pain, swelling in mouth, missing teeth",
  },

  Pulmonology: {
    conditions: [
      "Asthma",
      "COPD (Chronic Obstructive Pulmonary Disease)",
      "Pneumonia",
      "Tuberculosis (TB)",
      "Obstructive Sleep Apnoea",
      "Pulmonary Fibrosis",
    ],
    procedures: [
      "Spirometry & PFT",
      "Flexible Bronchoscopy",
      "CPAP / BiPAP Therapy",
      "Sleep Study (Polysomnography)",
      "Nebulisation & Chest Physiotherapy",
    ],
    equipment: [
      "Computerised Spirometer",
      "Video Bronchoscope",
      "Sleep Lab",
      "High-Flow Nasal Oxygen System",
    ],
    opd: { days: [1, 4, 6], startHour: 10, endHour: 14 }, // Mon, Thu, Sat
    whenToVisit:
      "Persistent cough, wheezing, breathlessness on exertion, chest tightness, coughing up blood, snoring or daytime sleepiness",
  },

  Nephrology: {
    conditions: [
      "Chronic Kidney Disease (CKD)",
      "Acute Kidney Injury",
      "Kidney Stones",
      "Glomerulonephritis",
      "Diabetic & Hypertensive Nephropathy",
    ],
    procedures: [
      "Haemodialysis",
      "Peritoneal Dialysis",
      "Kidney Biopsy",
      "AV Fistula Creation",
      "Renal Replacement Therapy",
    ],
    equipment: [
      "6-Station Dialysis Unit",
      "Ultrasound Guided Biopsy",
      "24-hr Ambulatory BP Monitor",
      "Automated Biochemistry Analyser",
    ],
    opd: { days: [2, 4], startHour: 9, endHour: 13 }, // Tue & Thu
    whenToVisit:
      "Swelling in legs or face, reduced urine output, foamy urine, flank or back pain, blood in urine, fatigue",
  },

  Gynaecology: {
    conditions: [
      "Pregnancy & Maternity",
      "PCOS / PCOD",
      "Endometriosis",
      "Uterine Fibroids",
      "Menstrual Disorders",
      "Menopause Management",
    ],
    procedures: [
      "Normal Delivery & Caesarean Section",
      "Hysteroscopy",
      "Diagnostic & Operative Laparoscopy",
      "Colposcopy",
      "Infertility Evaluation",
      "Cervical Cancer Screening",
    ],
    equipment: [
      "4D Ultrasound",
      "Laparoscopy Tower",
      "Colposcope",
      "Foetal Monitor",
      "Modular Labour Suite",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 13 }, // Mon–Sat
    whenToVisit:
      "Irregular or painful periods, pelvic pain, pregnancy care, abnormal bleeding or discharge, family planning, fertility concerns",
  },

  "General Medicine": {
    conditions: [
      "Diabetes Mellitus (Type 1 & 2)",
      "Hypertension",
      "Thyroid Disorders",
      "Anaemia",
      "Infectious Diseases",
      "Obesity & Metabolic Syndrome",
    ],
    procedures: [
      "Comprehensive Health Check-up",
      "Diabetes Management Programme",
      "Thyroid Evaluation",
      "ECG & Blood Pressure Monitoring",
      "Preventive Vaccinations",
    ],
    equipment: [
      "Point-of-Care HbA1c Analyser",
      "Thyroid Function Analyser",
      "ECG Machine",
      "Continuous Glucose Monitor",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 8, endHour: 20 }, // Mon–Sat
    whenToVisit:
      "Fatigue, fever, unexplained weight change, high blood sugar or pressure, general health concerns, annual checkup",
  },

  Dermatology: {
    conditions: [
      "Acne & Acne Scars",
      "Psoriasis & Eczema",
      "Androgenetic Alopecia (Hair Loss)",
      "Fungal & Bacterial Infections",
      "Vitiligo",
      "Skin Cancer Screening",
    ],
    procedures: [
      "Chemical Peels & Microdermabrasion",
      "Fractional CO2 Laser",
      "PRP Therapy for Hair Loss",
      "Cryotherapy",
      "Punch Biopsy",
      "Botox & Fillers",
    ],
    equipment: [
      "Dermatoscope",
      "Fractional CO2 Laser System",
      "PRP Centrifuge",
      "UV Phototherapy Unit",
    ],
    opd: { days: [1, 3, 5], startHour: 10, endHour: 15 }, // Mon, Wed, Fri
    whenToVisit:
      "Persistent rashes, acne, hair loss, changing moles, dry or itchy skin, fungal infections, cosmetic skin concerns",
  },

  Pathology: {
    conditions: [
      "Routine Blood Tests (CBC, LFT, KFT)",
      "Hormonal & Thyroid Panels",
      "Cancer Markers (CEA, PSA, CA-125)",
      "Infection Workup (Culture, Sensitivity)",
      "Histopathology & Biopsy",
    ],
    procedures: [
      "Haematology & Biochemistry Panels",
      "Urine & Stool Analysis",
      "Biopsy & FNAC",
      "Microbiology Cultures",
      "PCR Molecular Diagnostics",
    ],
    equipment: [
      "5-Part Haematology Analyser",
      "Fully Automated Biochemistry Analyser",
      "PCR Machine",
      "Digital Pathology Scanner",
    ],
    opd: { days: [1, 2, 3, 4, 5, 6], startHour: 7, endHour: 20 }, // Mon–Sat (sample collection from 7 AM)
    whenToVisit:
      "Doctor-ordered tests, annual health screening, pre-operative workup, symptoms requiring laboratory investigation",
  },
};
