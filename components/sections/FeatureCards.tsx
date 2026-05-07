import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/cards/FeatureCard";
import { homeConfig } from "@/config/home";

export default function FeatureCards() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <SectionHeader
          title="Everything You Need, In One Place"
          subtitle="Care that fits the rhythm of life in the hills — from a quick consultation to round-the-clock emergency response."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeConfig.features.map((f) => (
            <FeatureCard key={f.name} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
