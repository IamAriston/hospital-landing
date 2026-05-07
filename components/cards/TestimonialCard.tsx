import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";

interface TestimonialCardProps {
  name: string;
  treatment: string;
  text: string;
  initial: string;
}

export default function TestimonialCard({
  name,
  treatment,
  text,
  initial,
}: TestimonialCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-6 pt-7 pb-6 flex flex-col gap-3.5 relative">
      <div className="absolute top-4.5 right-5.5 text-sky-100">
        <Icon name="quote" size={48} stroke={0} />
      </div>
      <div className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }, (_, k) => (
          <Icon
            key={k}
            name="star"
            size={16}
            stroke={1.5}
            className="fill-amber-400"
          />
        ))}
      </div>
      <p className="text-[15px] text-navy leading-[1.65] font-medium">
        "{text}"
      </p>
      <div className="mt-auto pt-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-display font-bold text-navy shrink-0">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-navy text-sm font-display truncate">
            {name}
          </div>
          <div className="text-[12.5px] text-slate-500 truncate">
            {treatment}
          </div>
        </div>
        <Pill variant="green" className="text-[11px] px-2.5 py-1 shrink-0">
          <Icon name="check" size={12} stroke={3} /> Verified
        </Pill>
      </div>
    </div>
  );
}
