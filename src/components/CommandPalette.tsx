"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Home, Cpu, User, FolderOpen, BookOpen,
  Mail, Search, FileText, Layers, Star,
} from "lucide-react";

type ItemType = "page" | "project" | "blog" | "skill";

interface SearchItem {
  id: string;
  label: string;
  href: string;
  desc: string;
  type: ItemType;
  icon: React.ElementType;
  tag?: string;
}

const PAGES: SearchItem[] = [
  { id: "home",     label: "Home",     href: "/",        icon: Home,       desc: "Back to home",                                   type: "page" },
  { id: "about",    label: "About",    href: "/about",   icon: User,       desc: "Intro, experience, education & certs",           type: "page" },
  { id: "skills",   label: "Skills",   href: "/skills",  icon: Cpu,        desc: "Tech stack & proficiency",                       type: "page" },
  { id: "projects", label: "Projects", href: "/projects",icon: FolderOpen, desc: "Portfolio projects",                             type: "page" },
  { id: "blog",     label: "Blog",     href: "/blog",    icon: BookOpen,   desc: "Articles & thoughts",                           type: "page" },
  { id: "contact",  label: "Contact",  href: "/contact", icon: Mail,       desc: "Get in touch",                                  type: "page" },
];

const TYPE_LABELS: Record<ItemType, string> = {
  page: "PAGE",
  project: "PROJECT",
  blog: "BLOG",
  skill: "SKILL",
};

