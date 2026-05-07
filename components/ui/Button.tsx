import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "sky"
  | "teal"
  | "whatsapp"
  | "ghost"
  | "outline"
  | "tealOutline"
  | "redOutline"
  | "whiteOutline"
  | "skyOutline";

export type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

const variantClasses: Record<ButtonVariant, string> = {
  sky: "bg-sky-400 text-[#04293F] hover:bg-sky-500",
  teal: "bg-teal-600 text-white hover:bg-teal-700",
  whatsapp: "bg-whatsapp text-white hover:bg-[#1a8c3a]",
  ghost: "text-navy hover:text-teal-600",
  outline:
    "border border-slate-300 text-navy hover:bg-slate-100 hover:border-slate-400",
  tealOutline:
    "border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white",
  redOutline:
    "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
  whiteOutline:
    "border border-white/50 text-white hover:bg-white hover:text-navy",
  skyOutline:
    "border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm rounded-lg gap-1.5",
  md: "px-[22px] py-3.5 text-[15px] rounded-[10px] gap-2",
  lg: "px-7 py-[18px] text-base rounded-[10px] gap-2",
};

const base =
  "inline-flex items-center font-semibold font-display whitespace-nowrap transition-all duration-150 ease-out hover:-translate-y-px active:translate-y-0";

export default function Button({
  variant = "sky",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as {
      href: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
