"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const latestBlogs = [
  {
    title: "Commit Message Style Guide",
    date: "Jan 23, 2026",
    author: "Ridwan Halim",
    tags: ["commit-style", "conventional-commits", "developer-experience"],
    excerpt:
      "A practical guide to writing expressive and consistent commit messages using emojis, types, scopes, and summaries.",
  },
  {
    title: "How Usage Monitoring Sustains MLBB and API-PDDIKTI",
    date: "Jul 9, 2025",
    author: "Ridwan Halim",
    tags: ["threshold-system", "manual-control", "api-sustainability"],
    excerpt:
      "Two open APIs remain online through a robust threshold system and manual code-based controls, ensuring sustainable uptime.",
  },
  {
    title: "Project Priority: Workflows & Focus",
    date: "Jun 17, 2025",
    author: "Ridwan Halim",
    tags: ["project-management", "time-management", "focus"],
    excerpt:
      "Learn how to prioritize your work based on urgency, complexity, and impact to stay focused and move faster.",
  },
];

const tools = [
  "MongoDB",
  "CSS",
  "Gemini",
  "Scikit-learn",
  "Vuexy",
  "n8n",
  "Redis",
  "Material-UI",
  "Flask-Mail",
  "OpenCV",
  "Shadcn UI",
  "Bulma",
  "GitHub",
];

