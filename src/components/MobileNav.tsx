"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Home, FolderOpen, Cpu, BookOpen, GraduationCap, Mail, MessageSquare, X, Menu, Settings, Search } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Skills", href: "/skills", icon: Cpu },
  { label: "Education", href: "/education", icon: GraduationCap },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Reviews", href: "/reviews", icon: MessageSquare },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      gsap.fromTo(".mobile-drawer", { x: "-100%" }, { x: "0%", duration: 0.38, ease: "power3.out" });
      gsap.fromTo(".mobile-drawer-link", { x: -24, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.35, delay: 0.1, ease: "power2.out" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const handleNav = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0;
          width: 100%;
          min-height: 68px;
          background: rgba(8,8,8,0.96);
          border-bottom: 1px solid #1a1a18;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          z-index: 1100;
          gap: 10px;
          box-sizing: border-box;
          backdrop-filter: blur(12px);
        }
        .mobile-topbar-brand {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 0.05em;
          text-transform: none;
        }

        .mobile-topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .mobile-action-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: #e8e4dc;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .mobile-action-btn:hover { transform: translateY(-1px); background: rgba(255,255,255,0.08); }

        .mobile-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
          background: #080808; border-right: 1px solid #1a1a18;
          z-index: 1200; padding: 28px 16px;
          display: flex; flex-direction: column;
          transform: translateX(-100%);
        }
        .mobile-drawer-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 1190;
          backdrop-filter: blur(2px);
        }
        .mobile-drawer-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          color: #4a4a44; display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-radius: 8px; cursor: pointer;
          border: none; background: none; width: 100%; text-align: left;
          transition: color 0.2s, background 0.2s;
        }
        .mobile-drawer-link:hover { color: #e8e4dc; background: rgba(255,255,255,0.04); }
        .mobile-drawer-link.active { color: var(--accent); background: rgba(255,255,255,0.05); }
        @media (max-width: 1024px) {
          .mobile-topbar { display: flex; }
        }
      `}</style>

      {/* Top bar with hamburger */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setImageOpen(true)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.14)',
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label="Open profile image"
          >
            <img
              src="/image.jpg"
              alt="Ridwan"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
          <div className="mobile-topbar-brand">&lt;MRH/&gt;</div>
        </div>
        <div className="mobile-topbar-actions">
          <button className="mobile-action-btn" onClick={() => window.dispatchEvent(new Event("open-search"))} aria-label="Search">
            <Search size={18} />
          </button>
          <button className="mobile-action-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Drawer overlay */}
      {open && <div className="mobile-drawer-overlay" onClick={() => setOpen(false)} />}

      {imageOpen && (
        <div
          onClick={() => setImageOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'zoom-out',
          }}
        >
          <img
            src="/image.jpg"
            alt="Ridwan"
            style={{
              width: 'min(420px, 90vw)',
              height: 'min(420px, 90vw)',
              objectFit: 'cover',
              borderRadius: '18px',
              border: '2px solid rgba(var(--accent-rgb),0.4)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
            }}
          />
        </div>
      )}

      {/* Drawer */}
      {open && (
        <div className="mobile-drawer">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", paddingLeft: "8px" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "22px", color: "#f0ece4" }}>
              MR<span style={{ color: "var(--accent)" }}>H</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "#4a4a44", cursor: "pointer", padding: "4px" }}
            >
              <X size={18} />
            </button>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`mobile-drawer-link${isActive(link.href) ? " active" : ""}`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ height: "1px", background: "#1a1a18" }} />
            <button
              onClick={() => { setOpen(false); window.dispatchEvent(new Event("open-search")); }}
              className="mobile-drawer-link"
            >
              <Search size={15} strokeWidth={1.5} />
              Search
              <span style={{ marginLeft: "auto", fontSize: "10px", color: "#2a2a28", fontFamily: "'JetBrains Mono', monospace" }}>Ctrl K</span>
            </button>
            <button
              onClick={() => handleNav("/contact")}
              style={{
                width: "100%", padding: "10px 16px", borderRadius: "6px",
                background: "var(--accent)", color: "#080808", border: "none",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              Hire Me →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
