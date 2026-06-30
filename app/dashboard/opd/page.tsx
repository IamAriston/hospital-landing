import type { Metadata } from "next";

export const metadata: Metadata = { title: "Today's OPD" };

export default function OpdPage() {
  return (
    <div className="px-7 pt-7 pb-[60px]">
      <h1 className="text-[28px] font-extrabold text-dash-text font-display mb-2">
        Today&apos;s OPD
      </h1>
      <p className="text-[14.5px] text-dash-text-dim">
        Live OPD queue and consultation management — coming soon.
      </p>
    </div>
  );
}
