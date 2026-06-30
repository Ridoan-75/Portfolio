"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  Cpu,
  BookOpen,
  User,
  Mail,
  Search,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Skills", href: "/skills", icon: Cpu },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Contact", href: "/contact", icon: Mail },
];

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
      );
      const links = sidebarRef.current.querySelectorAll(".sidebar-link-item");
      gsap.fromTo(
        links,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const firework = (x: number, y: number) => {
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#c8f060";
    const colors = [accent, "#ecfccb", "#ffffff", "#6a6a72"];
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("span");
      Object.assign(dot.style, {
        position: "fixed",
        left: `${x}px`,
        top: `${y}px`,
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: colors[Math.floor(Math.random() * colors.length)],
        pointerEvents: "none",
        zIndex: "9999",
      });
      document.body.appendChild(dot);
      const angle = Math.random() * Math.PI * 2,
        dist = Math.random() * 70 + 30;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      });
    }
  };

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      firework(rect.left + rect.width / 2, rect.top + rect.height / 2);
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.85 },
        { scale: 1, duration: 0.35, ease: "back.out(2.5)" }
      );
      router.push(href);
    },
    [router]
  );


  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <style>{`
        .sidebar-desktop::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.55), transparent);
          z-index: 2; pointer-events: none;
        }
        .sidebar-link-item {
          font-family: var(--site-font, 'JetBrains Mono', monospace);
          font-size: 13px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          text-decoration: none;
          color: #b8b4ac;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .sidebar-link-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--accent);
          transform: scaleY(0);
          transition: transform 0.2s ease;
          border-radius: 0 2px 2px 0;
          box-shadow: 2px 0 10px rgba(var(--accent-rgb),.3);
        }
        .sidebar-link-item:hover {
          color: #eae6de;
          background: rgba(255,255,255,0.07);
        }
        .sidebar-link-item:hover::before { transform: scaleY(1); }
        .sidebar-link-item.active-link {
          color: var(--accent);
          background: rgba(var(--accent-rgb),0.08);
        }
        .sidebar-link-item.active-link::before {
          transform: scaleY(1);
          box-shadow: 2px 0 14px rgba(var(--accent-rgb),.45);
        }

/* spinning ring */
        .sb-avatar-wrap {
          position: relative; flex-shrink: 0;
          width: 58px; height: 58px;
        }
        .sb-avatar-ring {
          position: absolute; inset: -2px;
          border-radius: 14px;
          background: conic-gradient(from 180deg, var(--accent) 0%, rgba(var(--accent-rgb),0.12) 55%, var(--accent) 100%);
          animation: sb-ring-spin 6s linear infinite;
        }
        @keyframes sb-ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .sb-avatar-btn {
          position: relative; z-index: 1;
          width: 58px; height: 58px; border-radius: 12px;
          border: 2px solid rgba(6,7,15,1);
          padding: 0; cursor: pointer; overflow: hidden;
          background: #1a1a18; display: block;
          transition: box-shadow 0.2s;
        }
        .sb-avatar-btn:hover { box-shadow: 0 0 12px rgba(var(--accent-rgb),0.3); }
        .sb-avatar-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }

        @media (max-width: 1024px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>

      <div
        ref={sidebarRef}
        className="sidebar-desktop"
        style={{
          position: "sticky",
          top: "0",
          width: "280px",
          minWidth: "280px",
          alignSelf: "start",
          height: "100vh",
          background: "rgba(6,7,15,0.97)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRight: "1px solid rgba(var(--accent-rgb),0.15)",
          borderRadius: "0",
          display: "flex",
          flexDirection: "column",
          padding: "28px 20px",
          boxShadow: "8px 0 40px rgba(0,0,0,0.55), inset -1px 0 0 rgba(255,255,255,0.04)",
          fontFamily: "var(--site-font, 'DM Sans', sans-serif)",
          overflow: "hidden",
        }}
      >
        {/* Profile */}
        <div style={{ marginBottom: "28px" }}>

          {/* Image + name row */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>

            {/* Profile image — square with spinning ring */}
            <div className="sb-avatar-wrap">
              <div className="sb-avatar-ring" />
              <button className="sb-avatar-btn" onClick={() => setLightbox(true)} title="View photo">
                <img src="/image.jpg" alt="Md Ridoan" />
              </button>
            </div>

            {/* Name + verified + role */}
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "22px", color: "#f0ece4",
                  letterSpacing: "0.05em", lineHeight: 1,
                }}>
                  MR<span style={{ color: "var(--accent)" }}>H</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                  <polyline points="7 12.5 10.5 16 17 9" stroke="#080808" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: "#c4c0b8", letterSpacing: "0.04em",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                marginBottom: "2px",
              }}>
                Md Ridoan Hossen
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: "#a8a4a0", letterSpacing: "0.05em",
              }}>
                Full Stack Dev
              </div>
            </div>
          </div>

          {/* Open to work badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.3)",
            borderRadius: "20px", padding: "7px 16px",
            boxShadow: "0 0 12px rgba(var(--accent-rgb),0.08)",
          }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "var(--accent)", display: "inline-block",
              boxShadow: "0 0 8px var(--accent)",
              animation: "pulse 2s infinite", flexShrink: 0,
            }} />
            <span style={{
              fontSize: "11px", color: "var(--accent)",
              letterSpacing: "0.07em", fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 500,
            }}>
              Open to Work
            </span>
          </div>
        </div>

        {/* Search trigger */}
        <button
          onClick={() => window.dispatchEvent(new Event("open-search"))}
          style={{
            display: "flex", alignItems: "center", gap: "9px",
            width: "100%", padding: "10px 14px", marginBottom: "14px",
            background: "#111110", border: "1px solid #2a2a28",
            borderRadius: "8px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px", color: "#9a9a90",
            letterSpacing: "0.06em", textAlign: "left",
            transition: "border-color 0.2s, color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = "rgba(var(--accent-rgb),0.35)";
            b.style.color = "#d0d0c8";
            b.style.background = "#161614";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = "#2a2a28";
            b.style.color = "#9a9a90";
            b.style.background = "#111110";
          }}
        >
          <Search size={15} strokeWidth={1.5} />
          <span style={{ flex: 1 }}>Search pages...</span>
          <span style={{
            background: "#1a1a18", border: "1px solid #333330",
            borderRadius: "4px", padding: "2px 7px", fontSize: "10px",
            letterSpacing: "0.04em", color: "#8a8a78",
          }}>
            Ctrl K
          </span>
        </button>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`sidebar-link-item${active ? " active-link" : ""}`}
              >
                <Icon size={17} strokeWidth={1.5} />
                {link.label}
                {active && (
                  <span style={{ marginLeft: "auto", fontSize: "16px", opacity: 0.5 }}>→</span>
                )}
              </a>
            );
          })}

        </nav>

      </div>

      {/* Lightbox — outside sidebar so it centers on full viewport */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
            <img
              src="/image.jpg"
              alt="Md Ridoan"
              style={{
                width: "min(380px, 88vw)", height: "min(380px, 88vw)",
                borderRadius: "18px", objectFit: "cover", display: "block",
                border: "2px solid rgba(var(--accent-rgb),0.35)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(var(--accent-rgb),0.15)",
              }}
            />
            <div style={{
              marginTop: "16px", textAlign: "center",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px",
              color: "#f0ece4", letterSpacing: "0.06em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              Md Ridoan Hossen
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                <polyline points="7 12.5 10.5 16 17 9" stroke="#080808" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{
              textAlign: "center", fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", color: "#7a7a70", letterSpacing: "0.08em", marginTop: "5px",
            }}>
              Full Stack Developer
            </div>
            <button
              onClick={() => setLightbox(false)}
              style={{
                position: "absolute", top: "-14px", right: "-14px",
                width: "30px", height: "30px", borderRadius: "50%",
                background: "#1a1a18", border: "1px solid #2a2a28",
                color: "#a0a098", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  );
}
