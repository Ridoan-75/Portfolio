"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Home, FolderOpen, Cpu, BookOpen, User, Mail, Search, X } from "lucide-react";

const navLinks = [
  { label: "Home",     href: "/",        icon: Home },
  { label: "About",    href: "/about",   icon: User },
  { label: "Skills",   href: "/skills",  icon: Cpu },
  { label: "Projects", href: "/projects",icon: FolderOpen },
  { label: "Blog",     href: "/blog",    icon: BookOpen },
  { label: "Contact",  href: "/contact", icon: Mail },
];

export default function MobileNav() {
  const [open, setOpen]           = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const pathname                  = usePathname();
  const router                    = useRouter();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".mob-menu-panel",
        { y: "100%" },
        { y: "0%", duration: 0.44, ease: "power4.out" }
      );
      gsap.fromTo(
        ".mob-profile-card",
        { y: 20, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.38, delay: 0.16, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mob-menu-search",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, delay: 0.26, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mob-menu-link",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, delay: 0.34, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const close = useCallback(() => {
    gsap.to(".mob-menu-panel", {
      y: "100%", duration: 0.32, ease: "power3.in",
      onComplete: () => setOpen(false),
    });
  }, []);

  const handleNav = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Top bar ── */
        .mobile-topbar {
          display: none;
          position: fixed; top: 0; left: 0; right: 0;
          height: 62px;
          background: rgba(6,6,8,0.94);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          align-items: center; justify-content: space-between;
          padding: 0 16px; z-index: 1100; gap: 10px;
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-sizing: border-box;
        }
        .mobile-topbar-brand-wrap {
          display: flex; align-items: center; gap: 10px; min-width: 0;
          flex: 1;
        }
        .mobile-topbar-avatar-wrap {
          position: relative; width: 38px; height: 38px; flex-shrink: 0;
        }
        .mobile-topbar-avatar-ring {
          position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(from 180deg, var(--accent) 0%, rgba(var(--accent-rgb),0.14) 60%, var(--accent) 100%);
          animation: mob-ring-spin 6s linear infinite;
        }
        .mobile-topbar-avatar {
          position: relative; z-index: 1; width: 38px; height: 38px; border-radius: 50%;
          border: 2px solid rgba(6,6,8,1); overflow: hidden; padding: 0; cursor: pointer; background: none;
        }
        .mobile-topbar-avatar img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .mobile-topbar-brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; color: var(--accent); letter-spacing: 0.05em; line-height: 1;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .mobile-topbar-brand:hover { opacity: 0.85; }
        .mobile-topbar-actions { display: flex; align-items: center; gap: 8px; }
        .mob-icon-btn {
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #c8c4bc; display: inline-flex;
          align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .mob-icon-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-1px); }

        .mob-burger { display: flex; flex-direction: column; gap: 4px; width: 18px; }
        .mob-burger-line {
          height: 1.5px; border-radius: 2px; background: #c8c4bc;
          transition: background 0.2s;
        }
        .mob-burger-line:nth-child(1) { width: 100%; }
        .mob-burger-line:nth-child(2) { width: 70%; }
        .mob-burger-line:nth-child(3) { width: 85%; }

        /* ── Overlay ── */
        .mob-overlay {
          position: fixed; inset: 0; z-index: 1190;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        }

        /* ── Menu Panel ── */
        .mob-menu-panel {
          position: fixed; bottom: 0; left: 0; right: 0;
          z-index: 1200;
          background: rgba(4,4,6,0.98);
          backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
          display: flex; flex-direction: column;
          padding: 0 0 28px;
          border-radius: 32px 32px 0 0;
          border-top: 1px solid rgba(255,255,255,0.07);
          max-height: 88vh;
          transform: translateY(100%);
          will-change: transform;
          overflow-y: auto;
        }

        /* ── Profile Card Header ── */
        .mob-profile-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }

        .mob-close-btn {
          position: absolute; top: 16px; right: 16px;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s, color 0.2s;
        }
        .mob-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .mob-avatar-wrap {
          position: relative;
          width: 72px; height: 72px;
          flex-shrink: 0;
        }
        .mob-avatar-ring {
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: conic-gradient(from 180deg, var(--accent) 0%, rgba(var(--accent-rgb),0.15) 60%, var(--accent) 100%);
          animation: mob-ring-spin 6s linear infinite;
        }
        @keyframes mob-ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .mob-avatar-inner {
          position: relative; z-index: 1;
          width: 72px; height: 72px;
          border-radius: 50%;
          border: 3px solid rgba(4,4,6,1);
          overflow: hidden;
          cursor: pointer;
        }
        .mob-avatar-inner img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }

        .mob-profile-content {
          display: flex; flex-direction: column; min-width: 0;
          flex: 1;
        }
        .mob-profile-name-row {
          display: flex; align-items: center; gap: 6px;
          margin-bottom: 4px;
        }
        .mob-profile-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #f5f3eb;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .mob-verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Search bar inside menu ── */
        .mob-menu-search {
          display: flex; align-items: center; gap: 9px;
          width: 100%;
          padding: 10px 14px;
          margin: 16px 0 0;
          background: #111110;
          border: 1px solid #2a2a28;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: #7a7a70;
          letter-spacing: 0.06em;
          text-align: left;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .mob-menu-search:hover {
          border-color: rgba(var(--accent-rgb),0.35);
          color: #b0b0a8;
          background: #161614;
        }
        .mob-menu-search-kbd {
          background: #1a1a18;
          border: 1px solid #333330;
          border-radius: 4px;
          padding: 2px 7px;
          font-size: 10px;
          letter-spacing: 0.04em;
          color: #6a6a60;
          margin-left: auto;
          flex-shrink: 0;
        }

        .mob-profile-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.3;
        }

        /* ── Nav Links ── */
        .mob-menu-links {
          display: flex; flex-direction: column; gap: 2px;
          padding: 16px 16px 0;
        }
        .mob-menu-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          display: flex; align-items: center; gap: 12px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: #8a8a7a;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .mob-menu-link::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--accent);
          transform: scaleY(0);
          transition: transform 0.2s ease;
          border-radius: 0 2px 2px 0;
        }
        .mob-menu-link:hover {
          color: #d8d4cc;
          background: rgba(255,255,255,0.05);
        }
        .mob-menu-link:hover::before { transform: scaleY(1); }
        .mob-menu-link.active {
          color: var(--accent);
          background: rgba(255,255,255,0.05);
        }
        .mob-menu-link.active::before { transform: scaleY(1); }
        .mob-menu-link-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.07em;
          color: inherit;
        }

        @media (max-width: 1024px) {
          .mobile-topbar { display: flex; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-brand-wrap">
          <div className="mobile-topbar-avatar-wrap">
            <div className="mobile-topbar-avatar-ring" />
            <button className="mobile-topbar-avatar" onClick={() => setImageOpen(true)} aria-label="Profile">
              <img src="/image.jpg" alt="Ridoan" />
            </button>
          </div>
          <button className="mobile-topbar-brand" onClick={() => handleNav("/")} aria-label="Go to home">
            &lt;MRH/&gt;
          </button>
        </div>

        <div className="mobile-topbar-actions">
          <button className="mob-icon-btn" onClick={() => window.dispatchEvent(new Event("open-search"))} aria-label="Search">
            <Search size={17} strokeWidth={1.8} />
          </button>
          <button className="mob-icon-btn" onClick={() => setOpen(true)} aria-label="Menu">
            <div className="mob-burger">
              <div className="mob-burger-line" />
              <div className="mob-burger-line" />
              <div className="mob-burger-line" />
            </div>
          </button>
        </div>
      </div>

      {/* ── Profile image lightbox ── */}
      {imageOpen && (
        <div onClick={() => setImageOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          <img src="/image.jpg" alt="Ridoan" style={{ width: "min(420px,90vw)", height: "min(420px,90vw)", objectFit: "cover", borderRadius: 18, border: "2px solid rgba(var(--accent-rgb),0.4)", boxShadow: "0 24px 70px rgba(0,0,0,0.6)" }} />
        </div>
      )}

      {/* ── Overlay ── */}
      {open && <div className="mob-overlay" onClick={close} />}

      {/* ── Menu Panel ── */}
      {open && (
        <div className="mob-menu-panel">

          {/* Profile Card */}
          <div className="mob-profile-card">
            <button className="mob-close-btn" onClick={close} aria-label="Close">
              <X size={16} strokeWidth={2} />
            </button>

            <div className="mob-avatar-wrap">
              <div className="mob-avatar-ring" />
              <div className="mob-avatar-inner" onClick={() => setImageOpen(true)}>
                <img src="/image.jpg" alt="Md Ridoan Hossen" />
              </div>
            </div>

            <div className="mob-profile-content">
              <div className="mob-profile-name-row">
                <span className="mob-profile-name">Md Ridoan Hossen</span>
                <span className="mob-verified-badge" title="Verified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="var(--accent)" />
                    <polyline points="7 12.5 10.5 16 17 9" stroke="#080808" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              <div className="mob-profile-role">Full Stack Developer</div>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: "0 16px" }}>
            <button
              className="mob-menu-search"
              onClick={() => { close(); window.dispatchEvent(new Event("open-search")); }}
            >
              <Search size={15} strokeWidth={1.5} />
              <span style={{ flex: 1 }}>Search pages...</span>
              <span className="mob-menu-search-kbd">Ctrl K</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="mob-menu-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <button
                  key={link.href}
                  className={`mob-menu-link${active ? " active" : ""}`}
                  onClick={() => handleNav(link.href)}
                >
                  <Icon size={17} strokeWidth={1.5} />
                  <span className="mob-menu-link-text">{link.label}</span>
                  {isActive(link.href) && (
                    <span style={{ marginLeft: "auto", fontSize: "16px", opacity: 0.5 }}>→</span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </>
  );
}
