"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// =============================================
// 🔧 PROJECT DATA — notun project add korte
// sudhu ei array te object add koro
// =============================================
const filters = ["All", "React", "Next.js", "Full Stack", "Landing Page", "Frontend"];

const projects = [
  {
    title: "SaaS Dashboard",
    category: "Full Stack",
    description:
      "A feature-rich analytics dashboard with real-time data visualization, user management, and role-based access control.",
    tags: ["Next.js", "TypeScript", "Express", "Tailwind", "Prisma", "PostgreSQL"],
    image: "/eco.png",
    live: "https://ecospark-frontend-gules.vercel.app",
    github: "https://github.com/Ridoan-75/ecospark-frontend",
    year: "2026",
    featured: true,
  },
  {
    title: "Medical Store E-commerce",
    category: "Full Stack",
    description:
      "Full-featured online store with Stripe payments, product filtering, cart system, and admin panel.",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL", "Node.js", "Tailwind"],
    image: "/medistore.png",
    live: "https://medistore-client-lime.vercel.app/",
    github: "https://github.com/Ridoan-75/medistore-client",
    year: "2026",
    featured: true,
  },
  {
    title: "Nike Product Page",
    category: "Frontend",
    description:
      "A visually stunning product page with interactive color selector and smooth GSAP animations.",
    tags: ["React", "Tailwind", "Framer Motion", "Vercel"],
    image: "/nike.png",
    live: "https://nike-1-drab.vercel.app/",
    github: "https://github.com/Ridoan-75/Nike",
    year: "2025",
    featured: false,
  },
  {
    title: "Dashboard Design",
    category: "Landing Page",
    description:
      "A clean and modern landing page for a SaaS product with smooth scroll animations.",
    tags: ["React", "Tailwind", "Vercel"],
    image: "/dashboard.png",
    live: "https://dashboard-ashen-psi.vercel.app/",
    github: "https://github.com/Ridoan-75/Dashboard",
    year: "2025",
    featured: false,
  },
  {
    title: "Food Website",
    category: "Frontend",
    description:
      "A modern restaurant website with menu filtering, reservation form, and scroll animations.",
    tags: ["React", "Tailwind", "Vercel"],
    image: "/foodie.png",
    live: "https://foodie-website-d3s3.vercel.app/",
    github: "https://github.com/Ridoan-75/Foodie-Website",
    year: "2025",
    featured: false,
  },
  {
    title: "Finance Landing Page",
    category: "React",
    description:
      "A sleek landing page for a finance app with interactive features and responsive design.",
    tags: ["React", "Tailwind", "Vercel"],
    image: "/finance.png",
    live: "https://finance-website-cyan.vercel.app",
    github: "https://github.com/Ridoan-75/Finance-Website",
    year: "2024",
    featured: false,
  },
];

