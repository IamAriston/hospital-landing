// Icon background style used on the services list page
export const serviceAccentIcon: Record<string, string> = {
  red: "bg-red-50 text-red-600",
  sky: "bg-sky-50 text-sky-600",
  teal: "bg-teal-50 text-teal-600",
};

// Hero accent used on each service's detail page
export const serviceAccentHero: Record<string, { bg: string; iconBg: string }> = {
  red: { bg: "bg-red-600", iconBg: "bg-white/10 text-white" },
  sky: { bg: "bg-sky-500", iconBg: "bg-white/10 text-white" },
  teal: { bg: "bg-teal-600", iconBg: "bg-white/10 text-white" },
};
