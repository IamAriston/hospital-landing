import Icon from "@/components/ui/Icon";
import Pill from "@/components/ui/Pill";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { homeConfig } from "@/config/home";

export default function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-[32px] sm:text-[36px] font-extrabold text-navy font-display">
            What Our Patients Say
          </h2>
          <Pill variant="sky" className="mt-4">
            <Icon
              name="star"
              size={13}
              stroke={1.5}
              className="fill-amber-400 text-amber-400"
            />
            4.8 average rating · 320+ verified patients
          </Pill>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeConfig.testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>

        {/* Review badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-9">
          <div className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 rounded-[10px] bg-white">
            <div className="w-6 h-6 rounded-md bg-linear-to-br from-blue-500 via-red-500 to-yellow-400" />
            <div>
              <div className="text-xs text-slate-500">Google Reviews</div>
              <div className="text-sm font-bold text-navy">
                4.8 ★ · 210 reviews
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 border border-slate-200 rounded-[10px] bg-white">
            <div className="w-6 h-6 rounded-md bg-[#01796F] text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <div className="text-xs text-slate-500">Practo</div>
              <div className="text-sm font-bold text-navy">
                4.9 ★ · Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
