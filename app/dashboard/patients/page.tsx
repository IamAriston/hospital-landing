"use client";

import * as React from "react";
import { Download, Plus, X, Calendar, Phone, Pencil, ChevronRight } from "lucide-react";
import { DashCard } from "@/components/dashboard/ui/dash-card";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { StatusBadge } from "@/components/dashboard/ui/status-badge";
import { DashAvatar } from "@/components/dashboard/ui/dash-avatar";
import { ActionBtn } from "@/components/dashboard/ui/action-btn";
import { FilterBar, ChipRow, ClearBtn } from "@/components/dashboard/ui/filter-bar";
import { PatientPanel } from "@/components/forms/patient-form";
import { cn } from "@/lib/utils";

const PATIENTS = [
  { id:"P-10421", name:"Suresh Kumar",    age:62, sex:"M", phone:"+91 98113 22001", city:"Shimla",   blood:"O+",  last:"2 days ago",  reg:"Apr 12, 2024", insurance:"CGHS",           allergies:"Penicillin"   },
  { id:"P-10844", name:"Priya Devi",      age:34, sex:"F", phone:"+91 98113 22002", city:"Solan",    blood:"A+",  last:"Today",       reg:"Aug 02, 2024", insurance:"Star Health",    allergies:"—"            },
  { id:"P-11023", name:"Rakesh Verma",    age:48, sex:"M", phone:"+91 98113 22003", city:"Mandi",    blood:"B+",  last:"5 days ago",  reg:"Sep 18, 2024", insurance:"None",           allergies:"Sulfa drugs"  },
  { id:"P-11102", name:"Anita Sharma",    age:29, sex:"F", phone:"+91 98113 22004", city:"Kullu",    blood:"AB+", last:"3 weeks ago", reg:"Oct 04, 2024", insurance:"HDFC Ergo",      allergies:"—"            },
  { id:"P-11287", name:"Devanshu Rana",   age:7,  sex:"M", phone:"+91 98113 22005", city:"Shimla",   blood:"O-",  last:"Today",       reg:"Nov 11, 2024", insurance:"CGHS",           allergies:"Peanuts"      },
  { id:"P-11451", name:"Maya Chauhan",    age:55, sex:"F", phone:"+91 98113 22006", city:"Hamirpur", blood:"A-",  last:"1 week ago",  reg:"Dec 30, 2024", insurance:"ICICI Lombard",  allergies:"Aspirin"      },
  { id:"P-11620", name:"Arjun Negi",      age:23, sex:"M", phone:"+91 98113 22007", city:"Shimla",   blood:"B-",  last:"Today",       reg:"Jan 14, 2025", insurance:"None",           allergies:"—"            },
  { id:"P-11788", name:"Geeta Bhandari",  age:71, sex:"F", phone:"+91 98113 22008", city:"Bilaspur", blood:"O+",  last:"4 days ago",  reg:"Feb 20, 2025", insurance:"Senior Citizen", allergies:"Iodine"       },
  { id:"P-11942", name:"Mohan Lal",       age:39, sex:"M", phone:"+91 98113 22009", city:"Mandi",    blood:"A+",  last:"2 weeks ago", reg:"Mar 08, 2025", insurance:"Star Health",    allergies:"—"            },
  { id:"P-12110", name:"Kavita Goswami",  age:42, sex:"F", phone:"+91 98113 22010", city:"Solan",    blood:"AB-", last:"Yesterday",   reg:"Apr 12, 2025", insurance:"None",           allergies:"Latex"        },
  { id:"P-12245", name:"Inderjeet Singh", age:51, sex:"M", phone:"+91 98113 22011", city:"Kangra",   blood:"O+",  last:"Today",       reg:"May 02, 2025", insurance:"CGHS",           allergies:"—"            },
  { id:"P-12389", name:"Rashmi Pandey",   age:18, sex:"F", phone:"+91 98113 22012", city:"Shimla",   blood:"B+",  last:"6 days ago",  reg:"Jun 19, 2025", insurance:"Parents'",       allergies:"—"            },
];

