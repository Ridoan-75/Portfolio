"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const roles = [
  "Full Stack Developer",
  "Graphics Designer",
  "Digital Marketer",
  "UI/UX Designer",
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohammad-ridoan-hossen75",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/Ridoan-75",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/Ridoan_075",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/Ridoan-75",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
];

const stats = [
  { num: "6+", label: "Yrs Exp" },
  { num: "50+", label: "Projects" },
  { num: "50K+", label: "Users" },
];

const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "UI/UX Design",
  "Tailwind CSS",
  "GraphQL",
  "PostgreSQL",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "UI/UX Design",
  "Tailwind CSS",
  "GraphQL",
  "PostgreSQL",
];

function firework(x: number, y: number) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c8f060";
  const colors = [accent, "#ffffff", "#6a6a62"];
  for (let i = 0; i < 16; i++) {
    const dot = document.createElement("span");
    Object.assign(dot.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      background: colors[Math.floor(Math.random() * colors.length)],
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 80 + 30;
    gsap.to(dot, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => dot.remove(),
    });
  }
}

export default function Hero() {
  const typedRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ri = 0,
      ci = 0,
      del = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const cur = roles[ri];
      if (!del) {
        if (typedRef.current)
          typedRef.current.textContent = cur.slice(0, ci + 1);
        ci++;
        if (ci === cur.length) {
          t = setTimeout(() => {
            del = true;
            tick();
          }, 1500);
          return;
        }
      } else {
        if (typedRef.current)
          typedRef.current.textContent = cur.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          del = false;
          ri = (ri + 1) % roles.length;
        }
      }
      t = setTimeout(tick, del ? 38 : 88);
    };
    const s = setTimeout(tick, 600);
    return () => {
      clearTimeout(s);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.48,
      ease: "steps(1)",
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".hero-status-tag",
      { y: 30, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        delay: 0.1,
      },
    );
    gsap.fromTo(
      ".hero-hello",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.2 },
    );
    gsap.fromTo(
      ".hero-heading",
      { y: 60, opacity: 0, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.25,
      },
    );
    gsap.fromTo(
      ".hero-role-line",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45 },
    );
    gsap.fromTo(
      ".hero-typing",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.52 },
    );
    gsap.fromTo(
      ".hero-desc",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6 },
    );
    gsap.fromTo(
      ".hero-stats",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.68 },
    );
    gsap.fromTo(
      ".hero-ctas",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.76 },
    );
    gsap.fromTo(
      ".hero-social-item",
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(2)",
        delay: 0.84,
      },
    );
    gsap.fromTo(
      ".hero-right-col",
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 },
    );
  }, []);

  const handleBtnClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      firework(e.clientX, e.clientY);
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: "back.out(2.5)" },
      );
    },
    [],
  );

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#080808",
        color: "#e8e4dc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ===== BASE / DESKTOP (1200px+) ===== */
        #home {
          padding: 80px 60px 80px;
        }

        /* Grid background */
        #home::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          z-index: 0;
        }

        .hero-corner-tl {
          position: absolute;
          top: 0; left: 0;
          width: 180px; height: 180px;
          border-right: 1px solid rgba(var(--accent-rgb),.08);
          border-bottom: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }

        .hero-corner-br {
          position: absolute;
          bottom: 0; right: 0;
          width: 180px; height: 180px;
          border-left: 1px solid rgba(var(--accent-rgb),.08);
          border-top: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }

        .hero-scanline {
          position: absolute;
          left: 60px; right: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.12), transparent);
          top: 50%;
          pointer-events: none;
          z-index: 0;
          animation: heroScan 7s ease-in-out infinite;
        }

        @keyframes heroScan {
          0%, 100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }

        .hero-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* Status Tag */
        .hero-status-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(var(--accent-rgb),.06);
          border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px;
          padding: 7px 14px;
          width: fit-content;
          margin-bottom: 24px;
          opacity: 0;
        }

        .hero-status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
          animation: heroBlink 2s ease infinite;
          flex-shrink: 0;
        }

        @keyframes heroBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

        .hero-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--accent);
        }

        /* Hello line */
        .hero-hello {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 22px;
          color: #4a4a44;
          letter-spacing: .05em;
          margin-bottom: 8px;
          opacity: 0;
        }

        /* Main Heading */
        .hero-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92;
          letter-spacing: .02em;
          color: #f0ece4;
          margin-bottom: 20px;
          opacity: 0;
        }

        .hero-heading .h-accent { color: var(--accent); }

        /* Role line */
        .hero-role-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #6a6a60;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          opacity: 0;
        }

        .hero-role-line::before {
          content: '';
          width: 28px; height: 1px;
          background: var(--accent);
          flex-shrink: 0;
        }

        /* Typing */
        .hero-typing {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          letter-spacing: .05em;
          color: #5a5a56;
          margin-bottom: 24px;
          min-height: 20px;
          opacity: 0;
          word-break: break-word;
        }

        .hero-typed { color: var(--accent); font-weight: 600; }

        .hero-cursor {
          display: inline-block;
          width: 2px; height: 14px;
          background: var(--accent);
          vertical-align: middle;
          margin-left: 2px;
        }

        /* Desc */
        .hero-desc {
          font-size: 16px;
          line-height: 1.85;
          color: #4a4a44;
          max-width: 440px;
          margin-bottom: 28px;
          opacity: 0;
        }

        /* Stats */
        .hero-stats {
          display: flex;
          align-items: stretch;
          margin-bottom: 32px;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border-radius: 6px;
          overflow: hidden;
          width: fit-content;
          opacity: 0;
        }

        .hero-stat-item {
          padding: 16px 30px;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }

        .hero-stat-item:last-child { border-right: none; }

        .hero-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px;
          color: var(--accent);
          letter-spacing: .03em;
          line-height: 1;
        }

        .hero-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #3a3a36;
          margin-top: 4px;
        }

        /* CTAs */
        .hero-ctas {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 36px;
          flex-wrap: wrap;
          opacity: 0;
        }

        .hero-btn-primary {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #080808;
          background: var(--accent);
          text-decoration: none;
          padding: 14px 26px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: filter .2s, transform .15s;
          white-space: nowrap;
        }

        .hero-btn-primary:hover { filter: brightness(1.12); transform: translateY(-2px); }
        .hero-btn-primary::after { content: '→'; display: inline-block; transition: transform .2s; }
        .hero-btn-primary:hover::after { transform: translateX(3px); }

        .hero-btn-secondary {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #6a6a60;
          background: transparent;
          text-decoration: none;
          padding: 13px 26px;
          border-radius: 3px;
          border: 1px solid #2a2a28;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: border-color .2s, color .2s, transform .15s;
          white-space: nowrap;
        }

        .hero-btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

        /* Social label */
        .hero-social-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #e8e4dc;
          margin-bottom: 12px;
        }

        /* Social icons */
        .hero-socials { display: flex; gap: 10px; flex-wrap: wrap; }

        .hero-social-item {
          width: 46px; height: 46px;
          border-radius: 4px;
          border: 1px solid #2a2a28;
          background: #0e0e0c;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          color: #8a8a80;
          transition: border-color .2s, color .2s, transform .15s, background .2s;
          opacity: 0;
        }

        .hero-social-item:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: #131310;
          transform: translateY(-3px);
        }

        /* RIGHT COL */
        .hero-right-col {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          padding: 20px 34px;
        }

        /* Big decorative text behind */
        .hero-bg-text {
          position: absolute;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 220px;
          color: rgba(var(--accent-rgb),.025);
          letter-spacing: -.02em;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
        }

        /* Image frame */
        .hero-img-frame {
          width: 300px; height: 360px;
          border: 1px solid #1e1e1a;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          background: #0c0c0a;
        }

        /* Corner brackets */
        .hero-img-frame::before,
        .hero-img-frame::after {
          content: '';
          position: absolute;
          width: 24px; height: 24px;
          border-color: var(--accent);
          border-style: solid;
          z-index: 2;
        }

        .hero-img-frame::before {
          top: -1px; left: -1px;
          border-width: 2px 0 0 2px;
        }

        .hero-img-frame::after {
          bottom: -1px; right: -1px;
          border-width: 0 2px 2px 0;
        }

        /* Track lines beside image */
        .hero-track {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #1a1a18 30%, #1a1a18 70%, transparent);
          top: -30px; bottom: -30px;
        }

        .hero-track-left { left: -22px; }
        .hero-track-right { right: -22px; }

        .hero-track-dot {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          left: -2px;
          box-shadow: 0 0 4px var(--accent);
          animation: heroTrack 3s ease-in-out infinite;
        }

        .hero-track-dot.rev { animation-direction: reverse; animation-delay: 1.5s; }

        @keyframes heroTrack {
          0% { top: 0; }
          100% { top: calc(100% - 5px); }
        }

        /* Floating badges */
        .hero-badge {
          position: absolute;
          background: #0c0c0a;
          border: 1px solid #1e1e1a;
          border-radius: 3px;
          padding: 10px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: .08em;
        }

        .hero-badge-top {
          top: -14px; right: -28px;
          border-color: rgba(var(--accent-rgb),.2);
          animation: heroBadgeUp 3.5s ease-in-out infinite;
        }

        .hero-badge-bottom {
          bottom: -14px; left: -28px;
          animation: heroBadgeDown 4s ease-in-out infinite;
        }

        @keyframes heroBadgeUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes heroBadgeDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

        .hero-badge-label {
          display: block;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: var(--accent);
          margin-bottom: 2px;
          font-size: 10px;
        }

        .hero-badge-val {
          color: #4a4a44;
          font-size: 10px;
        }

        /* Marquee strip */
        .hero-marquee-wrap {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          overflow: hidden;
          border-top: 1px solid #1a1a18;
          background: #050505;
          padding: 14px 0;
          z-index: 1;
        }

        .hero-marquee-inner {
          display: flex;
          width: max-content;
          animation: heroMarquee 20s linear infinite;
        }

        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hero-marquee-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: .15em;
          color: #8a8a80;
          padding: 0 32px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hero-marquee-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }

        /* ============================================
           RESPONSIVE BREAKPOINTS
           ============================================ */

        /* ── LAPTOP / SMALL DESKTOP (1024px – 1199px) ── */
        @media (max-width: 1199px) {
          #home {
            padding: 80px 40px 80px;
          }

          .hero-inner {
            gap: 48px;
            max-width: 960px;
          }

          .hero-heading {
            font-size: clamp(52px, 8vw, 100px);
          }

          .hero-bg-text {
            font-size: 180px;
          }

          .hero-img-frame {
            width: 270px;
            height: 330px;
          }

          .hero-stat-item {
            padding: 14px 24px;
          }

          .hero-stat-num {
            font-size: 34px;
          }

          .hero-corner-tl,
          .hero-corner-br {
            width: 120px;
            height: 120px;
          }
        }

        /* ── TABLET LANDSCAPE / SMALL LAPTOP (768px – 1023px) ── */
        @media (max-width: 1023px) {
          #home {
            padding: 70px 32px 90px;
          }

          .hero-inner {
            gap: 40px;
          }

          .hero-heading {
            font-size: clamp(48px, 8vw, 80px);
          }

          .hero-bg-text {
            font-size: 150px;
          }

          .hero-img-frame {
            width: 240px;
            height: 300px;
          }

          .hero-hello {
            font-size: 20px;
          }

          .hero-desc {
            font-size: 15px;
            line-height: 1.75;
          }

          .hero-role-line {
            font-size: 12px;
          }

          .hero-typing {
            font-size: 13px;
          }

          .hero-stat-item {
            padding: 12px 20px;
          }

          .hero-stat-num {
            font-size: 30px;
          }

          .hero-stat-label {
            font-size: 10px;
          }

          .hero-badge {
            padding: 8px 12px;
            font-size: 10px;
          }

          .hero-badge-top {
            right: -20px;
            top: -10px;
          }

          .hero-badge-bottom {
            left: -20px;
            bottom: -10px;
          }

          .hero-marquee-item {
            font-size: 12px;
            padding: 0 24px;
          }

          .hero-corner-tl,
          .hero-corner-br {
            width: 100px;
            height: 100px;
          }
        }

        /* ── TABLET PORTRAIT (600px – 767px) ── */
        @media (max-width: 767px) {
          #home {
            padding: 60px 24px 90px;
            min-height: 100vh;
            justify-content: flex-start;
            padding-top: 80px;
          }

          .hero-inner {
            grid-template-columns: 1fr;
            gap: 36px;
            text-align: center;
          }

          .hero-right-col {
            order: -1;
            padding: 20px 30px;
          }

          .hero-left-col {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-status-tag {
            margin-bottom: 20px;
          }

          .hero-heading {
            font-size: clamp(52px, 14vw, 80px);
            margin-bottom: 16px;
          }

          .hero-hello {
            font-size: 18px;
            margin-bottom: 6px;
          }

          .hero-role-line {
            font-size: 11px;
            justify-content: center;
            margin-bottom: 14px;
          }

          .hero-typing {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .hero-desc {
            font-size: 14px;
            line-height: 1.8;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 24px;
          }

          .hero-stats {
            width: auto;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 28px;
          }

          .hero-stat-item {
            padding: 14px 22px;
          }

          .hero-stat-num {
            font-size: 32px;
          }

          .hero-ctas {
            justify-content: center;
            margin-bottom: 28px;
          }

          .hero-social-label {
            text-align: center;
          }

          .hero-socials {
            justify-content: center;
          }

          .hero-bg-text {
            font-size: 120px;
          }

          .hero-img-frame {
            width: 220px;
            height: 280px;
          }

          .hero-badge {
            padding: 7px 10px;
            font-size: 9px;
          }

          .hero-badge-top {
            right: 0px;
            top: -6px;
          }

          .hero-badge-bottom {
            left: 0px;
            bottom: -6px;
          }

          .hero-badge-label {
            font-size: 9px;
          }

          .hero-badge-val {
            font-size: 9px;
          }

          .hero-track-left { left: -16px; }
          .hero-track-right { right: -16px; }

          .hero-corner-tl,
          .hero-corner-br {
            width: 80px;
            height: 80px;
          }

          .hero-scanline {
            left: 24px;
            right: 24px;
          }

          .hero-marquee-item {
            font-size: 11px;
            padding: 0 20px;
            gap: 10px;
          }

          .hero-marquee-wrap {
            padding: 12px 0;
          }
        }

        /* ── MOBILE (480px – 599px) ── */
        @media (max-width: 599px) {
          #home {
            padding: 50px 18px 80px;
            padding-top: 70px;
          }

          .hero-right-col {
            padding: 18px 24px;
          }

          .hero-inner {
            gap: 30px;
          }

          .hero-heading {
            font-size: clamp(44px, 16vw, 64px);
            margin-bottom: 14px;
          }

          .hero-hello {
            font-size: 16px;
          }

          .hero-role-line {
            font-size: 10px;
            gap: 8px;
            letter-spacing: .06em;
          }

          .hero-role-line::before {
            width: 20px;
          }

          .hero-typing {
            font-size: 11px;
          }

          .hero-desc {
            font-size: 13px;
            line-height: 1.75;
            max-width: 340px;
          }

          .hero-stats {
            width: 100%;
          }

          .hero-stat-item {
            flex: 1;
            padding: 12px 10px;
          }

          .hero-stat-num {
            font-size: 28px;
          }

          .hero-stat-label {
            font-size: 9px;
            letter-spacing: .08em;
          }

          .hero-ctas {
            flex-direction: column;
            width: 100%;
            align-items: stretch;
          }

          .hero-btn-primary,
          .hero-btn-secondary {
            justify-content: center;
            padding: 14px 20px;
            font-size: 11px;
            width: 100%;
            box-sizing: border-box;
          }

          .hero-social-item {
            width: 42px;
            height: 42px;
          }

          .hero-bg-text {
            font-size: 100px;
          }

          .hero-img-frame {
            width: 200px;
            height: 260px;
          }

          .hero-badge-top {
            right: 0px;
            top: -4px;
          }

          .hero-badge-bottom {
            left: 0px;
            bottom: -4px;
          }

          .hero-track-left { left: -14px; }
          .hero-track-right { right: -14px; }

          .hero-status-text {
            font-size: 11px;
          }

          .hero-social-label {
            font-size: 11px;
          }

          .hero-marquee-item {
            font-size: 10px;
            padding: 0 16px;
            gap: 8px;
          }

          .hero-marquee-wrap {
            padding: 10px 0;
          }

          .hero-marquee-dot {
            width: 4px;
            height: 4px;
          }

          .hero-corner-tl,
          .hero-corner-br {
            width: 60px;
            height: 60px;
          }

          .hero-scanline {
            left: 18px;
            right: 18px;
          }
        }

        /* ── SMALL MOBILE (below 380px) ── */
        @media (max-width: 379px) {
          #home {
            padding: 40px 14px 70px;
            padding-top: 60px;
          }

          .hero-right-col {
            padding: 16px 20px;
          }

          .hero-inner {
            gap: 24px;
          }

          .hero-heading {
            font-size: clamp(38px, 18vw, 52px);
            margin-bottom: 12px;
          }

          .hero-hello {
            font-size: 15px;
          }

          .hero-role-line {
            font-size: 9px;
            gap: 6px;
          }

          .hero-role-line::before {
            width: 16px;
          }

          .hero-typing {
            font-size: 10px;
          }

          .hero-desc {
            font-size: 12px;
            line-height: 1.7;
            max-width: 280px;
          }

          .hero-stat-item {
            padding: 10px 8px;
          }

          .hero-stat-num {
            font-size: 24px;
          }

          .hero-stat-label {
            font-size: 8px;
          }

          .hero-btn-primary,
          .hero-btn-secondary {
            padding: 12px 16px;
            font-size: 10px;
          }

          .hero-social-item {
            width: 38px;
            height: 38px;
          }

          .hero-social-item svg {
            width: 16px;
            height: 16px;
          }

          .hero-bg-text {
            font-size: 80px;
          }

          .hero-img-frame {
            width: 170px;
            height: 220px;
          }

          .hero-badge {
            padding: 6px 8px;
            font-size: 8px;
          }

          .hero-badge-top {
            right: 4px;
            top: -2px;
          }

          .hero-badge-bottom {
            left: 4px;
            bottom: -2px;
          }

          .hero-badge-label {
            font-size: 7px;
          }

          .hero-badge-val {
            font-size: 7px;
          }

          .hero-track {
            display: none;
          }

          .hero-status-tag {
            padding: 5px 10px;
            gap: 6px;
            margin-bottom: 16px;
          }

          .hero-status-text {
            font-size: 10px;
          }

          .hero-status-dot {
            width: 6px;
            height: 6px;
          }

          .hero-social-label {
            font-size: 10px;
          }

          .hero-marquee-item {
            font-size: 9px;
            padding: 0 12px;
            gap: 6px;
          }

          .hero-marquee-wrap {
            padding: 8px 0;
          }

          .hero-corner-tl,
          .hero-corner-br {
            width: 40px;
            height: 40px;
          }

          .hero-scanline {
            left: 14px;
            right: 14px;
          }

          .hero-ctas {
            margin-bottom: 24px;
          }
        }

        /* ── LANDSCAPE MOBILE (short height) ── */
        @media (max-height: 500px) and (orientation: landscape) {
          #home {
            padding: 30px 32px 70px;
            min-height: auto;
          }

          .hero-inner {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }

          .hero-right-col {
            order: 0;
          }

          .hero-heading {
            font-size: clamp(36px, 8vh, 56px);
            margin-bottom: 10px;
          }

          .hero-hello {
            font-size: 14px;
            margin-bottom: 4px;
          }

          .hero-desc {
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 16px;
          }

          .hero-role-line {
            font-size: 10px;
            margin-bottom: 10px;
          }

          .hero-typing {
            font-size: 10px;
            margin-bottom: 14px;
          }

          .hero-stats {
            margin-bottom: 16px;
          }

          .hero-stat-item {
            padding: 8px 16px;
          }

          .hero-stat-num {
            font-size: 24px;
          }

          .hero-stat-label {
            font-size: 8px;
          }

          .hero-ctas {
            margin-bottom: 16px;
            gap: 8px;
          }

          .hero-btn-primary,
          .hero-btn-secondary {
            padding: 10px 18px;
            font-size: 10px;
          }

          .hero-img-frame {
            width: 160px;
            height: 200px;
          }

          .hero-bg-text {
            font-size: 100px;
          }

          .hero-status-tag {
            margin-bottom: 12px;
            padding: 4px 10px;
          }

          .hero-social-item {
            width: 36px;
            height: 36px;
          }

          .hero-social-label {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .hero-corner-tl,
          .hero-corner-br {
            width: 60px;
            height: 60px;
          }
        }

        /* ── ULTRA-WIDE / 4K (1600px+) ── */
        @media (min-width: 1600px) {
          .hero-inner {
            max-width: 1300px;
            gap: 80px;
          }

          .hero-img-frame {
            width: 360px;
            height: 430px;
          }

          .hero-bg-text {
            font-size: 260px;
          }

          .hero-desc {
            font-size: 17px;
            max-width: 500px;
          }

          .hero-stat-item {
            padding: 18px 36px;
          }

          .hero-stat-num {
            font-size: 42px;
          }

          .hero-marquee-item {
            font-size: 15px;
            padding: 0 36px;
          }
        }

        /* ── Touch device hover fix ── */
        @media (hover: none) {
          .hero-btn-primary:hover { transform: none; }
          .hero-btn-secondary:hover { transform: none; }
          .hero-social-item:hover { transform: none; }

          .hero-btn-primary:active { transform: scale(0.96); }
          .hero-btn-secondary:active { transform: scale(0.96); }
          .hero-social-item:active { transform: scale(0.92); }
        }
      `}</style>

      {/* Decorations */}
      <div className="hero-corner-tl" />
      <div className="hero-corner-br" />
      <div className="hero-scanline" />

      <div className="hero-inner">
        {/* ── LEFT ── */}
        <div className="hero-left-col" style={{ display: "flex", flexDirection: "column" }}>
          <div className="hero-status-tag">
            <span className="hero-status-dot" />
            <span className="hero-status-text">Available for Work</span>
          </div>

          <div className="hero-hello">Hello, I am</div>

          <h1 className="hero-heading">
            <span className="h-accent">R</span>idoan
          </h1>

          <div className="hero-role-line">
            Full Stack Developer &amp; UI/UX Designer
          </div>

          <div className="hero-typing">
            &gt;_ Currently building:{" "}
            <span className="hero-typed" ref={typedRef} />
            <span className="hero-cursor" ref={cursorRef} />
          </div>

          <p className="hero-desc">
            Crafting fast, scalable, pixel-perfect web experiences. 6+ years
            shipping production-grade products at global companies — open to
            remote roles and freelance projects worldwide.
          </p>

          <div className="hero-stats">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="hero-stat-item"
                style={i === stats.length - 1 ? { borderRight: "none" } : {}}
              >
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="hero-ctas">
            <a
              href="#contact"
              className="hero-btn-primary"
              onClick={handleBtnClick}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,12 2,6" />
              </svg>
              Hire Me
            </a>
            <a
              href="/Resume.pdf"
              download
              className="hero-btn-secondary"
              onClick={handleBtnClick}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              View Resume
            </a>
          </div>

          <div className="hero-social-label">Find me on</div>
          <div className="hero-socials">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="hero-social-item"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div
          className="hero-right-col"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="hero-bg-text">RDN</div>

          {/* Track lines */}
          <div className="hero-track hero-track-left">
            <span className="hero-track-dot" />
          </div>
          <div className="hero-track hero-track-right">
            <span className="hero-track-dot rev" />
          </div>

          {/* Image frame */}
          <div className="hero-img-frame">
            <Image
              src="/image.jpg"
              alt="Ridoan"
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              priority
            />
          </div>

          {/* Badge top */}
          <div className="hero-badge hero-badge-top">
            <span className="hero-badge-label">Stack</span>
            <span className="hero-badge-val">React · Next.js · TS</span>
          </div>

          {/* Badge bottom */}
          <div className="hero-badge hero-badge-bottom">
            <span className="hero-badge-label" style={{ color: "#4a4a44" }}>
              Status
            </span>
            <span className="hero-badge-val" style={{ color: "var(--accent)" }}>
              ● Open to Remote
            </span>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="hero-marquee-wrap">
        <div className="hero-marquee-inner">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="hero-marquee-item">
              <span className="hero-marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
