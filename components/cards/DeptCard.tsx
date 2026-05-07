import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

interface DeptCardProps {
  icon: string;
  name: string;
  desc: string;
}

export default function DeptCard({ icon, name, desc }: DeptCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 group hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_10px_24px_-14px_rgba(13,148,136,.25)] transition-all duration-200 cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center">
        <Icon name={icon as IconName} size={24} stroke={1.7} />
      </div>
      <h3 className="mt-4 text-base font-bold text-navy font-display">
        {name}
      </h3>
      <p className="mt-1 text-[13.5px] text-slate-500">{desc}</p>
      <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 group-hover:gap-2.5 transition-all">
        Learn More <Icon name="arrowSmall" size={14} stroke={2.4} />
      </span>
    </div>
  );
}
