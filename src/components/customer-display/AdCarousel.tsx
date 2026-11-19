'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { BrandMark } from '@/components/ui/BrandMark';
import { cn } from '@/lib/cn';
import type { AdSlide } from '@/types/customer-display';

const SLIDE_DURATION_MS = 7_000;

const ACCENT_CLASSES: Record<AdSlide['accent'], string> = {
  amber: 'text-amber-200',
  rose: 'text-orange-200',
  sage: 'text-lime-200',
};

interface AdCarouselProps {
  slides: readonly AdSlide[];
  storeName: string;
}

export function AdCarousel({ slides, storeName }: AdCarouselProps) {
  const [index, setIndex] = useState(0);
  const slideCount = slides.length;
  // Giữ chỉ số hợp lệ nếu danh sách quảng cáo thay đổi.
  const activeIndex = slideCount > 0 ? index % slideCount : 0;

  useEffect(() => {
    if (slideCount < 2) {
      return;
    }
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slideCount),
      SLIDE_DURATION_MS,
    );
    return () => window.clearInterval(timer);
  }, [slideCount]);

  if (slideCount === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5 bg-brand text-white">
        <BrandMark size="lg" />
        <p className="text-4xl font-bold tracking-tight">{storeName}</p>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Quảng cáo và khuyến mãi tại quán"
      className="[container-type:size] relative h-full overflow-hidden bg-ink"
    >
      {slides.map((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        return (
          <figure
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} / ${slideCount}: ${slide.eyebrow}`}
            aria-hidden={!isActive}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              sizes="(min-width: 768px) 67vw, 100vw"
              loading="eager"
              fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
              className={cn(
                'object-cover transition-transform duration-[7000ms] ease-linear motion-reduce:transition-none',
                isActive ? 'scale-105' : 'scale-100',
              )}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/20" />
            <figcaption className="absolute inset-x-0 bottom-0 px-[clamp(1.5rem,4.5cqw,4rem)] pt-20 pb-[clamp(3.5rem,7cqw,6rem)] text-white [@container(max-height:300px)]:pb-10">
              <p
                className={cn(
                  'flex items-center gap-3 text-[clamp(0.625rem,1.5cqw,0.875rem)] font-semibold tracking-[0.18em] uppercase',
                  ACCENT_CLASSES[slide.accent],
                )}
              >
                <span aria-hidden="true" className="h-px w-7 bg-current" />
                {slide.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,5.7cqw,4.5rem)] leading-[1.15] font-bold tracking-tight whitespace-pre-line [@container(max-height:300px)]:mt-2 [@container(max-height:300px)]:text-[1.375rem]">
                {slide.title}
              </h2>
              <p className="mt-3 max-w-[38em] text-[clamp(0.8125rem,1.8cqw,1.25rem)] leading-relaxed text-white/80 [@container(max-height:300px)]:mt-2 [@container(max-height:300px)]:text-xs">
                {slide.description}
              </p>
            </figcaption>
          </figure>
        );
      })}

      <p className="absolute top-6 left-[clamp(1.5rem,4.5cqw,4rem)] max-w-[calc(100%-6rem)] truncate py-2 text-sm font-bold tracking-wide text-white sm:max-w-[calc(100%-15rem)] lg:text-lg">
        {storeName}
      </p>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-5 flex items-center justify-between px-[clamp(1.5rem,4.5cqw,4rem)] text-white/60 md:bottom-7"
      >
        <div className="flex items-center gap-2">
          {slides.map((slide, slideIndex) => (
            <span
              key={slide.id}
              className={cn(
                'h-1 rounded-full transition-all duration-500 motion-reduce:transition-none',
                slideIndex === activeIndex
                  ? 'w-10 bg-white'
                  : 'w-4 bg-white/30',
              )}
            />
          ))}
        </div>
        <span className="font-mono text-xs tabular-nums">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="mx-2 text-white/30">/</span>
          {String(slideCount).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
