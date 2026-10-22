// Health Canada warning, formatted per the Vaping Products Promotion Regulations:
// black standard sans-serif type on white, matching border, first word bold and
// upper case, attribution not bold at roughly the x-height of the warning text.

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function HealthWarning() {
  const { lead, text, attribution, fullCompliance } = siteConfig.healthWarning;

  return (
    <aside aria-label="Health warning" className="relative z-50 bg-white p-1 text-black">
      <div
        className={cn(
          "flex items-center justify-center border-[3px] border-black px-4 text-center",
          fullCompliance ? "min-h-[20svh] py-6" : "py-1.5",
        )}
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
      >
        <p className={cn("leading-snug", fullCompliance ? "text-[clamp(1rem,2.6vw,2rem)]" : "text-[12px] sm:text-[13px]")}>
          <strong className="font-bold">{lead}</strong> {text}{" "}
          <span className="whitespace-nowrap text-[0.72em]">{attribution}</span>
        </p>
      </div>
    </aside>
  );
}
