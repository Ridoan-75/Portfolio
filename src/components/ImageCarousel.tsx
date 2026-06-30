"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";

export function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length >= 3;

  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);
  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [hasMultiple, next]);

  if (images.length === 0) return null;

  return (
    <div className="img-carousel">
      <style>{`
        .img-carousel {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 8px;
          overflow: hidden;
          background: #0e0e0c;
          border: 1px solid rgba(255,255,255,0.08);
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .img-carousel-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .img-carousel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          animation: carouselFadeIn 0.5s ease;
        }

        @keyframes carouselFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .img-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          color: #e8e4dc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
          flex-shrink: 0;
        }

        .img-carousel-arrow:hover {
          background: rgba(var(--accent-rgb), 0.20);
          border-color: rgba(var(--accent-rgb), 0.35);
          color: var(--accent);
          transform: translateY(-50%) scale(1.05);
        }

        .img-carousel-arrow--left {
          left: 16px;
        }

        .img-carousel-arrow--right {
          right: 16px;
        }

        .img-carousel-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 11;
        }

        .img-carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.20);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .img-carousel-dot--active {
          background: var(--accent);
          border-color: var(--accent);
          width: 20px;
          border-radius: 3px;
        }

        .img-carousel-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #5e5e58;
          background: rgba(255,255,255,0.06);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.09);
        }
      `}</style>

      <div className="img-carousel-container">
        <img
          src={images[current]}
          alt={`${title} — image ${current + 1}`}
          className="img-carousel-img"
        />

        {/* Counter */}
        {hasMultiple && (
          <div className="img-carousel-counter">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Left Arrow */}
        {hasMultiple && (
          <button
            className="img-carousel-arrow img-carousel-arrow--left"
            onClick={prev}
            title="Previous image"
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {hasMultiple && (
          <button
            className="img-carousel-arrow img-carousel-arrow--right"
            onClick={next}
            title="Next image"
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Dots */}
        {hasMultiple && (
          <div className="img-carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`img-carousel-dot${i === current ? " img-carousel-dot--active" : ""}`}
                onClick={() => setCurrent(i)}
                title={`Go to image ${i + 1}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
