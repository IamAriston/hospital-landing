// Mock data for dashboard.

const DEPARTMENTS = [
  "Cardiology", "Neurology", "Orthopaedics", "Paediatrics", "Gynaecology",
  "General Medicine", "Dermatology", "Ophthalmology", "Pulmonology",
  "Nephrology", "Dental", "Pathology", "ENT", "Psychiatry"
];

const DOCTORS = [
  {id:"d1", name:"Dr. Anjali Sharma",   spec:"Cardiologist",        dept:"Cardiology",      yrs:18, rating:4.9, room:"OPD 12", phone:"+91 98765 11201", email:"anjali@asthahospital.in", status:"in-opd",   today:"9:00 AM – 1:00 PM", patients_today:14},
  {id:"d2", name:"Dr. Rohan Thakur",    spec:"Orthopaedic Surgeon", dept:"Orthopaedics",    yrs:14, rating:4.8, room:"OPD 08", phone:"+91 98765 11202", email:"rohan@asthahospital.in",  status:"in-surgery",today:"2:00 PM – 6:00 PM", patients_today:8},
  {id:"d3", name:"Dr. Meera Negi",      spec:"Paediatrician",       dept:"Paediatrics",     yrs:11, rating:4.9, room:"OPD 04", phone:"+91 98765 11203", email:"meera@asthahospital.in",  status:"in-opd",   today:"10:00 AM – 4:00 PM", patients_today:22},
  {id:"d4", name:"Dr. Vikram Chauhan",  spec:"Neurologist",         dept:"Neurology",       yrs:16, rating:4.8, room:"OPD 14", phone:"+91 98765 11204", email:"vikram@asthahospital.in", status:"off",      today:"Off today",         patients_today:0},
  {id:"d5", name:"Dr. Priya Verma",     spec:"Gynaecologist",       dept:"Gynaecology",     yrs:13, rating:4.9, room:"OPD 06", phone:"+91 98765 11205", email:"priya@asthahospital.in",  status:"in-opd",   today:"9:00 AM – 1:00 PM", patients_today:12},
  {id:"d6", name:"Dr. Sanjay Rana",     spec:"General Physician",   dept:"General Medicine",yrs:22, rating:4.7, room:"OPD 02", phone:"+91 98765 11206", email:"sanjay@asthahospital.in", status:"in-opd",   today:"8:00 AM – 12:00 PM", patients_today:18},
  {id:"d7", name:"Dr. Karan Mehta",     spec:"Dermatologist",       dept:"Dermatology",     yrs:9,  rating:4.7, room:"OPD 09", phone:"+91 98765 11207", email:"karan@asthahospital.in",  status:"break",    today:"11:00 AM – 3:00 PM", patients_today:6},
  {id:"d8", name:"Dr. Aarti Kapoor",    spec:"Ophthalmologist",     dept:"Ophthalmology",   yrs:15, rating:4.8, room:"OPD 11", phone:"+91 98765 11208", email:"aarti@asthahospital.in",  status:"in-opd",   today:"2:00 PM – 7:00 PM", patients_today:10},
  {id:"d9", name:"Dr. Nikhil Joshi",    spec:"Pulmonologist",       dept:"Pulmonology",     yrs:12, rating:4.6, room:"OPD 13", phone:"+91 98765 11209", email:"nikhil@asthahospital.in", status:"in-opd",   today:"9:00 AM – 2:00 PM", patients_today:9},
  {id:"d10",name:"Dr. Ritu Bansal",     spec:"ENT Specialist",      dept:"ENT",             yrs:10, rating:4.7, room:"OPD 07", phone:"+91 98765 11210", email:"ritu@asthahospital.in",   status:"on-call",  today:"On call",            patients_today:0},
  {id:"d11",name:"Dr. Manish Gupta",    spec:"Psychiatrist",        dept:"Psychiatry",      yrs:13, rating:4.8, room:"OPD 15", phone:"+91 98765 11211", email:"manish@asthahospital.in", status:"in-opd",   today:"3:00 PM – 7:00 PM", patients_today:7},
  {id:"d12",name:"Dr. Shruti Pal",      spec:"Dental Surgeon",      dept:"Dental",          yrs:8,  rating:4.7, room:"OPD 10", phone:"+91 98765 11212", email:"shruti@asthahospital.in", status:"off",      today:"Off today",         patients_today:0},
];

