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
import { getDepartments } from "@/lib/db/departments";
import { getDoctors } from "@/lib/db/doctors";

export const metadata: Metadata = {
  title: homeConfig.meta.title,
  description: homeConfig.meta.description,
};

export const dynamic = "force-dynamic";

const { sections } = homeConfig;

export default async function HomePage() {
  const [departments, doctors] = await Promise.all([getDepartments(), getDoctors()]);

  const bookingDepartments = departments.map((d) => ({ id: d.id, name: d.name }));
  const bookingDoctors = doctors.map((d) => ({
    id: d.id,
    name: d.name,
    department_id: d.department_id,
  }));

  return (
    <>
      {sections.hero && <Hero />}
      {sections.stats && <StatsBand />}
      {sections.features && <FeatureCards />}
      {sections.departments && <Departments />}
      {sections.whyUs && <WhyAastha />}
      {sections.doctors && <DoctorsSection />}
      {sections.booking && (
        <BookAppointment departments={bookingDepartments} doctors={bookingDoctors} />
      )}
      {sections.testimonials && <Testimonials />}
      {sections.blogs && <BlogsSection />}
      {sections.emergency && <EmergencyCTA />}
    </>
  );
}
