import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import { homeConfig } from "@/config/home";
import type { IconName } from "@/components/ui/Icon";

export default function WhyAastha() {
  const { whyUs } = homeConfig;

  return (
    <section className="bg-navy text-white py-20 sm:py-24 relative overflow-hidden">
      {/* Mountain silhouette bg */}
      <svg
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0 500 L200 320 L350 420 L520 280 L700 380 L900 240 L1100 360 L1280 280 L1440 380 L1440 600 L0 600 Z"
          fill="#38BDF8"
        />
        <path
          d="M0 540 L150 420 L320 480 L500 380 L680 460 L860 340 L1040 440 L1240 360 L1440 460 L1440 600 L0 600 Z"
          fill="#0D9488"
        />
      </svg>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <Pill
            variant="custom"
            style={{
              background: "rgba(56,189,248,.15)",
              color: "#7DD3FC",
              border: "1px solid rgba(56,189,248,.25)",
            }}
          >
            <Icon name="mountain" size={13} stroke={2.2} />
            {whyUs.pill}
          </Pill>
          <h2 className="text-white text-[36px] sm:text-[40px] font-extrabold font-display mt-4 leading-[1.15]">
            {whyUs.headline}
          </h2>
          <p className="text-sky-200 text-lg mt-3 leading-relaxed">
            {whyUs.body}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 items-stretch">
          {/* Photo */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-85 lg:min-h-110">
            <Image
              src={whyUs.image}
              alt="Aastha hospital interior"
              fill
              className="object-cover"
              style={{ filter: "saturate(1.05)" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/10 to-transparent" />
            <div className="absolute left-6 bottom-6 right-6">
              <Pill
                variant="custom"
                style={{
                  background: "rgba(13,148,136,.95)",
                  color: "#fff",
                  border: "none",
                }}
              >
                <Icon name="play2" size={11} />
                {whyUs.imageCaption.pill}
              </Pill>
              <h3 className="text-white text-[26px] font-bold font-display mt-3 leading-snug whitespace-pre-line">
                {whyUs.imageCaption.title}
              </h3>
            </div>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
            {whyUs.points.map((p) => (
              <div
                key={p.title}
                className="bg-navy-dark border border-white/10 rounded-2xl p-6 flex flex-col gap-2.5"
              >
                <div className="w-11 h-11 rounded-[10px] bg-teal-600/20 text-teal-300 inline-flex items-center justify-center">
                  <Icon name={p.icon as IconName} size={22} stroke={1.7} />
                </div>
                <h4 className="text-white text-[17px] font-bold font-display">
                  {p.title}
                </h4>
                <p className="text-slate-400 text-[13.5px] leading-relaxed m-0">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
