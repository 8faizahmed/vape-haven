"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Muted looping background video. Plays only in the visible viewport and pauses
 * in background tabs. Eager clips can buffer ahead; reduced-motion visitors get
 * the poster without preloading video.
 */
export function BackgroundVideo({
  src,
  mobileSrc,
  poster,
  className,
  eager = false,
}: {
  src: string;
  mobileSrc?: string;
  poster: string;
  className?: string;
  /** Start buffering immediately (above-the-fold videos). */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    video.muted = true;
    let visible = false;
    const syncPlayback = () => {
      video.preload = eager && !reducedMotion.matches ? "auto" : "none";
      if (visible && !document.hidden && !reducedMotion.matches) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.01 },
    );
    io.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();
    return () => {
      io.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [eager]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden
      className={cn("object-cover", className)}
    >
      {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
