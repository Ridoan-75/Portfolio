"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Briefcase, GraduationCap, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function CertLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="ab-lightbox" onClick={onClose}>
      <button className="ab-lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      <img
        src={src}
        alt="Certificate"
        className="ab-lightbox-img"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}

type Section = "intro" | "experience" | "education" | "certifications";

type Certificate = {
  id: string; title: string; issuer: string; issueDate: string;
  expiryDate?: string | null; credentialId?: string | null;
  credentialUrl?: string | null; image?: string | null; category?: string | null;
};
type Experience = {
  id: string; role: string; company: string; period: string;
  type: string; color: string; description: string; highlights: string[];
};
type Education = {
  id: string; degree: string; institution: string; period: string;
  badge: string; color: string; description: string; subjects: string[];
};

const NAV_ITEMS: { id: Section; label: string; num: string; icon: React.ElementType }[] = [
  { id: "intro",          label: "Intro",          num: "01", icon: User },
  { id: "experience",     label: "Experience",     num: "02", icon: Briefcase },
  { id: "education",      label: "Education",      num: "03", icon: GraduationCap },
  { id: "certifications", label: "Certifications", num: "04", icon: Award },
];

// ── Skeleton bar ──────────────────────────────────────────────────────────────
function Skel({ w, h }: { w: string | number; h: number }) {
  return <div className="ab-skel" style={{ width: w, height: h }} />;
}

