"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type EduStatus = "completed" | "ongoing" | "upcoming";

const educations: {
  status: EduStatus;
  progress: number;
  degree: string;
  institution: string;
  period: string;
  badge: string;
  badgeColor: string;
  tag: string;
  subjects: string[];
  description: string;
  achievements: string[];
}[] = [
  {
    status: "completed",
    progress: 100,
    degree: "Secondary School Certificate (SSC)",
    institution: "School Name · Chattogram",
    period: "2019 – 2021",
    badge: "Passed",
    badgeColor: "#22c55e",
    tag: "01",
    subjects: ["Mathematics", "Science", "English", "ICT", "General Studies"],
    description:
      "Completed secondary education with strong results. First exposure to computers and programming sparked a deep passion for technology that led to a career in software development.",
    achievements: [
      "Strong academic performance in science and math",
      "Best student award in ICT",
      "Active member of school science club",
    ],
  },
  {
    status: "ongoing",
    progress: 75,
    degree: "Diploma in Computer Science & Technology",
    institution: "Chattogram Polytechnic Institute · Chattogram, Bangladesh",
    period: "2021 – 2025",
    badge: "Ongoing",
    badgeColor: "#3b82f6",
    tag: "02",
    subjects: ["Algorithms", "Data Structures", "OS", "Networking", "Web Dev"],
    description:
      "Pursuing a diploma with a strong practical focus on full-stack web development, software engineering principles, and modern technologies. Actively building real-world projects alongside coursework.",
    achievements: [
      "Building production-grade full-stack applications",
      "Active open-source contributor on GitHub",
      "Completed multiple freelance projects during studies",
    ],
  },
  {
    status: "upcoming",
    progress: 0,
    degree: "Bachelor of Science in Computer Science",
    institution: "University · Bangladesh",
    period: "2025 – 2029",
    badge: "Upcoming",
    badgeColor: "#6b7280",
    tag: "03",
    subjects: ["Algorithms", "System Design", "Cloud", "Software Engineering", "Web Systems"],
    description:
      "Planning to pursue a Bachelor's degree to deepen theoretical foundations and explore advanced topics in software architecture, distributed systems, and scalable product development.",
    achievements: [
      "Building strong fundamentals through self-study",
      "Targeting admission to a top-tier CS program",
      "Growing expertise in modern software engineering",
    ],
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".edu-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".edu-role-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".edu-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-timeline-line",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.8, ease: "power2.out",
          scrollTrigger: { trigger: ".edu-timeline-wrap", start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Type 1 — completed: stamp-in effect
      document.querySelectorAll(".edu-card--completed").forEach((card) => {
        gsap.fromTo(card,
          { y: 30, opacity: 0, scale: 1.04 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 82%", once: true } }
        );
      });
      // Type 2 — ongoing: smooth slide-up
      document.querySelectorAll(".edu-card--ongoing").forEach((card) => {
        gsap.fromTo(card,
          { y: 44, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true } }
        );
      });
      // Type 3 — upcoming: fade from below slowly
      document.querySelectorAll(".edu-card--upcoming").forEach((card) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power2.out", delay: 0.12,
            scrollTrigger: { trigger: card, start: "top 85%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dot animations per type
      document.querySelectorAll<HTMLElement>(".edu-dot--completed").forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(3)",
            scrollTrigger: { trigger: dot, start: "top 85%", once: true },
            onComplete: () => {
              // stamp bounce
              gsap.to(dot, { scale: 1.25, duration: 0.12, ease: "power2.in",
                onComplete: () => gsap.to(dot, { scale: 1, duration: 0.22, ease: "back.out(2)" }) });
            }
          }
        );
      });
      document.querySelectorAll<HTMLElement>(".edu-dot--ongoing").forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)",
            scrollTrigger: { trigger: dot, start: "top 85%", once: true } }
        );
      });
      document.querySelectorAll<HTMLElement>(".edu-dot--upcoming").forEach((dot) => {
        gsap.fromTo(dot,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.45, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: dot, start: "top 87%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate progress bars on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".edu-progress-fill").forEach((bar) => {
        const target = parseFloat(bar.dataset.progress || "0");
        gsap.fromTo(bar,
          { width: "0%" },
          { width: `${target}%`, duration: target > 0 ? 1.4 : 0, ease: "power2.out",
            scrollTrigger: { trigger: bar, start: "top 88%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".edu-card").forEach((card) => {
        gsap.fromTo(card.querySelectorAll(".edu-achievement"),
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 80%", once: true } }
        );
        gsap.fromTo(card.querySelectorAll(".edu-subject"),
          { y: 10, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.35, stagger: 0.05, ease: "back.out(1.5)",
            scrollTrigger: { trigger: card, start: "top 80%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-stats",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".edu-stats", start: "top 88%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".edu-float").forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-20, 20), x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(3, 5), ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onCardEnter = useCallback((i: number, color: string) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const inner = card.querySelector<HTMLElement>(".edu-card-inner");
    if (inner) gsap.to(inner, { borderColor: color + "40", duration: 0.3 });
    gsap.to(card.querySelector(".edu-card-accent"), { opacity: 1, duration: 0.25 });
    gsap.to(card.querySelector(".edu-card-glow"), { opacity: 1, duration: 0.4 });
    gsap.to(card.querySelector(".edu-card-num"), { opacity: 0.06, duration: 0.3 });
    const bar = card.querySelector<HTMLElement>(".edu-card-bar");
    if (bar) gsap.to(bar, { boxShadow: `0 0 18px ${color}70`, duration: 0.35 });
    const dot = dotRefs.current[i];
    if (dot) gsap.to(dot, { scale: 1.3, duration: 0.3, ease: "back.out(2)" });
  }, []);

  const onCardLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const inner = card.querySelector<HTMLElement>(".edu-card-inner");
    if (inner) gsap.to(inner, { borderColor: "rgba(255,255,255,0.08)", duration: 0.4 });
    gsap.to(card.querySelector(".edu-card-accent"), { opacity: 0, duration: 0.3 });
    gsap.to(card.querySelector(".edu-card-glow"), { opacity: 0, duration: 0.4 });
    gsap.to(card.querySelector(".edu-card-num"), { opacity: 0.02, duration: 0.3 });
    const bar = card.querySelector<HTMLElement>(".edu-card-bar");
    if (bar) gsap.to(bar, { boxShadow: "none", duration: 0.35 });
    const dot = dotRefs.current[i];
    if (dot) gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #education {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
        }

        .edu-corner-tl {
          position: absolute; top: 0; left: 0;
          width: 180px; height: 180px;
          border-right: 1px solid rgba(var(--accent-rgb),.08);
          border-bottom: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }
        .edu-corner-br {
          position: absolute; bottom: 0; right: 0;
          width: 180px; height: 180px;
          border-left: 1px solid rgba(var(--accent-rgb),.08);
          border-top: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }

        .edu-scanline {
          position: absolute; left: 60px; right: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.12), transparent);
          top: 50%; pointer-events: none; z-index: 0;
          animation: eduScan 7s ease-in-out infinite;
        }
        @keyframes eduScan {
          0%,100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; } 85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }

        .edu-inner {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .edu-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06);
          border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px;
          width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .edu-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
          animation: eduBlink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes eduBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .edu-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--accent);
        }

        .edu-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .edu-heading .h-accent { color: var(--accent); }

        .edu-role-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px; letter-spacing: .08em;
          text-transform: uppercase; color: #e8e4dc;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          opacity: 0;
        }
        .edu-role-line::before {
          content: ''; width: 28px; height: 1px;
          background: var(--accent); flex-shrink: 0;
        }

        .edu-desc {
          font-size: 16px; line-height: 1.85; color: #e8e4dc;
          max-width: 440px; margin-bottom: 52px; opacity: 0;
        }

        /* ── Timeline legend ── */
        .edu-legend {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 32px; flex-wrap: wrap;
        }
        .edu-legend-item {
          display: flex; align-items: center; gap: 7px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase; color: #5a5856;
        }
        .edu-legend-dot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }

        /* ── timeline ── */
        .edu-timeline-wrap {
          position: relative;
          padding-left: 48px;
        }
        .edu-timeline-line {
          position: absolute;
          left: 16px; top: 8px; bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom, #22c55e 0%, #22c55e 33%, #3b82f6 33%, #3b82f6 66%, #6b7280 66%, #6b7280 100%);
          border-radius: 2px;
        }

        /* ── Timeline dots by type ── */
        .edu-dot {
          position: absolute;
          left: -39px; top: 32px;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid #080808;
          z-index: 2;
        }
        .edu-dot--completed {
          opacity: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .edu-dot--ongoing {
          opacity: 0;
        }
        .edu-dot--upcoming {
          opacity: 0;
          background: transparent !important;
          border-style: dashed !important;
          border-width: 2px !important;
        }

        .edu-dot-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0.25;
          animation: eduRing 2.5s ease-in-out infinite;
        }
        @keyframes eduRing {
          0%,100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.5); opacity: 0; }
        }

        /* ── card shell ── */
        .edu-card {
          position: relative;
          margin-bottom: 28px;
          opacity: 0;
          will-change: transform;
        }
        .edu-card:last-child { margin-bottom: 0; }

        /* completed: slight green tint on inner */
        .edu-card--completed .edu-card-inner {
          background: linear-gradient(145deg, rgba(34,197,94,0.04) 0%, rgba(255,255,255,0.02) 100%);
        }
        /* upcoming: reduced opacity, dashed border */
        .edu-card--upcoming { opacity: 0; }
        .edu-card--upcoming .edu-card-inner {
          border-style: dashed !important;
          opacity: 0.6;
        }

        .edu-card-inner {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.09),
            0 4px 32px rgba(0,0,0,0.35),
            0 1px 4px rgba(0,0,0,0.4);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 10px;
          padding: 0;
          position: relative;
          overflow: hidden;
          transition: border-color .3s ease, box-shadow .35s ease, background .35s ease;
        }
        .edu-card-inner:hover {
          background: linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 8px 44px rgba(0,0,0,0.42);
        }

        .edu-card-glow {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          background: radial-gradient(ellipse at top left, var(--cc-glow) 0%, transparent 55%);
          transition: opacity .4s;
        }
        .edu-card-accent {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(90deg, var(--cc), transparent 70%);
          opacity: 0;
        }
        .edu-card-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--cc);
          border-radius: 10px 0 0 10px;
        }
        .edu-card-num {
          position: absolute; bottom: 16px; right: 24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 110px; line-height: 1;
          color: rgba(255,255,255,.02);
          user-select: none; pointer-events: none;
          letter-spacing: .04em;
        }

        /* ── Progress bar ── */
        .edu-progress-wrap {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 0 0 0 0;
          overflow: hidden;
        }
        .edu-progress-fill {
          height: 100%; width: 0%; border-radius: 0;
          transition: box-shadow 0.3s;
        }
        .edu-progress-fill--completed {
          background: linear-gradient(90deg, #22c55e, #4ade80);
          box-shadow: 0 0 8px rgba(34,197,94,0.5);
        }
        .edu-progress-fill--ongoing {
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          box-shadow: 0 0 8px rgba(59,130,246,0.4);
          animation: eduProgressPulse 2.5s ease-in-out infinite;
        }
        @keyframes eduProgressPulse {
          0%,100% { box-shadow: 0 0 8px rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 16px rgba(59,130,246,0.7); }
        }
        .edu-progress-fill--upcoming {
          background: linear-gradient(90deg, #6b7280, #9ca3af);
        }

        /* ── card header ── */
        .edu-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding: 24px 28px 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .edu-card-head-left { flex: 1; min-width: 0; }
        .edu-card-head-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .edu-tag-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .edu-tag-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--cc);
          opacity: 0.55;
        }
        .edu-tag-sep {
          width: 24px; height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .edu-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .14em;
          text-transform: uppercase;
          padding: 5px 12px; border-radius: 3px;
          background: var(--cc-bg);
          color: var(--cc);
          border: 1px solid var(--cc-border);
          white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
        }

        /* ongoing badge pulse */
        .edu-badge--ongoing::before {
          content: '';
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
          animation: eduBlink 2s ease infinite;
        }

        .edu-degree {
          font-family: 'DM Sans', sans-serif;
          font-size: 19px; font-weight: 700;
          color: #f0ece4;
          line-height: 1.25;
          letter-spacing: .005em;
          margin-bottom: 8px;
        }
        /* upcoming degree dimmer */
        .edu-card--upcoming .edu-degree { color: #6e6c6a; }

        .edu-institution {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #7a7672;
          letter-spacing: .05em; line-height: 1.5;
        }

        .edu-period {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #5a5654;
          letter-spacing: .08em;
          white-space: nowrap;
          margin-top: 2px;
        }

        /* ── card body ── */
        .edu-card-body {
          padding: 20px 28px 26px 32px;
        }

        .edu-subjects-wrap {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .edu-subject {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .08em;
          text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(var(--accent-rgb), .05);
          border: 1px solid rgba(var(--accent-rgb), .18);
          border-radius: 3px;
          color: rgba(var(--accent-rgb), 0.55);
          opacity: 0;
        }

        .edu-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #7a7876;
          line-height: 1.85; margin-bottom: 20px;
          letter-spacing: .01em;
        }

        .edu-achievements-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .14em;
          text-transform: uppercase;
          color: #3a3836;
          margin-bottom: 10px;
        }

        .edu-achievements { list-style: none; padding: 0; margin: 0; }
        .edu-achievement {
          display: flex; align-items: flex-start; gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #6e6c6a;
          letter-spacing: .01em;
          line-height: 1.55;
          margin-bottom: 9px;
          padding-bottom: 9px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          opacity: 0;
        }
        .edu-achievement:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        .edu-achievement-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--cc);
          box-shadow: 0 0 6px var(--cc);
          flex-shrink: 0;
          margin-top: 6px;
        }

        /* ── stats strip ── */
        .edu-stats {
          display: flex; align-items: stretch;
          margin-top: 52px;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border-radius: 6px;
          overflow: hidden; width: fit-content; opacity: 0;
        }
        .edu-stat-item {
          padding: 16px 30px;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .edu-stat-item:last-child { border-right: none; }
        .edu-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px; letter-spacing: .03em; line-height: 1;
        }
        .edu-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; text-transform: uppercase;
          letter-spacing: .12em; color: #5a5856; margin-top: 4px;
        }

        .edu-float {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .1em;
          opacity: .03; pointer-events: none;
          user-select: none; color: var(--accent);
        }

        /* ── divider between cards ── */
        .edu-divider--solid {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent);
          margin: 0 0 28px;
        }
        .edu-divider--dashed {
          height: 1px;
          background: repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 8px, transparent 8px, transparent 16px);
          margin: 0 0 28px;
        }

        /* ── responsive ── */
        @media (max-width: 1199px) {
          .edu-heading { font-size: clamp(52px, 8vw, 100px); }
          .edu-corner-tl, .edu-corner-br { width: 120px; height: 120px; }
          .edu-stat-item { padding: 14px 24px; }
          .edu-stat-num { font-size: 34px; }
        }
        @media (max-width: 1023px) {
          .edu-heading { font-size: clamp(48px, 8vw, 80px); }
          .edu-desc { font-size: 15px; }
          .edu-corner-tl, .edu-corner-br { width: 100px; height: 100px; }
          .edu-scanline { left: 32px; right: 32px; }
          .edu-card-head { padding: 22px 24px 18px 28px; }
          .edu-card-body { padding: 18px 24px 22px 28px; }
        }
        @media (max-width: 767px) {
          .edu-heading { font-size: clamp(52px, 14vw, 80px); }
          .edu-desc { font-size: 14px; line-height: 1.8; max-width: 100%; }
          .edu-stats { width: 100%; }
          .edu-stat-item { flex: 1; padding: 14px 16px; }
          .edu-corner-tl, .edu-corner-br { width: 80px; height: 80px; }
          .edu-scanline { left: 24px; right: 24px; }
          .edu-timeline-wrap { padding-left: 36px; }
          .edu-card-head { flex-direction: column; gap: 12px; }
          .edu-card-head-right { align-items: flex-start; flex-direction: row; gap: 10px; align-items: center; }
          .edu-degree { font-size: 16px; }
          .edu-legend { gap: 14px; }
        }
        @media (max-width: 599px) {
          .edu-heading { font-size: clamp(44px, 16vw, 64px); }
          .edu-role-line { font-size: 10px; gap: 8px; letter-spacing: .06em; }
          .edu-role-line::before { width: 20px; }
          .edu-desc { font-size: 13px; }
          .edu-stat-num { font-size: 28px; }
          .edu-stat-item { padding: 12px 10px; }
          .edu-stat-label { font-size: 9px; }
          .edu-corner-tl, .edu-corner-br { width: 60px; height: 60px; }
          .edu-card-head { padding: 18px 18px 14px 22px; }
          .edu-card-body { padding: 14px 18px 20px 22px; }
          .edu-card-desc { font-size: 13px; }
        }
        @media (max-width: 379px) {
          .edu-heading { font-size: clamp(38px, 18vw, 52px); }
          .edu-corner-tl, .edu-corner-br { width: 40px; height: 40px; }
          .edu-scanline { left: 14px; right: 14px; }
          .edu-status-text { font-size: 11px; }
          .edu-timeline-wrap { padding-left: 28px; }
        }
        @media (hover: none) {
          .edu-card:hover { transform: none !important; }
        }
        @media (min-width: 1600px) {
          .edu-inner { max-width: 1300px; }
          .edu-heading { font-size: clamp(80px, 9vw, 130px); }
          .edu-desc { font-size: 17px; max-width: 500px; }
          .edu-stat-item { padding: 18px 36px; }
          .edu-stat-num { font-size: 42px; }
          .edu-degree { font-size: 21px; }
        }
      `}</style>

      <section id="education" ref={sectionRef}>
        <div className="page-card">
        <div className="edu-corner-tl" />
        <div className="edu-corner-br" />
        <div className="edu-scanline" />

        {["BSC", "HSC", "SSC", "GPA", "CS", "EDU", "DEV", "4.0"].map((p, i) => (
          <div key={i} className="edu-float"
            style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>
            {p}
          </div>
        ))}

        <div className="edu-inner">

          <div ref={headingRef}>
            <div className="edu-status-tag">
              <span className="edu-status-dot" />
              <span className="edu-status-text">Academic Background</span>
            </div>

            <h2 className="edu-heading">
              <span className="h-accent">E</span>duc<span className="h-accent">a</span>tion
            </h2>

            <div className="edu-role-line">
              The foundation behind everything I build
            </div>

            <p className="edu-desc">
              My academic journey that shaped my engineering mindset, problem-solving
              skills, and passion for building real-world software.
            </p>
          </div>

          {/* Legend */}
          <div className="edu-legend">
            <div className="edu-legend-item">
              <div className="edu-legend-dot" style={{ background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.5)" }} />
              Completed
            </div>
            <div className="edu-legend-item">
              <div className="edu-legend-dot" style={{ background: "#3b82f6", boxShadow: "0 0 6px rgba(59,130,246,0.4)", animation: "eduBlink 2s ease infinite" }} />
              Ongoing
            </div>
            <div className="edu-legend-item">
              <div className="edu-legend-dot" style={{ background: "transparent", border: "2px dashed #6b7280" }} />
              Upcoming
            </div>
          </div>

          <div className="edu-timeline-wrap">
            <div className="edu-timeline-line" />

            {educations.map((edu, i) => (
              <div key={i}>
                <div
                  className={`edu-card edu-card--${edu.status}`}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  onMouseEnter={() => onCardEnter(i, edu.badgeColor)}
                  onMouseLeave={() => onCardLeave(i)}
                >
                  {/* Timeline dot — different per status */}
                  <div
                    className={`edu-dot edu-dot--${edu.status}`}
                    ref={(el) => { dotRefs.current[i] = el; }}
                    style={{
                      background: edu.status === "upcoming" ? "transparent" : edu.badgeColor,
                      boxShadow: edu.status !== "upcoming" ? `0 0 12px ${edu.badgeColor}80` : "none",
                      borderColor: edu.status === "upcoming" ? edu.badgeColor : "#080808",
                      color: edu.badgeColor,
                    }}
                  >
                    {edu.status === "completed" && (
                      /* Checkmark for completed */
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {edu.status === "ongoing" && (
                      <div className="edu-dot-ring" />
                    )}
                    {edu.status === "upcoming" && (
                      /* Lock icon for upcoming */
                      <svg width="7" height="7" viewBox="0 0 12 12" fill="none" style={{ position: "relative", zIndex: 1 }}>
                        <rect x="2" y="5" width="8" height="6" rx="1.5" stroke={edu.badgeColor} strokeWidth="1.5" />
                        <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke={edu.badgeColor} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  <div
                    className="edu-card-inner"
                    style={{
                      "--cc": edu.badgeColor,
                      "--cc-bg": `${edu.badgeColor}14`,
                      "--cc-border": `${edu.badgeColor}35`,
                      "--cc-glow": `${edu.badgeColor}30`,
                    } as React.CSSProperties}
                  >
                    <div className="edu-card-glow" />
                    <div className="edu-card-accent" />
                    <div className="edu-card-bar" />
                    <div className="edu-card-num">{edu.tag}</div>

                    {/* ── Header ── */}
                    <div className="edu-card-head">
                      <div className="edu-card-head-left">
                        <div className="edu-tag-row">
                          <span className="edu-tag-num">#{edu.tag}</span>
                          <div className="edu-tag-sep" />
                          <span className={`edu-badge edu-badge--${edu.status}`}>{edu.badge}</span>
                        </div>
                        <div className="edu-degree">{edu.degree}</div>
                        <div className="edu-institution">{edu.institution}</div>
                      </div>
                      <div className="edu-card-head-right">
                        <span className="edu-period">{edu.period}</span>
                        {/* Progress % label */}
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          color: edu.status === "upcoming" ? "#4a4a48" : edu.badgeColor,
                          letterSpacing: ".06em",
                        }}>
                          {edu.status === "upcoming" ? "—" : `${edu.progress}%`}
                        </span>
                      </div>
                    </div>

                    {/* ── Progress bar ── */}
                    <div className="edu-progress-wrap">
                      <div
                        className={`edu-progress-fill edu-progress-fill--${edu.status}`}
                        data-progress={edu.progress}
                      />
                    </div>

                    {/* ── Body ── */}
                    <div className="edu-card-body">
                      <div className="edu-subjects-wrap">
                        {edu.subjects.map((s) => (
                          <span key={s} className="edu-subject">{s}</span>
                        ))}
                      </div>

                      <p className="edu-card-desc">{edu.description}</p>

                      <div className="edu-achievements-label">Highlights</div>
                      <ul className="edu-achievements">
                        {edu.achievements.map((a) => (
                          <li key={a} className="edu-achievement">
                            <span
                              className="edu-achievement-dot"
                              style={{ "--cc": edu.badgeColor } as React.CSSProperties}
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Divider between cards — solid for completed→ongoing, dashed for ongoing→upcoming */}
                {i < educations.length - 1 && (
                  <div className={
                    educations[i].status === "ongoing" || educations[i+1].status === "upcoming"
                      ? "edu-divider--dashed"
                      : "edu-divider--solid"
                  } />
                )}
              </div>
            ))}
          </div>

          <div className="edu-stats">
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "var(--accent)" }}>3</div>
              <div className="edu-stat-label">Programs</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "#60a5fa" }}>6+</div>
              <div className="edu-stat-label">Years Study</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "#93c5fd" }}>15+</div>
              <div className="edu-stat-label">Subjects</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "var(--accent)" }}>5.0</div>
              <div className="edu-stat-label">GPA</div>
            </div>
          </div>

        </div>
        </div>
      </section>
    </>
  );
}
