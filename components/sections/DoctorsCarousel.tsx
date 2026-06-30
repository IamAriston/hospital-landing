"use client";

import { useRef } from "react";
import DoctorCard from "@/components/cards/DoctorCard";
import Icon from "@/components/ui/Icon";
import type { Schedule } from "@/lib/schedule";

type Card = {
  name: string;
  spec: string;
  dept: string;
  yrs: number;
  rating: number;
  schedule: Schedule;
  initial: string;
  tone: string;
  toneBg: string;
};

export function DoctorsCarousel({ cards }: { cards: Card[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <>
      <div className="flex justify-end gap-2.5 mb-4">
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="w-9.5 h-9.5 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center text-navy hover:bg-slate-50 transition-colors"
        >
          <Icon name="arrowSmall" size={16} stroke={2.2} className="rotate-180" />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="w-9.5 h-9.5 rounded-[10px] border border-slate-200 bg-white inline-flex items-center justify-center text-navy hover:bg-slate-50 transition-colors"
        >
          <Icon name="arrowSmall" size={16} stroke={2.2} />
        </button>
        <a
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-teal-600 font-semibold hover:gap-3 transition-all"
        >
          View All Doctors <Icon name="arrowSmall" size={16} stroke={2.2} />
        </a>
      </div>
      <div
        ref={scrollerRef}
        className="grid grid-flow-col auto-cols-[calc(50%-12px)] sm:auto-cols-[calc(33.33%-16px)] lg:auto-cols-[calc(25%-18px)] gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin"
      >
        {cards.map((d) => (
          <DoctorCard key={d.name} {...d} />
        ))}
      </div>
    </>
  );
}
