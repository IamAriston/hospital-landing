"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import DoctorCard from "@/components/cards/DoctorCard";
import Icon from "@/components/ui/Icon";
import { homeConfig } from "@/config/home";

export default function DoctorsSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="left"
          title="Meet Our Specialists"
          subtitle="Experienced consultants across every major specialty — many trained at India's leading institutions."
          action={
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scroll(-1)}
                className="w-9.5 h-9.5 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center text-navy hover:bg-slate-50 transition-colors"
              >
                <Icon
                  name="arrowSmall"
                  size={16}
                  stroke={2.2}
                  className="rotate-180"
                />
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-9.5 h-9.5 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center text-navy hover:bg-slate-50 transition-colors"
              >
                <Icon name="arrowSmall" size={16} stroke={2.2} />
              </button>
              <a href="/doctors" className="inline-flex items-center gap-1.5 text-teal-600 font-semibold hover:gap-3 transition-all">
                View All Doctors{" "}
                <Icon name="arrowSmall" size={16} stroke={2.2} />
              </a>
            </div>
          }
        />
        <div
          ref={scrollerRef}
          className="grid grid-flow-col auto-cols-[calc(50%-12px)] sm:auto-cols-[calc(33.33%-16px)] lg:auto-cols-[calc(25%-18px)] gap-6 overflow-x-auto snap-x pb-2 scrollbar-thin"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {homeConfig.doctors.map((d) => (
            <DoctorCard key={d.name} {...d} />
          ))}
        </div>
      </div>
    </section>
  );
}
