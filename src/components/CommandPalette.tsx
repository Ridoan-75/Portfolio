"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Home, Cpu, GraduationCap, FolderOpen, BookOpen,
  MessageSquare, Mail, Settings, Search,
} from "lucide-react";

const PAGES = [
  { label: "Home",      href: "/",          icon: Home,         desc: "Back to home" },
  { label: "Skills",    href: "/skills",     icon: Cpu,          desc: "Tech stack & proficiency" },
  { label: "Education", href: "/education",  icon: GraduationCap,desc: "Academic background" },
  { label: "Projects",  href: "/projects",   icon: FolderOpen,   desc: "Portfolio projects" },
  { label: "Blog",      href: "/blog",       icon: BookOpen,     desc: "Articles & thoughts" },
  { label: "Reviews",   href: "/reviews",    icon: MessageSquare,desc: "Client reviews" },
  { label: "Contact",   href: "/contact",    icon: Mail,         desc: "Get in touch" },
  { label: "Settings",  href: "/settings",   icon: Settings,     desc: "Customize accent, cursor, sounds" },
];

export default function CommandPalette() {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [selected, setSelected] = useState(0);
  const panelRef  = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const router    = useRouter();

  const filtered = PAGES.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) ||
      p.desc.toLowerCase().includes(query.toLowerCase())
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

  const navigate = useCallback((item: typeof PAGES[0]) => {
    closePalette();
    setTimeout(() => router.push(item.href), 220);
  }, [closePalette, router]);

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

  return (
    <>
      <style>{`
        /* ── Overlay ── */
        .cp-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 16vh;
        }

        /* ── Panel ── */
        .cp-panel {
          width: 100%; max-width: 640px;
          background: #111110;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          box-shadow:
            0 32px 100px rgba(0,0,0,0.8),
            0 0 0 1px rgba(var(--accent-rgb),0.08),
            0 0 40px rgba(var(--accent-rgb),0.04);
          overflow: hidden;
        }

        /* ── Input row ── */
        .cp-input-wrap {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid #1e1e1c;
        }
        .cp-input-icon { color: #8a8a80; flex-shrink: 0; }
        .cp-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'DM Sans', sans-serif; font-size: 16px;
          color: #e8e4dc; caret-color: var(--accent);
        }
        .cp-input::placeholder { color: #6a6a60; }
        .cp-esc-kbd {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #7a7a70; background: #1a1a18; border: 1px solid #2e2e2c;
          border-radius: 5px; padding: 3px 9px; letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        /* ── Results ── */
        .cp-results {
          max-height: 380px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }
        .cp-results::-webkit-scrollbar { width: 4px; }
        .cp-results::-webkit-scrollbar-track { background: transparent; }
        .cp-results::-webkit-scrollbar-thumb { background: #2e2e2c; border-radius: 2px; }
        .cp-results::-webkit-scrollbar-thumb:hover { background: #3e3e3a; }

        .cp-item {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 14px; border-radius: 10px;
          cursor: pointer; transition: background 0.12s;
          border: 1px solid transparent;
        }
        .cp-item:hover { background: rgba(255,255,255,0.04); }
        .cp-item.active {
          background: rgba(var(--accent-rgb),0.08);
          border-color: rgba(var(--accent-rgb),0.22);
        }

        .cp-item-icon {
          width: 38px; height: 38px; border-radius: 9px;
          background: rgba(255,255,255,0.04); border: 1px solid #222220;
          display: flex; align-items: center; justify-content: center;
          color: #7a7a70; flex-shrink: 0;
          transition: color 0.12s, background 0.12s, border-color 0.12s;
        }
        .cp-item.active .cp-item-icon {
          background: rgba(var(--accent-rgb),0.12);
          border-color: rgba(var(--accent-rgb),0.25);
          color: var(--accent);
        }

        .cp-item-label {
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
          color: #c8c4bc; transition: color 0.12s;
        }
        .cp-item.active .cp-item-label { color: #f0ece4; }

        .cp-item-desc {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #6a6a60; letter-spacing: 0.04em; margin-top: 2px;
          transition: color 0.12s;
        }
        .cp-item.active .cp-item-desc { color: rgba(var(--accent-rgb),0.7); }

        .cp-item-arrow {
          margin-left: auto; color: #4a4a44; font-size: 15px;
          transition: color 0.12s; flex-shrink: 0;
        }
        .cp-item.active .cp-item-arrow { color: var(--accent); }

        .cp-empty {
          padding: 40px 20px; text-align: center;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #5a5a54; letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* ── Footer ── */
        .cp-footer {
          padding: 10px 20px;
          border-top: 1px solid #1e1e1c;
          display: flex; gap: 20px; align-items: center;
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #7a7a70; letter-spacing: 0.05em;
        }
        .cp-footer-item { display: flex; align-items: center; gap: 6px; }
        .cp-footer-kbd {
          background: #1a1a18; border: 1px solid #2e2e2c;
          border-radius: 4px; padding: 2px 7px;
          font-size: 10px; color: #9a9a90;
        }

        /* ── Mobile: bottom sheet ── */
        @media (max-width: 640px) {
          .cp-overlay {
            padding-top: 0;
            align-items: flex-end;
          }
          .cp-panel {
            max-width: 100%;
            border-radius: 16px 16px 0 0;
            border-bottom: none;
          }
          .cp-results { max-height: 55vh; }
          .cp-footer { gap: 14px; font-size: 10px; }
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
              placeholder="Search pages..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="cp-esc-kbd">ESC</span>
          </div>

          {/* Results — data-lenis-prevent stops Lenis from hijacking scroll here */}
          <div className="cp-results" data-lenis-prevent onTouchStart={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
            {filtered.length === 0 ? (
              <div className="cp-empty">No results for &ldquo;{query}&rdquo;</div>
            ) : (
              filtered.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.href}
                    className={`cp-item${i === selected ? " active" : ""}`}
                    onClick={() => navigate(item)}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <div className="cp-item-icon">
                      <Icon size={17} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="cp-item-label">{item.label}</div>
                      <div className="cp-item-desc">{item.desc}</div>
                    </div>
                    <span className="cp-item-arrow">→</span>
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
          </div>

        </div>
      </div>
    </>
  );
}
