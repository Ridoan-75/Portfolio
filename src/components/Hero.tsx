"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

const stats = [
  { num: "6+", label: "Yrs Exp" },
  { num: "50+", label: "Projects" },
  { num: "50K+", label: "Users" },
];

const featureCards = [
  {
    id: "blog",
    href: "/blog",
    tag: "Writing & Thoughts",
    label: "The Blog",
    desc: "Dev notes, tutorials, and thoughts on full-stack development, design, and building products.",
    accent: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    id: "projects",
    href: "/projects",
    tag: "Featured Work",
    label: "Projects",
    desc: "50+ production-grade projects built with React, Next.js, Node.js, TypeScript and more.",
    accent: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "skills",
    href: "/skills",
    tag: "Tech Stack",
    label: "Skills",
    desc: "React · Next.js · TypeScript · Node.js · PostgreSQL · Tailwind · GraphQL · Docker",
    accent: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "reviews",
    href: "/reviews",
    tag: "Testimonials",
    label: "Reviews",
    desc: "What clients and colleagues say about working with me on their projects worldwide.",
    accent: false,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const navLinks = [
  { label: "Skills", href: "/skills" },
  { label: "Education", href: "/education" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Settings", href: "/settings" },
];

function firework(x: number, y: number) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c8f060";
  const colors = [accent, "#ffffff", "#6a6a62"];
  for (let i = 0; i < 14; i++) {
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
    const dist = Math.random() * 70 + 30;
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
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(".home-about", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.1 });
    gsap.fromTo(".home-feat-card", { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: "power3.out", delay: 0.32 });
    gsap.fromTo(".home-nav-bar", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out", delay: 0.72 });
  }, []);

  const handleCardClick = useCallback((href: string, e: React.MouseEvent<HTMLDivElement>) => {
    firework(e.clientX, e.clientY);
    gsap.fromTo(e.currentTarget, { scale: 0.96 }, { scale: 1, duration: 0.35, ease: "back.out(2.5)" });
    setTimeout(() => router.push(href), 160);
  }, [router]);

  const handleNavClick = useCallback((href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    firework(e.clientX, e.clientY);
    router.push(href);
  }, [router]);

  return (
    <section id="home">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #home {
          min-height: 100vh;
          background: #080808;
          color: #e8e4dc;
          position: relative;
          overflow: hidden;
          padding: 60px 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
        }

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

        .home-wrap {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── ABOUT ME ── */
        .home-about {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px 32px;
          background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 24px rgba(0,0,0,0.3);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          opacity: 0;
          flex-wrap: wrap;
        }

        .home-avatar {
          width: 72px;
          height: 72px;
          border-radius: 14px;
          border: 2px solid rgba(var(--accent-rgb), 0.4);
          overflow: hidden;
          flex-shrink: 0;
          background: #1a1a18;
        }

        .home-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .home-about-text {
          flex: 1;
          min-width: 200px;
        }

        .home-about-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: #f0ece4;
          letter-spacing: 0.04em;
          line-height: 1;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .home-about-name .h-accent { color: var(--accent); }

        .home-about-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #5a5a54;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .home-about-bio {
          font-size: 14px;
          color: #4a4a44;
          line-height: 1.75;
          max-width: 500px;
        }

        .home-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.38);
          border-radius: 20px;
          padding: 6px 14px;
          flex-shrink: 0;
        }

        .home-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 7px #22c55e;
          animation: homePulse 2s ease infinite;
          flex-shrink: 0;
        }

        @keyframes homePulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .home-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #4ade80;
          letter-spacing: 0.06em;
        }

        .home-stats {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .home-stat {
          padding: 12px 20px;
          border-right: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }

        .home-stat:last-child { border-right: none; }

        .home-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          color: var(--accent);
          letter-spacing: 0.03em;
          line-height: 1;
        }

        .home-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #3a3a36;
          margin-top: 2px;
        }

        /* ── FEATURED CARDS ── */
        .home-feat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .home-feat-card {
          padding: 22px 20px;
          background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          cursor: pointer;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          opacity: 0;
          position: relative;
          overflow: hidden;
        }

        .home-feat-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .home-feat-card:hover {
          border-color: rgba(var(--accent-rgb), 0.25);
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 24px rgba(var(--accent-rgb),0.06);
        }

        .home-feat-card:hover::before { transform: scaleX(1); }

        .home-feat-card--accent {
          border-color: rgba(var(--accent-rgb), 0.18);
          background: linear-gradient(145deg, rgba(var(--accent-rgb),0.06) 0%, rgba(255,255,255,0.01) 100%);
        }

        .home-feat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(var(--accent-rgb), 0.08);
          border: 1px solid rgba(var(--accent-rgb), 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: 14px;
        }

        .home-feat-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          margin-bottom: 6px;
          opacity: 0.7;
        }

        .home-feat-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #f0ece4;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
          line-height: 1;
        }

        .home-feat-desc {
          font-size: 12px;
          color: #4a4a44;
          line-height: 1.7;
          margin-bottom: 14px;
        }

        .home-feat-cta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: gap 0.2s;
        }

        .home-feat-card:hover .home-feat-cta { gap: 9px; }

        /* ── BOTTOM NAV BAR ── */
        .home-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 26px;
          background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          opacity: 0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .home-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .home-nav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #4a4a44;
          text-decoration: none;
          padding: 7px 12px;
          border-radius: 6px;
          border: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }

        .home-nav-link:hover {
          color: var(--accent);
          border-color: rgba(var(--accent-rgb), 0.25);
          background: rgba(var(--accent-rgb), 0.05);
        }

        .home-nav-sep {
          color: #2a2a28;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          user-select: none;
          flex-shrink: 0;
        }

        .home-contact-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #080808;
          background: var(--accent);
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 7px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: filter 0.2s, transform 0.15s;
          flex-shrink: 0;
        }

        .home-contact-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1023px) {
          #home { padding: 60px 40px 40px; }
          .home-feat-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 767px) {
          #home { padding: 80px 24px 40px; }
          .home-about { gap: 16px; padding: 20px 20px; }
          .home-stats { width: 100%; justify-content: center; }
          .home-about-name { font-size: 26px; }
          .home-about-bio { font-size: 13px; }
          .home-feat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .home-nav-bar { padding: 14px 18px; }
        }

        @media (max-width: 599px) {
          #home { padding: 70px 16px 32px; }
          .home-wrap { gap: 24px; }
          .home-about { flex-direction: column; align-items: flex-start; gap: 14px; padding: 18px; }
          .home-stats { width: 100%; }
          .home-stat { flex: 1; padding: 10px 8px; }
          .home-stat-num { font-size: 22px; }
          .home-feat-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .home-feat-card { padding: 16px 14px; }
          .home-feat-label { font-size: 18px; }
          .home-feat-desc { font-size: 11px; }
          .home-nav-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .home-contact-btn { width: 100%; justify-content: center; }
          .home-nav-links { gap: 2px; }
          .home-nav-link { font-size: 10px; padding: 6px 9px; }
        }

        @media (max-width: 400px) {
          .home-feat-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home-wrap">

        {/* ── ABOUT ME ── */}
        <div className="home-about">
          <div className="home-avatar">
            <img src="/image.jpg" alt="Md Ridoan" />
          </div>

          <div className="home-about-text">
            <div className="home-about-name">
              <span><span className="h-accent">R</span>idoan Hossen</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                <polyline points="7 12.5 10.5 16 17 9" stroke="#080808" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="home-about-role">Full Stack Developer &amp; UI/UX Designer</div>
            <p className="home-about-bio">
              Crafting fast, scalable, pixel-perfect web experiences. 6+ years shipping production-grade products — open to remote roles and freelance projects worldwide.
            </p>
          </div>

          <div className="home-status-badge">
            <span className="home-status-dot" />
            <span className="home-status-text">Open to Work</span>
          </div>

          <div className="home-stats">
            {stats.map((s) => (
              <div key={s.label} className="home-stat">
                <div className="home-stat-num">{s.num}</div>
                <div className="home-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURED CARDS ── */}
        <div className="home-feat-grid">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className={`home-feat-card${card.accent ? " home-feat-card--accent" : ""}`}
              onClick={(e) => handleCardClick(card.href, e)}
            >
              <div className="home-feat-icon">{card.icon}</div>
              <div className="home-feat-tag">{card.tag}</div>
              <div className="home-feat-label">{card.label}</div>
              <p className="home-feat-desc">{card.desc}</p>
              <span className="home-feat-cta">
                View All
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          ))}
        </div>

        {/* ── BOTTOM NAV BAR ── */}
        <div className="home-nav-bar">
          <div className="home-nav-links">
            {navLinks.map((link, i) => (
              <span key={link.href} style={{ display: "contents" }}>
                <a
                  href={link.href}
                  className="home-nav-link"
                  onClick={(e) => handleNavClick(link.href, e)}
                >
                  {link.label}
                </a>
                {i < navLinks.length - 1 && (
                  <span className="home-nav-sep">/</span>
                )}
              </span>
            ))}
          </div>

          <a
            href="/contact"
            className="home-contact-btn"
            onClick={(e) => handleNavClick("/contact", e)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,12 2,6" />
            </svg>
            Contact Me
          </a>
        </div>

      </div>
    </section>
  );
}
