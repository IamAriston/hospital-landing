interface Props {
  title: string;
  body: string;
  /** Buttons / links — pass pre-styled Button/Link elements */
  children: React.ReactNode;
}

export default function CTABanner({ title, body, children }: Props) {
  return (
    <div className="bg-navy rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
          {title}
        </h3>
        <p className="mt-2 text-slate-400 text-[15px] leading-relaxed">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3 shrink-0">{children}</div>
    </div>
  );
}
