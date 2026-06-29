"use client";

import { useEffect, useRef, useState } from "react";
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

function BlogCardSkeleton() {
  return (
    <div className="bl-card bl-card--skeleton">
      <div className="bl-skel-img" />
      <div className="bl-card-body">
        <div className="bl-skel-bar" style={{ width: "85%", height: "17px" }} />
        <div className="bl-skel-bar" style={{ width: "60%", height: "17px", marginTop: "6px" }} />
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
          <div className="bl-skel-bar" style={{ width: "48px", height: "22px", borderRadius: "5px" }} />
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog, onNavigate }: { blog: Blog; onNavigate: (id: string) => void }) {
  const plainText = blog.content.replace(/<[^>]+>/g, "");

  return (
    <article className="bl-card" onClick={() => onNavigate(blog.id)}>
      {/* 16:9 thumbnail with title overlay */}
      <div className="bl-card-img-wrap">
        {blog.thumbnail ? (
          <img src={blog.thumbnail} alt={blog.title} className="bl-card-img" />
        ) : (
          <div className="bl-card-img-ph">
            <span className="bl-card-img-ph-text">BLOG</span>
          </div>
        )}
        <div className="bl-img-overlay">
          <h3 className="bl-img-title">{blog.title}</h3>
        </div>
      </div>

      {/* Card body */}
      <div className="bl-card-body">
        <h2 className="bl-card-title">{blog.title}</h2>

        <div className="bl-card-meta-row">
          <span className="bl-card-date">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "numeric",
            })}
          </span>
          <div className="bl-views-chip">
            <EyeIcon size={12} />
            <span>{blog.views ?? 0} views</span>
          </div>
        </div>

        <p className="bl-card-excerpt">{plainText}</p>

        <div className="bl-card-footer">
          <span
            className="bl-read-link"
            onClick={(e) => { e.stopPropagation(); onNavigate(blog.id); }}
          >
            Read Full Blog
          </span>
          <span className="bl-blog-badge">BLOG</span>
        </div>
      </div>
    </article>
  );
}

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
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setFetching(false);
      })
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

  useEffect(() => {
    if (blogs.length === 0) return;
    gsap.fromTo(".bl-card:not(.bl-card--skeleton)", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".bl-grid", start: "top 85%", once: true },
    });
  }, [blogs, activeCategory, page]);

  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? blogs : blogs.filter((b) => b.category === activeCategory);
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleNavigate = (id: string) => router.push(`/blog/${id}`);

  return (
    <>
      <style>{`
        #blog {
          padding: 80px 60px 80px;
          min-height: 100vh;
          color: #e8e4dc;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        #blog::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px; pointer-events: none; z-index: 0;
        }
        .bl-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        /* Header */
        .bl-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px; width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .bl-status-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
          box-shadow: 0 0 6px var(--accent); animation: blBlink 2s ease infinite;
        }
        @keyframes blBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .bl-status-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }

        .bl-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .bl-heading .h-accent { color: var(--accent); }
        .bl-role-line {
          font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing:.08em;
          text-transform: uppercase; color: #6a6a60; margin-bottom: 40px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap; opacity: 0;
        }
        .bl-role-line::before { content: ''; width: 28px; height: 1px; background: var(--accent); flex-shrink: 0; }

        /* Category tabs */
        .bl-categories {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; align-items: center;
        }
        .bl-cat-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: 0.1em; text-transform: uppercase; color: #3a3a36; margin-right: 4px; flex-shrink: 0;
        }
        .bl-cat-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.07em; text-transform: uppercase;
          padding: 8px 18px; border-radius: 6px; cursor: pointer;
          border: 1px solid #1c1c1a; background: transparent; color: #4a4a44;
          transition: all 0.2s;
        }
        .bl-cat-btn:hover { border-color: rgba(var(--accent-rgb),0.35); color: var(--accent); background: rgba(var(--accent-rgb),0.05); }
        .bl-cat-btn.active { background: rgba(var(--accent-rgb),0.12); border-color: rgba(var(--accent-rgb),0.45); color: var(--accent); box-shadow: 0 0 12px rgba(var(--accent-rgb),0.1); }
        .bl-cat-count { display: inline-flex; align-items: center; justify-content: center; background: rgba(var(--accent-rgb),0.15); border-radius: 4px; padding: 1px 6px; font-size: 9px; margin-left: 6px; color: var(--accent); font-weight: 700; }

        /* Grid — fixed card width, wraps naturally */
        .bl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, 313px);
          gap: 20px;
          justify-content: center;
        }

        /* Card — glass morphism */
        .bl-card {
          background: rgba(255,255,255,0.04);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.35);
          border-radius: 14px; overflow: hidden;
          cursor: pointer;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          opacity: 0;
          display: flex; flex-direction: column;
          min-width: 0;
        }
        .bl-card:hover {
          border-color: rgba(var(--accent-rgb),0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 48px rgba(0,0,0,0.5), 0 0 32px rgba(var(--accent-rgb),0.08);
          transform: translateY(-6px);
        }

        /* 16:9 thumbnail */
        .bl-card-img-wrap {
          position: relative;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0e0e0c;
          flex-shrink: 0;
        }
        .bl-card-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center;
          transition: transform 0.4s ease;
          display: block;
        }
        .bl-card:hover .bl-card-img { transform: scale(1.05); }
        .bl-card-img-ph {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #0c0c0a 0%, #1a1a16 50%, #0f0f0d 100%);
          display: flex; align-items: center; justify-content: center;
        }
        .bl-card-img-ph-text {
          font-family: 'Bebas Neue', sans-serif; font-size: 48px;
          color: rgba(var(--accent-rgb),0.07); letter-spacing: 0.06em;
          user-select: none;
        }

        /* Title overlay on image */
        .bl-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.0) 100%);
          display: flex; align-items: flex-end;
          padding: 14px 16px;
          min-width: 0;
        }
        .bl-img-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #fff; line-height: 1.35;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
          margin: 0; min-width: 0; width: 100%;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        /* Card body */
        .bl-card-body {
          padding: 16px 18px 18px;
          display: flex; flex-direction: column; gap: 10px;
          flex: 1; min-width: 0;
        }

        .bl-card-title {
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: #e8e4dc; line-height: 1.45;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .bl-card-meta-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; flex-wrap: wrap;
        }
        .bl-card-date {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #3a3a36; letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .bl-views-chip {
          display: flex; align-items: center; gap: 4px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #4a4a44; letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .bl-views-chip svg { color: #3a3a36; flex-shrink: 0; }

        .bl-card-excerpt {
          font-size: 13px; color: #5a5a54; line-height: 1.7;
          margin: 0; flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }

        .bl-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
          margin-top: auto; padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .bl-read-link {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: var(--accent); letter-spacing: 0.07em; text-transform: uppercase;
          text-decoration: underline; text-underline-offset: 3px;
          transition: opacity 0.2s; white-space: nowrap;
        }
        .bl-card:hover .bl-read-link { opacity: 0.75; }
        .bl-blog-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(var(--accent-rgb), 0.09);
          border: 1px solid rgba(var(--accent-rgb), 0.22);
          border-radius: 5px; color: var(--accent);
          white-space: nowrap; flex-shrink: 0;
        }

        /* Skeleton */
        .bl-card--skeleton {
          cursor: default; pointer-events: none; opacity: 1 !important;
        }
        .bl-card--skeleton:hover { transform: none; border-color: rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.35); }
        @keyframes blSkelShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .bl-skel-img {
          aspect-ratio: 16 / 9; width: 100%;
          background: linear-gradient(90deg, #181816 25%, #222220 50%, #181816 75%);
          background-size: 200% 100%;
          animation: blSkelShimmer 1.6s ease infinite;
        }
        .bl-skel-bar {
          border-radius: 4px;
          background: linear-gradient(90deg, #181816 25%, #222220 50%, #181816 75%);
          background-size: 200% 100%;
          animation: blSkelShimmer 1.6s ease infinite;
        }
        .bl-skel-meta-row {
          display: flex; align-items: center; justify-content: space-between;
          margin: 4px 0;
        }
        .bl-skel-footer-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: auto; padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* Pagination */
        .bl-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-top: 52px; flex-wrap: wrap;
        }
        .bl-page-btn {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 0.07em; padding: 9px 16px;
          border-radius: 6px; cursor: pointer;
          border: 1px solid #1c1c1a; background: transparent; color: #4a4a44;
          transition: all 0.2s; min-width: 40px; text-align: center;
        }
        .bl-page-btn:hover:not(:disabled) { border-color: rgba(var(--accent-rgb),0.35); color: var(--accent); background: rgba(var(--accent-rgb),0.05); }
        .bl-page-btn.active { background: rgba(var(--accent-rgb),0.12); border-color: rgba(var(--accent-rgb),0.45); color: var(--accent); }
        .bl-page-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .bl-page-info {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: #3a3a36; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 0 8px;
        }

        /* Empty state */
        .bl-empty { text-align: center; padding: 80px 20px; grid-column: 1 / -1; }
        .bl-empty-title { font-family: 'Bebas Neue', sans-serif; font-size: 36px; color: #2a2a28; letter-spacing: 0.04em; margin-bottom: 8px; }
        .bl-empty-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #2a2a28; letter-spacing: 0.08em; text-transform: uppercase; }

        @media (max-width: 1024px) {
          #blog { padding: 80px 40px 80px; }
        }
        @media (max-width: 767px) {
          #blog { padding: 80px 24px 80px; padding-top: 100px; }
          .bl-heading { font-size: clamp(52px, 14vw, 80px); }
        }
        @media (max-width: 599px) {
          #blog { padding: 50px 18px 80px; padding-top: 90px; }
          .bl-heading { font-size: clamp(44px, 16vw, 64px); }
        }
        @media (max-width: 400px) {
          #blog { padding: 50px 14px 60px; padding-top: 86px; }
        }
      `}</style>

      <section id="blog">
        <div className="bl-inner">
          {/* Heading */}
          <div ref={headingRef}>
            <div className="bl-status-tag">
              <span className="bl-status-dot" />
              <span className="bl-status-text">Writing & Thoughts</span>
            </div>
            <h1 className="bl-heading">
              The <span className="h-accent">B</span>log
            </h1>
            <div className="bl-role-line">Dev notes, tutorials, and random thoughts</div>
          </div>

          {/* Category tabs */}
          {!fetching && categories.length > 1 && (
            <div className="bl-categories">
              <span className="bl-cat-label">Browse //</span>
              {categories.map((cat) => {
                const count = cat === "All" ? blogs.length : blogs.filter((b) => b.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`bl-cat-btn${activeCategory === cat ? " active" : ""}`}
                  >
                    {cat}
                    <span className="bl-cat-count">{count}</span>
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
              paginated.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onNavigate={handleNavigate} />
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bl-pagination">
              <button
                className="bl-page-btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>

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
                    <button
                      key={item}
                      className={`bl-page-btn${page === item ? " active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                className="bl-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
