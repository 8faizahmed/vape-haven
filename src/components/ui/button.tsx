import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-gold-gradient text-ink-950 shine hover:shadow-[0_0_48px_-10px_rgba(212,171,85,0.7)]",
  outline:
    "border border-gold-400/40 text-gold-100 hover:border-gold-300 hover:bg-gold-400/10",
  ghost: "text-gold-200 hover:text-gold-50",
} as const;

const sizes = {
  sm: "h-10 px-5 text-[0.65rem]",
  md: "h-12 px-7 text-[0.7rem]",
  lg: "h-14 px-9 text-[0.72rem]",
} as const;

type StyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

export function buttonStyles({ variant = "primary", size = "md", className }: StyleProps = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap font-sans font-semibold uppercase tracking-[0.24em] transition-all duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & StyleProps) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
