"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "LinkedIn", href: "https://www.linkedin.com/in/mohammad-ridoan-hossen75",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>),
  },
  {
    label: "GitHub", href: "https://github.com/Ridoan-75",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>),
  },
  {
    label: "Twitter / X", href: "https://twitter.com/Ridoan_75",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
  },
  {
    label: "Facebook", href: "https://facebook.com/Ridoan-75",
    icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>),
  },
];

export default function Footer() {
  useEffect(() => {
    gsap.fromTo(".footer-content",
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".footer-content", start: "top 95%", toggleActions: "play none none none" } }
    );
  }, []);

  return (
    <footer style={{ background: "#080808", color: "#e8e4dc", fontFamily: "var(--site-font, 'DM Sans', sans-serif)", position: "relative", overflow: "hidden" }}>
      <style>{`
        footer::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.03) 1px, transparent 1px);
          background-size: 44px 44px; pointer-events: none; z-index: 0;
        }

        .footer-top-border {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.15), transparent);
        }

        .footer-content {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; padding: 64px 60px 0;
        }

        .footer-grid {
          display: grid; grid-template-columns: 1.8fr 1fr 1fr;
          gap: 64px; padding-bottom: 48px; border-bottom: 1px solid #1a1a18;
        }

        .footer-logo {
          font-family: 'Bebas Neue', sans-serif; font-size: 48px; line-height: 1;
          letter-spacing: .02em; color: #f0ece4; text-decoration: none;
          display: inline-block; margin-bottom: 16px;
        }
        .footer-logo .logo-accent { color: var(--accent); }

        .footer-bio { font-size: 14px; line-height: 1.85; color: #4a4a44; max-width: 280px; margin-bottom: 24px; }

        .footer-social-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          text-transform: uppercase; letter-spacing: .1em; color: #2a2a28; margin-bottom: 10px;
        }

        .footer-socials { display: flex; gap: 8px; flex-wrap: wrap; }

        .footer-social-item {
          width: 42px; height: 42px; border-radius: 3px; border: 1px solid #2a2a28;
          background: #0e0e0c; display: flex; align-items: center; justify-content: center;
          text-decoration: none; color: #4a4a44;
          transition: border-color .2s, color .2s, transform .15s, background .2s;
        }
        .footer-social-item:hover {
          border-color: var(--accent); color: var(--accent);
          background: #131310; transform: translateY(-3px);
        }

        .footer-col-title {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          text-transform: uppercase; letter-spacing: .12em; color: var(--accent);
          margin-bottom: 22px; display: flex; align-items: center; gap: 10px;
        }
        .footer-col-title::before { content: ''; width: 20px; height: 1px; background: var(--accent); flex-shrink: 0; }

        .footer-links { display: flex; flex-direction: column; gap: 12px; }

        .footer-link {
          font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #4a4a44;
          text-decoration: none; letter-spacing: .04em;
          transition: color .2s, padding-left .2s;
          display: flex; align-items: center; gap: 8px;
        }
        .footer-link::before { content: '//'; color: #2a2a28; transition: color .2s; flex-shrink: 0; }
        .footer-link:hover { color: #e8e4dc; padding-left: 4px; }
        .footer-link:hover::before { color: var(--accent); }

        .footer-contact-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }

        .footer-contact-icon {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          text-transform: uppercase; letter-spacing: .08em; color: var(--accent);
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.15);
          border-radius: 2px; padding: 3px 6px; flex-shrink: 0; margin-top: 1px;
        }

        .footer-contact-val {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #4a4a44; letter-spacing: .04em; line-height: 1.6;
          text-decoration: none; transition: color .2s;
        }
        a.footer-contact-val:hover { color: #e8e4dc; }

        .footer-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 0 32px; flex-wrap: wrap; gap: 12px;
        }
        .footer-copy { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .08em; color: #2a2a28; }
        .footer-copy span { color: #4a4a44; }
        .footer-built { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: .08em; color: #2a2a28; display: flex; align-items: center; gap: 6px; }
        .footer-built-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 4px var(--accent); animation: ftBlink 2s ease infinite; }
        @keyframes ftBlink { 0%,100%{opacity:1} 50%{opacity:.2} }

        @media (max-width: 900px) {
          .footer-content { padding: 48px 24px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; gap: 36px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="footer-top-border" />

      <div className="footer-content">
        <div className="footer-grid">
          <div>
            <a href="#home" className="footer-logo"><span className="logo-accent">R</span>idoan</a>
            <p className="footer-bio">Full Stack Developer &amp; UI/UX Designer. Crafting fast, scalable, pixel-perfect web experiences for global clients.</p>
            <div className="footer-social-label">Find me on</div>
            <div className="footer-socials">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label} className="footer-social-item">{s.icon}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigate</div>
            <div className="footer-links">
              {quickLinks.map((link) => (
                <a key={link.label} href={link.href} className="footer-link">{link.label}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">mail</span>
              <a href="mailto:ridoan437@gmail.com" className="footer-contact-val">ridoan437@gmail.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">loc</span>
              <span className="footer-contact-val">Bangladesh<br />Remote Worldwide</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">utc</span>
              <span className="footer-contact-val">UTC+6<br />Available Now</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} <span>Ridoan.</span> All rights reserved.</div>
          <div className="footer-built"><span className="footer-built-dot" /> Built with Next.js · GSAP · Tailwind</div>
        </div>
      </div>
    </footer>
  );
}
