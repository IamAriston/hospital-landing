import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface Props {
  breadcrumb: BreadcrumbItem[];
  title: React.ReactNode;
  subtitle?: string;
  /** Extra content below subtitle (e.g. OPD badge) */
  children?: React.ReactNode;
  compact?: boolean; // smaller vertical padding
}

export default function PageHero({
  breadcrumb,
  title,
  subtitle,
  children,
  compact = false,
}: Props) {
  const py = compact ? "py-14 sm:py-20" : "py-16 sm:py-24";
  return (
    <div className={`bg-navy ${py}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-[40px] sm:text-[52px] font-extrabold text-white font-display leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-[17px] text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
