import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-cream px-5">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
          <Icon
            name="search"
            size={36}
            stroke={1.5}
            className="text-teal-600"
          />
        </div>

        <div className="text-[96px] font-extrabold font-display text-navy leading-none tracking-tight">
          404
        </div>
        <h1 className="mt-3 text-2xl font-bold text-navy font-display">
          Page not found
        </h1>
        <p className="mt-3 text-slate-500 text-[16px] leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let us
          help you find your way.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Button href="/" variant="outline" size="lg">
            <Icon name="home" size={18} stroke={2} />
            Back to Home
          </Button>
          <Button href="#book" variant="sky" size="lg">
            <Icon name="calendar" size={18} stroke={2} />
            Book Appointment
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          Need help?{" "}
          <a
            href={`tel:${siteConfig.phone}`}
            className="text-teal-600 font-semibold hover:underline"
          >
            Call {siteConfig.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
