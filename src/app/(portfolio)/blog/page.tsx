"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

const POSTS_PER_PAGE = 6;

type Blog = {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  images: string[];
  tags: string[];
  category: string | null;
  published: boolean;
  createdAt: string;
  views: number;
};

function EyeIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ blog, index, onNavigate }: { blog: Blog; index: number; onNavigate: (id: string) => void }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const accentRef  = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => { isTouchRef.current = window.matchMedia("(hover: none)").matches; }, []);

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
    gsap.to(el, { rotateX: ((y - cy) / cy) * -5, rotateY: ((x - cx) / cx) * 5, duration: 0.3, ease: "power2.out", transformPerspective: 900 });
    if (glowRef.current) gsap.to(glowRef.current, { x: x - 150, y: y - 150, duration: 0.4, ease: "power2.out" });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    gsap.to(cardRef.current, { borderColor: "rgba(var(--accent-rgb),0.35)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1),0 8px 40px rgba(0,0,0,0.5),0 0 32px rgba(var(--accent-rgb),0.1)", duration: 0.3 });
    gsap.to(accentRef.current, { opacity: 1, duration: 0.25 });
    gsap.to(glowRef.current,   { opacity: 1, duration: 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06),0 4px 24px rgba(0,0,0,0.4),0 1px 4px rgba(0,0,0,0.5)", duration: 0.5, ease: "power3.out", transformPerspective: 900 });
    gsap.to(accentRef.current, { opacity: 0, duration: 0.3 });
    gsap.to(glowRef.current,   { opacity: 0, duration: 0.3 });
  }, []);

  const plainText = blog.content.replace(/<[^>]+>/g, "");
  const dateStr   = new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div style={{ opacity: 0 }} ref={cardRef}>
      <div
        onClick={() => onNavigate(blog.id)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "linear-gradient(145deg,rgba(22,22,20,0.96) 0%,rgba(16,16,14,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06),0 4px 24px rgba(0,0,0,0.4),0 1px 4px rgba(0,0,0,0.5)",
          borderRadius: "6px", overflow: "hidden", position: "relative",
          height: "100%", display: "flex", flexDirection: "column",
          cursor: "pointer", transition: "border-color .3s ease, box-shadow .35s ease",
        }}
      >
        <div ref={accentRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg,var(--accent),transparent)", boxShadow: "0 0 14px rgba(var(--accent-rgb),0.5)", opacity: 0, zIndex: 3 }} />
        <div ref={glowRef} style={{ position: "absolute", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle,rgba(var(--accent-rgb),0.12) 0%,transparent 68%)", pointerEvents: "none", opacity: 0, zIndex: 1, transform: "translate(-50%,-50%)" }} />

        <div className="bl-img-wrap">
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0 }} />
          {blog.thumbnail ? <img src={blog.thumbnail} alt={blog.title} className="bl-img" /> : <div className="bl-img-ph"><span className="bl-img-ph-text">BLOG</span></div>}
          <div className="bl-img-overlay" />
          <div style={{ position: "absolute", top: "8px", right: "8px", zIndex: 2, padding: "3px 9px", background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.2)", borderRadius: "3px", fontSize: "10px", fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", letterSpacing: "0.08em" }}>{new Date(blog.createdAt).getFullYear()}</div>
          {blog.category && <div style={{ position: "absolute", top: "8px", left: "8px", zIndex: 2, padding: "3px 8px", background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: "3px", fontSize: "9px", fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>{blog.category}</div>}
        </div>

        <div className="bl-card-body">
          <h2 className="bl-card-title" style={{ color: hovered ? "var(--accent)" : "#f0ece4" }}>{blog.title}</h2>
          <div className="bl-card-meta-row">
            <span className="bl-card-date">{dateStr}</span>
            <div className="bl-views-chip"><EyeIcon size={12} /><span>{blog.views ?? 0} views</span></div>
          </div>
          <p className="bl-card-excerpt">{plainText}</p>
          <div className="bl-card-footer">
            <span className="bl-read-link" onClick={(e) => { e.stopPropagation(); onNavigate(blog.id); }}>Read Full Blog →</span>
            <span className="bl-blog-badge">BLOG</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="bl-skel-card">
      <div className="bl-skel-img" />
      <div className="bl-card-body" style={{ gap: "10px" }}>
        <div className="bl-skel-bar" style={{ width: "85%", height: "18px" }} />
        <div className="bl-skel-bar" style={{ width: "60%", height: "14px" }} />
        <div className="bl-skel-meta-row">
          <div className="bl-skel-bar" style={{ width: "90px", height: "11px" }} />
          <div className="bl-skel-bar" style={{ width: "65px", height: "11px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div className="bl-skel-bar" style={{ width: "100%", height: "12px" }} />
          <div className="bl-skel-bar" style={{ width: "100%", height: "12px" }} />
          <div className="bl-skel-bar" style={{ width: "72%",  height: "12px" }} />
        </div>
        <div className="bl-skel-footer-row">
          <div className="bl-skel-bar" style={{ width: "110px", height: "12px" }} />
          <div className="bl-skel-bar" style={{ width: "48px",  height: "22px", borderRadius: "3px" }} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [blogs, setBlogs]       = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [inputValue, setInput]  = useState("");   // what's typed
  const [searchQuery, setQuery] = useState("");   // what's filtering (set on Enter)
  const [page, setPage]         = useState(1);
  const [stuck, setStuck]       = useState(false);

  const headingRef  = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);
  const router      = useRouter();

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setBlogs(Array.isArray(data) ? data : []); setFetching(false); })
      .catch(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".bl-status-tag", { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1, scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } });
      gsap.fromTo(".bl-heading",    { y: 60, opacity: 0, skewY: 3 },   { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25, scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } });
      gsap.fromTo(".bl-role-line",  { y: 20, opacity: 0 },             { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45, scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } });
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // JS-based sticky — position: sticky breaks inside page-card { overflow: hidden }
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

  const q        = searchQuery.trim().toLowerCase();
  const filtered = q
    ? blogs.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.content.replace(/<[^>]+>/g, "").toLowerCase().includes(q) ||
        (b.category ?? "").toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      )
    : blogs;

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const commitSearch = (val: string) => {
    setQuery(val);
    setPage(1);
    // Scroll to top so results are visible from the start and sentinel re-enters
    // the viewport, which naturally releases the fixed state cleanly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")  { e.preventDefault(); commitSearch(inputValue); }
    if (e.key === "Escape") { setInput(""); commitSearch(""); }
  };

  const handleClear = () => { setInput(""); commitSearch(""); inputRef.current?.focus(); };

  const handleNavigate = (id: string) => router.push(`/blog/${id}`);

  const SearchBar = (
    <div className="bl-search-bar">
      <span className="bl-search-icon"><SearchIcon /></span>
      <input
        ref={inputRef}
        className="bl-search-input"
        type="text"
        placeholder="Search blogs by title, tag or category..."
        value={inputValue}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
      {searchQuery && (
        <span className="bl-search-count">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      )}
      {inputValue && (
        <button className="bl-search-clear" onClick={handleClear} aria-label="Clear">×</button>
      )}
      <button
        className="bl-search-submit"
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
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #blog { min-height:100vh; display:flex; flex-direction:column; color:#e8e4dc; font-family:'DM Sans',sans-serif; }
        .bl-inner { max-width:1100px; margin:0 auto; width:100%; position:relative; z-index:1; }

        /* Header */
        .bl-status-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2); border-radius:3px; padding:7px 14px; width:fit-content; margin-bottom:24px; opacity:0; }
        .bl-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:blBlink 2s ease infinite; }
        @keyframes blBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .bl-status-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
        .bl-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,120px); line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:20px; opacity:0; }
        .bl-heading .h-accent { color:var(--accent); }
        .bl-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#e8e4dc; margin-bottom:32px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; opacity:0; }
        .bl-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }

        /* ── Search bar ── */
        .bl-search-wrap { margin-bottom:36px; }
        .bl-search-bar {
          display:flex; align-items:center; gap:10px;
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1);
          border-radius:8px; padding:11px 16px;
          transition:border-color 0.2s, box-shadow 0.2s;
        }
        .bl-search-bar:focus-within {
          border-color:rgba(var(--accent-rgb),0.45);
          box-shadow:0 0 0 3px rgba(var(--accent-rgb),0.08);
        }
        .bl-search-icon { color:#5a5a54; flex-shrink:0; display:flex; }
        .bl-search-input {
          flex:1; background:none; border:none; outline:none;
          font-family:'JetBrains Mono',monospace; font-size:13px;
          letter-spacing:0.04em; color:#e8e4dc; min-width:0;
        }
        .bl-search-input::placeholder { color:#666660; }
        .bl-search-submit {
          display:flex; align-items:center; justify-content:center;
          width:30px; height:30px; border-radius:6px; flex-shrink:0;
          background:rgba(var(--accent-rgb),0.12); border:1px solid rgba(var(--accent-rgb),0.3);
          color:var(--accent); cursor:pointer;
          transition:background 0.18s, transform 0.15s;
        }
        .bl-search-submit:hover { background:rgba(var(--accent-rgb),0.22); transform:scale(1.06); }
        .bl-search-submit:active { transform:scale(0.95); }
        .bl-search-clear {
          background:none; border:none; cursor:pointer;
          color:#5a5a54; font-size:20px; line-height:1;
          padding:0 2px; transition:color 0.15s; flex-shrink:0;
        }
        .bl-search-clear:hover { color:var(--accent); }
        .bl-search-count {
          font-family:'JetBrains Mono',monospace; font-size:10px;
          letter-spacing:0.06em; color:var(--accent); white-space:nowrap;
          flex-shrink:0; background:rgba(var(--accent-rgb),0.1);
          border:1px solid rgba(var(--accent-rgb),0.2); border-radius:4px;
          padding:2px 8px;
        }

        /* Fixed search — applied via JS when stuck on mobile */
        @keyframes blSearchDrop {
          from { transform:translateY(-100%); opacity:0; }
          to   { transform:translateY(0);     opacity:1; }
        }
        .bl-search-fixed {
          position:fixed; top:62px; left:0; right:0; z-index:900;
          background:rgba(8,8,8,0.97);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(255,255,255,0.07);
          padding:10px 20px;
          animation:blSearchDrop 0.22s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .bl-search-fixed .bl-search-bar {
          max-width:1100px; margin:0 auto;
          background:rgba(255,255,255,0.05);
        }
        .bl-search-spacer { height:57px; margin-bottom:36px; }

        /* Grid */
        .bl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }

        /* Image */
        .bl-img-wrap { aspect-ratio:16/9; min-height:140px; max-height:220px; background:#080808; border-bottom:1px solid #1a1a18; position:relative; overflow:hidden; flex-shrink:0; }
        .bl-img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; transition:transform .4s ease; }
        .bl-img-ph { width:100%; height:100%; background:linear-gradient(135deg,#0c0c0a 0%,#1a1a16 50%,#0f0f0d 100%); display:flex; align-items:center; justify-content:center; }
        .bl-img-ph-text { font-family:'Bebas Neue',sans-serif; font-size:48px; color:rgba(var(--accent-rgb),0.07); letter-spacing:0.06em; user-select:none; }
        .bl-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,rgba(0,0,0,0.15) 55%,rgba(0,0,0,0) 100%); z-index:2; pointer-events:none; }

        /* Card body */
        .bl-card-body { padding:18px 20px; display:flex; flex-direction:column; gap:10px; flex:1; min-width:0; }
        .bl-card-title { font-family:'Bebas Neue',sans-serif; font-size:20px; font-weight:400; letter-spacing:.04em; line-height:1.2; margin:0; transition:color .25s ease; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .bl-card-meta-row { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
        .bl-card-date { font-family:'JetBrains Mono',monospace; font-size:10px; color:#807c74; letter-spacing:0.06em; white-space:nowrap; }
        .bl-views-chip { display:flex; align-items:center; gap:4px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#807c74; letter-spacing:0.05em; white-space:nowrap; }
        .bl-card-excerpt { font-size:13px; color:#9a9890; font-family:'DM Sans',sans-serif; line-height:1.75; margin:0; flex:1; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .bl-card-footer { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:auto; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06); }
        .bl-read-link { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--accent); letter-spacing:0.07em; text-transform:uppercase; text-decoration:underline; text-underline-offset:3px; white-space:nowrap; transition:opacity .2s; }
        .bl-blog-badge { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.12em; text-transform:uppercase; padding:4px 10px; background:rgba(var(--accent-rgb),0.09); border:1px solid rgba(var(--accent-rgb),0.22); border-radius:3px; color:var(--accent); white-space:nowrap; flex-shrink:0; }

        /* Skeleton */
        .bl-skel-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:6px; overflow:hidden; display:flex; flex-direction:column; }
        @keyframes blSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .bl-skel-img { aspect-ratio:16/9; width:100%; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:blSkelShimmer 1.6s ease infinite; }
        .bl-skel-bar { border-radius:4px; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:blSkelShimmer 1.6s ease infinite; }
        .bl-skel-meta-row { display:flex; align-items:center; justify-content:space-between; margin:4px 0; }
        .bl-skel-footer-row { display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06); }

        /* Pagination */
        .bl-pagination { display:flex; align-items:center; justify-content:center; gap:8px; margin-top:52px; flex-wrap:wrap; }
        .bl-page-btn { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.07em; padding:9px 16px; border-radius:3px; cursor:pointer; border:1px solid #1c1c1a; background:transparent; color:#7a7a70; transition:all 0.2s; min-width:40px; text-align:center; }
        .bl-page-btn:hover:not(:disabled) { border-color:rgba(var(--accent-rgb),0.35); color:var(--accent); background:rgba(var(--accent-rgb),0.05); }
        .bl-page-btn.active { background:rgba(var(--accent-rgb),0.12); border-color:rgba(var(--accent-rgb),0.45); color:var(--accent); }
        .bl-page-btn:disabled { opacity:0.25; cursor:not-allowed; }
        .bl-page-info { font-family:'JetBrains Mono',monospace; font-size:10px; color:#5a5a54; letter-spacing:0.08em; text-transform:uppercase; padding:0 8px; }

        /* Empty / no results */
        .bl-empty { text-align:center; padding:80px 20px; grid-column:1/-1; }
        .bl-empty-icon { font-size:48px; margin-bottom:16px; opacity:0.4; }
        .bl-empty-title { font-family:'Bebas Neue',sans-serif; font-size:38px; color:#8a8a84; letter-spacing:0.04em; margin-bottom:10px; }
        .bl-empty-sub { font-family:'JetBrains Mono',monospace; font-size:12px; color:#6a6a62; letter-spacing:0.08em; text-transform:uppercase; }
        .bl-empty-query { color:var(--accent); }

        /* Responsive */
        @media (max-width:767px) {
          .bl-heading{font-size:clamp(52px,14vw,80px)}
          .bl-grid{grid-template-columns:1fr;gap:14px}
          .bl-card-title{font-size:18px}
          .bl-card-excerpt{font-size:12px}
        }
        @media (max-width:599px) {
          .bl-heading{font-size:clamp(44px,16vw,64px)}
          .bl-role-line{font-size:10px;gap:8px;letter-spacing:.06em}
          .bl-role-line::before{width:20px}
          .bl-card-body{padding:16px 18px}
          .bl-page-btn{padding:7px 12px;font-size:10px}
          .bl-search-fixed{padding:10px 16px}
        }
        @media (hover:none) { .bl-read-link:hover{opacity:1} }
      `}</style>

      <section id="blog">
        <div className="page-card">
          <div className="bl-inner">

            {/* Heading */}
            <div ref={headingRef}>
              <div className="bl-status-tag">
                <span className="bl-status-dot" />
                <span className="bl-status-text">Writing & Thoughts</span>
              </div>
              <h1 className="bl-heading">The <span className="h-accent">B</span>log</h1>
              <div className="bl-role-line">Dev notes, tutorials, and random thoughts</div>
            </div>

            {/* Sentinel — IntersectionObserver watches this to detect when search bar scrolls past nav */}
            <div ref={sentinelRef} style={{ height: 0 }} />

            {/* Spacer replaces the search bar's space when it goes fixed */}
            {stuck && <div className="bl-search-spacer" />}

            {/* Search bar — rendered inline normally, teleported to fixed when stuck */}
            <div className={stuck ? "bl-search-fixed" : "bl-search-wrap"}>
              {SearchBar}
            </div>

            {/* Grid */}
            <div className="bl-grid">
              {fetching ? (
                Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className="bl-empty">
                  <div className="bl-empty-icon">{searchQuery ? "🔍" : "📝"}</div>
                  <div className="bl-empty-title">
                    {searchQuery ? "No Results Found" : "No Posts Yet"}
                  </div>
                  <div className="bl-empty-sub">
                    {searchQuery
                      ? <>nothing matched &ldquo;<span className="bl-empty-query">{searchQuery}</span>&rdquo;</>
                      : "// coming soon — check back later"
                    }
                  </div>
                </div>
              ) : (
                paginated.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} onNavigate={handleNavigate} />
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bl-pagination">
                <button className="bl-page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`dots-${idx}`} className="bl-page-info">...</span>
                    ) : (
                      <button key={item} className={`bl-page-btn${page === item ? " active" : ""}`}
                        onClick={() => setPage(item as number)}>{item}</button>
                    )
                  )}
                <button className="bl-page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next →</button>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
