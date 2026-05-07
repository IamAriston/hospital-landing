interface Milestone {
  year: string;
  event: string;
}

interface Props {
  items: Milestone[];
}

export default function MilestoneTimeline({ items }: Props) {
  return (
    <div className="relative pl-4 border-l-2 border-slate-200 flex flex-col gap-6">
      {items.map((m, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-6.25 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm" />
          <div className="text-[11.5px] font-bold text-teal-600 uppercase tracking-wider">
            {m.year}
          </div>
          <div className="mt-0.5 text-[14.5px] text-navy font-medium">
            {m.event}
          </div>
        </div>
      ))}
    </div>
  );
}
