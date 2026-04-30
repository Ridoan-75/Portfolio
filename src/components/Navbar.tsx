"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hireBtnRef = useRef<HTMLAnchorElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // entrance
    gsap.from(navRef.current, {
      y: -60,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });

    gsap.from(".nav-link-item", {
      y: -10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      delay: 0.4,
      ease: "power2.out",
    });

    // scroll listener
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: auto-update active nav link based on scroll position
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // mobile menu slide
  useEffect(() => {
    if (!mobileMenuRef.current) return;
    gsap.to(mobileMenuRef.current, {
      y: menuOpen ? 0 : "-110%",
      duration: 0.4,
      ease: menuOpen ? "power3.out" : "power3.in",
    });
  }, [menuOpen]);

  const firework = (x: number, y: number) => {
    const colors = ["#c8f060", "#a3e635", "#ffffff", "#6a6a62"];
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
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 70 + 30;
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
      setActive(href);
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
      const rect = e.currentTarget.getBoundingClientRect();
      firework(rect.left + rect.width / 2, rect.top + rect.height / 2);
      gsap.fromTo(
        e.currentTarget,
        { scale: 0.85 },
        { scale: 1, duration: 0.35, ease: "back.out(2.5)" }
      );
    },
    []
  );

const handleHireClick = useCallback(
  (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const btn = hireBtnRef.current!;
    const rect = btn.getBoundingClientRect();

    // firework effect
    firework(rect.left + rect.width / 2, rect.top + rect.height / 2);

    // button animation
    gsap
      .timeline()
      .to(btn, { scale: 1.15, duration: 0.1 })
      .to(btn, { scale: 0.9, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.15 })
      .to(btn, { x: -4, repeat: 4, yoyo: true, duration: 0.05 })
      .set(btn, { x: 0 });

    // 👉 SCROLL TO CONTACT
    setTimeout(() => {
      const section = document.querySelector("#contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setActive("#contact"); // optional: active link update
      }
      setMenuOpen(false); // mobile menu close
    }, 550);
  },
  []
);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

        .nav-link-item {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          color: #4a4a44;
          position: relative;
          padding-bottom: 4px;
          transition: color 0.2s ease;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #c8f060;
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link-item:hover { color: #e8e4dc; }
        .nav-link-item:hover::after { width: 100%; }
        .nav-link-item.active-link { color: #c8f060; }
        .nav-link-item.active-link::after { width: 100%; }

        .hire-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #080808;
          background: #c8f060;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .hire-btn:hover { background: #d4f577; }
        .hire-btn::after {
          content: '→';
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .hire-btn:hover::after { transform: translateX(3px); }

        .mobile-nav-link {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: block;
          padding: 18px 0;
          color: #4a4a44;
          text-decoration: none;
          border-bottom: 1px solid #1a1a18;
          transition: color 0.2s ease;
          position: relative;
        }
        .mobile-nav-link.active-link { color: #c8f060; }
        .mobile-nav-link:hover { color: #e8e4dc; }

        .menu-btn {
          background: transparent;
          border: 1px solid #1e1e1a;
          color: #4a4a44;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .menu-btn:hover { border-color: #c8f060; color: #c8f060; }

        @media (min-width: 768px) { .mobile-only { display: none !important; } }
        @media (max-width: 767px) { .desktop-only { display: none !important; } }
      `}</style>

      {/* NAV */}
      <nav
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: "0 40px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(8,8,8,0.95)" : "#080808",
          borderBottom: `1px solid ${scrolled ? "#1a1a18" : "transparent"}`,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* LOGO */}
        <a
          ref={logoRef}
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "32px",
            letterSpacing: "0.05em",
            color: "#f0ece4",
            textDecoration: "none",
            lineHeight: 1,
          }}
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { letterSpacing: "0.12em", duration: 0.3 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { letterSpacing: "0.05em", duration: 0.3 })
          }
        >
          MR<span style={{ color: "#c8f060" }}>H</span>
        </a>

        {/* DESKTOP LINKS */}
        <div
          className="desktop-only"
          style={{ display: "flex", alignItems: "center", gap: "32px" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`nav-link-item${active === link.href ? " active-link" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="desktop-only"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          <a
            ref={hireBtnRef}
            href="#"
            onClick={handleHireClick}
            className="hire-btn"
          >
            Hire Me
          </a>
        </div>

        {/* MOBILE MENU BTN */}
        <button
          className="menu-btn mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#080808",
          zIndex: 999,
          padding: "80px 40px 40px",
          transform: "translateY(-110%)",
          borderBottom: "1px solid #1a1a18",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* big heading */}
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "56px",
            color: "#1a1a18",
            lineHeight: 1,
            marginBottom: "32px",
            letterSpacing: "0.02em",
            userSelect: "none",
          }}
        >
          MENU
        </div>

        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`mobile-nav-link${active === link.href ? " active-link" : ""}`}
          >
            {link.label}
          </a>
        ))}

        <a
          href="#"
          onClick={handleHireClick}
          className="hire-btn"
          style={{ marginTop: "32px", alignSelf: "flex-start" }}
        >
          Hire Me
        </a>

        <div
          style={{
            marginTop: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "#2a2a28",
            letterSpacing: "0.08em",
          }}
        >
           ridoan@dev
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
