"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/config/site";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const scrollToBook = () => {
    const el = document.getElementById("book");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 z-[60] bg-white border-t-[3px] border-teal-600 lg:hidden shadow-[0_-4px_20px_rgba(12,35,64,.08)]">
      <div className="grid grid-cols-4">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center gap-1 py-2.5",
            pathname === "/" ? "text-teal-600" : "text-navy",
          )}
        >
          <Icon name="home" size={22} stroke={1.8} />
          <span className="text-[11px] font-semibold font-display">Home</span>
        </Link>

        <Link
          href="/doctors"
          className={cn(
            "flex flex-col items-center gap-1 py-2.5",
            pathname === "/doctors" ? "text-teal-600" : "text-navy",
          )}
        >
          <Icon name="stethoscope" size={22} stroke={1.8} />
          <span className="text-[11px] font-semibold font-display">Doctors</span>
        </Link>

        <button
          onClick={scrollToBook}
          className="flex flex-col items-center gap-1 py-2.5 bg-sky-400 text-[#04293F]"
        >
          <Icon name="calendar" size={22} stroke={1.8} />
          <span className="text-[11px] font-semibold font-display">Book</span>
        </button>

        <a
          href={`tel:${siteConfig.phone}`}
          className="flex flex-col items-center gap-1 py-2.5 text-navy"
        >
          <Icon name="phone" size={22} stroke={1.8} />
          <span className="text-[11px] font-semibold font-display">Call</span>
        </a>
      </div>
    </div>
  );
}