// =============================================
// 🃏 ProjectCard Component
// =============================================
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);

  // scroll entrance
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power4.out",
        delay: (index % 3) * 0.1,
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", once: true } }
    );
  }, [index]);

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    gsap.to(el, {
      rotateX: ((y - cy) / cy) * -5,
      rotateY: ((x - cx) / cx) * 5,
      duration: 0.3, ease: "power2.out",
      transformPerspective: 900,
    });
    // glow follows cursor
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: x - 150, y: y - 150,
        duration: 0.4, ease: "power2.out",
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    gsap.to(cardRef.current, {
      borderColor: "rgba(var(--accent-rgb),0.35)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.15), 0 8px 40px rgba(0,0,0,0.38), 0 0 32px rgba(var(--accent-rgb),0.12)",
      duration: 0.3,
    });
    gsap.to(accentRef.current, { opacity: 1, duration: 0.25 });
    gsap.to(glowRef.current, { opacity: 1, duration: 0.3 });
    gsap.to(imageWrapRef.current, { scale: 1.04, duration: 0.5, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      borderColor: "rgba(255,255,255,0.09)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 24px rgba(0,0,0,0.32), 0 1px 4px rgba(0,0,0,0.4)",
      duration: 0.6, ease: "elastic.out(1,0.6)",
      transformPerspective: 900,
    });
    gsap.to(accentRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(imageWrapRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  }, []);

  return (
    <div style={{ perspective: "900px", opacity: 0 }} ref={cardRef}>
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.058) 0%, rgba(255,255,255,0.016) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.15), 0 4px 24px rgba(0,0,0,0.32), 0 1px 4px rgba(0,0,0,0.4)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          borderRadius: "6px",
          overflow: "hidden",
          position: "relative",
          willChange: "transform",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "border-color .3s ease, box-shadow .35s ease",
        }}
      >
        {/* top accent */}
        <div ref={accentRef} style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "3px", background: "linear-gradient(90deg, var(--accent), transparent)",
          boxShadow: "0 0 14px rgba(var(--accent-rgb),0.5)",
          opacity: 0, zIndex: 3,
        }} />

        {/* cursor glow */}
        <div ref={glowRef} style={{
          position: "absolute", width: "360px", height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.12) 0%, transparent 68%)",
          pointerEvents: "none", opacity: 0, zIndex: 1,
          transform: "translate(-50%,-50%)",
        }} />

        {/* ── image area ── */}
        <div style={{
          height: "200px", background: "#080808",
          borderBottom: "1px solid #1a1a18",
          position: "relative", overflow: "hidden",
        }}>
          {/* grid */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0,
          }} />

          {/* image */}
          <div ref={imageWrapRef} style={{
            position: "absolute", inset: "12px",
            borderRadius: "3px", overflow: "hidden",
            border: "1px solid rgba(var(--accent-rgb),0.08)", zIndex: 1,
          }}>
            {!imageError ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 900px) 100vw, 350px"
                style={{ objectFit: "cover" }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: "#0e0e0c", gap: "8px",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(var(--accent-rgb),0.3)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span style={{
                  fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(var(--accent-rgb),0.25)", letterSpacing: "0.06em",
                }}>{project.title}</span>
              </div>
            )}
          </div>

          {/* year badge */}
          <div style={{
            position: "absolute", top: "10px", right: "10px", zIndex: 2,
            padding: "4px 10px",
            background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.2)",
            borderRadius: "3px", fontSize: "10px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--accent)", letterSpacing: "0.08em",
          }}>{project.year}</div>

          {/* featured badge */}
          {project.featured && (
            <div style={{
              position: "absolute", top: "10px", left: "10px", zIndex: 2,
              padding: "4px 10px",
              background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.25)",
              borderRadius: "3px", fontSize: "9px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase",
            }}>★ Featured</div>
          )}
        </div>

        {/* ── content ── */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* category */}
          <div style={{
            display: "inline-block", padding: "3px 10px", marginBottom: "10px",
            background: "rgba(var(--accent-rgb),0.05)", border: "1px solid rgba(var(--accent-rgb),0.12)",
            borderRadius: "2px", fontSize: "9px",
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase",
            width: "fit-content",
          }}>{project.category}</div>

          {/* title */}
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "20px", fontWeight: 400,
            color: hovered ? "var(--accent)" : "#f0ece4",
            marginBottom: "10px", letterSpacing: "0.04em",
            transition: "color 0.25s ease",
          }}>{project.title}</h3>

          {/* desc */}
          <p style={{
            fontSize: "13px", color: "#5a5a56",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.8, marginBottom: "16px", flex: 1,
          }}>{project.description}</p>

          {/* tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "18px" }}>
            {project.tags.map((tag) => (
              <span key={tag} className="proj-tag" style={{
                padding: "3px 8px",
                background: "#0e0e0c", border: "1px solid #2a2a25",
                borderRadius: "2px", fontSize: "9px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#6a6a60", letterSpacing: "0.06em",
              }}>{tag}</span>
            ))}
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <ProjBtn href={project.live} primary>Live Demo ↗</ProjBtn>
            <ProjBtn href={project.github}>GitHub →</ProjBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Button with magnetic effect ──
function ProjBtn({ children, href, primary }: {
  children: React.ReactNode; href: string; primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={primary ? "proj-btn-primary" : "proj-btn-secondary"}
      onMouseMove={(e) => {
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(el, { x, y, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" })}
    >
      {children}
    </a>
  );
}

// ── Filter Pill ──
function FilterPill({ label, active, onClick, count }: {
  label: string; active: boolean; onClick: () => void; count: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={active ? "proj-filter active" : "proj-filter"}
      onMouseMove={(e) => {
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(el, { x, y, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" })}
    >
      {label}
      <span className="proj-filter-count">{count}</span>
    </button>
  );
}

// ── GitHub CTA ──
function GithubCTA() {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } }
    );
  }, []);
  return (
    <a
      ref={ref}
      href="https://github.com/Ridoan-75?tab=repositories"
      target="_blank"
      rel="noopener noreferrer"
      className="proj-github-cta"
      style={{ opacity: 0 }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(var(--accent-rgb),0.3)";
        el.style.color = "var(--accent)";
        el.style.background = "rgba(var(--accent-rgb),0.04)";
        gsap.to(el, { y: -3, scale: 1.03, duration: 0.25, ease: "power2.out" });
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#1e1e1a";
        el.style.color = "#9a9a90";
        el.style.background = "transparent";
        gsap.to(el, { y: 0, scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
      View All Projects on GitHub ↗
    </a>
  );
}

// =============================================
// 🏠 Main Projects Component
// =============================================
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const getCount = (f: string) =>
    f === "All" ? projects.length : projects.filter((p) => p.category === f).length;

  // filter change animate
  const handleFilter = useCallback((f: string) => {
    if (!gridRef.current) { setActiveFilter(f); return; }
    gsap.to(gridRef.current, {
      opacity: 0, y: 12, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveFilter(f);
        gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });
      }
    });
  }, []);

  // heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".proj-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".proj-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".proj-role-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".proj-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".proj-filters-wrap",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.72,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // floating particles
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".proj-float").forEach((el) => {
      gsap.to(el, {
        y: gsap.utils.random(-20, 20), x: gsap.utils.random(-10, 10),
        rotation: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(3, 5), ease: "sine.inOut",
        repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2),
      });
    });
  }, []);

  // stats entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".proj-stats",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".proj-stats", start: "top 88%", once: true } }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #projects {
          padding: 80px 60px 80px;
          min-height: 100vh;
          display: flex; flex-direction: column; justify-content: center;
          background: #080808; color: #e8e4dc;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        #projects::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px; pointer-events: none; z-index: 0;
        }
        .proj-corner-tl {
          position: absolute; top: 0; left: 0; width: 180px; height: 180px;
          border-right: 1px solid rgba(var(--accent-rgb),.08);
          border-bottom: 1px solid rgba(var(--accent-rgb),.08); pointer-events: none;
        }
        .proj-corner-br {
          position: absolute; bottom: 0; right: 0; width: 180px; height: 180px;
          border-left: 1px solid rgba(var(--accent-rgb),.08);
          border-top: 1px solid rgba(var(--accent-rgb),.08); pointer-events: none;
        }
        .proj-scanline {
          position: absolute; left: 60px; right: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.12), transparent);
          top: 50%; pointer-events: none; z-index: 0;
          animation: projScan 7s ease-in-out infinite;
        }
        @keyframes projScan {
          0%,100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; } 85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
        .proj-inner { max-width: 1100px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }

        /* ── status tag ── */
        .proj-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px;
          width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .proj-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
          animation: projBlink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes projBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .proj-status-text {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          letter-spacing: .1em; text-transform: uppercase; color: var(--accent);
        }

        /* ── heading ── */
        .proj-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .proj-heading .h-accent { color: var(--accent); }

        /* ── role line ── */
        .proj-role-line {
          font-family: 'JetBrains Mono', monospace; font-size: 14px;
          letter-spacing: .08em; text-transform: uppercase; color: #6a6a60;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap; opacity: 0;
        }
        .proj-role-line::before { content: ''; width: 28px; height: 1px; background: var(--accent); flex-shrink: 0; }

        /* ── desc ── */
        .proj-desc {
          font-size: 16px; line-height: 1.85; color: #4a4a44;
          max-width: 440px; margin-bottom: 36px; opacity: 0;
        }

        /* ── filters ── */
        .proj-filters-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 48px; opacity: 0; }
        .proj-filter {
          padding: 7px 16px; border-radius: 3px; cursor: pointer;
          border: 1px solid #1a1a18; background: transparent; color: #5a5a56;
          font-size: 11px; font-family: 'JetBrains Mono', monospace;
          letter-spacing: .1em; text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
          transition: color .2s, border-color .2s, background .2s;
        }
        .proj-filter:hover { color: #8a8a80; border-color: #2a2a28; }
        .proj-filter.active {
          border-color: rgba(var(--accent-rgb),.35); background: rgba(var(--accent-rgb),.07); color: var(--accent);
        }
        .proj-filter-count {
          font-size: 9px; padding: 1px 5px; border-radius: 2px;
          background: #0e0e0c; border: 1px solid #1a1a18; color: #5a5a56;
          font-family: 'JetBrains Mono', monospace;
        }
        .proj-filter.active .proj-filter-count {
          background: rgba(var(--accent-rgb),.1); border-color: rgba(var(--accent-rgb),.2); color: #a3e635;
        }

        /* ── buttons ── */
        .proj-btn-primary {
          display: inline-flex; align-items: center;
          padding: 8px 16px; border-radius: 3px; font-size: 11px;
          font-family: 'JetBrains Mono', monospace; letter-spacing: .08em;
          text-decoration: none; cursor: pointer; text-transform: uppercase;
          background: rgba(var(--accent-rgb),.07); border: 1px solid rgba(var(--accent-rgb),.22); color: var(--accent);
          transition: background .2s, border-color .2s;
        }
        .proj-btn-primary:hover { background: rgba(var(--accent-rgb),.14); }
        .proj-btn-secondary {
          display: inline-flex; align-items: center;
          padding: 8px 16px; border-radius: 3px; font-size: 11px;
          font-family: 'JetBrains Mono', monospace; letter-spacing: .08em;
          text-decoration: none; cursor: pointer; text-transform: uppercase;
          background: transparent; border: 1px solid #1e1e1a; color: #6a6a60;
          transition: border-color .2s, color .2s;
        }
        .proj-btn-secondary:hover { border-color: rgba(var(--accent-rgb),.22); color: var(--accent); }

        /* ── github cta ── */
        .proj-github-cta {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 3px;
          background: transparent; border: 1px solid #1e1e1a; color: #9a9a90;
          font-size: 12px; font-family: 'JetBrains Mono', monospace;
          letter-spacing: .1em; text-decoration: none; text-transform: uppercase;
          transition: all .25s;
        }

        /* ── stats ── */
        .proj-stats {
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
        .proj-stat-item { padding: 16px 30px; border-right: 1px solid rgba(255,255,255,0.07); text-align: center; }
        .proj-stat-item:last-child { border-right: none; }
        .proj-stat-num {
          font-family: 'Bebas Neue', sans-serif; font-size: 38px;
          letter-spacing: .03em; line-height: 1;
        }
        .proj-stat-label {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          text-transform: uppercase; letter-spacing: .12em; color: #3a3a36; margin-top: 4px;
        }

        /* ── float ── */
        .proj-float {
          position: absolute; font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .1em; opacity: .03;
          pointer-events: none; user-select: none; color: var(--accent);
        }

        /* ── project grid ── */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ── responsive — exact hero breakpoints ── */
        @media (max-width: 1199px) {
          #projects { padding: 80px 40px 80px; }
          .proj-heading { font-size: clamp(52px, 8vw, 100px); }
          .proj-corner-tl, .proj-corner-br { width: 120px; height: 120px; }
          .proj-stat-item { padding: 14px 24px; }
          .proj-stat-num { font-size: 34px; }
        }
        @media (max-width: 1023px) {
          #projects { padding: 70px 32px 90px; }
          .proj-heading { font-size: clamp(48px, 8vw, 80px); }
          .proj-grid { grid-template-columns: repeat(2, 1fr); }
          .proj-corner-tl, .proj-corner-br { width: 100px; height: 100px; }
          .proj-scanline { left: 32px; right: 32px; }
        }
        @media (max-width: 767px) {
          #projects { padding: 60px 24px 90px; padding-top: 80px; }
          .proj-heading { font-size: clamp(52px, 14vw, 80px); }
          .proj-grid { grid-template-columns: 1fr; }
          .proj-desc { font-size: 14px; max-width: 100%; }
          .proj-stats { width: 100%; }
          .proj-stat-item { flex: 1; padding: 14px 16px; }
          .proj-corner-tl, .proj-corner-br { width: 80px; height: 80px; }
          .proj-scanline { left: 24px; right: 24px; }
          .proj-filters-wrap { gap: 6px; }
        }
        @media (max-width: 599px) {
          #projects { padding: 50px 18px 80px; padding-top: 70px; }
          .proj-heading { font-size: clamp(44px, 16vw, 64px); }
          .proj-role-line { font-size: 10px; gap: 8px; letter-spacing: .06em; }
          .proj-role-line::before { width: 20px; }
          .proj-desc { font-size: 13px; }
          .proj-stat-num { font-size: 28px; }
          .proj-stat-item { padding: 12px 10px; }
          .proj-corner-tl, .proj-corner-br { width: 60px; height: 60px; }
          .proj-filters-wrap { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 379px) {
          #projects { padding: 40px 14px 70px; padding-top: 60px; }
          .proj-heading { font-size: clamp(38px, 18vw, 52px); }
          .proj-corner-tl, .proj-corner-br { width: 40px; height: 40px; }
          .proj-scanline { left: 14px; right: 14px; }
          .proj-status-text { font-size: 11px; }
        }
        @media (hover: none) {
          .proj-btn-primary:hover, .proj-btn-secondary:hover { transform: none !important; }
        }
        @media (min-width: 1600px) {
          .proj-inner { max-width: 1300px; }
          .proj-heading { font-size: clamp(80px, 9vw, 130px); }
          .proj-desc { font-size: 17px; max-width: 500px; }
          .proj-grid { grid-template-columns: repeat(3, 1fr); }
          .proj-stat-item { padding: 18px 36px; }
          .proj-stat-num { font-size: 42px; }
        }
      `}</style>

      <section id="projects">
        <div className="proj-corner-tl" />
        <div className="proj-corner-br" />
        <div className="proj-scanline" />

        {["const", "async", "=>", "return", "export", "type", "import", "{}"].map((t, i) => (
          <div key={i} className="proj-float"
            style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>{t}</div>
        ))}

        <div className="proj-inner">

          {/* ── heading ── */}
          <div ref={headingRef}>
            <div className="proj-status-tag">
              <span className="proj-status-dot" />
              <span className="proj-status-text">Selected Work</span>
            </div>

            <h2 className="proj-heading">
              Featured <span className="h-accent">P</span>rojects
            </h2>

            <div className="proj-role-line">
              Things I&apos;ve built with passion &amp; precision
            </div>

            <p className="proj-desc">
              A curated collection of work — from SaaS platforms to creative
              landing pages, all built with care and shipped to production.
            </p>

            {/* ── filters ── */}
            <div className="proj-filters-wrap">
              {filters.map((f) => (
                <FilterPill
                  key={f} label={f} active={activeFilter === f}
                  onClick={() => handleFilter(f)} count={getCount(f)}
                />
              ))}
            </div>
          </div>

          {/* ── grid ── */}
          <div className="proj-grid" ref={gridRef}>
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
          </div>

          {/* ── stats strip ── */}
          <div className="proj-stats">
            <div className="proj-stat-item">
              <div className="proj-stat-num" style={{ color: "var(--accent)" }}>{projects.length}+</div>
              <div className="proj-stat-label">Projects</div>
            </div>
            <div className="proj-stat-item">
              <div className="proj-stat-num" style={{ color: "#60a5fa" }}>
                {projects.filter(p => p.featured).length}
              </div>
              <div className="proj-stat-label">Featured</div>
            </div>
            <div className="proj-stat-item">
              <div className="proj-stat-num" style={{ color: "#f472b6" }}>
                {[...new Set(projects.map(p => p.year))].length}
              </div>
              <div className="proj-stat-label">Years</div>
            </div>
            <div className="proj-stat-item">
              <div className="proj-stat-num" style={{ color: "var(--accent)" }}>
                {[...new Set(projects.flatMap(p => p.tags))].length}+
              </div>
              <div className="proj-stat-label">Technologies</div>
            </div>
          </div>

          {/* ── github cta ── */}
          <div style={{ textAlign: "center", marginTop: "52px" }}>
            <GithubCTA />
          </div>

        </div>
      </section>
    </>
  );
}