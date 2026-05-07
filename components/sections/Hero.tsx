import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import Button from "@/components/ui/Button";
import TopoLines from "@/components/ui/TopoLines";
import OpdBadge from "@/components/ui/OpdBadge";
import { homeConfig } from "@/config/home";
import { siteConfig } from "@/config/site";

export default function Hero() {
  const { hero } = homeConfig;
  const waNumber = siteConfig.whatsapp.replace(/\D/g, "");

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Cream wash right half */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hero.bgFade
            ? "linear-gradient(to right, transparent 30%, rgba(250,247,242,.5) 48%, #FAF7F2 68%)"
            : "linear-gradient(to right, transparent 50%, rgba(250,247,242,.85) 50%, #FAF7F2 100%)",
        }}
      />
      <TopoLines size={hero.topoLines} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <Pill variant="teal">
            <Icon name="mountain" size={14} stroke={2.2} />
            {hero.pill}
          </Pill>

          <h1 className="mt-6 text-[40px] sm:text-[52px] lg:text-[56px] font-extrabold text-navy font-display leading-[1.1] tracking-tight">
            Advanced Healthcare,
            <br />
            <span className="text-teal-600">Amidst the Mountains.</span>
          </h1>

          <p className="mt-5 text-[17px] sm:text-lg text-slate-600 max-w-140 leading-[1.65]">
            {hero.body}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button href="#book" variant="sky" size="lg">
              <Icon name="calendar" size={18} stroke={2} />
              Book Appointment
            </Button>
            <Button href="/doctors" variant="tealOutline" size="lg">
              <Icon name="search" size={18} stroke={2} />
              Find a Doctor
            </Button>
            <Button
              href={`https://wa.me/${waNumber}`}
              variant="whatsapp"
              size="lg"
            >
              <Icon name="whatsapp" size={18} stroke={2} />
              Chat with Us
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-9 pt-6 border-t border-slate-200 flex flex-wrap gap-x-6 gap-y-3">
            {hero.trustPoints.map((point) => (
              <div
                key={point}
                className="flex items-center gap-2 text-sm text-navy font-medium"
              >
                <span className="w-5.5 h-5.5 rounded-full bg-teal-50 text-teal-600 inline-flex items-center justify-center shrink-0">
                  <Icon name="check" size={13} stroke={2.5} />
                </span>
                {point}
              </div>
            ))}
          </div>
        </div>

        {/* Right — photo */}
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden aspect-4/5 bg-cream border border-[#EDE5D5] shadow-[0_1px_2px_rgba(12,35,64,.06),0_20px_50px_-20px_rgba(12,35,64,.25)]">
            <Image
              src={hero.image}
              alt={`${siteConfig.fullName} exterior`}
              className="object-cover object-center"
              fill
              priority
            />
          </div>

          {/* Badge */}
          <div className="absolute top-4.5 right-4.5 bg-teal-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-[0_4px_14px_rgba(13,148,136,.35)] flex items-center gap-1.5">
            <Icon name="shield" size={13} stroke={2.4} />
            {hero.imageBadge}
          </div>

          {/* OPD open card — computed client-side from current time */}
          <div className="absolute -left-4.5 bottom-6">
            <OpdBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
