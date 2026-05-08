import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import StatsBand from "@/components/sections/StatsBand";
import FeatureCards from "@/components/sections/FeatureCards";
import Departments from "@/components/sections/Departments";
import WhyAastha from "@/components/sections/WhyAastha";
import DoctorsSection from "@/components/sections/DoctorsSection";
import BookAppointment from "@/components/sections/BookAppointment";
import Testimonials from "@/components/sections/Testimonials";
import BlogsSection from "@/components/sections/BlogsSection";
import EmergencyCTA from "@/components/sections/EmergencyCTA";
import { homeConfig } from "@/config/home";

export const metadata: Metadata = {
  title: homeConfig.meta.title,
  description: homeConfig.meta.description,
};

const { sections } = homeConfig;

export default function HomePage() {
  return (
    <>
      {sections.hero && <Hero />}
      {sections.stats && <StatsBand />}
      {sections.features && <FeatureCards />}
      {sections.departments && <Departments />}
      {sections.whyUs && <WhyAastha />}
      {sections.doctors && <DoctorsSection />}
      {sections.booking && <BookAppointment />}
      {sections.testimonials && <Testimonials />}
      {sections.blogs && <BlogsSection />}
      {sections.emergency && <EmergencyCTA />}
    </>
  );
}
