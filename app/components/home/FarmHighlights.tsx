"use client";

import React, { useEffect, useMemo, useState } from "react";

type HighlightItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

type Props = {
  items: HighlightItem[];
  autoScrollMs?: number; // default 3500
};

export default function FarmHighlights({ items, autoScrollMs = 3500 }: Props) {
  const safeItems = useMemo(() => items.slice(0, 8), [items]);
  const [idx, setIdx] = useState(0);

  const canAuto = safeItems.length > 1;

  useEffect(() => {
    if (!canAuto) return;
    const t = setInterval(() => {
      setIdx((p) => (p + 1) % safeItems.length);
    }, autoScrollMs);
    return () => clearInterval(t);
  }, [canAuto, autoScrollMs, safeItems.length]);

  const prev = () => setIdx((p) => (p - 1 + safeItems.length) % safeItems.length);
  const next = () => setIdx((p) => (p + 1) % safeItems.length);

  const current = safeItems[idx];

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-zinc-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Farm Highlights</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Fresh stock, clean handling, quick delivery.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prev}
            className="h-9 w-9 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="h-9 w-9 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        <div className="relative aspect-[16/9] w-full">
          {current?.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.src}
              alt={current.alt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <video
              className="h-full w-full object-cover"
              src={current.src}
              poster={current.poster}
              controls
              playsInline
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {safeItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === idx ? "bg-zinc-900" : "bg-zinc-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}