const PATIENTS = [
  {id:"P-10421", name:"Suresh Kumar",      age:62, sex:"M", phone:"+91 98113 22001", city:"Shimla",  blood:"O+",  last:"2 days ago",   reg:"Apr 12, 2024", insurance:"CGHS",          allergies:"Penicillin"},
  {id:"P-10844", name:"Priya Devi",        age:34, sex:"F", phone:"+91 98113 22002", city:"Solan",   blood:"A+",  last:"Today",        reg:"Aug 02, 2024", insurance:"Star Health",   allergies:"—"},
  {id:"P-11023", name:"Rakesh Verma",      age:48, sex:"M", phone:"+91 98113 22003", city:"Mandi",   blood:"B+",  last:"5 days ago",   reg:"Sep 18, 2024", insurance:"None",          allergies:"Sulfa drugs"},
  {id:"P-11102", name:"Anita Sharma",      age:29, sex:"F", phone:"+91 98113 22004", city:"Kullu",   blood:"AB+", last:"3 weeks ago",  reg:"Oct 04, 2024", insurance:"HDFC Ergo",     allergies:"—"},
  {id:"P-11287", name:"Devanshu Rana",     age:7,  sex:"M", phone:"+91 98113 22005", city:"Shimla",  blood:"O-",  last:"Today",        reg:"Nov 11, 2024", insurance:"CGHS",          allergies:"Peanuts"},
  {id:"P-11451", name:"Maya Chauhan",      age:55, sex:"F", phone:"+91 98113 22006", city:"Hamirpur",blood:"A-",  last:"1 week ago",   reg:"Dec 30, 2024", insurance:"ICICI Lombard", allergies:"Aspirin"},
  {id:"P-11620", name:"Arjun Negi",        age:23, sex:"M", phone:"+91 98113 22007", city:"Shimla",  blood:"B-",  last:"Today",        reg:"Jan 14, 2025", insurance:"None",          allergies:"—"},
  {id:"P-11788", name:"Geeta Bhandari",    age:71, sex:"F", phone:"+91 98113 22008", city:"Bilaspur",blood:"O+",  last:"4 days ago",   reg:"Feb 20, 2025", insurance:"Senior Citizen",allergies:"Iodine"},
  {id:"P-11942", name:"Mohan Lal",         age:39, sex:"M", phone:"+91 98113 22009", city:"Mandi",   blood:"A+",  last:"2 weeks ago",  reg:"Mar 08, 2025", insurance:"Star Health",   allergies:"—"},
  {id:"P-12110", name:"Kavita Goswami",    age:42, sex:"F", phone:"+91 98113 22010", city:"Solan",   blood:"AB-", last:"Yesterday",    reg:"Apr 12, 2025", insurance:"None",          allergies:"Latex"},
  {id:"P-12245", name:"Inderjeet Singh",   age:51, sex:"M", phone:"+91 98113 22011", city:"Kangra",  blood:"O+",  last:"Today",        reg:"May 02, 2025", insurance:"CGHS",          allergies:"—"},
  {id:"P-12389", name:"Rashmi Pandey",     age:18, sex:"F", phone:"+91 98113 22012", city:"Shimla",  blood:"B+",  last:"6 days ago",   reg:"Jun 19, 2025", insurance:"Parents'",      allergies:"—"},
];