// ── Cards shared renderer ──────────────────────────────────────────────────────
function TimelineCard({ color, badge, title, sub, period, description, tags, highlights }: {
  color: string; badge: string; title: string; sub: string; period: string;
  description: string; tags?: string[]; highlights?: string[];
}) {
  return (
    <div className="ab-card">
      <div className="ab-card-bar" style={{ background: color }} />
      <div className="ab-card-body">
        <div className="ab-card-head">
          <div>
            <div className="ab-card-title">{title}</div>
            <div className="ab-card-sub">{sub}</div>
            <div className="ab-card-period">{period}</div>
          </div>
          <span className="ab-card-badge"
            style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
            {badge}
          </span>
        </div>
        <p className="ab-card-desc">{description}</p>
        {tags && tags.length > 0 && (
          <div className="ab-tags">
            {tags.map(t => <span key={t} className="ab-tag">{t}</span>)}
          </div>
        )}
        {highlights && highlights.length > 0 && (
          <ul className="ab-highlights">
            {highlights.map(h => <li key={h} className="ab-highlight">{h}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  const [active, setActive]             = useState<Section>("intro");
  const [certs, setCerts]               = useState<Certificate[]>([]);
  const [exps, setExps]                 = useState<Experience[]>([]);
  const [edus, setEdus]                 = useState<Education[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [expsLoading, setExpsLoading]   = useState(true);
  const [edusLoading, setEdusLoading]   = useState(true);
  const [lightboxImg, setLightboxImg]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/certificates").then(r => r.json())
      .then(d => { setCerts(Array.isArray(d) ? d : []); setCertsLoading(false); })
      .catch(() => setCertsLoading(false));
    fetch("/api/experience").then(r => r.json())
      .then(d => { setExps(Array.isArray(d) ? d : []); setExpsLoading(false); })
      .catch(() => setExpsLoading(false));
    fetch("/api/education").then(r => r.json())
      .then(d => { setEdus(Array.isArray(d) ? d : []); setEdusLoading(false); })
      .catch(() => setEdusLoading(false));
  }, []);

  // Page header entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ab-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".ab-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".ab-role-line, .ab-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.15, delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // Content fade-in on active section change
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" }
    );
    // animate cards inside
    gsap.fromTo(el.querySelectorAll(".ab-card, .ab-cert-card, .ab-intro-card"),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "back.out(1.4)", delay: 0.08 }
    );
  }, [active]);

  // floating bg particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".ab-float").forEach(el => {
        gsap.to(el, {
          y: gsap.utils.random(-18, 18), x: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(3, 5), ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const switchSection = useCallback((id: Section) => {
    if (id === active) return;
    const el = contentRef.current;
    if (!el) { setActive(id); return; }
    gsap.to(el, {
      opacity: 0, y: -14, duration: 0.18, ease: "power2.in",
      onComplete: () => setActive(id),
    });
  }, [active]);

  // ── Render section content ──────────────────────────────────────────────────
  function renderContent() {
    switch (active) {

      // ── INTRO ──
      case "intro":
        return (
          <div className="ab-intro-grid">
            <div className="ab-intro-card ab-card">
              <div className="ab-intro-label">// About me</div>
              <p className="ab-intro-text">
                I'm Md Ridoan Hossen, a Full Stack Developer based in Chattogram, Bangladesh. I specialize in building modern web applications using React, Next.js, Node.js, and various databases.
              </p>
              <p className="ab-intro-text" style={{ marginTop: 14 }}>
                I'm passionate about clean code, great UX, and learning new technologies. Outside of coding I enjoy exploring new frameworks, contributing to open source, and sharing knowledge with the community.
              </p>
            </div>
            <div className="ab-intro-card ab-card">
              <div className="ab-intro-label">// Quick info</div>
              {[
                { key: "Name",         val: "Md Ridoan Hossen" },
                { key: "Location",     val: "Chattogram, Bangladesh" },
                { key: "Role",         val: "Full Stack Developer" },
                { key: "Experience",   val: "2+ Years" },
                { key: "Availability", val: "Open to Work" },
                { key: "GitHub",       val: "@Ridoan-75" },
              ].map(({ key, val }) => (
                <div key={key} className="ab-info-row">
                  <span className="ab-info-key">{key}</span>
                  <span className="ab-info-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // ── EXPERIENCE ──
      case "experience":
        if (expsLoading) return <CardsSkeleton />;
        if (exps.length === 0) return <EmptyState title="No Experience Yet" sub="// Add from admin panel" />;
        return (
          <div>
            {exps.map(e => (
              <TimelineCard key={e.id} color={e.color} badge={e.type}
                title={e.role} sub={e.company} period={e.period}
                description={e.description} highlights={e.highlights} />
            ))}
          </div>
        );

      // ── EDUCATION ──
      case "education":
        if (edusLoading) return <CardsSkeleton />;
        if (edus.length === 0) return <EmptyState title="No Education Yet" sub="// Add from admin panel" />;
        return (
          <div>
            {edus.map(e => (
              <TimelineCard key={e.id} color={e.color} badge={e.badge}
                title={e.degree} sub={e.institution} period={e.period}
                description={e.description} tags={e.subjects} />
            ))}
          </div>
        );

      // ── CERTIFICATIONS ──
      case "certifications":
        if (certsLoading) return <CertsSkeleton />;
        if (certs.length === 0) return <EmptyState title="No Certificates Yet" sub="// Add from admin panel" />;
        return (
          <div className="ab-cert-grid">
            {certs.map(cert => (
              <div key={cert.id} className="ab-cert-card">
                <div
                  className={`ab-cert-img-wrap${cert.image ? " ab-cert-img-clickable" : ""}`}
                  onClick={() => cert.image && setLightboxImg(cert.image)}
                >
                  {cert.image
                    ? <>
                        <img src={cert.image} alt={cert.title} className="ab-cert-img" />
                        <div className="ab-cert-img-hint">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                            <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                          </svg>
                          <span>Click to view</span>
                        </div>
                      </>
                    : <div className="ab-cert-img-ph"><span className="ab-cert-ph-txt">CERT</span></div>
                  }
                </div>
                <div className="ab-cert-body">
                  <div className="ab-cert-info">
                    {cert.category && <span className="ab-cert-cat">{cert.category}</span>}
                    <div className="ab-cert-title">{cert.title}</div>
                    <div className="ab-cert-issuer">{cert.issuer}</div>
                  </div>
                  {cert.credentialId && <div className="ab-cert-id">ID: {cert.credentialId}</div>}
                  <div className="ab-cert-meta">
                    <span className="ab-cert-date">
                      {cert.issueDate}{cert.expiryDate ? ` – ${cert.expiryDate}` : ""}
                    </span>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="ab-cert-link">
                        Verify →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  }

  return (
    <>
      {lightboxImg && <CertLightbox src={lightboxImg} onClose={() => setLightboxImg(null)} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #about {
          min-height: 100vh; display: flex; flex-direction: column;
          color: #e8e4dc; font-family: 'DM Sans', sans-serif;
        }
        .ab-corner-tl { position:absolute; top:0; left:0; width:160px; height:160px; border-right:1px solid rgba(var(--accent-rgb),.08); border-bottom:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .ab-corner-br { position:absolute; bottom:0; right:0; width:160px; height:160px; border-left:1px solid rgba(var(--accent-rgb),.08); border-top:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .ab-float { position:absolute; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; opacity:.03; pointer-events:none; user-select:none; color:var(--accent); }
        .ab-inner { max-width:1100px; margin:0 auto; width:100%; position:relative; z-index:1; }

        /* ── Header ── */
        .ab-status-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2); border-radius:3px; padding:7px 14px; width:fit-content; margin-bottom:24px; opacity:0; }
        .ab-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:abBlink 2s ease infinite; flex-shrink:0; }
        @keyframes abBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .ab-status-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
        .ab-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,120px); line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:20px; opacity:0; }
        .ab-heading .h-accent { color:var(--accent); }
        .ab-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#e8e4dc; margin-bottom:18px; display:flex; align-items:center; gap:12px; opacity:0; }
        .ab-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }
        .ab-desc { font-size:15px; line-height:1.85; color:#c0bcb4; max-width:500px; margin-bottom:36px; opacity:0; }

        /* ── Sticky nav tab bar ── */
        .ab-nav-wrap {
          position: sticky; top: 0; z-index: 20;
          background: rgba(8,8,10,0.95);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.09);
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 0 -40px 0;
          padding: 0 40px;
        }
        .ab-nav-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; align-items: stretch;
        }
        /* vertical divider between nav buttons */
        .ab-nav-sep {
          width: 1px;
          background: rgba(255,255,255,0.09);
          margin: 10px 0;
          flex-shrink: 0;
        }
        .ab-nav-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          gap: 8px; padding: 10px 16px; margin: 7px 4px;
          border-radius: 8px;
          background: transparent; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          color: #8a8880; transition: background .2s, color .2s;
          white-space: nowrap;
          letter-spacing: .02em; flex: 1;
        }
        .ab-nav-btn:hover { color: #d4d0c8; background: rgba(255,255,255,0.05); }
        .ab-nav-btn.active {
          background: var(--accent);
          color: #080808;
        }
        .ab-nav-num {
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: .12em; color: rgba(var(--accent-rgb),.55);
          border: 1px solid rgba(var(--accent-rgb),.22);
          border-radius: 3px; padding: 1px 5px; line-height: 1.5;
          flex-shrink: 0; transition: color .2s, border-color .2s, background .2s;
        }
        .ab-nav-btn.active .ab-nav-num {
          color: rgba(0,0,0,0.65);
          border-color: rgba(0,0,0,0.2);
          background: rgba(0,0,0,0.12);
        }
        .ab-nav-label { transition: none; }
        /* icon — hidden on desktop, shown on mobile */
        .ab-nav-icon { display: none; align-items: center; justify-content: center; }
        /* label text wrapper */
        .ab-nav-label-text { display: inline; }
        /* mobile section title strip */
        .ab-nav-section-label {
          display: none;
          text-align: center;
          padding: 7px 0 10px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--accent);
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* ── Content wrapper ── */
        .ab-content { padding-top: 36px; min-height: 340px; }

        /* ── Section title ── */
        .ab-sec-title {
          font-family:'Bebas Neue',sans-serif; font-size:26px; color:#e8e4dc;
          line-height:1; letter-spacing:.04em; margin-bottom: 22px;
          display:flex; align-items:center; gap:12px;
        }
        .ab-sec-title::before { content:''; width:3px; height:22px; background:var(--accent); border-radius:2px; flex-shrink:0; }

        /* ── Intro grid ── */
        .ab-intro-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:stretch; }
        .ab-intro-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          border-radius:14px; padding:24px;
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.07); opacity:0;
          height:100%; box-sizing:border-box;
          display:flex; flex-direction:column;
        }
        .ab-intro-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(var(--accent-rgb),.6); margin-bottom:12px; }
        .ab-intro-text { font-size:14px; line-height:1.9; color:#c8c4bc; margin:0; }
        .ab-info-row { display:flex; align-items:center; gap:12px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
        .ab-info-row:last-child { border-bottom:none; }
        .ab-info-key { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#888070; width:110px; flex-shrink:0; }
        .ab-info-val { font-family:'DM Sans',sans-serif; font-size:13px; color:#c8c4bc; }

        /* ── Timeline cards ── */
        .ab-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          border-radius:14px; overflow:hidden; margin-bottom:14px; opacity:0;
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 16px rgba(0,0,0,0.22);
          transition:border-color .22s, box-shadow .22s;
        }
        .ab-card:last-child { margin-bottom:0; }
        .ab-card:hover { border-color:rgba(var(--accent-rgb),.22); box-shadow:inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.36); }
        .ab-card-bar { height:3px; }
        .ab-card-body { padding:20px 22px; }
        .ab-card-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:10px; }
        .ab-card-title { font-family:'DM Sans',sans-serif; font-size:17px; font-weight:700; color:#f0ece4; line-height:1.25; margin-bottom:3px; }
        .ab-card-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#b0aca4; letter-spacing:.05em; }
        .ab-card-badge { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; padding:4px 10px; border-radius:4px; white-space:nowrap; flex-shrink:0; margin-top:2px; }
        .ab-card-period { font-family:'JetBrains Mono',monospace; font-size:11px; color:#908c84; letter-spacing:.08em; margin-top:2px; }
        .ab-card-desc { font-size:13px; color:#a8a49c; line-height:1.8; margin-bottom:12px; }
        .ab-tags { display:flex; gap:6px; flex-wrap:wrap; }
        .ab-tag { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; text-transform:uppercase; padding:3px 8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.16); border-radius:3px; color:rgba(var(--accent-rgb),.75); }
        .ab-highlights { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:5px; }
        .ab-highlight { display:flex; align-items:flex-start; gap:10px; font-size:12px; color:#9a9a92; line-height:1.55; }
        .ab-highlight::before { content:'→'; color:var(--accent); opacity:.7; flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:11px; margin-top:1px; }

        /* ── Cert grid ── */
        .ab-cert-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(270px,1fr)); gap:16px; }
        .ab-cert-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          border-radius:14px; overflow:hidden; opacity:0;
          backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
          box-shadow:inset 0 1px 0 rgba(255,255,255,0.07);
          transition:border-color .22s, transform .22s, box-shadow .22s;
          display:flex; flex-direction:column;
        }
        .ab-cert-card:hover { border-color:rgba(var(--accent-rgb),.28); transform:translateY(-4px); box-shadow:inset 0 1px 0 rgba(255,255,255,0.10),0 12px 36px rgba(0,0,0,0.4); }
        .ab-cert-img-wrap { aspect-ratio:16/9; background:#0e0e0c; overflow:hidden; flex-shrink:0; position:relative; }
        .ab-cert-img-clickable { cursor:zoom-in; }
        .ab-cert-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .35s; }
        .ab-cert-card:hover .ab-cert-img { transform:scale(1.05); }
        .ab-cert-img-ph { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#0c0c0a,#1a1a16); }
        .ab-cert-ph-txt { font-family:'Bebas Neue',sans-serif; font-size:40px; color:rgba(var(--accent-rgb),.08); letter-spacing:.06em; user-select:none; }
        .ab-cert-img-hint {
          position:absolute; bottom:0; left:0; right:0;
          display:flex; align-items:center; justify-content:center; gap:7px;
          padding:10px 14px 12px;
          background:linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
          color:rgba(255,255,255,0.9); font-family:'JetBrains Mono',monospace;
          font-size:10px; letter-spacing:.1em; text-transform:uppercase;
          opacity:0; transform:translateY(6px);
          transition:opacity .25s, transform .25s;
          pointer-events:none;
        }
        .ab-cert-img-clickable:hover .ab-cert-img-hint { opacity:1; transform:translateY(0); }
        @media (hover: none) {
          .ab-cert-img-clickable .ab-cert-img-hint { opacity:1; transform:translateY(0); }
        }
        .ab-cert-body { padding:18px 20px; display:flex; flex-direction:column; gap:10px; flex:1; min-width:0; }
        .ab-cert-info { display:flex; flex-direction:column; gap:5px; min-width:0; }
        .ab-cert-cat { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; padding:3px 10px; background:rgba(var(--accent-rgb),.1); border:1px solid rgba(var(--accent-rgb),.25); border-radius:4px; color:var(--accent); display:inline-block; width:fit-content; }
        .ab-cert-title { font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:#f0ece4; line-height:1.4; overflow-wrap:anywhere; word-break:break-word; }
        .ab-cert-issuer { font-family:'JetBrains Mono',monospace; font-size:11px; color:#c0bcb4; letter-spacing:.05em; overflow-wrap:anywhere; word-break:break-word; }
        .ab-cert-id { font-family:'JetBrains Mono',monospace; font-size:10px; color:#a8a4a0; letter-spacing:.05em; overflow-wrap:anywhere; word-break:break-word; }
        .ab-cert-meta { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; margin-top:auto; padding-top:10px; border-top:1px solid rgba(255,255,255,0.08); }
        .ab-cert-date { font-family:'JetBrains Mono',monospace; font-size:10px; color:#b0aca8; letter-spacing:.06em; overflow-wrap:anywhere; }
        .ab-cert-link { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.07em; text-transform:uppercase; color:var(--accent); text-decoration:none; opacity:.9; transition:opacity .2s; }
        .ab-cert-link:hover { opacity:1; }

        /* ── Lightbox ── */
        .ab-lightbox { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.94); display:flex; align-items:center; justify-content:center; padding:24px; cursor:pointer; backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); animation:abLbIn .18s ease; }
        @keyframes abLbIn { from{opacity:0} to{opacity:1} }
        .ab-lightbox-img { max-width:90vw; max-height:86vh; object-fit:contain; border-radius:10px; box-shadow:0 32px 96px rgba(0,0,0,0.85); cursor:default; animation:abLbScale .2s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes abLbScale { from{transform:scale(0.88)} to{transform:scale(1)} }
        .ab-lightbox-close { position:absolute; top:20px; right:24px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18); border-radius:50%; width:42px; height:42px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; color:#e8e4dc; transition:background .2s, transform .2s; line-height:1; }
        .ab-lightbox-close:hover { background:rgba(255,255,255,.2); transform:scale(1.1); }

        /* ── Empty state ── */
        .ab-empty { text-align:center; padding:64px 20px; }
        .ab-empty-title { font-family:'Bebas Neue',sans-serif; font-size:30px; color:#4a4a44; letter-spacing:.04em; margin-bottom:8px; }
        .ab-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#4a4a44; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Skeleton ── */
        @keyframes abShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .ab-skel { display:block; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:abShimmer 1.6s ease infinite; border-radius:4px; }
        .ab-skel-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); border-radius:14px; overflow:hidden; margin-bottom:14px; }

        /* ── Responsive ── */
        @media (max-width:900px) { .ab-intro-grid{grid-template-columns:1fr} }
        @media (max-width:767px) {
          .ab-heading{font-size:clamp(52px,14vw,80px)}
          .ab-desc{font-size:14px;line-height:1.8;max-width:100%}
          .ab-nav-wrap{margin:0 -20px;padding:0 20px}
          .ab-nav-btn{padding:9px 8px;font-size:12px;gap:5px;margin:6px 3px}
          .ab-nav-sep{margin:8px 0}
        }
        @media (max-width:599px) {
          .ab-heading{font-size:clamp(44px,16vw,64px)}
          .ab-cert-grid{grid-template-columns:1fr; gap:12px}
          .ab-cert-card{border-radius:12px}
          .ab-cert-body{padding:14px 14px 16px; gap:8px}
          .ab-cert-title{font-size:14px; line-height:1.45}
          .ab-cert-issuer{font-size:10px}
          .ab-cert-meta{flex-direction:column; align-items:flex-start; gap:6px; padding-top:8px}
          .ab-card-head{flex-direction:column;gap:8px}
          .ab-nav-wrap{margin:0 -16px;padding:0 16px}
          .ab-nav-btn{padding:10px 4px;font-size:11px;gap:0;margin:5px 2px;border-radius:8px}
          .ab-nav-num{display:none}
          .ab-nav-label-text{display:none}
          .ab-nav-icon{display:flex}
          .ab-nav-section-label{display:block}
          .ab-nav-sep{margin:7px 0}
        }
        @media (max-width:379px) { .ab-heading{font-size:clamp(38px,18vw,52px)} .ab-nav-btn{padding:8px 2px} }
      `}</style>

      <section id="about" ref={sectionRef}>
        <div className="page-card" style={{ position: "relative" }}>
          <div className="ab-corner-tl" />
          <div className="ab-corner-br" />

          {["about","intro","work","edu","cert","me","life","</>"].map((t, i) => (
            <div key={i} className="ab-float" style={{ left:`${5+i*12}%`, top:`${10+(i%4)*22}%` }}>{t}</div>
          ))}

          {/* ── Page Header ── */}
          <div className="ab-inner" ref={headingRef}>
            <div className="ab-status-tag">
              <span className="ab-status-dot" />
              <span className="ab-status-text">Who I Am</span>
            </div>
            <h2 className="ab-heading">
              <span className="h-accent">A</span>bout <span className="h-accent">M</span>e
            </h2>
            <div className="ab-role-line">Full Stack Developer</div>
            <p className="ab-desc">
              I explore through code, share with empathy, and reflect on every challenge. I thrive on building scalable web solutions and collaborating with teams to bring ideas to life.
            </p>
          </div>

          {/* ── Sticky Tab Nav ── */}
          <div className="ab-nav-wrap">
            <div className="ab-nav-inner">
              {NAV_ITEMS.flatMap((item, idx) => [
                idx > 0 ? <div key={`sep-${idx}`} className="ab-nav-sep" /> : null,
                <button
                  key={item.id}
                  className={`ab-nav-btn${active === item.id ? " active" : ""}`}
                  onClick={() => switchSection(item.id)}
                >
                  {/* desktop: num + label */}
                  <span className="ab-nav-num">{item.num}</span>
                  <span className="ab-nav-label-text">{item.label}</span>
                  {/* mobile: icon only */}
                  <span className="ab-nav-icon">
                    <item.icon size={22} strokeWidth={1.8} />
                  </span>
                </button>,
              ])}
            </div>
            {/* mobile-only section title */}
            <div className="ab-nav-section-label">
              {NAV_ITEMS.find(item => item.id === active)?.label}
            </div>
          </div>

          {/* ── Section Content ── */}
          <div className="ab-inner">
            <div className="ab-content" ref={contentRef}>
              {renderContent()}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function CardsSkeleton() {
  return (
    <div>
      {[0, 1].map(i => (
        <div key={i} className="ab-skel-card">
          <div style={{ height: 3 }} className="ab-skel" />
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
                <Skel w="55%" h={16} />
                <Skel w="38%" h={11} />
                <Skel w="25%" h={10} />
              </div>
              <Skel w={70} h={24} />
            </div>
            <Skel w="90%" h={11} />
            <Skel w="78%" h={11} />
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              {[50, 65, 45].map(w => <Skel key={w} w={w} h={22} />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CertsSkeleton() {
  return (
    <div className="ab-cert-grid">
      {[0, 1, 2].map(i => (
        <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, overflow: "hidden" }}>
          <div className="ab-skel" style={{ aspectRatio: "16/9" }} />
          <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 9 }}>
            <Skel w="78%" h={14} />
            <Skel w="52%" h={10} />
            <Skel w="38%" h={9} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ab-empty">
      <div className="ab-empty-title">{title}</div>
      <div className="ab-empty-sub">{sub}</div>
    </div>
  );
}
