import Link from "next/link";
import Icon from "@/components/ui/Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  light?: boolean; // true = on navy bg (default), false = on light bg
}

export default function Breadcrumb({ items, light = true }: Props) {
  const mutedClass  = light ? "text-slate-500" : "text-slate-400";
  const activeClass = light ? "text-slate-400" : "text-slate-600";
  const hoverClass  = light ? "hover:text-sky-400" : "hover:text-teal-600";

  return (
    <div className={`flex items-center gap-2 text-[13px] ${mutedClass} mb-5`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <Icon name="arrowSmall" size={13} stroke={2} className="text-slate-600 shrink-0" />
          )}
          {item.href ? (
            <Link href={item.href} className={`${hoverClass} transition-colors`}>
              {item.label}
            </Link>
          ) : (
            <span className={activeClass}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
