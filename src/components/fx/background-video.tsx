"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Muted looping background video. Loads and plays only when near the viewport
 * (so hidden ones never download), and never for visitors who prefer reduced
 * motion — they get the poster frame.
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
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      poster={poster}
      aria-hidden
      className={cn("object-cover", className)}
    >
      {mobileSrc && <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
