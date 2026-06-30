"use client";

import Icon from "@/components/ui/Icon";
import { type Schedule, isAvailableToday, availabilityLabel } from "@/lib/schedule";

interface DoctorCardProps {
  name: string;
  spec: string;
  dept: string;
  yrs: number;
  rating: number;
  schedule: Schedule;
  initial: string;
  tone: string;
  toneBg?: string;
}

export default function DoctorCard({
  name,
  spec,
  dept,
  yrs,
  rating,
  schedule,
  initial,
  tone,
}: DoctorCardProps) {
  const today = isAvailableToday(schedule);
  const label = availabilityLabel(schedule);

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-hover-md hover:border-sky-200 transition-all duration-200 snap-start shrink-0">
      {/* Avatar area */}
      <div
        className={`relative flex items-center justify-center border-b border-slate-200 aspect-square bg-gradient-to-br to-white ${tone}`}
      >
        <div className="w-30 h-30 rounded-full bg-white border-[3px] border-white shadow-avatar flex items-center justify-center text-navy font-display text-[36px] font-bold">
          {initial}
        </div>
        <span
          className={`absolute top-3 left-3 border px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1.5 ${
            today
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${today ? "bg-green-600" : "bg-slate-400"}`} />
          {label}
        </span>
      </div>
      {/* Info */}
      <div className="px-4.5 py-4.5">
        <h3 className="text-base font-bold text-navy font-display">{name}</h3>
        <div className="text-teal-600 text-[13.5px] font-semibold mt-0.5">
          {spec}
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-2.5">
          <span className="bg-slate-100 text-navy px-2.5 py-0.5 rounded-full text-[11.5px] font-medium">
            {dept}
          </span>
          <span className="inline-flex items-center gap-1 text-amber-600 text-[12.5px] font-semibold">
            <Icon
              name="star"
              size={13}
              stroke={1.5}
              className="fill-amber-400 text-amber-400"
            />
            {rating}
          </span>
          <span className="text-slate-500 text-[12.5px]">· {yrs} yrs exp</span>
        </div>
        <button className="w-full mt-3.5 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-sky-400 text-sky-ink text-[13px] font-semibold font-display hover:bg-sky-500 transition-colors">
          <Icon name="calendar" size={15} stroke={2} />
          Book Appointment
        </button>
      </div>
    </div>
  );
}
