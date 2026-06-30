"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { doctorInfoPoints } from "@/config/doctors";
import { isAvailableToday, availabilityLabel } from "@/lib/schedule";
import { doctorRowToCardProps } from "@/lib/doctor-adapter";
import { cn } from "@/lib/cn";
import type { IconName } from "@/components/ui/Icon";
import type { DoctorRow } from "@/types/database";

type Item = { row: DoctorRow; departmentName: string | null };

interface DoctorsListProps {
  items: Item[];
  deptNames: string[];
}

export function DoctorsList({ items, deptNames }: DoctorsListProps) {
  const [filter, setFilter] = useState("All");
  const allDepts = ["All", ...deptNames];

  const visible =
    filter === "All"
      ? items
      : items.filter((i) => i.departmentName === filter);

  return (
    <div className="bg-cream">
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {allDepts.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={cn(
                  "px-4 py-2 rounded-full text-[13.5px] font-semibold font-display border transition-colors",
                  filter === dept
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-navy border-slate-200 hover:border-slate-400",
                )}
              >
                {dept}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              No doctors listed yet. Please check back soon.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map(({ row, departmentName }) => {
                const card = doctorRowToCardProps(row, departmentName);
                const today = isAvailableToday(card.schedule);
                const label = availabilityLabel(card.schedule);
                return (
                  <div
                    key={row.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-200 hover:shadow-hover-navy transition-all duration-200"
                  >
                    <div className={`h-28 flex items-center px-6 gap-5 bg-gradient-to-r to-white ${card.tone}`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold font-display text-navy border-2 border-white shadow-md shrink-0 ${card.toneBg}`}>
                        {card.initial}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold rounded-full px-3 py-1 border ${today ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${today ? "bg-green-500" : "bg-slate-400"}`} />
                        {label}
                      </span>
                    </div>

                    <div className="px-6 py-5">
                      <h3 className="font-extrabold text-navy font-display text-[17px] leading-snug">{card.name}</h3>
                      <p className="text-sky-600 text-[13.5px] font-semibold mt-0.5">{card.spec}</p>
                      <div className="flex flex-wrap gap-2 items-center mt-3">
                        <span className="bg-slate-100 text-navy px-2.5 py-0.5 rounded-full text-[11.5px] font-medium">{card.dept}</span>
                        <span className="inline-flex items-center gap-1 text-amber-500 text-[12.5px] font-semibold">
                          <Icon name="star" size={12} stroke={0} className="fill-amber-400 text-amber-400" />
                          {card.rating}
                        </span>
                        <span className="text-slate-400 text-[12.5px]">{card.yrs} yrs experience</span>
                      </div>
                      <Link
                        href="/#book"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-sky-400 text-sky-ink text-[14px] font-semibold font-display hover:bg-sky-500 transition-colors"
                      >
                        <Icon name="calendar" size={15} stroke={2} />
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-[18px] font-extrabold text-navy font-display">
                Looking for someone specific?
              </h3>
              <p className="mt-2 text-[14.5px] text-slate-500 leading-relaxed">
                Book online and tell us your condition — our coordinators will match you with the right specialist.
              </p>
            </div>
            <Link
              href="/#book"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[15px]"
            >
              <Icon name="calendar" size={16} stroke={2} />
              Book Appointment
            </Link>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-5">
            {doctorInfoPoints.map((pt) => (
              <div key={pt.title} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                  <Icon name={pt.icon as IconName} size={18} stroke={1.8} />
                </div>
                <h4 className="font-bold text-navy font-display text-[14.5px]">{pt.title}</h4>
                <p className="mt-1.5 text-[13px] text-slate-500 leading-relaxed">{pt.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
