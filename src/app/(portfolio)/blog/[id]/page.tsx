"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImageCarousel } from "@/components/ImageCarousel";

// ── Types ─────────────────────────────────────────────────────────────────────
type Blog = {
  id: string; title: string; content: string;
  thumbnail: string | null; images: string[];
  tags: string[];
  category: string | null; published: boolean;
  createdAt: string; updatedAt: string; views: number;
};
// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
// If content is plain text (no HTML tags), wrap paragraphs properly
function prepareContent(html: string): string {
  if (!html) return "";
  const hasHtml = /<[a-z][\s\S]*>/i.test(html);
  if (hasHtml) return html;
  // Plain text: split by double newlines → paragraphs, single newlines → <br>
  return html
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const ClockIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const CalIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);
const FbIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const LiIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const LinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Reading Progress Bar ──────────────────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "3px",
      zIndex: 9999, background: "rgba(0,0,0,0.3)",
    }}>
      <div style={{
        height: "100%", width: `${progress}%`,
        background: "linear-gradient(90deg, var(--accent), rgba(var(--accent-rgb),0.7))",
        boxShadow: "0 0 10px rgba(var(--accent-rgb),0.6)",
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}

// ── Related Card ──────────────────────────────────────────────────────────────
function RelatedCard({ blog, onNavigate }: { blog: Blog; onNavigate: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const plainText = blog.content.replace(/<[^>]+>/g, "");
  return (
    <article
      onClick={() => onNavigate(blog.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg,rgba(255,255,255,0.055) 0%,rgba(255,255,255,0.015) 100%)",
        border: `1px solid ${hovered ? "rgba(var(--accent-rgb),0.3)" : "rgba(255,255,255,0.09)"}`,
        borderRadius: "8px", overflow: "hidden", cursor: "pointer",
        display: "flex", flexDirection: "column",
        transition: "border-color .25s, transform .25s, box-shadow .25s",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(var(--accent-rgb),0.08)" : "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#0e0e0c", flexShrink: 0, position: "relative" }}>
        {blog.thumbnail
          ? <img src={blog.thumbnail} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
          : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#0c0c0a,#1a1a16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "36px", color: "rgba(var(--accent-rgb),0.07)" }}>BLOG</span>
            </div>
        }
        {blog.category && (
          <div style={{ position: "absolute", top: "8px", left: "8px", padding: "3px 8px", background: "rgba(8,8,8,0.85)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: "3px", fontSize: "9px", fontFamily: "'JetBrains Mono',monospace", color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
            {blog.category}
          </div>
        )}
      </div>
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "18px", fontWeight: 400, color: hovered ? "var(--accent)" : "#f0ece4", margin: 0, letterSpacing: ".04em", lineHeight: 1.2, transition: "color .25s", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{blog.title}</h4>
        <p style={{ fontSize: "12px", color: "#9a9890", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", flex: 1 }}>{plainText}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "#5a5a54", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span>{fmtShort(blog.createdAt)}</span>
          <span style={{ color: "#2a2a28" }}>·</span>
          <EyeIcon size={10} /><span>{blog.views} views</span>
        </div>
      </div>
    </article>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <>
      {/* Hero image skeleton */}
      <div className="bd-skel-hero" />

      <div className="bd-skel-wrap">
        {/* Topbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 28px", flexWrap: "wrap", gap: "10px" }}>
          <div className="bd-skel-bar" style={{ width: 120, height: 34, borderRadius: 4 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {[1,2,3,4].map(i => <div key={i} className="bd-skel-bar" style={{ width: 34, height: 34, borderRadius: "50%" }} />)}
          </div>
        </div>
        {/* Article */}
        <div className="bd-skel-article">
          <div className="bd-skel-bar" style={{ width: "85%", height: 38, marginBottom: 10 }} />
          <div className="bd-skel-bar" style={{ width: "60%", height: 38, marginBottom: 22 }} />
          {/* Meta */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            {[100, 80, 90, 65].map((w, i) => <div key={i} className="bd-skel-bar" style={{ width: w, height: 12, borderRadius: 4 }} />)}
          </div>
          {/* Tags */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {[60, 50, 72, 54].map((w, i) => <div key={i} className="bd-skel-bar" style={{ width: w, height: 24, borderRadius: 4 }} />)}
          </div>
          <div className="bd-skel-bar" style={{ width: "100%", height: 1, marginBottom: 32 }} />
          {/* Body lines */}
          {[100, 96, 88, 100, 74, 0, 100, 92, 84, 100, 78, 0, 68, 100, 88, 76].map((w, i) =>
            w === 0
              ? <div key={i} style={{ height: 20 }} />
              : <div key={i} className="bd-skel-bar" style={{ width: `${w}%`, height: 14, marginBottom: 12 }} />
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [blog, setBlog]         = useState<Blog | null>(null);
  const [related, setRelated]   = useState<Blog[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [lightbox, setLightbox] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setShareUrl(window.location.href); }, []);

  useEffect(() => {
    if (!lightbox) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(false); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [lightbox]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/blog/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); setLoading(false); return null; } return r.json(); })
      .then(data => { if (data) setBlog(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch("/api/blog")
      .then(r => r.json())
      .then((data: Blog[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter(b => b.id !== id);
        const sameCat = blog ? others.filter(b => b.category && b.category === blog.category) : [];
        const rest = others.filter(b => !sameCat.find(s => s.id === b.id));
        setRelated([...sameCat, ...rest].slice(0, 3));
      })
      .catch(() => {});
  }, [id, blog]);

  const preparedContent = useMemo(() => blog ? prepareContent(blog.content) : "", [blog]);
  const readingTime = useMemo(
    () => blog ? Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200)) : 0,
    [blog]
  );

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl || window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  const enc = (s: string) => encodeURIComponent(s);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        #blog-detail {
          min-height: 100vh;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        /* ── Hero ─────────────────────────────────────────────────────────── */
        .bd-hero {
          position: relative; width: 100%;
          aspect-ratio: 21 / 9; min-height: 280px; max-height: 520px;
          overflow: hidden; background: #080808;
        }
        .bd-hero-img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
        .bd-hero-grad { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 40%, rgba(6,6,8,0.92) 85%, #060608 100%); }
        .bd-hero-ph { width: 100%; height: 100%; background: linear-gradient(135deg,#0a0a08 0%,#141410 50%,#0c0c0a 100%); display: flex; align-items: center; justify-content: center; }
        .bd-hero-ph-text { font-family: 'Bebas Neue', sans-serif; font-size: clamp(60px,12vw,140px); color: rgba(var(--accent-rgb),0.04); letter-spacing: 0.06em; user-select: none; }
        .bd-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(var(--accent-rgb),.04) 1px,transparent 1px), linear-gradient(90deg,rgba(var(--accent-rgb),.04) 1px,transparent 1px); background-size: 44px 44px; pointer-events: none; }
        .bd-hero-zoom { cursor: zoom-in; }

        /* ── Lightbox ─────────────────────────────────────────────────────── */
        @keyframes bdLbIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        .bd-lightbox { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.95); display:flex; align-items:center; justify-content:center; cursor:pointer; backdrop-filter:blur(6px); }
        .bd-lightbox-img { max-width:90vw; max-height:88vh; object-fit:contain; border-radius:10px; box-shadow:0 24px 80px rgba(0,0,0,.8); cursor:default; animation:bdLbIn .22s ease; display:block; }
        .bd-lightbox-close { position:absolute; top:20px; right:24px; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:#aaa; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s,color .2s; }
        .bd-lightbox-close:hover { background:rgba(255,255,255,.16); color:#fff; }

        /* ── Wrapper ──────────────────────────────────────────────────────── */
        .bd-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px 100px;
          position: relative;
          z-index: 1;
        }

        /* ── Top nav bar ──────────────────────────────────────────────────── */
        .bd-topbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 20px 0 32px; flex-wrap: wrap;
        }
        .bd-back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;
          color: #080808; border: 1px solid var(--accent);
          background: var(--accent);
          padding: 10px 20px; border-radius: 6px;
          cursor: pointer; transition: all .22s;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(var(--accent-rgb),0.3);
        }
        .bd-back-btn:hover {
          filter: brightness(1.12);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(var(--accent-rgb),0.4);
        }
        .bd-back-btn svg { transition: transform .2s; }
        .bd-back-btn:hover svg { transform: translateX(-3px); }

        /* share icons row */
        .bd-share-row {
          display: flex; align-items: center; gap: 6px;
        }
        .bd-share-icon {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #8a8880; cursor: pointer; text-decoration: none;
          transition: background .18s, color .18s, border-color .18s, transform .15s;
          border-radius: 50%;
        }
        .bd-share-icon:hover { background: rgba(var(--accent-rgb),.12); border-color: rgba(var(--accent-rgb),.3); color: var(--accent); transform: translateY(-2px); }
        .bd-share-icon--active { color: var(--accent) !important; background: rgba(var(--accent-rgb),.1) !important; border-color: rgba(var(--accent-rgb),.3) !important; }

        /* ── Content layout ───────────────────────────────────────────────── */
        .bd-content-layout { position: relative; }

        /* ── Article ─────────────────────────────────────────────────────── */
        .bd-article { max-width: 760px; }

        /* Title */
        .bd-title {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(28px, 4vw, 52px);
          font-weight: 700; line-height: 1.12;
          color: #ffffff; margin: 0 0 22px;
          letter-spacing: -.025em;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        /* Meta row */
        .bd-meta-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #d4d0c8; margin-bottom: 18px;
          line-height: 1.6;
        }
        .bd-meta-row svg { flex-shrink: 0; color: var(--accent); }
        .bd-meta-dot { color: #4a4a46; font-size: 16px; line-height: 1; flex-shrink: 0; }
        .bd-meta-cat {
          font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent); padding: 3px 9px;
          background: rgba(var(--accent-rgb),.09); border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px;
        }

        /* Tags */
        .bd-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 28px; }
        .bd-tag {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 5px 11px; background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.18); border-radius: 4px; color: #c0bcb8;
          transition: color .2s, border-color .2s, background .2s;
        }
        .bd-tag:hover { color: var(--accent); border-color: rgba(var(--accent-rgb),.35); background: rgba(var(--accent-rgb),.06); }

        /* Divider */
        .bd-divider {
          width: 100%; height: 1px; margin: 0 0 32px;
          background: linear-gradient(90deg, rgba(var(--accent-rgb),.3) 0%, rgba(255,255,255,.06) 40%, transparent 90%);
        }

        /* Body content */
        .bd-body { font-size: 17px; line-height: 1.9; color: #b8b4ac; }
        .bd-body h1,.bd-body h2,.bd-body h3,.bd-body h4 {
          font-family: 'DM Sans', sans-serif; color: #f0ece4;
          margin: 2.2em 0 .75em; font-weight: 700; line-height: 1.25; letter-spacing: -.01em;
        }
        .bd-body h1 { font-size: 1.9em; }
        .bd-body h2 { font-size: 1.45em; padding-bottom: .5em; border-bottom: 1px solid rgba(255,255,255,.07); }
        .bd-body h3 { font-size: 1.2em; }
        .bd-body h4 { font-size: .95em; text-transform: uppercase; letter-spacing: .08em; color: var(--accent); }
        .bd-body p { margin: 0 0 1.4em; }
        .bd-body strong { color: #e0dcd4; font-weight: 700; }
        .bd-body em { color: #ccc8c0; }
        .bd-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; transition: opacity .2s; }
        .bd-body a:hover { opacity: .75; }
        .bd-body ul,.bd-body ol { padding-left: 1.6em; margin: 0 0 1.4em; }
        .bd-body li { margin-bottom: .5em; }
        .bd-body blockquote {
          border-left: 3px solid rgba(var(--accent-rgb),.5);
          padding: 12px 20px; margin: 1.8em 0;
          background: rgba(var(--accent-rgb),.04); border-radius: 0 6px 6px 0;
          color: #9a9890; font-style: italic;
        }
        .bd-body blockquote p { margin: 0; }
        .bd-body code {
          font-family: 'JetBrains Mono', monospace; font-size: .83em;
          background: rgba(var(--accent-rgb),.08); border: 1px solid rgba(var(--accent-rgb),.14);
          border-radius: 4px; padding: 2px 7px; color: var(--accent);
        }
        .bd-body pre {
          background: #0a0a08; border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px; padding: 22px 24px; overflow-x: auto; margin: 2em 0;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
        }
        .bd-body pre code { background: none; border: none; padding: 0; color: #c8c4bc; font-size: .88em; }
        .bd-body img { max-width: 100%; border-radius: 8px; margin: 2em 0; border: 1px solid rgba(255,255,255,.08); display: block; }
        .bd-body hr { border: none; border-top: 1px solid #1e1e1a; margin: 2.8em 0; }
        .bd-body table { width: 100%; border-collapse: collapse; margin: 2em 0; font-size: .9em; }
        .bd-body th { background: rgba(var(--accent-rgb),.07); border: 1px solid rgba(255,255,255,.08); padding: 10px 14px; text-align: left; color: #e8e4dc; font-weight: 600; }
        .bd-body td { border: 1px solid rgba(255,255,255,.06); padding: 9px 14px; color: #a8a4a0; }
        .bd-body tr:nth-child(even) td { background: rgba(255,255,255,.02); }

        /* ── Related posts ─────────────────────────────────────────────────── */
        .bd-related-section {
          margin-top: 72px; padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,.07);
        }
        .bd-related-label {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: .16em; text-transform: uppercase; color: var(--accent);
          display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
        }
        .bd-related-label::before { content: ''; width: 20px; height: 1px; background: var(--accent); opacity: .6; flex-shrink: 0; }
        .bd-related-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 32px;
          color: #f0ece4; margin: 0 0 24px; letter-spacing: .02em;
        }
        .bd-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }


        /* ── Skeleton ─────────────────────────────────────────────────────── */
        @keyframes bdSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .bd-skel-bar { display:block; border-radius:4px; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:bdSkelShimmer 1.6s ease infinite; }
        .bd-skel-hero { width:100%; aspect-ratio:21/9; min-height:280px; max-height:520px; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:bdSkelShimmer 1.6s ease infinite; }
        .bd-skel-wrap { max-width:1200px; margin:0 auto; padding:0 32px 100px; }
        .bd-skel-article { max-width:760px; }

        /* ── Not found ────────────────────────────────────────────────────── */
        .bd-notfound { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:16px; }
        .bd-notfound-title { font-family:'Bebas Neue',sans-serif; font-size:48px; color:#2a2a28; letter-spacing:.04em; }
        .bd-notfound-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a28; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Responsive ───────────────────────────────────────────────────── */
        @media (max-width: 1023px) {
          .bd-wrap { padding: 0 32px 80px; }
          .bd-skel-wrap { padding: 0 32px 80px; }
        }
        @media (max-width: 767px) {
          .bd-hero { min-height: 200px; max-height: 340px; }
          .bd-skel-hero { min-height: 200px; max-height: 340px; }
          .bd-wrap { padding: 0 20px 70px; }
          .bd-skel-wrap { padding: 0 20px 70px; }
          .bd-body { font-size: 15.5px; line-height: 1.85; }
          .bd-body pre { padding: 16px 18px; }
          .bd-body table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .bd-title { font-size: clamp(20px, 6vw, 32px); margin-bottom: 14px; }
          .bd-topbar { padding: 14px 0 20px; gap: 10px; }
          .bd-share-row { gap: 4px; }
          .bd-meta-row { font-size: 10px; gap: 5px; }
          .bd-related-section { margin-top: 52px; padding-top: 32px; }
          .bd-related-title { font-size: 28px; }
          .bd-related-grid { gap: 14px; }
        }
        @media (max-width: 599px) {
          .bd-hero { min-height: 160px; max-height: 260px; aspect-ratio: 16/9; }
          .bd-skel-hero { min-height: 160px; max-height: 260px; aspect-ratio: 16/9; }
          .bd-wrap { padding: 0 16px 56px; }
          .bd-skel-wrap { padding: 0 16px 56px; }
          .bd-body { font-size: 15px; }
          .bd-body pre { padding: 14px 16px; border-radius: 8px; font-size: .82em; }
          .bd-body blockquote { padding: 10px 16px; }
          .bd-related-grid { grid-template-columns: 1fr; }
          .bd-related-title { font-size: 24px; }
          .bd-share-icon { width: 30px; height: 30px; }
          .bd-back-btn { padding: 9px 16px; font-size: 10px; }
          .bd-topbar { flex-direction: column; align-items: flex-start; }
          .bd-tags { gap: 5px; }
          .bd-tag { font-size: 8px; padding: 3px 8px; }
        }
        @media (max-width: 379px) {
          .bd-wrap { padding: 0 14px 48px; }
          .bd-skel-wrap { padding: 0 14px 48px; }
          .bd-hero { min-height: 130px; }
          .bd-skel-hero { min-height: 130px; }
          .bd-body { font-size: 14.5px; }
          .bd-share-icon { width: 28px; height: 28px; }
          .bd-related-title { font-size: 22px; }
        }
      `}</style>

      <ReadingProgress />

      {/* Lightbox */}
      {lightbox && blog?.thumbnail && (
        <div className="bd-lightbox" onClick={() => setLightbox(false)}>
          <button className="bd-lightbox-close" onClick={e => { e.stopPropagation(); setLightbox(false); }}>✕</button>
          <img src={blog.thumbnail} alt={blog?.title} className="bd-lightbox-img" onClick={e => e.stopPropagation()} />
        </div>
      )}

      <section id="blog-detail">
        {loading ? (
          <DetailSkeleton />
        ) : notFound || !blog ? (
          <div className="bd-notfound">
            <div className="bd-notfound-title">Post Not Found</div>
            <div className="bd-notfound-sub">// This post doesn&apos;t exist or was removed</div>
          </div>
        ) : (
          <>
            {/* ── Hero image ── */}
            <div
              className={`bd-hero${blog.thumbnail ? " bd-hero-zoom" : ""}`}
              onClick={() => blog.thumbnail && setLightbox(true)}
            >
              {blog.thumbnail
                ? <img src={blog.thumbnail} alt={blog.title} className="bd-hero-img" />
                : <><div className="bd-hero-ph"><span className="bd-hero-ph-text">BLOG</span></div><div className="bd-hero-grid" /></>
              }
              {blog.thumbnail && <div className="bd-hero-grad" />}
            </div>

            <div className="bd-wrap">
              {/* ── Top bar: back + share ────────────────────────── */}
              <div className="bd-topbar">
                <button className="bd-back-btn" onClick={() => router.push("/blog")}>
                  <BackIcon /> Back to Blog
                </button>
                <div className="bd-share-row">
                  <a href={`https://x.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(blog.title)}`} target="_blank" rel="noopener noreferrer" className="bd-share-icon" title="Share on X"><XIcon /></a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bd-share-icon" title="Share on Facebook"><FbIcon /></a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${enc(shareUrl)}&title=${enc(blog.title)}`} target="_blank" rel="noopener noreferrer" className="bd-share-icon" title="Share on LinkedIn"><LiIcon /></a>
                  <button onClick={handleCopy} className={`bd-share-icon${copied ? " bd-share-icon--active" : ""}`} title={copied ? "Copied!" : "Copy link"}>
                    {copied ? <CheckIcon /> : <LinkIcon />}
                  </button>
                </div>
              </div>

              {/* ── Article ─────────────────────────────────────── */}
              <div className="bd-content-layout">
                <article className="bd-article" ref={contentRef}>
                  <h1 className="bd-title">{blog.title}</h1>

                  {/* Meta */}
                  <div className="bd-meta-row">
                    <CalIcon size={11} />
                    <span>{fmt(blog.createdAt)}</span>
                    <span className="bd-meta-dot">·</span>
                    <EyeIcon size={11} />
                    <span>{blog.views} views</span>
                    <span className="bd-meta-dot">·</span>
                    <ClockIcon size={11} />
                    <span>{readingTime} min read</span>
                    {blog.category && (
                      <><span className="bd-meta-dot">·</span><span className="bd-meta-cat">{blog.category}</span></>
                    )}
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="bd-tags">
                      {blog.tags.map(t => <span key={t} className="bd-tag">{t}</span>)}
                    </div>
                  )}

                  <div className="bd-divider" />

                  {/* Content */}
                  <div className="bd-body" dangerouslySetInnerHTML={{ __html: preparedContent }} />

                  {/* Image carousel */}
                  {blog.images && blog.images.length > 0 && (
                    <ImageCarousel images={blog.images} title={blog.title} />
                  )}
                </article>
              </div>

              {/* ── Related posts ────────────────────────────────── */}
              {related.length > 0 && (
                <div className="bd-related-section">
                  <div className="bd-related-label">Continue Reading</div>
                  <h2 className="bd-related-title">You Might Also Like</h2>
                  <div className="bd-related-grid">
                    {related.map(r => (
                      <RelatedCard key={r.id} blog={r} onNavigate={rid => router.push(`/blog/${rid}`)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
