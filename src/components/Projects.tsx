"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 6;

type Project = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  tags: string[];
  category: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  createdAt: string;
};

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef      = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const accentRef    = useRef<HTMLDivElement>(null);
  const isTouchRef   = useRef(false);
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered]       = useState(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power4.out",
        delay: (index % 3) * 0.1,
        scrollTrigger: { trigger: cardRef.current, start: "top 88%", once: true } }
    );
  }, [index]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current) return;
    const el = cardRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    gsap.to(el, { rotateX: ((y - cy) / cy) * -5, rotateY: ((x - cx) / cx) * 5,
      duration: 0.3, ease: "power2.out", transformPerspective: 900 });
    if (glowRef.current)
      gsap.to(glowRef.current, { x: x - 150, y: y - 150, duration: 0.4, ease: "power2.out" });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    gsap.to(cardRef.current, {
      borderColor: "rgba(var(--accent-rgb),0.35)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14),inset 0 -1px 0 rgba(0,0,0,0.15),0 8px 40px rgba(0,0,0,0.38),0 0 32px rgba(var(--accent-rgb),0.12)",
      duration: 0.3,
    });
    gsap.to(accentRef.current, { opacity: 1, duration: 0.25 });
    gsap.to(glowRef.current,   { opacity: 1, duration: 0.3 });
    if (!isTouchRef.current)
      gsap.to(imageWrapRef.current, { scale: 1.04, duration: 0.5, ease: "power2.out" });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(cardRef.current, {
      rotateX: 0, rotateY: 0,
      borderColor: "rgba(255,255,255,0.09)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),inset 0 -1px 0 rgba(0,0,0,0.15),0 4px 24px rgba(0,0,0,0.32),0 1px 4px rgba(0,0,0,0.4)",
      duration: 0.6, ease: "elastic.out(1,0.6)", transformPerspective: 900,
    });
    gsap.to(accentRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(glowRef.current,   { opacity: 0, duration: 0.3 });
    if (!isTouchRef.current)
      gsap.to(imageWrapRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
  }, []);

  const year = new Date(project.createdAt).getFullYear().toString();

  return (
    <div style={{ perspective: "900px", opacity: 0 }} ref={cardRef}>
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "linear-gradient(145deg,rgba(255,255,255,0.058) 0%,rgba(255,255,255,0.016) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),inset 0 -1px 0 rgba(0,0,0,0.15),0 4px 24px rgba(0,0,0,0.32),0 1px 4px rgba(0,0,0,0.4)",
          backdropFilter: "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: "blur(14px) saturate(1.4)",
          borderRadius: "6px", overflow: "hidden", position: "relative",
          willChange: "transform", height: "100%",
          display: "flex", flexDirection: "column",
          transition: "border-color .3s ease, box-shadow .35s ease",
        }}
      >
        {/* top accent */}
        <div ref={accentRef} style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,var(--accent),transparent)",
          boxShadow: "0 0 14px rgba(var(--accent-rgb),0.5)",
          opacity: 0, zIndex: 3,
        }} />

        {/* cursor glow */}
        <div ref={glowRef} style={{
          position: "absolute", width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(var(--accent-rgb),0.12) 0%,transparent 68%)",
          pointerEvents: "none", opacity: 0, zIndex: 1,
          transform: "translate(-50%,-50%)",
        }} />

        {/* image */}
        <div className="proj-img-wrap">
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px)",
            backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0,
          }} />
          <div ref={imageWrapRef} style={{
            position: "absolute", inset: "10px",
            borderRadius: "3px", overflow: "hidden",
            border: "1px solid rgba(var(--accent-rgb),0.08)", zIndex: 1,
          }}>
            {project.thumbnail && !imageError ? (
              <Image src={project.thumbnail} alt={project.title} fill
                sizes="(max-width:900px) 100vw, 350px"
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
                <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono',monospace",
                  color: "rgba(var(--accent-rgb),0.25)", letterSpacing: "0.06em" }}>
                  {project.title}
                </span>
              </div>
            )}
          </div>

          {/* year badge */}
          <div style={{
            position: "absolute", top: "8px", right: "8px", zIndex: 2,
            padding: "3px 9px",
            background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.2)",
            borderRadius: "3px", fontSize: "10px",
            fontFamily: "'JetBrains Mono',monospace",
            color: "var(--accent)", letterSpacing: "0.08em",
          }}>{year}</div>

          {/* featured badge — solid, high contrast */}
          {project.featured && (
            <div style={{
              position: "absolute", top: "8px", left: "8px", zIndex: 2,
              padding: "4px 10px",
              background: "var(--accent)",
              borderRadius: "3px", fontSize: "9px",
              fontFamily: "'JetBrains Mono',monospace",
              color: "#000", letterSpacing: "0.12em", textTransform: "uppercase",
              fontWeight: 700,
              boxShadow: "0 2px 10px rgba(var(--accent-rgb),0.5)",
            }}>★ FEATURED</div>
          )}
        </div>

        {/* content */}
        <div className="proj-card-body">
          {project.category && (
            <div className="proj-card-cat">{project.category}</div>
          )}
          <h3 className="proj-card-title" style={{
            color: hovered ? "var(--accent)" : "#f0ece4",
          }}>{project.title}</h3>

          <p className="proj-card-desc">{project.description}</p>

          <div className="proj-tags">
            {project.tags.map(tag => (
              <span key={tag} className="proj-tag">{tag}</span>
            ))}
          </div>

          <div className="proj-card-btns">
            {project.liveUrl && <ProjBtn href={project.liveUrl} primary>Live Demo ↗</ProjBtn>}
            {project.githubUrl && <ProjBtn href={project.githubUrl}>GitHub →</ProjBtn>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: "6px", overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      <div className="proj-img-wrap proj-skel" />
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
        <div className="proj-skel" style={{ width: "55%", height: 18, borderRadius: 4 }} />
        <div className="proj-skel" style={{ width: "100%", height: 13, borderRadius: 3 }} />
        <div className="proj-skel" style={{ width: "85%", height: 13, borderRadius: 3 }} />
        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
          {[55, 70, 50, 60].map((w, i) => (
            <div key={i} className="proj-skel" style={{ width: w, height: 22, borderRadius: 4 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
          <div className="proj-skel" style={{ width: 100, height: 36, borderRadius: 6, flex: 1 }} />
          <div className="proj-skel" style={{ width: 100, height: 36, borderRadius: 6, flex: 1 }} />
        </div>
      </div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
function ProjBtn({ children, href, primary }: {
  children: React.ReactNode; href: string; primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      className={primary ? "proj-btn-primary" : "proj-btn-secondary"}
      onMouseMove={e => {
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(el, { x, y, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" })}
    >{children}</a>
  );
}

// ── Filter Pill ───────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick, count }: {
  label: string; active: boolean; onClick: () => void; count: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button ref={ref} onClick={onClick}
      className={active ? "proj-filter active" : "proj-filter"}
      onMouseMove={e => {
        const el = ref.current; if (!el) return;
        const rect = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - rect.left - rect.width / 2) * 0.25,
          y: (e.clientY - rect.top - rect.height / 2) * 0.25,
          duration: 0.2, ease: "power2.out",
        });
      }}
      onMouseLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" })}
    >
      {label}
      <span className="proj-filter-count">{count}</span>
    </button>
  );
}

// ── GitHub CTA ────────────────────────────────────────────────────────────────
function GithubCTA() {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } }
    );
  }, []);
  return (
    <a ref={ref} href="https://github.com/Ridoan-75?tab=repositories"
      target="_blank" rel="noopener noreferrer"
      className="proj-github-cta" style={{ opacity: 0 }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(var(--accent-rgb),0.16)";
        gsap.to(el, { y: -3, scale: 1.05, duration: 0.25, ease: "power2.out" });
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "rgba(var(--accent-rgb),0.1)";
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

// ── Search Icon ───────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Projects() {
  const [allProjects, setAllProjects]   = useState<Project[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "featured">("all");
  const [inputValue, setInput]          = useState("");
  const [searchQuery, setQuery]         = useState("");
  const [page, setPage]                 = useState(1);
  const [stuck, setStuck]               = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/project")
      .then(r => r.json())
      .then(d => { setAllProjects(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const q = searchQuery.trim().toLowerCase();
  let filtered = activeFilter === "featured" ? allProjects.filter(p => p.featured) : allProjects;
  if (q) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const animateGrid = useCallback((cb: () => void) => {
    if (!gridRef.current) { cb(); return; }
    gsap.to(gridRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
      onComplete: () => { cb(); gsap.to(gridRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }); },
    });
  }, []);

  const handleFilter = useCallback((f: "all" | "featured") => {
    animateGrid(() => { setActiveFilter(f); setPage(1); });
  }, [animateGrid]);

  const changePage = useCallback((p: number) => {
    animateGrid(() => {
      setPage(p);
      setTimeout(() => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  }, [animateGrid]);

  // JS-based sticky for search bar — position: sticky breaks inside page-card { overflow: hidden }
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth <= 1024) setStuck(!entry.isIntersecting);
      },
      { rootMargin: "-62px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(sentinel);

    const onResize = () => { if (window.innerWidth > 1024) setStuck(false); };
    window.addEventListener("resize", onResize);
    return () => { observer.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);

  // heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const trig = { trigger: headingRef.current, start: "top 82%", once: true };
      gsap.fromTo(".proj-status-tag", { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1, scrollTrigger: trig });
      gsap.fromTo(".proj-heading", { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25, scrollTrigger: trig });
      gsap.fromTo(".proj-role-line", { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45, scrollTrigger: trig });
      gsap.fromTo(".proj-desc", { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6, scrollTrigger: trig });
      gsap.fromTo(".proj-filters-wrap", { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.72, scrollTrigger: trig });
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // floating particles
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".proj-float").forEach(el => {
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
      gsap.fromTo(".proj-stats", { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".proj-stats", start: "top 88%", once: true } });
    });
    return () => ctx.revert();
  }, []);

  const commitSearch = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")  { e.preventDefault(); commitSearch(inputValue); }
    if (e.key === "Escape") { setInput(""); commitSearch(""); }
  };

  const handleClear = () => { setInput(""); commitSearch(""); inputRef.current?.focus(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #projects { min-height:100vh; display:flex; flex-direction:column; color:#e8e4dc; font-family:'DM Sans',sans-serif; }
        .proj-corner-tl { position:absolute; top:0; left:0; width:180px; height:180px; border-right:1px solid rgba(var(--accent-rgb),.08); border-bottom:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .proj-corner-br { position:absolute; bottom:0; right:0; width:180px; height:180px; border-left:1px solid rgba(var(--accent-rgb),.08); border-top:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .proj-scanline { position:absolute; left:60px; right:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),.12),transparent); top:50%; pointer-events:none; z-index:0; animation:projScan 7s ease-in-out infinite; }
        @keyframes projScan { 0%,100%{transform:translateY(-140px);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateY(140px);opacity:0} }
        .proj-inner { max-width:1100px; margin:0 auto; width:100%; position:relative; z-index:1; }
        .proj-float { position:absolute; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; opacity:.03; pointer-events:none; user-select:none; color:var(--accent); }

        /* status tag */
        .proj-status-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2); border-radius:3px; padding:7px 14px; width:fit-content; margin-bottom:24px; opacity:0; }
        .proj-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:projBlink 2s ease infinite; flex-shrink:0; }
        @keyframes projBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .proj-status-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }

        /* heading */
        .proj-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,120px); line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:20px; opacity:0; }
        .proj-heading .h-accent { color:var(--accent); }
        .proj-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#e8e4dc; margin-bottom:18px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; opacity:0; }
        .proj-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }
        .proj-desc { font-size:16px; line-height:1.85; color:#c0bcb4; max-width:440px; margin-bottom:36px; opacity:0; }

        /* search bar */
        .proj-search-wrap { margin-bottom:4px; }
        .proj-search-bar {
          display:flex; align-items:center; gap:10px;
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1);
          border-radius:8px; padding:11px 16px;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        @keyframes projSearchDrop {
          from { transform:translateY(-100%); opacity:0; }
          to   { transform:translateY(0);     opacity:1; }
        }
        .proj-search-fixed {
          position:fixed; top:62px; left:0; right:0; z-index:900;
          background:rgba(8,8,8,0.97);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.07);
          padding:10px 20px;
          animation:projSearchDrop 0.22s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .proj-search-fixed .proj-search-bar {
          max-width:1100px; margin:0 auto;
          background:rgba(255,255,255,0.05);
        }
        .proj-search-spacer { height:57px; margin-bottom:12px; }
        .proj-search-bar:focus-within {
          border-color:rgba(var(--accent-rgb),0.45);
          box-shadow:0 0 0 3px rgba(var(--accent-rgb),0.08);
        }
        .proj-search-icon { color:#5a5a54; flex-shrink:0; display:flex; }
        .proj-search-input {
          flex:1; background:none; border:none; outline:none;
          font-family:'JetBrains Mono',monospace; font-size:13px;
          letter-spacing:0.04em; color:#e8e4dc; min-width:0;
        }
        .proj-search-input::placeholder { color:#666660; }
        .proj-search-submit {
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px; border-radius:6px; flex-shrink:0;
          background:rgba(var(--accent-rgb),0.12); border:1px solid rgba(var(--accent-rgb),0.3);
          color:var(--accent); cursor:pointer;
          transition:background 0.18s, transform 0.15s;
        }
        .proj-search-submit:hover { background:rgba(var(--accent-rgb),0.22); transform:scale(1.06); }
        .proj-search-submit:active { transform:scale(0.95); }
        .proj-search-clear {
          background:none; border:none; cursor:pointer;
          color:#5a5a54; font-size:20px; line-height:1;
          padding:0 2px; transition:color 0.15s; flex-shrink:0;
        }
        .proj-search-clear:hover { color:var(--accent); }
        .proj-search-count {
          font-family:'JetBrains Mono',monospace; font-size:10px;
          letter-spacing:0.06em; color:var(--accent); white-space:nowrap;
          flex-shrink:0; background:rgba(var(--accent-rgb),0.1);
          border:1px solid rgba(var(--accent-rgb),0.2); border-radius:4px;
          padding:2px 8px;
        }

        /* filters */
        .proj-filters-wrap { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:0; opacity:0; }
        .proj-filter { padding:7px 16px; border-radius:3px; cursor:pointer; border:1px solid #1a1a18; background:transparent; color:#7a7a70; font-size:11px; font-family:'JetBrains Mono',monospace; letter-spacing:.1em; text-transform:uppercase; display:flex; align-items:center; gap:6px; transition:color .2s,border-color .2s,background .2s; }
        .proj-filter:hover { color:#a0a098; border-color:#2a2a28; }
        .proj-filter.active { border-color:rgba(var(--accent-rgb),.35); background:rgba(var(--accent-rgb),.07); color:var(--accent); }
        .proj-filter-count { font-size:9px; padding:1px 5px; border-radius:2px; background:#0e0e0c; border:1px solid #1a1a18; color:#6a6a60; font-family:'JetBrains Mono',monospace; }
        .proj-filter.active .proj-filter-count { background:rgba(var(--accent-rgb),.1); border-color:rgba(var(--accent-rgb),.2); color:var(--accent); }

        /* card image area — aspect-ratio so it scales with card width */
        .proj-img-wrap { aspect-ratio:16/9; min-height:140px; max-height:220px; background:#080808; border-bottom:1px solid #1a1a18; position:relative; overflow:hidden; flex-shrink:0; }

        /* card body */
        .proj-card-body { padding:18px 20px; display:flex; flex-direction:column; flex:1; }
        .proj-card-cat { display:inline-block; font-size:12px; font-family:'JetBrains Mono',monospace; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); background:rgba(var(--accent-rgb),.22); border:1.5px solid rgba(var(--accent-rgb),.45); border-radius:5px; padding:6px 12px; margin-bottom:14px; font-weight:800; }
        .proj-card-title { font-family:'Bebas Neue',sans-serif; font-size:20px; font-weight:400; margin-bottom:8px; letter-spacing:.04em; transition:color .25s ease; line-height:1.2; }
        .proj-card-desc { font-size:13px; color:#9a9890; font-family:'DM Sans',sans-serif; line-height:1.75; margin-bottom:14px; flex:1; }
        .proj-tags { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:16px; }
        .proj-tag { padding:5px 11px; background:rgba(var(--accent-rgb),.08); border:1px solid rgba(var(--accent-rgb),.24); border-radius:4px; font-size:10px; font-family:'JetBrains Mono',monospace; color:var(--accent); letter-spacing:.08em; font-weight:600; }
        .proj-card-btns { display:flex; gap:8px; flex-wrap:nowrap; }

        /* buttons */
        .proj-btn-primary { display:inline-flex; align-items:center; padding:9px 14px; border-radius:6px; font-size:12px; font-family:'JetBrains Mono',monospace; letter-spacing:.07em; text-decoration:none; cursor:pointer; text-transform:uppercase; background:rgba(var(--accent-rgb),.14); border:1px solid rgba(var(--accent-rgb),.35); color:var(--accent); transition:background .2s,border-color .2s,box-shadow .2s; white-space:nowrap; font-weight:600; }
        .proj-btn-primary:hover { background:rgba(var(--accent-rgb),.22); border-color:rgba(var(--accent-rgb),.5); box-shadow:0 4px 12px rgba(var(--accent-rgb),.1); }
        .proj-btn-secondary { display:inline-flex; align-items:center; padding:9px 14px; border-radius:6px; font-size:12px; font-family:'JetBrains Mono',monospace; letter-spacing:.07em; text-decoration:none; cursor:pointer; text-transform:uppercase; background:rgba(var(--accent-rgb),.08); border:1px solid rgba(var(--accent-rgb),.25); color:var(--accent); transition:background .2s,border-color .2s,box-shadow .2s; white-space:nowrap; font-weight:600; }
        .proj-btn-secondary:hover { background:rgba(var(--accent-rgb),.14); border-color:rgba(var(--accent-rgb),.4); box-shadow:0 4px 12px rgba(var(--accent-rgb),.08); }

        /* grid — auto columns: fills with min 300px, no fixed column count */
        .proj-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }

        /* pagination */
        .proj-pagination { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:40px; flex-wrap:wrap; }
        .proj-page-btn { padding:8px 18px; background:transparent; border:1px solid #1e1e1a; color:#7a7a70; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; cursor:pointer; border-radius:3px; transition:all .2s; }
        .proj-page-btn:hover:not(:disabled) { border-color:rgba(var(--accent-rgb),.3); color:var(--accent); }
        .proj-page-btn:disabled { opacity:.25; cursor:not-allowed; }
        .proj-page-nums { display:flex; gap:5px; }
        .proj-page-num { width:34px; height:34px; display:flex; align-items:center; justify-content:center; background:transparent; border:1px solid #1e1e1a; color:#7a7a70; font-family:'JetBrains Mono',monospace; font-size:11px; cursor:pointer; border-radius:3px; transition:all .2s; }
        .proj-page-num:hover { border-color:rgba(var(--accent-rgb),.22); color:#9a9a90; }
        .proj-page-num.active { background:rgba(var(--accent-rgb),.08); border-color:rgba(var(--accent-rgb),.35); color:var(--accent); }

        /* skeleton */
        @keyframes projSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .proj-skel { background:linear-gradient(90deg,#1a1a18 25%,#2a2a28 50%,#1a1a18 75%); background-size:200% 100%; animation:projSkelShimmer 1.4s ease infinite; border-radius:4px; }

        /* stats */
        .proj-stats { display:flex; align-items:stretch; margin-top:52px; background:linear-gradient(145deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.014) 100%); border:1px solid rgba(255,255,255,.08); box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 4px 20px rgba(0,0,0,.28); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-radius:6px; overflow:hidden; width:fit-content; opacity:0; }
        .proj-stat-item { padding:16px 30px; border-right:1px solid rgba(255,255,255,.07); text-align:center; }
        .proj-stat-item:last-child { border-right:none; }
        .proj-stat-num { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:.03em; line-height:1; }
        .proj-stat-label { font-family:'JetBrains Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#7a7670; margin-top:4px; }

        /* github cta */
        .proj-github-cta { display:inline-flex; align-items:center; gap:12px; padding:18px 40px; border-radius:10px; background:rgba(var(--accent-rgb),0.1); border:2px solid rgba(var(--accent-rgb),0.5); color:var(--accent); font-size:14px; font-family:'JetBrains Mono',monospace; letter-spacing:.14em; text-decoration:none; text-transform:uppercase; transition:all .25s; font-weight:700; }

        /* empty */
        .proj-empty { text-align:center; padding:80px 20px; }
        .proj-empty-title { font-family:'Bebas Neue',sans-serif; font-size:32px; color:#3a3a36; letter-spacing:.04em; margin-bottom:8px; }
        .proj-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#3a3a36; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Responsive ── */
        @media (max-width:1199px) {
          .proj-heading{font-size:clamp(52px,8vw,100px)}
          .proj-corner-tl,.proj-corner-br{width:120px;height:120px}
          .proj-stat-item{padding:14px 24px} .proj-stat-num{font-size:34px}
        }
        @media (max-width:1023px) {
          .proj-heading{font-size:clamp(48px,8vw,80px)}
          .proj-grid{gap:16px}
          .proj-card-body{padding:16px 18px}
          .proj-card-title{font-size:18px}
          .proj-card-desc{font-size:12px}
          .proj-corner-tl,.proj-corner-br{width:100px;height:100px}
          .proj-scanline{left:32px;right:32px}
        }
        @media (max-width:767px) {
          .proj-heading{font-size:clamp(52px,14vw,80px)}
          .proj-grid{grid-template-columns:1fr;gap:14px}
          .proj-desc{font-size:14px;max-width:100%}
          .proj-stats{width:100%} .proj-stat-item{flex:1;padding:14px 12px}
          .proj-corner-tl,.proj-corner-br{width:80px;height:80px}
          .proj-scanline{left:24px;right:24px}
          .proj-card-body{padding:18px 20px}
          .proj-card-title{font-size:20px}
          .proj-card-desc{font-size:13px}
        }
        @media (max-width:599px) {
          .proj-heading{font-size:clamp(44px,16vw,64px)}
          .proj-role-line{font-size:10px;gap:8px;letter-spacing:.06em}
          .proj-role-line::before{width:20px}
          .proj-desc{font-size:13px}
          .proj-card-body{padding:16px 18px}
          .proj-card-title{font-size:19px}
          .proj-stat-num{font-size:28px} .proj-stat-item{padding:12px 10px}
          .proj-corner-tl,.proj-corner-br{width:60px;height:60px}
          .proj-page-btn{padding:7px 12px;font-size:10px}
          .proj-page-num{width:30px;height:30px;font-size:10px}
        }
        @media (max-width:379px) {
          .proj-heading{font-size:clamp(38px,18vw,52px)}
          .proj-corner-tl,.proj-corner-br{width:40px;height:40px}
          .proj-card-body{padding:14px 16px}
        }
        @media (hover:none) {
          .proj-btn-primary:hover,.proj-btn-secondary:hover{transform:none!important}
        }
        @media (min-width:1600px) {
          .proj-inner{max-width:1300px}
          .proj-heading{font-size:clamp(80px,9vw,130px)}
          .proj-desc{font-size:17px;max-width:500px}
          .proj-stat-item{padding:18px 36px} .proj-stat-num{font-size:42px}
        }
      `}</style>

      <section id="projects">
        <div className="page-card">
          <div className="proj-corner-tl" />
          <div className="proj-corner-br" />
          <div className="proj-scanline" />

          {["const","async","=>","return","export","type","import","{}"].map((t, i) => (
            <div key={i} className="proj-float"
              style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>{t}</div>
          ))}

          <div className="proj-inner">

            {/* heading */}
            <div ref={headingRef}>
              <div className="proj-status-tag">
                <span className="proj-status-dot" />
                <span className="proj-status-text">Selected Work</span>
              </div>
              <h2 className="proj-heading">
                Featured <span className="h-accent">P</span>rojects
              </h2>
              <div className="proj-role-line">Things I&apos;ve built with passion &amp; precision</div>
              <p className="proj-desc">
                A curated collection of work — from SaaS platforms to creative landing pages, all built with care and shipped to production.
              </p>

              {/* Sentinel — IntersectionObserver watches this to detect when search bar scrolls past nav */}
              <div ref={sentinelRef} style={{ height: 0 }} />

              {/* Spacer replaces the search bar's space when it goes fixed */}
              {stuck && <div className="proj-search-spacer" />}

              {/* Search bar — rendered inline normally, teleported to fixed when stuck */}
              {!loading && (
                <div className={stuck ? "proj-search-fixed" : "proj-search-wrap"}>
                  <div className="proj-search-bar">
                    <span className="proj-search-icon"><SearchIcon /></span>
                    <input
                      ref={inputRef}
                      className="proj-search-input"
                      type="text"
                      placeholder="Search projects by title, tag or category..."
                      value={inputValue}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {searchQuery && (
                      <span className="proj-search-count">
                        {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {inputValue && (
                      <button className="proj-search-clear" onClick={handleClear} aria-label="Clear">×</button>
                    )}
                    <button
                      className="proj-search-submit"
                      onClick={() => commitSearch(inputValue)}
                      aria-label="Search"
                      title="Search"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* filters */}
              {!loading && (
                <div className="proj-filters-wrap">
                  <FilterPill label="All" active={activeFilter === "all"}
                    onClick={() => handleFilter("all")} count={allProjects.length} />
                  <FilterPill label="Featured" active={activeFilter === "featured"}
                    onClick={() => handleFilter("featured")} count={allProjects.filter(p => p.featured).length} />
                </div>
              )}
            </div>

            {/* grid */}
            <div className="proj-grid" ref={gridRef}>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                : paginated.length === 0
                ? (
                  <div className="proj-empty" style={{ gridColumn: "1/-1" }}>
                    <div className="proj-empty-title">
                      {searchQuery ? "No Results Found" : "No Projects Yet"}
                    </div>
                    <div className="proj-empty-sub">
                      {searchQuery
                        ? <>nothing matched &ldquo;<span style={{ color: "var(--accent)" }}>{searchQuery}</span>&rdquo;</>
                        : "// Add projects from the admin panel"
                      }
                    </div>
                  </div>
                )
                : paginated.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))
              }
            </div>

            {/* pagination */}
            {!loading && totalPages > 1 && (
              <div className="proj-pagination">
                <button className="proj-page-btn" disabled={page === 1}
                  onClick={() => changePage(page - 1)}>← Prev</button>
                <div className="proj-page-nums">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p}
                      className={`proj-page-num${p === page ? " active" : ""}`}
                      onClick={() => changePage(p)}>{p}</button>
                  ))}
                </div>
                <button className="proj-page-btn" disabled={page === totalPages}
                  onClick={() => changePage(page + 1)}>Next →</button>
              </div>
            )}

            {/* stats */}
            {!loading && allProjects.length > 0 && (
              <div className="proj-stats">
                <div className="proj-stat-item">
                  <div className="proj-stat-num" style={{ color: "var(--accent)" }}>{allProjects.length}+</div>
                  <div className="proj-stat-label">Projects</div>
                </div>
                <div className="proj-stat-item">
                  <div className="proj-stat-num" style={{ color: "#4ade80" }}>
                    {allProjects.filter(p => p.featured).length}
                  </div>
                  <div className="proj-stat-label">Featured</div>
                </div>
                <div className="proj-stat-item">
                  <div className="proj-stat-num" style={{ color: "#86efac" }}>
                    {[...new Set(allProjects.flatMap(p => p.tags))].length}+
                  </div>
                  <div className="proj-stat-label">Technologies</div>
                </div>
              </div>
            )}

            {/* github cta */}
            <div style={{ textAlign: "center", marginTop: "52px" }}>
              <GithubCTA />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
