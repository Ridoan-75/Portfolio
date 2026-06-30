"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { soundManager } from "@/lib/SoundManager";

type CursorType =
  | "default"
  | "crosshair"
  | "tracer"
  | "radar"
  | "ghost"
  | "portal"
  | "snake"
  | "glitch"
  | "eye";

export default function Cursor() {
  const [cursorType, setCursorType] = useState<CursorType>("crosshair");
  const [accent, setAccent] = useState("#3b82f6");
  const [isMobile, setIsMobile] = useState(false);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  const ref4 = useRef<HTMLDivElement>(null);
  const crossHRef = useRef<HTMLDivElement>(null);
  const crossVRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia("(pointer:coarse)").matches,
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-settings");
      if (saved) {
        const s = JSON.parse(saved);
        queueMicrotask(() => {
          setCursorType(s.cursor || "crosshair");
          setAccent(s.accent || "#3b82f6");
        });
      }
    } catch {}

    const onSettings = (e: Event) => {
      const d = (e as CustomEvent).detail;
      queueMicrotask(() => {
        if (d.cursor !== undefined) setCursorType(d.cursor);
        if (d.accent !== undefined) setAccent(d.accent);
      });
    };
    window.addEventListener("site-settings-change", onSettings);
    return () => window.removeEventListener("site-settings-change", onSettings);
  }, []);

  useEffect(() => {
    if (isMobile || cursorType === "default") {
      // Remove any existing custom cursor styles
      const existingStyle = document.querySelector('style[data-cursor-style]');
      if (existingStyle) existingStyle.remove();
      
      document.body.style.cursor = "auto";
      const selectors =
        "a, button, [role='button'], input, textarea, select, label, .skill-item, .service-card, .blog-card, .testi-card, .journey-card";
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.style.cursor = "";
      });
      return;
    }

    document.body.style.cursor = "none";

    const primaryRefs = [
      ref1.current,
      ref2.current,
      ref3.current,
      ref4.current,
      crossHRef.current,
      crossVRef.current,
      dotRef.current,
      ringRef.current,
    ].filter(Boolean) as HTMLElement[];

    // ── Global style: pointer on interactive elements ──────────────────────
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-cursor-style", "true");
    styleEl.textContent = `
      a, button, [role='button'], input[type="button"], input[type="submit"], select, label,
      .skill-item, .service-card, .blog-card, .testi-card, .journey-card {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(styleEl);

    // ── TRACER ───────────────────────────────────────────────────────────────
    let trailDots: HTMLDivElement[] = [];
    if (cursorType === "tracer") {
      const TRAIL_COUNT = 14;
      trailDots = Array.from({ length: TRAIL_COUNT }, (_, i) => {
        const el = document.createElement("div");
        const size = Math.max(3, 9 - i * 0.45);
        el.style.cssText = `
          position:fixed;top:0;left:0;pointer-events:none;z-index:99998;
          width:${size}px;height:${size}px;border-radius:50%;
          background:${accent};opacity:${0.75 - i * 0.05};
          will-change:transform;transform:translate(-50%,-50%);
        `;
        document.body.appendChild(el);
        return el;
      });
    }

    // ── SNAKE ────────────────────────────────────────────────────────────────
    let snakeSegments: HTMLDivElement[] = [];
    let snakePositions: { x: number; y: number }[] = [];
    if (cursorType === "snake") {
      const SEG_COUNT = 14;
      snakePositions = Array.from({ length: SEG_COUNT }, () => ({ x: 0, y: 0 }));
      snakeSegments = Array.from({ length: SEG_COUNT }, (_, i) => {
        const el = document.createElement("div");
        const size = Math.max(5, 18 - i * 0.95);
        const opacity = Math.max(0.08, 0.65 - i * 0.05);
        el.style.cssText = `
          position:fixed;top:0;left:0;pointer-events:none;z-index:99997;
          width:${size}px;height:${size}px;border-radius:50%;
          background:${accent};opacity:${opacity};
          will-change:transform;transform:translate(-50%,-50%);
        `;
        document.body.appendChild(el);
        return el;
      });
    }

    // ── GLITCH ───────────────────────────────────────────────────────────────
    let glitchR: HTMLDivElement | null = null;
    let glitchC: HTMLDivElement | null = null;
    let glitchInterval: ReturnType<typeof setInterval> | null = null;
    if (cursorType === "glitch") {
      const makeLayer = (color: string) => {
        const el = document.createElement("div");
        el.style.cssText = `
          position:fixed;top:0;left:0;pointer-events:none;z-index:99997;
          will-change:transform;transform:translate(-50%,-50%);
          mix-blend-mode:screen;opacity:0.7;
        `;
        el.innerHTML = `<svg width="38" height="38" viewBox="0 0 38 38">
          <rect x="15" y="2" width="8" height="34" rx="2" fill="${color}"/>
          <rect x="2" y="15" width="34" height="8" rx="2" fill="${color}"/>
        </svg>`;
        document.body.appendChild(el);
        return el;
      };
      glitchR = makeLayer("#ff0044");
      glitchC = makeLayer("#00ffcc");

      glitchInterval = setInterval(() => {
        const dx1 = (Math.random() - 0.5) * 8;
        const dy1 = (Math.random() - 0.5) * 6;
        const dx2 = (Math.random() - 0.5) * 8;
        const dy2 = (Math.random() - 0.5) * 6;
        if (glitchR) glitchR.style.transform = `translate(calc(-50% + ${dx1}px), calc(-50% + ${dy1}px))`;
        if (glitchC) glitchC.style.transform = `translate(calc(-50% + ${dx2}px), calc(-50% + ${dy2}px))`;
      }, 80);
    }

    // ── RADAR ────────────────────────────────────────────────────────────────
    let canvas: HTMLCanvasElement | null = null;
    let rafId: number;
    let radarAngle = 0;
    let radarX = 0;
    let radarY = 0;

    if (cursorType === "radar") {
      canvas = document.createElement("canvas");
      const SIZE = 72;
      canvas.width = SIZE;
      canvas.height = SIZE;
      canvas.style.cssText = `
        position:fixed;top:0;left:0;pointer-events:none;z-index:99998;
        will-change:transform;transform:translate(-50%,-50%);
      `;
      document.body.appendChild(canvas);

      const hx = accent.slice(1);
      const r = parseInt(hx.slice(0, 2), 16);
      const g = parseInt(hx.slice(2, 4), 16);
      const b = parseInt(hx.slice(4, 6), 16);

      const drawRadar = () => {
        const ctx = canvas!.getContext("2d")!;
        const cx = SIZE / 2, cy = SIZE / 2, radius = SIZE / 2 - 2;
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.33, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${r},${g},${b},0.15)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius); ctx.stroke();
        const sweepSpan = Math.PI * 0.6;
        for (let i = 0; i < 30; i++) {
          const a = radarAngle - (sweepSpan * i) / 30;
          const alpha = (1 - i / 30) * 0.45;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius - 1, a, a + sweepSpan / 30);
          ctx.closePath();
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(radarAngle) * (radius - 1),
          cy + Math.sin(radarAngle) * (radius - 1),
        );
        ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        ctx.fill();
        radarAngle += 0.045;
        canvas!.style.transform = `translate(calc(${radarX}px - 50%), calc(${radarY}px - 50%))`;
        rafId = requestAnimationFrame(drawRadar);
      };
      drawRadar();
    }

    // ── EYE ──────────────────────────────────────────────────────────────────
    let eyeCanvas: HTMLCanvasElement | null = null;
    let eyeRafId: number;
    let eyeX = 0, eyeY = 0;
    let eyePupilX = 0, eyePupilY = 0;

    if (cursorType === "eye") {
      eyeCanvas = document.createElement("canvas");
      const W = 100, H = 62;
      eyeCanvas.width = W;
      eyeCanvas.height = H;
      eyeCanvas.style.cssText = `
        position:fixed;top:0;left:0;pointer-events:none;z-index:99998;
        will-change:transform;transform:translate(-50%,-50%);
      `;
      document.body.appendChild(eyeCanvas);

      const hx = accent.slice(1);
      const ar = parseInt(hx.slice(0, 2), 16);
      const ag = parseInt(hx.slice(2, 4), 16);
      const ab = parseInt(hx.slice(4, 6), 16);

      const drawEye = () => {
        const ctx = eyeCanvas!.getContext("2d")!;
        const cx = W / 2, cy = H / 2;
        ctx.clearRect(0, 0, W, H);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(4, cy);
        ctx.quadraticCurveTo(cx, 2, W - 4, cy);
        ctx.quadraticCurveTo(cx, H - 2, 4, cy);
        ctx.closePath();
        ctx.clip();

        ctx.fillStyle = "#080808";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(eyePupilX, eyePupilY, 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},0.25)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(eyePupilX, eyePupilY, 16, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},0.95)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(eyePupilX, eyePupilY, 13, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.5)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(eyePupilX, eyePupilY, 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.3)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(eyePupilX, eyePupilY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#000";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(eyePupilX - 4, eyePupilY - 4, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyePupilX + 3, eyePupilY + 3, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();

        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(4, cy);
        ctx.quadraticCurveTo(cx, 2, W - 4, cy);
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.9)`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(4, cy);
        ctx.quadraticCurveTo(cx, H - 2, W - 4, cy);
        ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.5)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(4, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},0.6)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(W - 4, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},0.6)`;
        ctx.fill();

        const maxOffset = 10;
        const tx = cx + Math.max(-maxOffset, Math.min(maxOffset,
          (eyeX - window.innerWidth / 2) / window.innerWidth * maxOffset * 5));
        const ty = cy + Math.max(-maxOffset * 0.6, Math.min(maxOffset * 0.6,
          (eyeY - window.innerHeight / 2) / window.innerHeight * maxOffset * 4));
        eyePupilX += (tx - eyePupilX) * 0.12;
        eyePupilY += (ty - eyePupilY) * 0.12;

        eyeCanvas!.style.transform = `translate(calc(${eyeX}px - 50%), calc(${eyeY}px - 50%))`;
        eyeRafId = requestAnimationFrame(drawEye);
      };
      eyePupilX = W / 2;
      eyePupilY = H / 2;
      drawEye();
    }

    let trailPositions = Array.from({ length: 14 }, () => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      primaryRefs.forEach((el) => {
        if (!el) return;
        gsap.to(el, { x: mx, y: my, duration: 0.08, ease: "power3.out" });
      });

      if (cursorType === "tracer") {
        trailPositions = [{ x: mx, y: my }, ...trailPositions.slice(0, 13)];
        trailDots.forEach((dot, i) => {
          const pos = trailPositions[i] || trailPositions[trailPositions.length - 1];
          gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.05 + i * 0.04, ease: "none" });
        });
      }

      if (cursorType === "snake") {
        snakePositions = [{ x: mx, y: my }, ...snakePositions.slice(0, snakePositions.length - 1)];
        snakeSegments.forEach((seg, i) => {
          const pos = snakePositions[i] || snakePositions[snakePositions.length - 1];
          gsap.to(seg, { x: pos.x, y: pos.y, duration: 0.04 + i * 0.035, ease: "none" });
        });
      }

      if (cursorType === "glitch") {
        if (glitchR) gsap.to(glitchR, { x: mx, y: my, duration: 0.06, ease: "none" });
        if (glitchC) gsap.to(glitchC, { x: mx, y: my, duration: 0.06, ease: "none" });
      }

      if (cursorType === "radar") { radarX = mx; radarY = my; }
      if (cursorType === "eye") { eyeX = mx; eyeY = my; }
    };

    // ── hover: keep custom cursor visible ────────────────────────────────────
    const onEnter = (e: Event) => {
      soundManager.playHover();
      const target = e.currentTarget as HTMLElement;
      target.style.setProperty("cursor", "none", "important");
    };

    const onLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.style.setProperty("cursor", "none", "important");
    };

    const onDown = (e: MouseEvent) => {
      soundManager.playClick();
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input[type='button'], input[type='submit'], select, label, .skill-item, .service-card, .blog-card, .testi-card, .journey-card"
      );
      if (!isInteractive) {
        gsap.to(primaryRefs, { scale: 0.88, opacity: 1, duration: 0.12, ease: "power2.out" });
      }
    };

    const onUp = () => {
      gsap.to(primaryRefs, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" });
    };

    const selectors =
      "a, button, [role='button'], input, textarea, select, label, .skill-item, .service-card, .blog-card, .testi-card, .journey-card";

    const addListeners = () => {
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
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

    return () => {
      document.body.style.cursor = "auto";
      styleEl.remove();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
      trailDots.forEach((d) => d.remove());
      snakeSegments.forEach((s) => s.remove());
      if (glitchR) { glitchR.remove(); glitchR = null; }
      if (glitchC) { glitchC.remove(); glitchC = null; }
      if (glitchInterval) clearInterval(glitchInterval);
      if (canvas) { cancelAnimationFrame(rafId); canvas.remove(); }
      if (eyeCanvas) { cancelAnimationFrame(eyeRafId); eyeCanvas.remove(); }
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.style.cursor = "";
      });
    };
  }, [cursorType, isMobile, accent]);

  if (isMobile || cursorType === "default") return null;

  const base: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 99999,
    willChange: "transform",
    transform: "translate(-50%, -50%)",
  };

  const hex2rgba = (o: number) => {
    const h = accent.slice(1);
    return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${o})`;
  };

  // ── CROSSHAIR ────────────────────────────────────────────────────────────
  if (cursorType === "crosshair") {
    return (
      <>
        <div ref={ringRef} style={{ ...base, width: "42px", height: "42px", border: `1.5px solid ${hex2rgba(0.7)}`, borderRadius: "4px", boxShadow: `0 0 8px ${hex2rgba(0.25)}` }} />
        <div ref={crossHRef} style={{ ...base, width: "22px", height: "1.5px", background: hex2rgba(0.6) }} />
        <div ref={crossVRef} style={{ ...base, width: "1.5px", height: "22px", background: hex2rgba(0.6) }} />
        <div ref={dotRef} style={{ ...base, width: "5px", height: "5px", borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}, 0 0 16px ${hex2rgba(0.5)}` }} />
      </>
    );
  }

  // ── GHOST ────────────────────────────────────────────────────────────────
  if (cursorType === "ghost") {
    return (
      <>
        <div ref={ref1} style={{ ...base, width: "8px", height: "8px", borderRadius: "50%", background: accent, boxShadow: `0 0 12px ${accent}, 0 0 24px ${hex2rgba(0.5)}` }} />
        <div ref={ref2} style={{ ...base, width: "32px", height: "32px", border: `1.5px solid ${hex2rgba(0.65)}`, borderRadius: "50%", boxShadow: `0 0 6px ${hex2rgba(0.2)}` }} />
        <div ref={ref3} style={{ ...base, width: "20px", height: "20px", border: `1px solid ${hex2rgba(0.3)}`, borderRadius: "50%" }} />
        <div ref={ref4} style={{ ...base, width: "0px", height: "0px" }}>
          {[0, 90, 180, 270].map((deg) => (
            <div key={deg} style={{ position: "absolute", width: "8px", height: "2px", background: hex2rgba(0.85), borderRadius: "1px", transform: `rotate(${deg}deg) translateX(22px)`, transformOrigin: "0 50%" }} />
          ))}
        </div>
        <div style={{ ...base, width: "8px", height: "8px", borderRadius: "50%", border: `1.5px solid ${hex2rgba(0.6)}`, animation: "ghost-ripple 1.8s ease-out infinite" }} />
        <style>{`
          @keyframes ghost-ripple {
            0%   { width:8px;  height:8px;  opacity:0.6; }
            100% { width:56px; height:56px; opacity:0; }
          }
        `}</style>
      </>
    );
  }

  // ── PORTAL ───────────────────────────────────────────────────────────────
  if (cursorType === "portal") {
    return (
      <>
        <div ref={ref1} style={{ ...base, width: "60px", height: "60px", borderRadius: "50%", border: `1.5px dashed ${hex2rgba(0.3)}`, animation: "portal-out 8s linear infinite" }} />
        <div ref={ref2} style={{ ...base, width: "44px", height: "44px", borderRadius: "50%", border: `2px dashed ${hex2rgba(0.5)}`, animation: "portal-in 4s linear infinite" }} />
        <div ref={ref3} style={{ ...base, width: "26px", height: "26px", borderRadius: "50%", border: `2px solid ${hex2rgba(0.95)}`, boxShadow: `0 0 12px ${hex2rgba(0.6)}, inset 0 0 8px ${hex2rgba(0.3)}` }} />
        <div ref={ref4} style={{ ...base, width: "8px", height: "8px", borderRadius: "50%", background: accent, boxShadow: `0 0 14px ${accent}, 0 0 28px ${hex2rgba(0.5)}` }} />
        <div style={{ ...base, width: "8px", height: "8px", borderRadius: "50%", border: `1.5px solid ${hex2rgba(0.6)}`, animation: "portal-pulse 1.2s ease-out infinite" }} />
        <style>{`
          @keyframes portal-out {
            from { transform: translate(-50%,-50%) rotate(0deg); }
            to   { transform: translate(-50%,-50%) rotate(360deg); }
          }
          @keyframes portal-in {
            from { transform: translate(-50%,-50%) rotate(360deg); }
            to   { transform: translate(-50%,-50%) rotate(0deg); }
          }
          @keyframes portal-pulse {
            0%   { width:8px;  height:8px;  opacity:0.6; }
            100% { width:28px; height:28px; opacity:0; }
          }
        `}</style>
      </>
    );
  }

  // ── SNAKE ────────────────────────────────────────────────────────────────
  if (cursorType === "snake") {
    return (
      <div ref={ref1} style={{ ...base, width: "0px", height: "0px" }}>
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ position: "absolute", transform: "translate(-50%, -50%)", filter: `drop-shadow(0 0 6px ${accent})` }}>
          <circle cx="13" cy="13" r="11" fill={accent} opacity="0.97" />
          <path d="M7 10 Q13 7 19 10" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.3" />
          <path d="M6 13 Q13 10 20 13" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.3" />
          <circle cx="17" cy="10" r="2.5" fill="#000" opacity="0.9" />
          <circle cx="17.8" cy="9.2" r="0.8" fill="#fff" opacity="0.75" />
          <circle cx="5" cy="13" r="1" fill="#000" opacity="0.5" />
          <line x1="2" y1="13" x2="-4" y2="12" stroke="#ff3355" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-4" y1="12" x2="-8" y2="10" stroke="#ff3355" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="-4" y1="12" x2="-8" y2="14" stroke="#ff3355" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // ── GLITCH ───────────────────────────────────────────────────────────────
  if (cursorType === "glitch") {
    return (
      <div ref={ref1} style={{ ...base, width: "0px", height: "0px" }}>
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: "absolute", transform: "translate(-50%, -50%)" }}>
          <rect x="15" y="2" width="8" height="34" rx="2" fill={accent} />
          <rect x="2" y="15" width="34" height="8" rx="2" fill={accent} />
          <rect x="0"  y="12" width="6"  height="3" fill={accent} opacity="0.6" />
          <rect x="32" y="22" width="7"  height="3" fill={accent} opacity="0.45" />
          <rect x="17" y="0"  width="3"  height="5" fill={accent} opacity="0.55" />
          <rect x="17" y="34" width="3"  height="5" fill={accent} opacity="0.4" />
          <rect x="16" y="16" width="6"  height="6" fill="#fff"   opacity="0.95" />
        </svg>
      </div>
    );
  }

  // ── TRACER ───────────────────────────────────────────────────────────────
  if (cursorType === "tracer") {
    return (
      <div ref={ref1} style={{ ...base, width: "10px", height: "10px", borderRadius: "50%", background: accent, boxShadow: `0 0 14px ${accent}, 0 0 28px ${hex2rgba(0.5)}` }} />
    );
  }

  // ── RADAR ────────────────────────────────────────────────────────────────
  if (cursorType === "radar") {
    return <div ref={ref1} style={{ ...base, width: "0px", height: "0px" }} />;
  }

  // ── EYE ──────────────────────────────────────────────────────────────────
  if (cursorType === "eye") {
    return <div ref={ref1} style={{ ...base, width: "0px", height: "0px" }} />;
  }

  return null;
}