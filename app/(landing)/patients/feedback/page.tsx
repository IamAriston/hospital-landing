"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import { cn } from "@/lib/cn";

type Visit = "OPD" | "Inpatient" | "Emergency" | "Diagnostics" | "Pharmacy" | "Other";

const visitTypes: Visit[] = ["OPD", "Inpatient", "Emergency", "Diagnostics", "Pharmacy", "Other"];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [visit, setVisit] = useState<Visit>("OPD");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Patients", href: "/patients" },
          { label: "Feedback" },
        ]}
        title="Share your experience"
        subtitle="Every response is read by our leadership team. Your honest feedback helps us improve care."
        compact
      />

      <div className="bg-cream">
        <section className="py-14 sm:py-20">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            {submitted ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 inline-flex items-center justify-center">
                  <Icon name="check" size={32} stroke={2.4} />
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold text-navy font-display">
                  Thank you for your feedback
                </h2>
                <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-md mx-auto">
                  We've received your response and our care quality team will review it within a working day.
                  If you've raised a concern, someone from the team will reach out personally.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setRating(0);
                    setVisit("OPD");
                  }}
                  className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-teal-600 text-white font-semibold font-display hover:bg-teal-700 transition-colors text-[14px]"
                >
                  Share more feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-10">
                {/* Rating */}
                <div>
                  <label className="text-[13px] font-bold text-navy font-display block">Overall rating</label>
                  <p className="text-[12.5px] text-slate-500 mt-0.5">How would you rate your visit?</p>
                  <div className="mt-3 flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1"
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Icon
                            name="star"
                            size={32}
                            stroke={1.6}
                            className={cn(
                              "transition-colors",
                              active ? "fill-amber-400 text-amber-400" : "text-slate-300",
                            )}
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span className="ml-3 text-[13px] font-semibold text-slate-500">
                        {rating} / 5
                      </span>
                    )}
                  </div>
                </div>

                {/* Visit type */}
                <div className="mt-7">
                  <label className="text-[13px] font-bold text-navy font-display block">Visit type</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visitTypes.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVisit(v)}
                        className={cn(
                          "px-4 py-2 rounded-full text-[13px] font-semibold font-display border transition-colors",
                          visit === v
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-navy border-slate-200 hover:border-slate-400",
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal details */}
                <div className="mt-7 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Your name</label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Phone or Email</label>
                    <input
                      type="text"
                      required
                      placeholder="So we can follow up if needed"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Visit date</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Department (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiology"
                      className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div className="mt-7">
                  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Your feedback</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us what worked well and what we can improve. Be as specific as you like — staff names, wait times, anything."
                    className="w-full px-3.5 py-3 rounded-[10px] border border-slate-200 text-[14px] text-navy placeholder:text-slate-400 focus:outline-none focus:border-teal-500 resize-y"
                  />
                </div>

                {/* Anonymity */}
                <label className="mt-5 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-[13px] text-slate-600 leading-relaxed">
                    Share my feedback anonymously with our leadership team. (We'll still keep your contact for follow-up, but won't link it to the comment.)
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className={cn(
                    "mt-7 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-[10px] font-semibold font-display transition-colors text-[15px]",
                    rating === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700",
                  )}
                >
                  Submit feedback
                  <Icon name="arrowSmall" size={16} stroke={2.4} />
                </button>

                <p className="mt-4 text-[12px] text-slate-400 text-center leading-relaxed">
                  By submitting, you allow us to contact you about your feedback. We never share personal details outside the hospital.
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
