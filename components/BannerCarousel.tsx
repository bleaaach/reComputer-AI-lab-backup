"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { BannerItem } from "@/lib/banners";

const ROTATE_INTERVAL_MS = 5000;

export default function BannerCarousel({ items }: { items: BannerItem[] }) {
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (i: number) => setIndex((i + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="relative w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
      <div className="relative aspect-[3/1] w-full">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="absolute inset-0 size-full transition-opacity duration-500 ease-out"
            style={{
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? "auto" : "none",
            }}
          >
            {item.link ? (
              <a href={item.link} className="block size-full">
                <Image
                  src={item.imageUrl}
                  alt={item.alt ?? ""}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={i === 0}
                />
              </a>
            ) : (
              <Image
                src={item.imageUrl}
                alt={item.alt ?? ""}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={i === 0}
              />
            )}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Previous"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Next"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