// Appointments — 18 of them; spread Today / Tomorrow / This week
const APPOINTMENTS = [
  {id:"APT-2401", patient:"Suresh Kumar",   patientId:"P-10421", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",     time:"09:00",  date:"today",    status:"completed",  reason:"Follow-up · BP review", type:"In-person", source:"WhatsApp"},
  {id:"APT-2402", patient:"Priya Devi",     patientId:"P-10844", doctor:"Dr. Priya Verma",    dept:"Gynaecology",    time:"09:30",  date:"today",    status:"completed",  reason:"Prenatal check-up",      type:"In-person", source:"Walk-in"},
  {id:"APT-2403", patient:"Devanshu Rana",  patientId:"P-11287", doctor:"Dr. Meera Negi",     dept:"Paediatrics",    time:"10:00",  date:"today",    status:"in-progress",reason:"Fever + cough",          type:"In-person", source:"Online"},
  {id:"APT-2404", patient:"Arjun Negi",     patientId:"P-11620", doctor:"Dr. Sanjay Rana",    dept:"General Medicine",time:"10:15", date:"today",    status:"in-progress",reason:"Routine consult",        type:"In-person", source:"Walk-in"},
  {id:"APT-2405", patient:"Inderjeet Singh",patientId:"P-12245", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",     time:"10:45",  date:"today",    status:"waiting",    reason:"Chest discomfort",       type:"In-person", source:"Phone"},
  {id:"APT-2406", patient:"Anita Sharma",   patientId:"P-11102", doctor:"Dr. Priya Verma",    dept:"Gynaecology",    time:"11:15",  date:"today",    status:"waiting",    reason:"PCOS follow-up",         type:"In-person", source:"Online"},
  {id:"APT-2407", patient:"Geeta Bhandari", patientId:"P-11788", doctor:"Dr. Karan Mehta",    dept:"Dermatology",    time:"11:30",  date:"today",    status:"waiting",    reason:"Skin allergy",           type:"Video",     source:"WhatsApp"},
  {id:"APT-2408", patient:"Mohan Lal",      patientId:"P-11942", doctor:"Dr. Sanjay Rana",    dept:"General Medicine",time:"12:00", date:"today",    status:"scheduled",  reason:"Diabetes review",        type:"In-person", source:"Online"},
  {id:"APT-2409", patient:"Rakesh Verma",   patientId:"P-11023", doctor:"Dr. Rohan Thakur",   dept:"Orthopaedics",   time:"14:30",  date:"today",    status:"scheduled",  reason:"Knee pain consult",      type:"In-person", source:"Walk-in"},
  {id:"APT-2410", patient:"Kavita Goswami", patientId:"P-12110", doctor:"Dr. Nikhil Joshi",   dept:"Pulmonology",    time:"15:00",  date:"today",    status:"scheduled",  reason:"Asthma follow-up",       type:"In-person", source:"Phone"},
  {id:"APT-2411", patient:"Maya Chauhan",   patientId:"P-11451", doctor:"Dr. Aarti Kapoor",   dept:"Ophthalmology",  time:"15:30",  date:"today",    status:"scheduled",  reason:"Cataract pre-op",        type:"In-person", source:"Online"},
  {id:"APT-2412", patient:"Rashmi Pandey",  patientId:"P-12389", doctor:"Dr. Manish Gupta",   dept:"Psychiatry",     time:"16:00",  date:"today",    status:"scheduled",  reason:"Counselling session",    type:"Video",     source:"Online"},

  {id:"APT-2501", patient:"Suresh Kumar",   patientId:"P-10421", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",     time:"09:30",  date:"tomorrow", status:"scheduled",  reason:"Echo report review",     type:"In-person", source:"WhatsApp"},
  {id:"APT-2502", patient:"Priya Devi",     patientId:"P-10844", doctor:"Dr. Priya Verma",    dept:"Gynaecology",    time:"10:00",  date:"tomorrow", status:"scheduled",  reason:"Routine check-up",       type:"In-person", source:"Online"},
  {id:"APT-2503", patient:"Devanshu Rana",  patientId:"P-11287", doctor:"Dr. Meera Negi",     dept:"Paediatrics",    time:"11:00",  date:"tomorrow", status:"scheduled",  reason:"Vaccination",            type:"In-person", source:"Walk-in"},

  {id:"APT-2601", patient:"Mohan Lal",      patientId:"P-11942", doctor:"Dr. Sanjay Rana",    dept:"General Medicine",time:"09:00", date:"week",     status:"scheduled",  reason:"Annual health package",  type:"In-person", source:"Online"},
  {id:"APT-2602", patient:"Geeta Bhandari", patientId:"P-11788", doctor:"Dr. Aarti Kapoor",   dept:"Ophthalmology",  time:"10:30",  date:"week",     status:"scheduled",  reason:"Vision check",           type:"In-person", source:"Phone"},
  {id:"APT-2603", patient:"Anita Sharma",   patientId:"P-11102", doctor:"Dr. Karan Mehta",    dept:"Dermatology",    time:"15:00",  date:"week",     status:"scheduled",  reason:"Acne follow-up",         type:"Video",     source:"Online"},
];

const STATUS_PILL = {
  "scheduled":   {label:"Scheduled",   cls:"pill-sky"},
  "waiting":     {label:"Waiting",     cls:"pill-amber"},
  "in-progress": {label:"In Progress", cls:"pill-teal"},
  "completed":   {label:"Completed",   cls:"pill-green"},
  "cancelled":   {label:"Cancelled",   cls:"pill-red"},
  "no-show":     {label:"No-Show",     cls:"pill-slate"},
};

const DOCTOR_STATUS_PILL = {
  "in-opd":     {label:"In OPD",      cls:"pill-green"},
  "in-surgery": {label:"In Surgery",  cls:"pill-amber"},
  "break":      {label:"On Break",    cls:"pill-slate"},
  "on-call":    {label:"On Call",     cls:"pill-sky"},
  "off":        {label:"Off Today",   cls:"pill-red"},
};

window.DEPARTMENTS = DEPARTMENTS;
window.DOCTORS_DATA = DOCTORS;
window.PATIENTS = PATIENTS;
window.APPOINTMENTS = APPOINTMENTS;
window.STATUS_PILL = STATUS_PILL;
window.DOCTOR_STATUS_PILL = DOCTOR_STATUS_PILL;
