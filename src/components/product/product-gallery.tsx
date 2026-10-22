"use client";

import Image from "next/image";
import { useState, ViewTransition, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name, slug }: { images: string[]; name: string; slug: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        data-gallery-image
        className="relative aspect-square cursor-zoom-in overflow-hidden border hairline bg-ink-950"
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
      >
        {/* Shares a name with the product card image so it morphs between pages. */}
        <ViewTransition name={active === 0 ? `product-${slug}` : undefined} share="morph" default="none">
          <Image
            src={images[active]}
            alt={name}
            fill
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out"
            style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </ViewTransition>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border transition-colors",
                i === active ? "border-gold-300" : "hairline hover:border-gold-400/50",
              )}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