export default function CommandPalette() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState(0);
  const [allItems, setAllItems] = useState<SearchItem[]>(PAGES);
  const [loading, setLoading]   = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const router    = useRouter();

  const filtered = allItems.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase()) ||
      (p.tag ?? "").toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase())
  );

  const openPalette = useCallback(() => {
    setQuery(""); setSelected(0); setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        y: -14, opacity: 0, scale: 0.97, duration: 0.22, ease: "power2.in",
        onComplete: () => setOpen(false),
      });
    } else { setOpen(false); }
  }, []);

  const navigate = useCallback((item: SearchItem) => {
    closePalette();
    setTimeout(() => router.push(item.href), 220);
  }, [closePalette, router]);

  // Fetch content when palette opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);

    const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "").trim().slice(0, 80);

    Promise.all([
      fetch("/api/project").then(r => r.json()).catch(() => []),
      fetch("/api/blog").then(r => r.json()).catch(() => []),
      fetch("/api/skills").then(r => r.json()).catch(() => []),
    ]).then(([projects, blogs, skills]) => {
      const projectItems: SearchItem[] = (Array.isArray(projects) ? projects : []).map((p: { id: string; title: string; description?: string; tags?: string[]; category?: string }) => ({
        id: `project-${p.id}`,
        label: p.title,
        href: "/projects",
        desc: stripHtml(p.description ?? "") || (p.tags ?? []).slice(0, 4).join(" · ") || "Project",
        type: "project" as ItemType,
        icon: FolderOpen,
        tag: p.category ?? undefined,
      }));

      const blogItems: SearchItem[] = (Array.isArray(blogs) ? blogs : []).map((b: { id: string; title: string; content?: string; category?: string; tags?: string[] }) => ({
        id: `blog-${b.id}`,
        label: b.title,
        href: `/blog/${b.id}`,
        desc: stripHtml(b.content ?? "") || (b.tags ?? []).slice(0, 3).join(", ") || "Article",
        type: "blog" as ItemType,
        icon: FileText,
        tag: b.category ?? undefined,
      }));

      const skillItems: SearchItem[] = (Array.isArray(skills) ? skills : []).map((s: { id: string; name: string; category?: string }) => ({
        id: `skill-${s.id}`,
        label: s.name,
        href: "/skills",
        desc: s.category ?? "Skill",
        type: "skill" as ItemType,
        icon: Star,
        tag: s.category ?? undefined,
      }));

      setAllItems([...PAGES, ...projectItems, ...blogItems, ...skillItems]);
      setLoading(false);
    });
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        open ? closePalette() : openPalette();
      }
      if (e.key === "Escape" && open) closePalette();
    };
    const onOpen = () => openPalette();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, [open, openPalette, closePalette]);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { y: -18, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }
      );
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[selected]) navigate(filtered[selected]); }
  };

  if (!open) return null;

  // Group results
  const groups: { label: string; type: ItemType; items: SearchItem[] }[] = [];
  const order: ItemType[] = ["page", "project", "blog", "skill"];
  order.forEach(type => {
    const items = filtered.filter(i => i.type === type);
    if (items.length > 0) groups.push({ label: TYPE_LABELS[type] + "S", type, items });
  });

  return (
    <>
      <style>{`
        .cp-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 14vh;
        }

        .cp-panel {
          width: 100%; max-width: 660px;
          background: rgba(8,8,10,0.98);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow:
            0 32px 100px rgba(0,0,0,0.8),
            0 0 0 1px rgba(var(--accent-rgb),0.08),
            0 0 40px rgba(var(--accent-rgb),0.04);
          overflow: hidden;
        }

        .cp-input-wrap {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #1e1e1c;
        }
        .cp-input-icon { color: #a0a098; flex-shrink: 0; }
        .cp-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 16px;
          color: #f0ece4; caret-color: var(--accent);
        }
        .cp-input::placeholder { color: #8a8a80; }
        .cp-esc-kbd {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #a0a098; background: #1a1a18; border: 1px solid #2e2e2c;
          border-radius: 5px; padding: 3px 9px; letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        .cp-results {
          max-height: 420px;
          min-height: 220px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
          display: flex;
          flex-direction: column;
        }
        .cp-results::-webkit-scrollbar { width: 4px; }
        .cp-results::-webkit-scrollbar-track { background: transparent; }
        .cp-results::-webkit-scrollbar-thumb { background: #2e2e2c; border-radius: 2px; }
        .cp-results::-webkit-scrollbar-thumb:hover { background: #3e3e3a; }

        .cp-group-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.1em;
          color: var(--accent); padding: 10px 14px 4px;
          text-transform: uppercase; opacity: 0.75;
        }

        .cp-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px; border-radius: 9px;
          cursor: pointer; transition: background 0.12s;
          border: 1px solid transparent;
        }
        .cp-item:hover { background: rgba(255,255,255,0.04); }
        .cp-item.active {
          background: rgba(var(--accent-rgb),0.08);
          border-color: rgba(var(--accent-rgb),0.18);
        }

        .cp-item-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid #222220;
          display: flex; align-items: center; justify-content: center;
          color: #a0a098; flex-shrink: 0;
          transition: color 0.12s, background 0.12s, border-color 0.12s;
        }
        .cp-item.active .cp-item-icon {
          background: rgba(var(--accent-rgb),0.12);
          border-color: rgba(var(--accent-rgb),0.22);
          color: var(--accent);
        }

        .cp-item-label {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #e8e4dc; transition: color 0.12s;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cp-item.active .cp-item-label { color: #ffffff; }

        .cp-item-desc {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #a0a098; letter-spacing: 0.02em; margin-top: 1px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.12s;
        }
        .cp-item.active .cp-item-desc { color: rgba(var(--accent-rgb),0.8); }

        .cp-item-right { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0; }

        .cp-item-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: 0.08em;
          padding: 2px 6px; border-radius: 4px;
          border: 1px solid currentColor;
          opacity: 0.6;
          text-transform: uppercase;
        }

        .cp-item-arrow {
          color: #7a7a70; font-size: 14px;
          transition: color 0.12s;
        }
        .cp-item.active .cp-item-arrow { color: var(--accent); }

        .cp-empty {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 20px; text-align: center;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #8a8a80; letter-spacing: 0.08em; text-transform: uppercase;
        }

        .cp-loading {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 20px; text-align: center;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #8a8a80; letter-spacing: 0.08em;
        }
        .cp-loading-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent); opacity: 0.6;
          animation: cp-blink 1.2s ease-in-out infinite;
        }
        .cp-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .cp-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cp-blink { 0%,80%,100%{opacity:0.2} 40%{opacity:0.9} }

        .cp-footer {
          padding: 9px 18px;
          border-top: 1px solid #1e1e1c;
          display: flex; gap: 18px; align-items: center;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #a0a098; letter-spacing: 0.05em;
        }
        .cp-footer-item { display: flex; align-items: center; gap: 6px; }
        .cp-footer-kbd {
          background: #1e1e1c; border: 1px solid #333330;
          border-radius: 4px; padding: 2px 7px;
          font-size: 10px; color: #c0c0b8;
        }
        .cp-footer-count {
          margin-left: auto;
          font-size: 10px; color: #7a7a70;
        }

        @media (max-width: 640px) {
          .cp-overlay { padding-top: 0; align-items: flex-end; }
          .cp-panel { max-width: 100%; border-radius: 16px 16px 0 0; border-bottom: none; }
          .cp-results { max-height: 55vh; min-height: 200px; }
          .cp-footer { gap: 12px; font-size: 10px; }
          .cp-footer-kbd { padding: 2px 6px; font-size: 9px; }
        }
      `}</style>

      <div className="cp-overlay" onClick={closePalette}>
        <div ref={panelRef} className="cp-panel" onClick={e => e.stopPropagation()}>

          {/* Input */}
          <div className="cp-input-wrap">
            <Search size={18} className="cp-input-icon" />
            <input
              ref={inputRef}
              className="cp-input"
              placeholder="Search pages, projects, blogs, skills..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="cp-esc-kbd">ESC</span>
          </div>

          {/* Results */}
          <div className="cp-results" data-lenis-prevent onTouchStart={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
            {loading && query === "" ? (
              <div className="cp-loading">
                <div className="cp-loading-dot" />
                <div className="cp-loading-dot" />
                <div className="cp-loading-dot" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="cp-empty">No results for &ldquo;{query}&rdquo;</div>
            ) : (
              groups.map(group => {
                // compute global index offset for keyboard selection
                const groupStart = filtered.indexOf(group.items[0]);
                return (
                  <div key={group.type}>
                    <div className="cp-group-label" style={{ color: "var(--accent)" }}>
                      {group.label}
                    </div>
                    {group.items.map((item, localIdx) => {
                      const globalIdx = groupStart + localIdx;
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className={`cp-item${globalIdx === selected ? " active" : ""}`}
                          onClick={() => navigate(item)}
                          onMouseEnter={() => setSelected(globalIdx)}
                        >
                          <div className="cp-item-icon">
                            <Icon size={15} strokeWidth={1.6} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="cp-item-label">{item.label}</div>
                            <div className="cp-item-desc">{item.desc}</div>
                          </div>
                          <div className="cp-item-right">
                            {item.tag && (
                              <span className="cp-item-tag" style={{ color: "var(--accent)" }}>
                                {item.tag}
                              </span>
                            )}
                            <span className="cp-item-arrow">→</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="cp-footer">
            <div className="cp-footer-item">
              <span className="cp-footer-kbd">↑↓</span> Navigate
            </div>
            <div className="cp-footer-item">
              <span className="cp-footer-kbd">↵</span> Open
            </div>
            <div className="cp-footer-item">
              <span className="cp-footer-kbd">Esc</span> Close
            </div>
            {filtered.length > 0 && (
              <span className="cp-footer-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