export default function HomeHero() {
  const router = useRouter();

  useEffect(() => {
    gsap.fromTo(
      ".home-hero-copy",
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".home-hero-actions",
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.18, ease: "power3.out" }
    );
    gsap.fromTo(
      ".home-blog-card",
      { y: 38, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, delay: 0.28, ease: "power3.out" }
    );
  }, []);

  const handleNav = useCallback(
    (href: string, external = false) => {
      if (external) {
        window.open(href, "_blank", "noreferrer");
      } else {
        router.push(href);
      }
    },
    [router]
  );

  return (
    <section id="home">
      <style>{`
        #home {
          min-height: 100vh;
          padding: 64px 64px 80px;
          color: #e8e4dc;
          position: relative;
          overflow: hidden;
          background: #080808;
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

        .home-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        .home-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 32px;
          align-items: center;
          width: 919px;
          height: 297px;
          max-width: 100%;
          min-height: 297px;
          margin: 0 auto;
          overflow: hidden;
          padding: 28px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
          backdrop-filter: blur(20px);
        }

        .home-hero-copy {
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .home-hero-right {
          position: relative;
          min-height: 100%;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
        }

        .home-hero-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),0.06) 1px, transparent 1px);
          background-size: 44px 44px;
          opacity: 0.35;
          pointer-events: none;
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
          text-shadow: 0 0 10px rgba(var(--accent-rgb),0.18);
        }

        .home-eyebrow::before {
          content: '';
          width: 24px;
          height: 1px;
          background: rgba(var(--accent-rgb),0.45);
          display: inline-block;
        }

        .home-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 8vw, 88px);
          line-height: 0.9;
          color: #ffffff;
          letter-spacing: -0.03em;
        }

        .home-title .h-accent {
          color: var(--accent);
        }

        .home-description {
          max-width: 680px;
          font-size: 16px;
          line-height: 1.9;
          color: #c8c5b9;
          letter-spacing: 0.01em;
        }

        .home-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .home-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 22px;
          border-radius: 999px;
          border: 1px solid transparent;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
          text-decoration: none;
        }

        .home-btn:hover {
          transform: translateY(-1px);
        }

        .home-btn-primary {
          background: var(--accent);
          color: #080808;
        }

        .home-btn-secondary {
          background: rgba(255,255,255,0.05);
          color: #e8e4dc;
          border-color: rgba(255,255,255,0.12);
        }

        .home-btn-ghost {
          background: transparent;
          color: #e8e4dc;
          border-color: rgba(255,255,255,0.15);
        }

        .home-panel {
          display: grid;
          gap: 20px;
          width: 919px;
          max-width: 100%;
          margin: 0 auto;
        }

        .home-panel-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(18px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 48px rgba(0,0,0,0.35);
        }

        .home-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        .home-panel-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          color: #f0ece4;
          line-height: 1;
        }

        .home-panel-link {
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .home-blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .home-blog-card {
          background: rgba(10,10,10,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .home-blog-card:hover {
          transform: translateY(-4px);
          border-color: rgba(var(--accent-rgb), 0.25);
          box-shadow: 0 22px 50px rgba(0,0,0,0.4);
        }

        .home-blog-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .home-blog-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b0b09a;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 8px 12px;
          border-radius: 999px;
        }

        .home-blog-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #f0ece4;
          margin: 0;
          line-height: 1.05;
        }

        .home-blog-meta {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #7a7a70;
        }

        .home-blog-excerpt {
          color: #c8c5b9;
          line-height: 1.8;
          flex: 1;
          margin: 0;
        }

        .home-blog-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .home-blog-action {
          color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        }

        .home-tools {
          display: grid;
          gap: 20px;
        }

        .home-tools-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(128px, 1fr));
          gap: 12px;
        }

        .home-tool-chip {
          border-radius: 999px;
          padding: 12px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #d3d0bf;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
        }

        @media (max-width: 1024px) {
          .home-hero {
            grid-template-columns: 1fr;
            width: 100%;
            height: auto;
            min-height: auto;
            padding: 24px;
          }
          .home-panel {
            width: 100%;
          }
          .home-blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          #home {
            padding: 50px 24px 48px;
          }
          .home-title {
            font-size: clamp(48px, 11vw, 72px);
          }
          .home-hero-actions {
            justify-content: flex-start;
          }
          .home-blog-grid {
            grid-template-columns: 1fr;
          }
          .home-panel-card {
            padding: 24px;
          }
          .home-tools-list {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }

        @media (max-width: 520px) {
          .home-hero {
            gap: 24px;
          }
          .home-panel-head {
            flex-direction: column;
            align-items: flex-start;
          }
          .home-panel-link {
            margin-top: 12px;
          }
        }
      `}</style>

      <div className="home-inner">
        <div className="home-hero">
          <div className="home-hero-copy">
            <span className="home-eyebrow">Full Stack Developer & AI/ML Engineer</span>
            <h1 className="home-title">
              Hi, I'm <span className="h-accent">Ridwan</span>
            </h1>
            <p className="home-description">
              I explore through code, share with empathy, and reflect on every challenge. My work weaves machine learning, web creation, and open source. I thrive on collaborating with teams to develop AI and web solutions that blend function with clarity.
            </p>
            <div className="home-hero-actions">
              <button className="home-btn home-btn-primary" onClick={() => handleNav("/about")}>About</button>
              <button className="home-btn home-btn-secondary" onClick={() => handleNav("/contact")}>Contact</button>
              <button className="home-btn home-btn-ghost" onClick={() => handleNav("https://github.com/Ridoan-75", true)}>
                Support
              </button>
            </div>
          </div>

          <div className="home-panel">
            <div className="home-panel-card">
              <div className="home-panel-head">
                <span className="home-panel-title">Latest Blogs</span>
                <button
                  type="button"
                  className="home-panel-link"
                  onClick={() => handleNav("/blog")}
                >
                  View All →
                </button>
              </div>
              <div className="home-blog-grid">
                {latestBlogs.map((blog) => (
                  <article key={blog.title} className="home-blog-card" onClick={() => handleNav("/blog")}
                    aria-label={`Read ${blog.title}`}>
                    <div className="home-blog-tags">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="home-blog-tag">#{tag}</span>
                      ))}
                    </div>
                    <h2 className="home-blog-title">{blog.title}</h2>
                    <div className="home-blog-meta">
                      <span>{blog.date}</span>
                      <span>{blog.author}</span>
                    </div>
                    <p className="home-blog-excerpt">{blog.excerpt}</p>
                    <div className="home-blog-footer">
                      <span className="home-blog-action">Read Now</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="home-panel-card home-tools">
              <div className="home-panel-head">
                <span className="home-panel-title">Tools I&apos;ve Used</span>
              </div>
              <div className="home-tools-list">
                {tools.map((tool) => (
                  <div key={tool} className="home-tool-chip">{tool}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
