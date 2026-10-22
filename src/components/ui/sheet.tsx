"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";
import { Portal } from "@/components/ui/portal";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Modal panel. On phones and tablets it rises as a bottom sheet that can be
 * dragged down to dismiss; on desktop it slides in as a drawer from `side`.
 * Children fill the area under the title bar — give scrolling regions
 * `min-h-0 flex-1 overflow-y-auto`.
 */
export function Sheet({
  open,
  onClose,
  label,
  title,
  side = "right",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name, e.g. "Shopping cart". */
  label: string;
  title: ReactNode;
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    panel.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 550) onClose();
  };

  const hidden = desktop ? { x: side === "right" ? "100%" : "-100%" } : { y: "100%" };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="safe-area-backdrop fixed inset-0 z-[90] bg-ink-950/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onClose}
            />
            <motion.div
              key="panel"
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              className={cn(
                "grain fixed z-[100] flex flex-col bg-ink-850 outline-none",
                desktop
                  ? cn("inset-y-0 h-dvh w-full max-w-md hairline", side === "right" ? "right-0 border-l" : "left-0 border-r")
                  : "inset-x-0 bottom-0 max-h-[calc(100dvh-2.5rem)] rounded-t-[1.25rem] border-t border-gold-400/25 pb-[env(safe-area-inset-bottom)] shadow-[0_-30px_80px_-20px_rgb(0_0_0/0.85)]",
                className,
              )}
              initial={hidden}
              animate={{ x: 0, y: 0 }}
              exit={hidden}
              transition={{ duration: desktop ? 0.55 : 0.5, ease }}
              drag={desktop ? false : "y"}
              dragListener={false}
              dragControls={drag}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              onDragEnd={onDragEnd}
            >
              {/* The title bar doubles as the drag handle, so the body can still scroll. */}
              <div
                onPointerDown={(e) => !desktop && drag.start(e)}
                className={cn("shrink-0 border-b hairline", !desktop && "touch-none")}
              >
                {!desktop && <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-ink-500" />}
                <div className="flex items-center justify-between gap-4 py-3 pr-3 pl-6 lg:py-4">
                  <h2 className="font-display text-2xl">{title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={`Close ${label.toLowerCase()}`}
                    className="flex size-11 items-center justify-center text-mist transition-colors hover:text-gold-200"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
