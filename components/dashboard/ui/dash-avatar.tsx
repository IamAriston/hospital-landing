import { cn } from "@/lib/utils";

const BG_CLASSES = [
  "bg-sky-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-red-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-teal-600",
  "bg-indigo-500",
];

const SIZE_CLASSES: Partial<Record<number, string>> = {
  28: "w-7 h-7 text-[10px]",
  32: "w-8 h-8 text-[11px]",
  34: "w-[34px] h-[34px] text-[12px]",
  36: "w-9 h-9 text-[12.5px]",
  48: "w-12 h-12 text-[17px]",
  54: "w-[54px] h-[54px] text-[19px]",
  56: "w-14 h-14 text-[19.5px]",
};

interface DashAvatarProps {
  name: string;
  size?: number;
  charIndex?: number;
  stripPrefix?: string;
  className?: string;
}

export function DashAvatar({
  name,
  size = 34,
  charIndex = 0,
  stripPrefix,
  className,
}: DashAvatarProps) {
  const cleanName = stripPrefix
    ? name.replace(new RegExp(`^${stripPrefix}\\s*`), "")
    : name;
  const bgClass = BG_CLASSES[name.charCodeAt(charIndex) % BG_CLASSES.length];
  const sizeClass = SIZE_CLASSES[size] ?? "w-8 h-8 text-[12px]";
  const initials = cleanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "rounded-full text-white font-bold flex items-center justify-center shrink-0 font-display",
        bgClass,
        sizeClass,
        className,
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
