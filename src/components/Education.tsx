"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const educations = [
  {
    degree: "Diploma in Computer Science & Technology",
    institution: "Chattogram Polytechnic Institute · Chattogram, Bangladesh",
    period: "2021 – 2025",
    badge: "Ongoing",
    badgeColor: "#c8f060",
    tag: "01",
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
    degree: "Secondary School Certificate (SSC)",
    institution: "School Name · Chattogram",
    period: "2019 – 2021",
    badge: "Completed",
    badgeColor: "#60a5fa",
    tag: "02",
    subjects: ["Mathematics", "Science", "English", "ICT", "General Studies"],
    description:
      "Completed secondary education with strong results. First exposure to computers and programming sparked a deep passion for technology that led to a career in software development.",
    achievements: [
      "Strong academic performance in science and math",
      "Best student award in ICT",
      "Active member of school science club",
    ],
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── heading entrance — exact hero pattern
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

  // ── timeline line draw
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

  // ── cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-card",
        { x: -50, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.18, ease: "power4.out",
          scrollTrigger: { trigger: ".edu-timeline-wrap", start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── timeline dots pop
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-dot",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.2, ease: "back.out(2.5)",
          scrollTrigger: { trigger: ".edu-timeline-wrap", start: "top 75%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── achievement items stagger per card
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

  // ── stats entrance
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

  // ── floating particles
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

  // ── card hover — GSAP
  const onCardEnter = useCallback((i: number, color: string) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, { x: 8, duration: 0.32, ease: "power3.out" });
    gsap.to(card.querySelector(".edu-card-accent"), { opacity: 1, duration: 0.25 });
    gsap.to(card.querySelector(".edu-card-glow"), { opacity: 1, duration: 0.4 });
    gsap.to(card.querySelector(".edu-card-num"), { opacity: 0.07, duration: 0.3 });
    gsap.to(card, { borderColor: color + "50", duration: 0.3 });
    // dot pulse
    const dot = dotRefs.current[i];
    if (dot) gsap.to(dot, { scale: 1.4, duration: 0.3, ease: "back.out(2)" });
  }, []);

  const onCardLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, { x: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(card.querySelector(".edu-card-accent"), { opacity: 0, duration: 0.3 });
    gsap.to(card.querySelector(".edu-card-glow"), { opacity: 0, duration: 0.4 });
    gsap.to(card.querySelector(".edu-card-num"), { opacity: 0.02, duration: 0.3 });
    gsap.to(card, { borderColor: "#1a1a18", duration: 0.3 });
    const dot = dotRefs.current[i];
    if (dot) gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── exact hero padding ── */
        #education {
          padding: 80px 60px 80px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #080808;
          color: #e8e4dc;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── grid bg ── */
        #education::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none; z-index: 0;
        }

        /* ── corner brackets ── */
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

        /* ── scanline ── */
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

        /* ── inner ── */
        .edu-inner {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* ── status tag ── */
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

        /* ── heading ── */
        .edu-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .edu-heading .h-accent { color: var(--accent); }

        /* ── role line ── */
        .edu-role-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px; letter-spacing: .08em;
          text-transform: uppercase; color: #6a6a60;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          opacity: 0;
        }
        .edu-role-line::before {
          content: ''; width: 28px; height: 1px;
          background: var(--accent); flex-shrink: 0;
        }

        /* ── desc ── */
        .edu-desc {
          font-size: 16px; line-height: 1.85; color: #4a4a44;
          max-width: 440px; margin-bottom: 52px; opacity: 0;
        }

        /* ── timeline wrap ── */
        .edu-timeline-wrap {
          position: relative;
          padding-left: 48px;
        }

        /* ── vertical line ── */
        .edu-timeline-line {
          position: absolute;
          left: 16px; top: 8px; bottom: 8px;
          width: 1px;
          background: linear-gradient(to bottom, var(--accent) 0%, #60a5fa 50%, #f472b6 100%);
          border-radius: 2px;
        }

        /* ── timeline dot ── */
        .edu-dot {
          position: absolute;
          left: -39px; top: 32px;
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid #080808;
          opacity: 0;
          z-index: 2;
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

        /* ── card ── */
        .edu-card {
          position: relative;
          margin-bottom: 24px;
          opacity: 0;
          will-change: transform;
        }
        .edu-card:last-child { margin-bottom: 0; }

        .edu-card-inner {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.018) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 4px 28px rgba(0,0,0,0.32),
            0 1px 4px rgba(0,0,0,0.4);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 6px;
          padding: 28px 32px;
          position: relative;
          overflow: hidden;
          transition: border-color .3s ease, box-shadow .35s ease, background .35s ease;
        }
        .edu-card-inner:hover {
          border-color: var(--cc);
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 8px 40px rgba(0,0,0,0.38),
            0 0 32px rgba(0,0,0,0.1);
        }

        .edu-card-glow {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          background: radial-gradient(ellipse at top left, var(--cc-glow) 0%, transparent 60%);
          transition: opacity .4s;
        }

        .edu-card-accent {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: var(--cc); opacity: 0;
          box-shadow: 0 0 12px var(--cc-glow);
        }

        .edu-card-num {
          position: absolute; bottom: 12px; right: 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 96px; line-height: 1;
          color: rgba(255,255,255,.04);
          user-select: none; pointer-events: none;
        }

        /* ── top row ── */
        .edu-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }

        .edu-degree {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px; font-weight: 600;
          color: #e8e4dc; margin-bottom: 5px;
          letter-spacing: .01em;
        }

        .edu-institution {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #4a4a44;
          letter-spacing: .06em;
        }

        .edu-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .12em;
          text-transform: uppercase;
          padding: 4px 10px; border-radius: 2px;
          background: var(--cc-bg); color: var(--cc);
          border: 1px solid var(--cc-border);
          margin-bottom: 6px; display: block;
          text-align: center;
        }

        .edu-period {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #3a3a36;
          letter-spacing: .08em; text-align: right;
        }

        /* ── subjects ── */
        .edu-subjects-wrap {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .edu-subject {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .08em;
          text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(var(--accent-rgb),.04);
          border: 1px solid rgba(var(--accent-rgb),.1);
          border-radius: 2px; color: #6a6a5a;
        }

        /* ── description ── */
        .edu-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #4a4a44;
          line-height: 1.85; margin-bottom: 18px;
          letter-spacing: .01em;
        }

        /* ── achievements ── */
        .edu-achievements { list-style: none; padding: 0; margin: 0; }
        .edu-achievement {
          display: flex; align-items: center; gap: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #4a4a44;
          letter-spacing: .04em; margin-bottom: 7px;
        }
        .edu-achievement:last-child { margin-bottom: 0; }
        .edu-achievement-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--cc); box-shadow: 0 0 6px var(--cc);
          flex-shrink: 0;
        }

        /* ── divider between cards ── */
        .edu-card-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #1a1a18 30%, #1a1a18 70%, transparent);
          margin-bottom: 24px;
          opacity: 0.5;
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
          letter-spacing: .12em; color: #3a3a36; margin-top: 4px;
        }

        /* ── float ── */
        .edu-float {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .1em;
          opacity: .03; pointer-events: none;
          user-select: none; color: var(--accent);
        }

        /* ── responsive — exact hero breakpoints ── */
        @media (max-width: 1199px) {
          #education { padding: 80px 40px 80px; }
          .edu-heading { font-size: clamp(52px, 8vw, 100px); }
          .edu-corner-tl, .edu-corner-br { width: 120px; height: 120px; }
          .edu-stat-item { padding: 14px 24px; }
          .edu-stat-num { font-size: 34px; }
        }
        @media (max-width: 1023px) {
          #education { padding: 70px 32px 90px; }
          .edu-heading { font-size: clamp(48px, 8vw, 80px); }
          .edu-desc { font-size: 15px; }
          .edu-corner-tl, .edu-corner-br { width: 100px; height: 100px; }
          .edu-scanline { left: 32px; right: 32px; }
        }
        @media (max-width: 767px) {
          #education { padding: 60px 24px 90px; padding-top: 80px; }
          .edu-heading { font-size: clamp(52px, 14vw, 80px); }
          .edu-desc { font-size: 14px; line-height: 1.8; max-width: 100%; }
          .edu-stats { width: 100%; }
          .edu-stat-item { flex: 1; padding: 14px 16px; }
          .edu-corner-tl, .edu-corner-br { width: 80px; height: 80px; }
          .edu-scanline { left: 24px; right: 24px; }
          .edu-timeline-wrap { padding-left: 36px; }
          .edu-card-inner { padding: 22px 20px; }
          .edu-degree { font-size: 15px; }
        }
        @media (max-width: 599px) {
          #education { padding: 50px 18px 80px; padding-top: 70px; }
          .edu-heading { font-size: clamp(44px, 16vw, 64px); }
          .edu-role-line { font-size: 10px; gap: 8px; letter-spacing: .06em; }
          .edu-role-line::before { width: 20px; }
          .edu-desc { font-size: 13px; }
          .edu-stat-num { font-size: 28px; }
          .edu-stat-item { padding: 12px 10px; }
          .edu-stat-label { font-size: 9px; }
          .edu-corner-tl, .edu-corner-br { width: 60px; height: 60px; }
          .edu-top-row { flex-direction: column; }
          .edu-badge { text-align: left; width: fit-content; }
          .edu-period { text-align: left; }
        }
        @media (max-width: 379px) {
          #education { padding: 40px 14px 70px; padding-top: 60px; }
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
        }
      `}</style>

      <section id="education" ref={sectionRef}>
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

          {/* ── Heading — exact hero pattern ── */}
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

          {/* ── Timeline ── */}
          <div className="edu-timeline-wrap">
            <div className="edu-timeline-line" />

            {educations.map((edu, i) => (
              <div key={i}>
                <div
                  className="edu-card"
                  ref={(el) => { cardRefs.current[i] = el; }}
                  onMouseEnter={() => onCardEnter(i, edu.badgeColor)}
                  onMouseLeave={() => onCardLeave(i)}
                >
                  {/* dot */}
                  <div
                    className="edu-dot"
                    ref={(el) => { dotRefs.current[i] = el; }}
                    style={{
                      background: edu.badgeColor,
                      boxShadow: `0 0 12px ${edu.badgeColor}80`,
                      color: edu.badgeColor,
                    }}
                  >
                    <div className="edu-dot-ring" />
                  </div>

                  <div
                    className="edu-card-inner"
                    style={{
                      "--cc": edu.badgeColor,
                      "--cc-bg": `${edu.badgeColor}12`,
                      "--cc-border": `${edu.badgeColor}30`,
                      "--cc-glow": `${edu.badgeColor}38`,
                    } as React.CSSProperties}
                  >
                    <div className="edu-card-glow" />
                    <div className="edu-card-accent" />
                    <div className="edu-card-num">{edu.tag}</div>

                    {/* top row */}
                    <div className="edu-top-row">
                      <div>
                        <div className="edu-degree">{edu.degree}</div>
                        <div className="edu-institution">{edu.institution}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
                        <span className="edu-badge">{edu.badge}</span>
                        <span className="edu-period">{edu.period}</span>
                      </div>
                    </div>

                    {/* subjects */}
                    <div className="edu-subjects-wrap">
                      {edu.subjects.map((s) => (
                        <span key={s} className="edu-subject">{s}</span>
                      ))}
                    </div>

                    {/* description */}
                    <p className="edu-card-desc">{edu.description}</p>

                    {/* achievements */}
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

                {/* divider between cards */}
                {i < educations.length - 1 && (
                  <div className="edu-card-divider" />
                )}
              </div>
            ))}
          </div>

          {/* ── Stats strip — exact hero stats bar ── */}
          <div className="edu-stats">
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "var(--accent)" }}>2+</div>
              <div className="edu-stat-label">Degrees</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "#60a5fa" }}>4+</div>
              <div className="edu-stat-label">Years Study</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "#f472b6" }}>10+</div>
              <div className="edu-stat-label">Subjects</div>
            </div>
            <div className="edu-stat-item">
              <div className="edu-stat-num" style={{ color: "var(--accent)" }}>5.0</div>
              <div className="edu-stat-label">GPA</div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}