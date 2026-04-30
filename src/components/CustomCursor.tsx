"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const crossHRef = useRef<HTMLDivElement>(null);
  const crossVRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const crossH = crossHRef.current;
    const crossV = crossVRef.current;
    if (!dot || !ring || !crossH || !crossV) return;

    document.body.style.cursor = "none";

    let mx = 0, my = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: "power3.out" });
      gsap.to([ring, crossH, crossV], { x: mx, y: my, duration: 0.42, ease: "power3.out" });
    };

    const onEnter = () => {
      gsap.to(ring, { scale: 2, opacity: 0.5, borderColor: "#c8f060", duration: 0.3, ease: "power2.out" });
      gsap.to([crossH, crossV], { scale: 2, opacity: 0.4, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, borderColor: "rgba(200,240,96,0.5)", duration: 0.3, ease: "power2.out" });
      gsap.to([crossH, crossV], { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.75, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { scale: 2.5, background: "#c8f060", duration: 0.15 });
    };

    const onUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2, ease: "back.out(2)" });
      gsap.to(dot, { scale: 1, background: "#c8f060", duration: 0.2 });
    };

    const selectors = "a, button, [role='button'], input, textarea, select, label, .skill-item, .service-card, .blog-card, .testi-card, .journey-card";

    const addListeners = () => {
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.style.cursor = "none";
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const hideAll = () => gsap.to([dot, ring, crossH, crossV], { opacity: 0, duration: 0.2 });
    const showAll = () => gsap.to([dot, ring, crossH, crossV], { opacity: 1, duration: 0.2 });

    document.addEventListener("mouseleave", hideAll);
    document.addEventListener("mouseenter", showAll);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", hideAll);
      document.removeEventListener("mouseenter", showAll);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 99999,
    willChange: "transform",
    transform: "translate(-50%, -50%)",
  };

  return (
    <>
      {/* Outer ring — square, hero-style */}
      <div
        ref={ringRef}
        style={{
          ...base,
          width: "32px",
          height: "32px",
          border: "1px solid rgba(200,240,96,0.5)",
          borderRadius: "3px",
          mixBlendMode: "normal",
        }}
      />

      {/* Crosshair H */}
      <div
        ref={crossHRef}
        style={{
          ...base,
          width: "16px",
          height: "1px",
          background: "rgba(200,240,96,0.35)",
          marginLeft: "0px",
        }}
      />

      {/* Crosshair V */}
      <div
        ref={crossVRef}
        style={{
          ...base,
          width: "1px",
          height: "16px",
          background: "rgba(200,240,96,0.35)",
        }}
      />

      {/* Center dot */}
      <div
        ref={dotRef}
        style={{
          ...base,
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "#c8f060",
          boxShadow: "0 0 6px #c8f060",
        }}
      />
    </>
  );
}