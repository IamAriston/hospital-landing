import Icon from "@/components/ui/Icon";

type Variant = "teal" | "sky" | "green";

const variantClasses: Record<Variant, string> = {
  teal:  "bg-teal-50 text-teal-600",
  sky:   "bg-sky-50 text-sky-600",
  green: "bg-green-50 text-green-600",
};

interface Props {
  items: string[];
  variant?: Variant;
  size?: "sm" | "md";
}

export default function CheckList({ items, variant = "teal", size = "md" }: Props) {
  const textSize   = size === "sm" ? "text-[13px]"   : "text-[14px]";
  const iconSize   = size === "sm" ? 10               : 11;
  const circleSize = size === "sm" ? "w-4.5 h-4.5"   : "w-5 h-5";

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3">
          <div className={`${circleSize} rounded-full ${variantClasses[variant]} flex items-center justify-center shrink-0`}>
            <Icon name="check" size={iconSize} stroke={2.8} />
          </div>
          <span className={`${textSize} text-slate-700`}>{item}</span>
        </div>
      ))}
    </div>
  );
}
