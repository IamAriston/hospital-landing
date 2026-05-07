import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/cards/BlogCard";
import Icon from "@/components/ui/Icon";
import { homeConfig } from "@/config/home";

export default function BlogsSection() {
  const [featured, ...rest] = homeConfig.blogs;

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="left"
          title="Health Tips by Our Doctors"
          subtitle="Practical advice from our specialists, written for people in the hills."
          action={
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-teal-600 font-semibold hover:gap-3 transition-all">
              View All <Icon name="arrowSmall" size={16} stroke={2.2} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
          <BlogCard {...featured} featured />
          <div className="flex flex-col gap-6">
            {rest.map((b) => (
              <BlogCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
