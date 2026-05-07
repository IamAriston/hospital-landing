interface Props {
  label: string;
  heading: React.ReactNode;
  body?: string;
  center?: boolean;
}

export default function SectionLabel({ label, heading, body, center = false }: Props) {
  const align = center ? "text-center" : "";
  return (
    <div className={align}>
      <p className="text-[11px] font-bold text-teal-600 uppercase tracking-[.14em] mb-2">
        {label}
      </p>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-navy font-display leading-tight">
        {heading}
      </h2>
      {body && (
        <p className="mt-3 text-[16px] text-slate-600 leading-relaxed max-w-2xl">
          {body}
        </p>
      )}
    </div>
  );
}
