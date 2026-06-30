"use client";

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

// ── Blog Card (project-card style) ────────────────────────────────────────────
function BlogCard({ blog, index, onNavigate }: { blog: Blog; index: number; onNavigate: (id: string) => void }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const accentRef  = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);
  const [hovered, setHovered] = useState(false);

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
  }, []);

  const plainText = blog.content.replace(/<[^>]+>/g, "");
  const dateStr = new Date(blog.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div style={{ perspective: "900px", opacity: 0 }} ref={cardRef}>
      <div
        onClick={() => onNavigate(blog.id)}
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
          cursor: "pointer",
          transition: "border-color .3s ease, box-shadow .35s ease",
        }}
      >
        {/* top accent line */}
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

        {/* image area */}
        <div className="bl-img-wrap">
          {/* grid pattern overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px)",
            backgroundSize: "28px 28px", pointerEvents: "none", zIndex: 0,
          }} />

          {blog.thumbnail ? (
            <img src={blog.thumbnail} alt={blog.title} className="bl-img" />
          ) : (
            <div className="bl-img-ph">
              <span className="bl-img-ph-text">BLOG</span>
            </div>
          )}

          {/* gradient overlay with title */}
          <div className="bl-img-overlay">
            <h3 className="bl-img-title">{blog.title}</h3>
          </div>

          {/* date badge */}
          <div style={{
            position: "absolute", top: "8px", right: "8px", zIndex: 2,
            padding: "3px 9px",
            background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.2)",
            borderRadius: "3px", fontSize: "10px",
            fontFamily: "'JetBrains Mono',monospace",
            color: "var(--accent)", letterSpacing: "0.08em",
          }}>{new Date(blog.createdAt).getFullYear()}</div>

          {/* category badge */}
          {blog.category && (
            <div style={{
              position: "absolute", top: "8px", left: "8px", zIndex: 2,
              padding: "3px 8px",
              background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.25)",
              borderRadius: "3px", fontSize: "9px",
              fontFamily: "'JetBrains Mono',monospace",
              color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
            }}>{blog.category}</div>
          )}
        </div>

        {/* card body */}
        <div className="bl-card-body">
          <h2 className="bl-card-title" style={{ color: hovered ? "var(--accent)" : "#f0ece4" }}>
            {blog.title}
          </h2>

          <div className="bl-card-meta-row">
            <span className="bl-card-date">{dateStr}</span>
            <div className="bl-views-chip">
              <EyeIcon size={12} />
              <span>{blog.views ?? 0} views</span>
            </div>
          </div>

          <p className="bl-card-excerpt">{plainText}</p>

          <div className="bl-card-footer">
            <span className="bl-read-link" onClick={(e) => { e.stopPropagation(); onNavigate(blog.id); }}>
              Read Full Blog →
            </span>
            <span className="bl-blog-badge">BLOG</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
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
          <div className="bl-skel-bar" style={{ width: "72%", height: "12px" }} />
        </div>
        <div className="bl-skel-footer-row">
          <div className="bl-skel-bar" style={{ width: "110px", height: "12px" }} />
          <div className="bl-skel-bar" style={{ width: "48px", height: "22px", borderRadius: "3px" }} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const headingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setBlogs(Array.isArray(data) ? data : []); setFetching(false); })
      .catch(() => setFetching(false));
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".bl-status-tag", { y: 30, opacity: 0, scale: 0.9 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
        scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true },
      });
      gsap.fromTo(".bl-heading", { y: 60, opacity: 0, skewY: 3 }, {
        y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
        scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true },
      });
      gsap.fromTo(".bl-role-line", { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
        scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true },
      });
    }, headingRef);
    return () => ctx.revert();
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? blogs : blogs.filter((b) => b.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleCategoryChange = (cat: string) => { setActiveCategory(cat); setPage(1); };
  const handleNavigate = (id: string) => router.push(`/blog/${id}`);

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
        .bl-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#e8e4dc; margin-bottom:40px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; opacity:0; }
        .bl-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }

        /* Category tabs */
        .bl-categories { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:36px; align-items:center; }
        .bl-cat-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:#5a5a54; margin-right:4px; flex-shrink:0; }
        .bl-cat-btn { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.07em; text-transform:uppercase; padding:8px 18px; border-radius:3px; cursor:pointer; border:1px solid #1c1c1a; background:transparent; color:#5a5a50; transition:all 0.2s; }
        .bl-cat-btn:hover { border-color:rgba(var(--accent-rgb),0.35); color:var(--accent); background:rgba(var(--accent-rgb),0.05); }
        .bl-cat-btn.active { background:rgba(var(--accent-rgb),0.12); border-color:rgba(var(--accent-rgb),0.45); color:var(--accent); box-shadow:0 0 12px rgba(var(--accent-rgb),0.1); }
        .bl-cat-count { display:inline-flex; align-items:center; justify-content:center; background:rgba(var(--accent-rgb),0.15); border-radius:4px; padding:1px 6px; font-size:9px; margin-left:6px; color:var(--accent); font-weight:700; }

        /* Grid */
        .bl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:20px; }

        /* Image area */
        .bl-img-wrap { aspect-ratio:16/9; min-height:140px; max-height:220px; background:#080808; border-bottom:1px solid #1a1a18; position:relative; overflow:hidden; flex-shrink:0; }
        .bl-img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; transition:transform .4s ease; }
        .bl-img-ph { width:100%; height:100%; background:linear-gradient(135deg,#0c0c0a 0%,#1a1a16 50%,#0f0f0d 100%); display:flex; align-items:center; justify-content:center; }
        .bl-img-ph-text { font-family:'Bebas Neue',sans-serif; font-size:48px; color:rgba(var(--accent-rgb),0.07); letter-spacing:0.06em; user-select:none; }
        .bl-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.35) 55%,rgba(0,0,0,0) 100%); display:flex; align-items:flex-end; padding:14px 16px; z-index:2; }
        .bl-img-title { font-family:'DM Sans',sans-serif; font-size:14px; font-weight:700; color:#fff; line-height:1.35; text-shadow:0 2px 10px rgba(0,0,0,0.8); margin:0; width:100%; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

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

        /* Empty state */
        .bl-empty { text-align:center; padding:80px 20px; grid-column:1/-1; }
        .bl-empty-title { font-family:'Bebas Neue',sans-serif; font-size:36px; color:#2a2a28; letter-spacing:0.04em; margin-bottom:8px; }
        .bl-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a28; letter-spacing:0.08em; text-transform:uppercase; }

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
        }
        @media (hover:none) {
          .bl-read-link:hover{opacity:1}
        }
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

            {/* Category tabs */}
            {!fetching && categories.length > 1 && (
              <div className="bl-categories">
                <span className="bl-cat-label">Browse //</span>
                {categories.map((cat) => {
                  const count = cat === "All" ? blogs.length : blogs.filter((b) => b.category === cat).length;
                  return (
                    <button key={cat} onClick={() => handleCategoryChange(cat)}
                      className={`bl-cat-btn${activeCategory === cat ? " active" : ""}`}>
                      {cat}<span className="bl-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Grid */}
            <div className="bl-grid">
              {fetching ? (
                Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <div className="bl-empty">
                  <div className="bl-empty-title">No Posts Yet</div>
                  <div className="bl-empty-sub">// Coming soon — check back later</div>
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
