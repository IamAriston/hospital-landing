"use client";

import { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/cards/BlogCard";
import { homeConfig } from "@/config/home";
import { cn } from "@/lib/cn";

const ALL = "All";

export default function BlogPage() {
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(homeConfig.blogs.map((b) => b.category)))],
    [],
  );
  const [filter, setFilter] = useState<string>(ALL);

  const visible = filter === ALL ? homeConfig.blogs : homeConfig.blogs.filter((b) => b.category === filter);
  const featured = visible.find((b) => b.featured) ?? visible[0];
  const rest = visible.filter((b) => b !== featured);

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
        title="Health Tips by Our Doctors"
        subtitle="Practical advice from our specialists, written for people living and working in the hills."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13.5px] font-semibold font-display border transition-colors",
                    filter === cat
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-navy border-slate-200 hover:border-slate-400",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Featured + rest */}
            {visible.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
                {featured && <BlogCard {...featured} featured />}
                <div className="flex flex-col gap-6">
                  {rest.map((b) => (
                    <BlogCard key={b.title} {...b} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <Icon name="book" size={36} className="text-slate-300 mx-auto" />
                <p className="mt-4 text-[14.5px] text-slate-500">
                  No articles in <strong className="text-navy">{filter}</strong> yet. Check back soon.
                </p>
              </div>
            )}

            {/* Subscribe band */}
            <div className="mt-14 bg-navy rounded-2xl p-8 sm:p-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div>
                <p className="text-[11px] font-bold text-teal-300 uppercase tracking-[.14em]">Stay informed</p>
                <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-white font-display">
                  Get new health tips by email
                </h3>
                <p className="mt-1.5 text-slate-400 text-[14.5px] leading-relaxed">
                  One short, doctor-written tip every two weeks. No spam — only stuff worth reading.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto"
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="px-3.5 py-3 rounded-[10px] bg-white/10 text-white placeholder:text-slate-400 border border-white/10 text-[14px] focus:outline-none focus:border-teal-400 min-w-[240px]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] bg-teal-500 text-white font-semibold font-display hover:bg-teal-600 transition-colors text-[14px]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
