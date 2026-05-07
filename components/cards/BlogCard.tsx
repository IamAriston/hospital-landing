import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface BlogCardProps {
  category: string;
  title: string;
  doctor: string;
  date: string;
  readTime: string;
  tone: string;
  featured?: boolean;
}

export default function BlogCard({
  category,
  title,
  doctor,
  date,
  readTime,
  tone,
  featured = false,
}: BlogCardProps) {
  return (
    <article
      className={cn(
        "bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer",
        "hover:-translate-y-1 hover:shadow-[0_14px_28px_-16px_rgba(12,35,64,.18)] transition-all duration-200 group",
        featured ? "flex flex-col" : "grid grid-cols-[160px_1fr]",
      )}
    >
      {/* Thumb */}
      <div
        className={cn(
          "flex items-center justify-center relative bg-linear-to-br",
          featured
            ? "h-50 sm:h-70 border-b border-slate-200"
            : "border-r border-slate-200",
        )}
        style={{ background: `linear-gradient(135deg, ${tone} 0%, #fff 100%)` }}
      >
        <Icon
          name="book"
          size={featured ? 64 : 36}
          stroke={1.4}
          className="text-navy/20"
        />
        <span className="absolute top-3.5 left-3.5 bg-teal-600 text-white px-2.5 py-1 rounded-full text-[11px] font-semibold">
          {category}
        </span>
      </div>
      {/* Content */}
      <div
        className={cn(
          "flex flex-col",
          featured ? "px-6 sm:px-7 py-6 sm:py-7" : "px-5 py-4.5",
        )}
      >
        <h3
          className={cn(
            "font-bold text-navy font-display leading-snug",
            featured ? "text-xl sm:text-[22px]" : "text-base",
          )}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 items-center mt-3 text-[12.5px] text-slate-500">
          <span className="font-semibold text-navy">{doctor}</span>
          <span>·</span>
          <span>{date}</span>
          <span>·</span>
          <span>{readTime} read</span>
        </div>
        <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
          Read More <Icon name="arrowSmall" size={14} stroke={2.4} />
        </span>
      </div>
    </article>
  );
}
