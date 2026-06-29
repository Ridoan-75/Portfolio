"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type Blog = {
  id: string; title: string; content: string;
  thumbnail: string | null; tags: string[];
  category: string | null; published: boolean;
  createdAt: string; updatedAt: string; views: number;
};
type TOCItem = { level: number; text: string; idx: number };

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractTOC(html: string): TOCItem[] {
  const re = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const items: TOCItem[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(html)) !== null)
    items.push({ level: parseInt(m[1]), text: m[2].replace(/<[^>]+>/g, "").trim(), idx: i++ });
  return items;
}
function toFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-").slice(0, 38) + ".md";
}
function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const EyeIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const BackArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Related panel card (compact, for right sidebar) ───────────────────────────
function RelatedPanelCard({ blog, onNavigate }: { blog: Blog; onNavigate: (id: string) => void }) {
  return (
    <div className="rp-card" onClick={() => onNavigate(blog.id)}>
      <div className="rp-img-wrap">
        {blog.thumbnail
          ? <img src={blog.thumbnail} alt={blog.title} className="rp-img" />
          : <div className="rp-img-ph"><span className="rp-img-ph-txt">BLOG</span></div>}
      </div>
      <div className="rp-body">
        <h4 className="rp-title">{blog.title}</h4>
        <div className="rp-meta">
          <EyeIcon size={11} />
          <span>{blog.views} views</span>
          <span className="rp-sep">·</span>
          <span>{fmt(blog.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="bd-layout">
      <aside className="bd-sidebar">
        <div className="bd-sb-card">
          <div className="bd-skel-bar" style={{ width: "55%", height: 9, marginBottom: 16 }} />
          {[88, 72, 80, 62, 74].map((w, i) => (
            <div key={i} className="bd-skel-bar" style={{ width: `${w}%`, height: 10, marginBottom: 9 }} />
          ))}
        </div>
      </aside>

      <main className="bd-main">
        {/* share bar skeleton */}
        <div className="bd-skel-bar" style={{ width: "100%", height: 56, borderRadius: 14, marginBottom: 16 }} />
        {/* mac card */}
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="bd-skel-bar" style={{ height: 36, borderRadius: 0 }} />
          <div className="bd-skel-bar" style={{ aspectRatio: "16/9", borderRadius: 0 }} />
          <div style={{ padding: "24px 28px 36px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="bd-skel-bar" style={{ width: "82%", height: 32, marginBottom: 10 }} />
            <div className="bd-skel-bar" style={{ width: "55%", height: 32, marginBottom: 18 }} />
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[80, 70, 86].map((w, i) => <div key={i} className="bd-skel-bar" style={{ width: w, height: 11 }} />)}
            </div>
            <div className="bd-skel-bar" style={{ width: "100%", height: 1, marginBottom: 24 }} />
            {[100, 94, 86, 100, 0, 68, 100, 88, 80, 100].map((w, i) =>
              w === 0 ? <div key={i} style={{ height: 16 }} /> : (
                <div key={i} className="bd-skel-bar" style={{ width: `${w}%`, height: 15, marginBottom: 10 }} />
              )
            )}
          </div>
        </div>
      </main>

      <aside className="bd-related-panel">
        <div className="bd-skel-bar" style={{ width: "55%", height: 9, marginBottom: 8 }} />
        <div className="bd-skel-bar" style={{ width: "75%", height: 18, marginBottom: 20 }} />
        {/* 2-column grid of card skeletons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="bd-skel-bar" style={{ aspectRatio: "16/9", borderRadius: 0 }} />
              <div style={{ padding: "10px 12px" }}>
                <div className="bd-skel-bar" style={{ width: "90%", height: 12, marginBottom: 8 }} />
                <div className="bd-skel-bar" style={{ width: "65%", height: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
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

  const toc      = useMemo(() => blog ? extractTOC(blog.content) : [], [blog]);
  const filename = useMemo(() => blog ? toFilename(blog.title) : "post.md", [blog]);
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
        /* ── Root ─────────────────────────────────────────── */
        #blog-detail { min-height: 100vh; color: #e8e4dc; font-family: 'DM Sans', sans-serif; position: relative; }
        #blog-detail::before {
          content:''; position:fixed; inset:0;
          background-image: linear-gradient(rgba(var(--accent-rgb),.03) 1px,transparent 1px), linear-gradient(90deg,rgba(var(--accent-rgb),.03) 1px,transparent 1px);
          background-size: 44px 44px; pointer-events:none; z-index:0;
        }

        /* ── Three-column layout ──────────────────────────── */
        .bd-layout {
          display: flex; flex-wrap: wrap;
          gap: 28px; padding: 44px 44px 80px;
          align-items: flex-start; position: relative; z-index: 1;
        }

        /* ── TOC sidebar (left) ───────────────────────────── */
        .bd-sidebar {
          width: 200px; flex-shrink: 0;
          position: sticky; top: 28px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .bd-sb-card {
          background: rgba(255,255,255,0.04); -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 16px 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .bd-sb-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:#3a3a36; margin-bottom:13px; }
        .bd-toc-item { font-family:'JetBrains Mono',monospace; font-size:10px; color:#4a4a44; line-height:1.55; padding:3px 0 3px 10px; border-left:2px solid transparent; transition:color .2s,border-color .2s; cursor:default; word-break:break-word; }
        .bd-toc-item:hover { color:var(--accent); border-left-color:rgba(var(--accent-rgb),.45); }
        .bd-toc-h3 { padding-left:18px; font-size:9px; color:#3a3a36; }

        /* ── Main content (center) ────────────────────────── */
        .bd-main { flex:1; min-width: 0; max-width: 700px; }

        /* ── Share bar — glass morphism, top of content ───── */
        .bd-share-glass {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px; padding: 10px 14px;
          margin-bottom: 16px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.22);
        }
        .bd-share-gap { width: 6px; flex-shrink: 0; }
        .bd-icon-btn {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.10);
          color: #5e5e58; cursor: pointer; text-decoration: none;
          transition: background .18s, color .18s, border-color .18s, transform .15s; flex-shrink: 0;
        }
        .bd-icon-btn:hover { background:rgba(var(--accent-rgb),.12); border-color:rgba(var(--accent-rgb),.3); color:var(--accent); transform:translateY(-2px); }
        .bd-icon-btn--back svg { transition: transform .2s; }
        .bd-icon-btn--back:hover svg { transform: translateX(-2px); }
        .bd-icon-btn--active { color:var(--accent) !important; background:rgba(var(--accent-rgb),.10) !important; border-color:rgba(var(--accent-rgb),.32) !important; }

        /* ── Mac window card ──────────────────────────────── */
        .bd-mac-wrap {
          background: rgba(255,255,255,0.04); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.10); border-radius: 12px; overflow: hidden;
          box-shadow: 0 12px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .bd-mac-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 14px; background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .bd-mac-dots { display: flex; align-items: center; gap: 7px; }
        .bd-mac-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .bd-mac-dot--red    { background: #FF5F57; box-shadow: 0 0 0 1px rgba(255,95,87,0.3); }
        .bd-mac-dot--yellow { background: #FFBD2E; box-shadow: 0 0 0 1px rgba(255,189,46,0.3); }
        .bd-mac-dot--green  { background: #28C840; box-shadow: 0 0 0 1px rgba(40,200,64,0.3); }
        .bd-mac-filename { font-family:'JetBrains Mono',monospace; font-size:11px; color:#3a3a36; letter-spacing:.05em; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        .bd-mac-img-wrap { width:100%; aspect-ratio:16/9; overflow:hidden; background:#0c0c0a; }
        .bd-mac-img-wrap--zoom { cursor:zoom-in; }
        .bd-mac-img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; transition:transform .5s ease; }
        .bd-mac-img-wrap--zoom:hover .bd-mac-img { transform:scale(1.03); }
        .bd-mac-img-ph { width:100%; height:100%; background:linear-gradient(135deg,#0c0c0a 0%,#1a1a16 50%,#0f0f0d 100%); display:flex; align-items:center; justify-content:center; }
        .bd-mac-img-ph-text { font-family:'Bebas Neue',sans-serif; font-size:64px; color:rgba(var(--accent-rgb),.06); letter-spacing:.06em; user-select:none; }

        /* Card body */
        .bd-mac-body { padding: 24px 28px 36px; border-top: 1px solid rgba(255,255,255,0.07); }
        .bd-title { font-family:'DM Sans',sans-serif; font-size:clamp(20px,2.8vw,36px); font-weight:700; line-height:1.22; color:#f0ece4; margin:0 0 14px; letter-spacing:-.01em; }

        .bd-meta-chips { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-family:'JetBrains Mono',monospace; font-size:11px; color:#4a4a44; }
        .bd-meta-chips svg { color:#3a3a36; flex-shrink:0; }
        .bd-meta-bullet { color:#2a2a28; font-size:15px; line-height:1; flex-shrink:0; }
        .bd-meta-cat { font-size:9px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); padding:2px 8px; background:rgba(var(--accent-rgb),.08); border:1px solid rgba(var(--accent-rgb),.18); border-radius:3px; }

        .bd-tags-row { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
        .bd-tag-chip { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; text-transform:uppercase; padding:3px 8px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09); border-radius:4px; color:#5a5a54; }

        .bd-card-divider { width:100%; height:1px; margin:24px 0; background:linear-gradient(90deg,rgba(var(--accent-rgb),.25) 0%,rgba(255,255,255,.06) 50%,transparent 90%); }

        /* ── Content body ─────────────────────────────────── */
        .bd-body { font-size:16px; line-height:1.85; color:#aaa9a3; }
        .bd-body h1,.bd-body h2,.bd-body h3,.bd-body h4 { font-family:'DM Sans',sans-serif; color:#e8e4dc; margin:2em 0 .75em; font-weight:700; line-height:1.3; letter-spacing:-.01em; }
        .bd-body h1 { font-size:1.85em; }
        .bd-body h2 { font-size:1.4em; border-bottom:1px solid rgba(255,255,255,.06); padding-bottom:.4em; }
        .bd-body h3 { font-size:1.18em; }
        .bd-body h4 { font-size:.95em; text-transform:uppercase; letter-spacing:.07em; color:var(--accent); }
        .bd-body p { margin:0 0 1.3em; }
        .bd-body strong { color:#e0dcd4; font-weight:600; }
        .bd-body em { color:#c8c4bc; }
        .bd-body a { color:var(--accent); text-decoration:underline; text-underline-offset:3px; transition:opacity .2s; }
        .bd-body a:hover { opacity:.75; }
        .bd-body ul,.bd-body ol { padding-left:1.6em; margin:0 0 1.3em; }
        .bd-body li { margin-bottom:.45em; }
        .bd-body blockquote { border-left:2px solid rgba(var(--accent-rgb),.5); padding:4px 18px; margin:1.5em 0; color:#888480; font-style:italic; }
        .bd-body blockquote p { margin:0; }
        .bd-body code { font-family:'JetBrains Mono',monospace; font-size:.84em; background:rgba(var(--accent-rgb),.08); border:1px solid rgba(var(--accent-rgb),.15); border-radius:4px; padding:2px 7px; color:var(--accent); }
        .bd-body pre { background:#0c0c0a; border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:20px 22px; overflow-x:auto; margin:1.8em 0; }
        .bd-body pre code { background:none; border:none; padding:0; color:#c8c4bc; font-size:.88em; }
        .bd-body img { max-width:100%; border-radius:8px; margin:1.8em 0; border:1px solid rgba(255,255,255,.08); display:block; }
        .bd-body hr { border:none; border-top:1px solid #1c1c1a; margin:2.5em 0; }
        .bd-body table { width:100%; border-collapse:collapse; margin:1.8em 0; font-size:.9em; }
        .bd-body th { background:rgba(var(--accent-rgb),.08); border:1px solid rgba(255,255,255,.08); padding:10px 14px; text-align:left; color:#e8e4dc; font-weight:600; }
        .bd-body td { border:1px solid rgba(255,255,255,.06); padding:9px 14px; color:#aaa9a3; }
        .bd-body tr:nth-child(even) td { background:rgba(255,255,255,.02); }

        /* ── Related panel (right 2-col, becomes bottom on tablet/mobile) */
        .bd-related-panel {
          width: 460px; flex-shrink: 0;
          position: sticky; top: 28px; align-self: flex-start;
        }
        .bd-rp-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .bd-rp-label::before { content:''; width:16px; height:1px; background:var(--accent); opacity:.6; flex-shrink:0; }
        .bd-rp-title { font-family:'DM Sans',sans-serif; font-size:17px; font-weight:700; color:#f0ece4; margin:0 0 16px; letter-spacing:-.01em; }
        .bd-rp-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }

        .rp-card {
          background:rgba(255,255,255,.04); -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,.09); border-radius:10px; overflow:hidden;
          cursor:pointer; transition:border-color .2s,transform .2s;
        }
        .rp-card:hover { border-color:rgba(var(--accent-rgb),.28); transform:translateY(-3px); }
        .rp-img-wrap { aspect-ratio:16/9; overflow:hidden; background:#0e0e0c; }
        .rp-img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; transition:transform .35s ease; }
        .rp-card:hover .rp-img { transform:scale(1.05); }
        .rp-img-ph { width:100%; height:100%; background:linear-gradient(135deg,#0c0c0a,#1a1a16); display:flex; align-items:center; justify-content:center; }
        .rp-img-ph-txt { font-family:'Bebas Neue',sans-serif; font-size:28px; color:rgba(var(--accent-rgb),.08); user-select:none; }
        .rp-body { padding:10px 12px 12px; }
        .rp-title { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#dedad2; line-height:1.4; margin:0 0 6px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .rp-meta { display:flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#3a3a36; flex-wrap:wrap; }
        .rp-meta svg { color:#2e2e2c; }
        .rp-sep { color:#2a2a28; }

        /* ── Lightbox ─────────────────────────────────────── */
        @keyframes bdLbIn { from{opacity:0} to{opacity:1} }
        .bd-lightbox { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.93); display:flex; align-items:center; justify-content:center; cursor:pointer; animation:bdLbIn .18s ease; }
        .bd-lightbox-img { max-width:90vw; max-height:88vh; object-fit:contain; border-radius:10px; box-shadow:0 24px 80px rgba(0,0,0,.8); cursor:default; animation:bdLbIn .22s ease; display:block; }
        .bd-lightbox-close { position:absolute; top:20px; right:24px; width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.14); color:#aaa; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .2s,color .2s; }
        .bd-lightbox-close:hover { background:rgba(255,255,255,.16); color:#fff; }

        /* ── Skeleton shimmer ─────────────────────────────── */
        @keyframes bdSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .bd-skel-bar { display:block; border-radius:4px; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:bdSkelShimmer 1.6s ease infinite; }

        /* ── Not found ────────────────────────────────────── */
        .bd-notfound { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:16px; position:relative; z-index:1; }
        .bd-notfound-title { font-family:'Bebas Neue',sans-serif; font-size:48px; color:#2a2a28; letter-spacing:.04em; }
        .bd-notfound-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a28; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Responsive ───────────────────────────────────── */
        /* Hide TOC sidebar below 1100px, related panel drops below */
        @media (max-width: 1100px) {
          .bd-sidebar { display: none; }
          .bd-layout { padding: 36px 32px 72px; }
          .bd-related-panel {
            width: 100%; position: static; order: 99;
            padding-top: 32px; border-top: 1px solid rgba(255,255,255,.06);
          }
          .bd-rp-cards { grid-template-columns: repeat(auto-fill, 280px); gap: 16px; }
        }
        @media (max-width: 767px) {
          .bd-layout { padding: 28px 20px 60px; }
          .bd-body { font-size: 15.5px; }
          .bd-rp-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 599px) {
          .bd-layout { padding: 20px 16px 52px; }
          .bd-body { font-size: 15px; }
          .bd-mac-body { padding: 18px 18px 28px; }
          .bd-rp-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Lightbox */}
      {lightbox && blog?.thumbnail && (
        <div className="bd-lightbox" onClick={() => setLightbox(false)}>
          <button className="bd-lightbox-close" onClick={e => { e.stopPropagation(); setLightbox(false); }}>
            <CloseIcon />
          </button>
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
          <div className="bd-layout">

            {/* ── TOC sidebar ─────────────────────────────── */}
            {toc.length > 0 && (
              <aside className="bd-sidebar">
                <div className="bd-sb-card">
                  <div className="bd-sb-label">On this page</div>
                  {toc.map(item => (
                    <div key={item.idx} className={`bd-toc-item${item.level === 3 ? " bd-toc-h3" : ""}`}>
                      {item.text}
                    </div>
                  ))}
                </div>
              </aside>
            )}

            {/* ── Main content ─────────────────────────────── */}
            <main className="bd-main">
              {/* Share bar — glass morphism, very top */}
              <div className="bd-share-glass">
                <button className="bd-icon-btn bd-icon-btn--back" onClick={() => router.push("/blog")} title="Back to Blog">
                  <BackArrowIcon />
                </button>
                <span className="bd-share-gap" />
                <a href={`https://x.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(blog.title)}`} target="_blank" rel="noopener noreferrer" className="bd-icon-btn" title="Share on X"><XIcon /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="bd-icon-btn" title="Share on Facebook"><FacebookIcon /></a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${enc(shareUrl)}&title=${enc(blog.title)}`} target="_blank" rel="noopener noreferrer" className="bd-icon-btn" title="Share on LinkedIn"><LinkedInIcon /></a>
                <a href={`mailto:?subject=${enc(blog.title)}&body=${enc(shareUrl)}`} className="bd-icon-btn" title="Share via Email"><EmailIcon /></a>
                <button onClick={handleCopy} className={`bd-icon-btn${copied ? " bd-icon-btn--active" : ""}`} title={copied ? "Copied!" : "Copy link"}>
                  {copied ? <CheckIcon /> : <LinkIcon />}
                </button>
              </div>

              {/* Single glass card — image + all content */}
              <div className="bd-mac-wrap">
                <div className="bd-mac-bar">
                  <div className="bd-mac-dots">
                    <span className="bd-mac-dot bd-mac-dot--red" />
                    <span className="bd-mac-dot bd-mac-dot--yellow" />
                    <span className="bd-mac-dot bd-mac-dot--green" />
                  </div>
                  <span className="bd-mac-filename">{filename}</span>
                </div>

                <div
                  className={`bd-mac-img-wrap${blog.thumbnail ? " bd-mac-img-wrap--zoom" : ""}`}
                  onClick={() => blog.thumbnail && setLightbox(true)}
                >
                  {blog.thumbnail
                    ? <img src={blog.thumbnail} alt={blog.title} className="bd-mac-img" />
                    : <div className="bd-mac-img-ph"><span className="bd-mac-img-ph-text">BLOG</span></div>}
                </div>

                <div className="bd-mac-body">
                  <h1 className="bd-title">{blog.title}</h1>

                  <div className="bd-meta-chips">
                    <span>{fmt(blog.createdAt)}</span>
                    <span className="bd-meta-bullet">·</span>
                    <EyeIcon /><span>{blog.views} views</span>
                    <span className="bd-meta-bullet">·</span>
                    <ClockIcon /><span>{readingTime} min read</span>
                    {blog.category && (
                      <><span className="bd-meta-bullet">·</span><span className="bd-meta-cat">{blog.category}</span></>
                    )}
                  </div>

                  {blog.tags.length > 0 && (
                    <div className="bd-tags-row">
                      {blog.tags.map(t => <span key={t} className="bd-tag-chip">{t}</span>)}
                    </div>
                  )}

                  <div className="bd-card-divider" />
                  <div className="bd-body" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
              </div>
            </main>

            {/* ── Related panel — right on desktop, below on tablet/mobile */}
            {related.length > 0 && (
              <aside className="bd-related-panel">
                <div className="bd-rp-label">Continue Reading</div>
                <h3 className="bd-rp-title">You Might Also Like</h3>
                <div className="bd-rp-cards">
                  {related.map(r => (
                    <RelatedPanelCard key={r.id} blog={r} onNavigate={rid => router.push(`/blog/${rid}`)} />
                  ))}
                </div>
              </aside>
            )}

          </div>
        )}
      </section>
    </>
  );
}