const APPOINTMENTS = [
  { id:"APT-2401", patientId:"P-10421", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",  time:"09:00", date:"today",    status:"completed"   },
  { id:"APT-2403", patientId:"P-11287", doctor:"Dr. Meera Negi",     dept:"Paediatrics", time:"10:00", date:"today",    status:"in-progress" },
  { id:"APT-2405", patientId:"P-12245", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",  time:"10:45", date:"today",    status:"waiting"     },
  { id:"APT-2501", patientId:"P-10421", doctor:"Dr. Anjali Sharma",  dept:"Cardiology",  time:"09:30", date:"tomorrow", status:"scheduled"   },
];

const GENDER_CHIPS = [
  { value: "all", label: "All"    },
  { value: "M",   label: "Male"   },
  { value: "F",   label: "Female" },
];

type Patient = typeof PATIENTS[number];

function PatientDrawer({ p, onClose }: { p: Patient; onClose: () => void }) {
  const appts = APPOINTMENTS.filter((a) => a.patientId === p.id);
  return (
    <DashCard noPad className="overflow-hidden sticky top-[88px] self-start">
      {/* Teal gradient header — Tailwind arbitrary gradient */}
      <div className="relative p-5 pb-4 bg-gradient-to-br from-brand-teal to-brand-teal-700 text-white">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors bg-white/15 border-none text-white"
        >
          <X size={15} />
        </button>
        <DashAvatar name={p.name} size={56} className="mb-3" />
        <h3 className="text-[19px] font-bold text-white">{p.name}</h3>
        <p className="text-[13px] mt-0.5 text-white/85">
          {p.id} · {p.age} yrs · {p.sex === "M" ? "Male" : "Female"}
        </p>
        <div className="flex gap-2 mt-3.5">
          {[{ icon: Calendar, label: "Book" }, { icon: Phone, label: "Call" }, { icon: Pencil, label: "Edit" }].map((btn) => (
            <button
              key={btn.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold cursor-pointer border-none transition-opacity hover:opacity-80 bg-white/18 text-white"
            >
              <btn.icon size={14} /> {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Blood Group", value: p.blood, mono: true },
            { label: "City",        value: p.city },
            { label: "Phone",       value: p.phone, mono: true },
            { label: "Insurance",   value: p.insurance },
            { label: "Registered",  value: p.reg },
            { label: "Last Visit",  value: p.last },
          ].map(({ label, value, mono }) => (
            <div key={label}>
              <div className="text-[10.5px] text-dash-text-mute uppercase tracking-[.1em] font-bold">{label}</div>
              <div className={cn("text-[13.5px] text-dash-text mt-0.5 font-medium", mono && "font-mono")}>{value}</div>
            </div>
          ))}
        </div>

        {p.allergies !== "—" && (
          <div className="flex gap-2 p-2.5 rounded-xl border mb-4 bg-amber-50 border-amber-200 text-amber-700">
            <div className="text-[12.5px]">
              <strong className="text-amber-800">Allergies:</strong> {p.allergies}
            </div>
          </div>
        )}

        <h4 className="text-[11.5px] uppercase tracking-[.1em] text-dash-text-mute font-bold mb-2.5">Recent Appointments</h4>
        {appts.length === 0 && <p className="text-[13px] text-dash-text-mute py-3">No appointments on record.</p>}
        <div className="flex flex-col gap-2">
          {appts.slice(0, 4).map((a) => (
            <div key={a.id} className="flex gap-2.5 items-center p-2.5 bg-dash-surface-3 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-brand-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                <Calendar size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-dash-text truncate">{a.doctor}</div>
                <div className="text-[11.5px] text-dash-text-mute">{a.dept} · {a.time}</div>
              </div>
              <StatusBadge status={a.status} small />
            </div>
          ))}
        </div>
      </div>
    </DashCard>
  );
}

export default function PatientsPage() {
  const [selected, setSelected] = React.useState<Patient | null>(null);
  const [search, setSearch] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("all");
  const [patientOpen, setPatientOpen] = React.useState(false);

  const term = search.toLowerCase();
  const filtered = PATIENTS.filter((p) => {
    if (genderFilter !== "all" && p.sex !== genderFilter) return false;
    if (!term) return true;
    return p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term) || p.phone.includes(term) || p.city.toLowerCase().includes(term);
  });

  return (
    <div className="p-7 pb-16">
      <PageHeader
        title="Patient Records"
        subtitle={`${filtered.length} patients · search by name, ID, phone or city`}
        actions={
          <>
            <ActionBtn variant="secondary" icon={<Download size={15} />}>Export CSV</ActionBtn>
            <ActionBtn variant="primary" icon={<Plus size={15} strokeWidth={2.4} />} onClick={() => setPatientOpen(true)}>
              Register Patient
            </ActionBtn>
          </>
        }
      />

      {/* Search & filter bar */}
      <FilterBar>
        <div className="relative flex-1 min-w-[240px] max-w-[480px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-text-mute pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, ID, phone, city…"
            className="w-full pl-9 pr-3.5 py-2 border border-dash-border rounded-xl bg-dash-surface text-[14px] text-dash-text placeholder:text-dash-text-mute outline-none focus:border-brand-teal transition-all"
          />
        </div>
        <ChipRow options={GENDER_CHIPS} value={genderFilter} onChange={setGenderFilter} />
        <span className="dash-pill dash-pill-slate ml-auto !px-[10px] !py-[5px]">
          Showing <strong className="mx-1">{filtered.length}</strong> of {PATIENTS.length}
        </span>
      </FilterBar>

      {/* Table + Drawer */}
      <div className={cn("grid gap-[18px]", selected ? "grid-cols-[1fr_360px]" : "grid-cols-1")}>
        <DashCard noPad className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Patient ID","Name","Age / Sex","Phone","City","Blood","Last Visit","Insurance",""].map((h) => (
                  <th key={h} className="text-left px-[18px] py-3.5 text-[11px] font-bold text-dash-text-mute uppercase tracking-[.08em] border-b border-dash-border bg-dash-surface whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={cn(
                    "dash-table-row cursor-pointer transition-colors",
                    selected?.id === p.id ? "bg-dash-surface-3" : "hover:bg-dash-surface-3",
                  )}
                  onClick={() => setSelected(p)}
                >
                  <td className="px-[18px] py-3.5 border-b border-dash-border font-mono text-[12.5px] text-dash-text-mute">{p.id}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    <div className="flex items-center gap-2.5">
                      <DashAvatar name={p.name} size={32} />
                      <span className="font-semibold text-[13.5px] text-dash-text">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13.5px] text-dash-text">{p.age} · {p.sex === "M" ? "Male" : "Female"}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border font-mono text-[13px] text-dash-text">{p.phone}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13.5px] text-dash-text">{p.city}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    <span className="inline-flex items-center bg-red-50 text-red-800 border border-red-200 font-mono font-bold px-2 py-[2px] rounded-full text-[11.5px]">{p.blood}</span>
                  </td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13px] text-dash-text-dim">{p.last}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border text-[13px] text-dash-text-dim">{p.insurance}</td>
                  <td className="px-[18px] py-3.5 border-b border-dash-border">
                    <ChevronRight size={15} className="text-dash-text-mute" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-dash-text-mute text-sm">No patients match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </DashCard>

        {selected && <PatientDrawer p={selected} onClose={() => setSelected(null)} />}
      </div>

      <PatientPanel open={patientOpen} onClose={() => setPatientOpen(false)} />
    </div>
  );
}
