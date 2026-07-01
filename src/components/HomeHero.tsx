"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useCallback, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

interface Blog {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string[];
  category: string | null;
  createdAt: string;
  views: number;
}

interface Skill {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
}

function EyeIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SocialIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case "github":
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      );
  }
}

export default function HomeHero() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [blogIdx, setBlogIdx] = useState(0);
  // skills kept for marquee section

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d: Blog[]) => setBlogs(Array.isArray(d) ? d.slice(0, 6) : []))
      .catch(() => {});
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d: Skill[]) => setSkills(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    gsap.fromTo(".home-master-card", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
    gsap.fromTo(".home-hero-copy", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, delay: 0.18, ease: "power3.out" });
    gsap.fromTo(".home-hero-right", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.28, ease: "power3.out" });
  }, []);

  const goBlog = useCallback((dir: 1 | -1) => {
    if (blogs.length === 0) return;
    setBlogIdx((p) => (p + dir + blogs.length) % blogs.length);
  }, [blogs.length]);

  const getOffset = (i: number, center: number, total: number) => {
    let off = ((i - center) % total + total) % total;
    if (off > total / 2) off -= total;
    return off;
  };

  useEffect(() => {
    if (blogs.length <= 1) return;
    const t = setInterval(() => goBlog(1), 5000);
    return () => clearInterval(t);
  }, [blogs.length, goBlog]);

  const handleNav = useCallback((href: string, external = false) => {
    if (external) window.open(href, "_blank", "noreferrer");
    else router.push(href);
  }, [router]);

  const skillLanes = useMemo(() => {
    const lanes: Skill[][] = [[], [], []];
    skills.forEach((skill, index) => {
      lanes[index % 3].push(skill);
    });
    return lanes;
  }, [skills]);

  const plainText = (html: string) => html.replace(/<[^>]+>/g, "").trim();

  const socialLinks = [
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
    { label: "Twitter", href: "https://x.com", icon: "twitter" },
    { label: "GitHub", href: "https://github.com/Ridoan-75", icon: "github" },
  ];

  return (
    <section id="home">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Root containers ── */
        #home {
          min-height: 100vh;
          padding: 0;
          color: #e8e4dc;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .home-master-card {
          background: rgba(255,255,255,0.022);
          border: 1px solid rgba(var(--accent-rgb),0.1);
          backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 100vh;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }
        .home-divider { height: 1px; background: rgba(255,255,255,0.06); flex-shrink: 0; }

        /* ── Hero ── */
        .home-hero {
          display: flex;
          flex-direction: column;
          gap: clamp(12px, 2vw, 24px);
          padding: clamp(22px, 4.5vw, 60px) clamp(16px, 5vw, 60px) clamp(18px, 3vw, 36px);
          width: 100%;
          box-sizing: border-box;
        }
        .home-hero-copy {
          display: flex;
          flex-direction: column;
          gap: clamp(10px, 1.4vw, 18px);
          min-width: 0;
        }
        .home-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .home-eyebrow::before {
          content: '';
          width: 22px;
          height: 1px;
          background: var(--accent);
          display: inline-block;
          flex-shrink: 0;
        }
        .home-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 9vw, 130px);
          line-height: 0.92;
          color: #ffffff;
          letter-spacing: 0.02em;
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .home-title .h-accent { color: var(--accent); }
        .home-description {
          font-size: 14.5px;
          line-height: 1.8;
          color: #c8c4bc;
          max-width: min(560px, 100%);
          word-break: break-word;
        }
        .home-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(6px, 0.7vw, 10px);
          margin-top: 2px;
        }
        .home-social-btn {
          width: clamp(36px, 3.5vw, 44px);
          height: clamp(36px, 3.5vw, 44px);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: #e8e4dc;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .home-social-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(var(--accent-rgb),0.24), transparent 70%);
          opacity: 0;
          transition: opacity 0.22s ease;
        }
        .home-social-btn:hover {
          transform: translateY(-3px) scale(1.04);
          border-color: rgba(var(--accent-rgb),0.38);
          background: rgba(var(--accent-rgb),0.12);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
        }
        .home-social-btn:hover::before { opacity: 1; }
        .home-social-btn svg { position: relative; z-index: 1; }

        /* ── Section shared ── */
        .home-section {
          padding: clamp(16px, 2.2vw, 28px) clamp(16px, 5vw, 60px);
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .home-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: clamp(12px, 1.5vw, 20px);
          flex-wrap: nowrap;
          min-width: 0;
        }
        .home-section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 2.2vw, 28px);
          color: #e8e4dc;
          line-height: 1;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .home-section-right {
          display: flex;
          align-items: center;
          gap: clamp(6px, 0.8vw, 14px);
          flex-wrap: nowrap;
          flex-shrink: 0;
        }
        .home-section-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(var(--accent-rgb),0.18);
          border-radius: 8px;
          cursor: pointer;
          padding: 7px 12px;
          white-space: nowrap;
          transition: all 0.18s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
        .home-section-link:hover { transform: translateY(-2px); background: rgba(var(--accent-rgb),0.06); }

        /* ── Carousel nav ── */
        .carousel-nav { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
        .carousel-btn {
          width: clamp(24px, 2.2vw, 30px);
          height: clamp(24px, 2.2vw, 30px);
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #6a6a72;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.16s, border-color 0.16s, color 0.16s;
        }
        .carousel-btn:hover { background: rgba(var(--accent-rgb),0.1); border-color: rgba(var(--accent-rgb),0.28); color: var(--accent); }

        /* ── Blog coverflow (desktop 3D) ── */
        .blog-coverflow {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .blog-coverflow--3d {
          perspective: 1100px;
          perspective-origin: 50% 50%;
          height: 420px;
        }
        .cf-card-wrap {
          position: absolute;
          width: 313px;
          max-width: 100%;
          transition: transform 0.52s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.52s ease;
          transform-style: preserve-3d;
          will-change: transform, opacity;
          box-sizing: border-box;
        }
        .cf-card-wrap--flat {
          position: relative;
          width: 100%;
          max-width: 380px;
          transform: none !important;
          opacity: 1 !important;
          z-index: 1 !important;
        }
        .cf-card-wrap--flat:not(.cf-center) { display: none; }

        /* ── Blog card ── */
        .blog-carousel-card {
          background: rgba(255,255,255,0.04);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.35);
          border-radius: 14px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .cf-card-wrap.cf-center .blog-carousel-card:hover {
          border-color: rgba(var(--accent-rgb),0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.5), 0 0 28px rgba(var(--accent-rgb),0.1);
        }
        .hb-img-wrap {
          position: relative; overflow: hidden;
          background: #0e0e0c; aspect-ratio: 16/9; flex-shrink: 0;
          width: 100%;
        }
        .hb-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; transition: transform 0.4s ease; }
        .cf-card-wrap.cf-center .blog-carousel-card:hover .hb-img { transform: scale(1.05); }
        .hb-img-ph {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #0c0c0a 0%, #1a1a16 50%, #0f0f0d 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .hb-img-ph-text {
          font-family: 'Bebas Neue', sans-serif; font-size: clamp(24px, 4vw, 48px);
          color: rgba(var(--accent-rgb),0.07); letter-spacing: 0.06em; user-select: none;
        }
        .hb-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, transparent 100%);
          display: flex; align-items: flex-end; padding: 14px 16px;
        }
        .hb-img-title {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          color: #fff; line-height: 1.35; text-shadow: 0 2px 10px rgba(0,0,0,0.8);
          margin: 0; width: 100%;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          word-break: break-word;
        }
        .hb-body {
          padding: clamp(12px, 1.2vw, 16px) clamp(14px, 1.4vw, 18px) clamp(14px, 1.4vw, 18px);
          display: flex; flex-direction: column; gap: clamp(7px, 0.7vw, 10px); flex: 1; min-width: 0;
        }
        .hb-title {
          font-family: 'DM Sans', sans-serif; font-size: clamp(13px, 1.1vw, 15px); font-weight: 700;
          color: #f0ece4; line-height: 1.45; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          word-break: break-word;
        }
        .hb-meta-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
        .hb-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7a7870; letter-spacing: 0.06em; }
        .hb-views { display: flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #7a7870; }
        .hb-excerpt {
          font-size: clamp(11px, 0.9vw, 13px); color: #9a9890; line-height: 1.65; margin: 0; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          word-break: break-word;
        }
        .hb-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .hb-read-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--accent); text-decoration: underline; text-underline-offset: 3px;
          background: none; border: none; cursor: pointer; transition: opacity 0.2s; padding: 0;
        }
        .hb-read-btn:hover { opacity: 0.75; }
        .hb-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 3px 9px;
          background: rgba(var(--accent-rgb),0.09); border: 1px solid rgba(var(--accent-rgb),0.22);
          border-radius: 5px; color: var(--accent); flex-shrink: 0; white-space: nowrap;
        }
        .blog-empty {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #2a2a32; text-align: center; padding: 36px 0; letter-spacing: 0.08em;
        }

        /* ── Skills marquee ── */
        .skill-rows { display: flex; flex-direction: column; gap: clamp(8px, 1vw, 14px); }
        .skill-lane-card {
          overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
          border-radius: 14px; padding: clamp(7px, 0.7vw, 10px) 0;
          min-width: 0; position: relative; width: 100%; box-sizing: border-box;
        }
        .skill-lane-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at top left, rgba(var(--accent-rgb),0.12), transparent 48%);
          pointer-events: none;
        }
        .skill-lane-track {
          display: inline-flex; gap: 8px; padding: 0 10px;
          white-space: nowrap; will-change: transform; transform: translate3d(0,0,0);
        }
        .track-left  { animation: snakeLeft  var(--dur, 22s) linear infinite; }
        .track-right { animation: snakeRight var(--dur, 24s) linear infinite; }
        @keyframes snakeLeft  { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(calc(-50% - 4px),0,0)} }
        @keyframes snakeRight { 0%{transform:translate3d(calc(-50% - 4px),0,0)} 100%{transform:translate3d(0,0,0)} }
        .skill-lane-card:hover .track-left,
        .skill-lane-card:hover .track-right { animation-play-state: paused; }

        .skill-chip {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
          border-radius: 9px; padding: 7px 12px;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.18s, border-color 0.18s, transform 0.18s;
          cursor: default; flex-shrink: 0; white-space: nowrap;
        }
        .skill-chip:hover { background: rgba(var(--accent-rgb),0.09); border-color: rgba(var(--accent-rgb),0.24); transform: translateY(-1px); }
        .skill-icon-wrap {
          width: 22px; height: 22px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(var(--accent-rgb),0.08); border: 1px solid rgba(var(--accent-rgb),0.15);
          border-radius: 6px;
        }
        .skill-icon-img { width: 14px; height: 14px; object-fit: contain; display: block; }
        .skill-icon-emoji { font-size: 13px; line-height: 1; }
        .skill-icon-fallback { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700; color: var(--accent); }
        .skill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); opacity: 0.45; flex-shrink: 0; }
        .skill-name {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.06em; text-transform: uppercase; color: #d8d4e0; font-weight: 500;
        }

        /* ══ BREAKPOINTS ══ */

        /* 3D coverflow — all screens wider than 700px (includes tablets at 973px) */
        @media (min-width: 701px) {
          .blog-coverflow { height: 420px; perspective: 1100px; perspective-origin: 50% 50%; }
          .cf-card-wrap { position: absolute; width: 313px; }
        }

        /* Flat single-card — only small phones ≤700px */
        @media (max-width: 700px) {
          .blog-coverflow { height: auto; padding: 8px 0; }
          .cf-card-wrap {
            position: relative !important;
            width: 100% !important;
            max-width: 420px !important;
            transform: none !important;
            opacity: 1 !important;
            z-index: 1 !important;
          }
          .cf-card-wrap:not(.cf-center) { display: none !important; }
          .blog-carousel-card { width: 100%; }
        }

        /* Very small screens — only shrink layout, never text */
        @media (max-width: 360px) {
          .home-title { font-size: clamp(40px, 10.5vw, 60px); }
          .home-section-link { padding: 6px 10px; }
          .carousel-btn { width: 24px; height: 24px; }
        }
      `}</style>

      <div className="home-master-card">

        {/* ── Hero ── */}
        <div className="home-hero">
          <div className="home-hero-copy">
            <span className="home-eyebrow">Full Stack Developer</span>
            <h1 className="home-title">
              Hi, I&apos;m <span className="h-accent">RIDOAN</span>
            </h1>
            <p className="home-description">
              I explore through code, share with empathy, and reflect on every challenge. My work weaves web creation, product thinking, and open source. I thrive on collaborating with teams to build modern web solutions.
            </p>
            <div className="home-hero-actions">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="home-social-btn"
                  aria-label={social.label}
                >
                  <SocialIcon kind={social.icon} />
                </a>
              ))}
            </div>
          </div>
          
        </div>

        <div className="home-divider" />

        {/* ── Featured Blogs ── */}
        <div className="home-section">
          <div className="home-section-head">
            <span className="home-section-title">Featured Blogs</span>
            <div className="home-section-right">
              {blogs.length > 1 && (
                <div className="carousel-nav">
                  <button className="carousel-btn" onClick={() => goBlog(-1)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button className="carousel-btn" onClick={() => goBlog(1)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
              <button className="home-section-link" onClick={() => handleNav("/blog")}>View All →</button>
            </div>
          </div>

          {blogs.length === 0 ? (
            <p className="blog-empty">No published blogs yet.</p>
          ) : (
            <div className="blog-coverflow">
              {blogs.map((b, i) => {
                const off = getOffset(i, blogIdx, blogs.length);
                const isCenter = off === 0;
                let transform: string;
                let opacity: number;
                let zIndex: number;
                let cursor: string;
                if (off === 0) {
                  transform = "translateX(0px) rotateY(0deg) scale(1)";
                  opacity = 1; zIndex = 4; cursor = "pointer";
                } else if (Math.abs(off) === 1) {
                  const d = off > 0 ? 1 : -1;
                  transform = `translateX(${d * 255}px) rotateY(${-d * 40}deg) scale(0.82)`;
                  opacity = 0.55; zIndex = 3; cursor = "pointer";
                } else if (Math.abs(off) === 2) {
                  const d = off > 0 ? 1 : -1;
                  transform = `translateX(${d * 430}px) rotateY(${-d * 54}deg) scale(0.66)`;
                  opacity = 0.22; zIndex = 2; cursor = "pointer";
                } else {
                  const d = off > 0 ? 1 : -1;
                  transform = `translateX(${d * 540}px) rotateY(${-d * 62}deg) scale(0.54)`;
                  opacity = 0; zIndex = 1; cursor = "default";
                }
                return (
                  <div
                    key={b.id}
                    className={`cf-card-wrap${isCenter ? " cf-center" : ""}`}
                    style={{ transform, opacity, zIndex, cursor } as React.CSSProperties}
                    onClick={() => isCenter ? handleNav(`/blog/${b.id}`) : setBlogIdx(i)}
                  >
                    <div className="blog-carousel-card">
                      <div className="hb-img-wrap">
                        {b.thumbnail ? (
                          <img src={b.thumbnail} alt={b.title} className="hb-img" />
                        ) : (
                          <div className="hb-img-ph"><span className="hb-img-ph-text">BLOG</span></div>
                        )}
                        <div className="hb-img-overlay">
                          <h3 className="hb-img-title">{b.title}</h3>
                        </div>
                      </div>
                      <div className="hb-body">
                        <h2 className="hb-title">{b.title}</h2>
                        <div className="hb-meta-row">
                          <span className="hb-date">
                            {new Date(b.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                          <div className="hb-views"><EyeIcon /><span>{b.views ?? 0} views</span></div>
                        </div>
                        {b.content && <p className="hb-excerpt">{plainText(b.content)}</p>}
                        <div className="hb-footer">
                          <span className="hb-read-btn">Read Full Blog</span>
                          <span className="hb-badge">{b.category || "BLOG"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <>
            <div className="home-divider" />

            {/* ── Featured Skills ── */}
            <div className="home-section">
              <div className="home-section-head">
                <span className="home-section-title">Tools I Have Used</span>
              </div>

              <div className="skill-rows">
                {skillLanes.map((laneSkills, laneIdx) => (
                  <div key={`lane-${laneIdx}`} className="skill-lane-card">
                    <div
                      className={`skill-lane-track ${laneIdx % 2 === 0 ? "track-left" : "track-right"}`}
                      style={{ "--dur": `${20 + laneIdx * 3}s` } as React.CSSProperties}
                    >
                      {[...laneSkills, ...laneSkills].map((s, i) => (
                        <div key={`${laneIdx}-${i}`} className="skill-chip">
                          {s.icon ? (
                            <div className="skill-icon-wrap">
                              {s.icon.startsWith("http") || s.icon.startsWith("/") ? (
                                <img src={s.icon} alt={s.name} className="skill-icon-img" />
                              ) : s.icon.length <= 2 ? (
                                <span className="skill-icon-emoji">{s.icon}</span>
                              ) : (
                                <span className="skill-icon-fallback">{s.icon.slice(0, 2).toUpperCase()}</span>
                              )}
                            </div>
                          ) : (
                            <span className="skill-dot" />
                          )}
                          <span className="skill-name">{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
}
