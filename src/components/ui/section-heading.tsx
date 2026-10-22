import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-gold-400/60" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow className={cn("mb-5", centered && "justify-center")}>{eyebrow}</Eyebrow>}
        <h2 className="font-display text-4xl leading-[1.05] font-medium text-cream sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {description && <p className="mt-5 text-base leading-relaxed text-mist">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Gold italic accent for a word inside a display heading. */
export function Accent({ children }: { children: ReactNode }) {
  return <em className="text-gold-gradient animate-shimmer pr-1 font-normal italic">{children}</em>;
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-4", className)}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/60" />
      <span className="size-1.5 rotate-45 border border-gold-300" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/60" />
    </div>
  );
}
