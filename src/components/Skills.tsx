"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Skill = {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  createdAt: string;
};

// ── Icon renderer ──────────────────────────────────────────────────────────────
function SkillIcon({ icon, name }: { icon: string | null; name: string }) {
  if (!icon) {
    return (
      <span className="sk-icon-text">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  if (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:")) {
    return <img src={icon} alt={name} className="sk-icon-img" />;
  }
  return <span className="sk-icon-emoji">{icon}</span>;
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function SkillsSkeleton() {
  return (
    <div className="sk-grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="sk-chip-skel">
          <div className="sk-skel-bar" style={{ width: 44, height: 44, borderRadius: 8 }} />
          <div className="sk-skel-bar" style={{ width: "68%", height: 9, borderRadius: 3, marginTop: 2 }} />
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Skills() {
  const [skills, setSkills]     = useState<Skill[]>([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then(r => r.json())
      .then(data => { setSkills(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sk-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".sk-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".sk-role-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".sk-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // chip entrance on tab change
  useEffect(() => {
    if (loading || skills.length === 0) return;
    gsap.fromTo(".sk-chip",
      { y: 28, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.42, stagger: 0.03,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".sk-grid", start: "top 84%", once: false } }
    );
  }, [skills, activeTab, loading]);

  // stats entrance
  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sk-stats",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".sk-stats", start: "top 88%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading]);

  // floating particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".sk-float").forEach(el => {
        gsap.to(el, {
          y: gsap.utils.random(-18, 18), x: gsap.utils.random(-8, 8),
          rotation: gsap.utils.random(-12, 12),
          duration: gsap.utils.random(3, 5), ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(skills.map(s => s.category).filter(Boolean) as string[])].sort();
    return ["All", ...cats];
  }, [skills]);

  const displayed = useMemo(() =>
    activeTab === "All" ? skills : skills.filter(s => s.category === activeTab),
    [skills, activeTab]
  );

  const categoryCount = (cat: string) =>
    cat === "All" ? skills.length : skills.filter(s => s.category === cat).length;

  return (
    <>
      <style>{`
        #skills {
          padding: 80px 60px 80px;
          min-height: 100vh;
          color: #e8e4dc;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        #skills::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px; pointer-events: none; z-index: 0;
        }

        .sk-corner-tl { position:absolute; top:0; left:0; width:180px; height:180px; border-right:1px solid rgba(var(--accent-rgb),.08); border-bottom:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .sk-corner-br { position:absolute; bottom:0; right:0; width:180px; height:180px; border-left:1px solid rgba(var(--accent-rgb),.08); border-top:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .sk-scanline { position:absolute; left:60px; right:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),.12),transparent); top:50%; pointer-events:none; z-index:0; animation:skScan 7s ease-in-out infinite; }
        @keyframes skScan { 0%,100%{transform:translateY(-140px);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateY(140px);opacity:0} }

        .sk-float { position:absolute; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; opacity:.03; pointer-events:none; user-select:none; color:var(--accent); }

        .sk-inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; }

        /* ── Header ── */
        .sk-status-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2); border-radius:3px; padding:7px 14px; width:fit-content; margin-bottom:24px; opacity:0; }
        .sk-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:skBlink 2s ease infinite; flex-shrink:0; }
        @keyframes skBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .sk-status-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }

        .sk-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,120px); line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:20px; opacity:0; }
        .sk-heading .h-accent { color:var(--accent); }

        .sk-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#6a6a60; margin-bottom:18px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; opacity:0; }
        .sk-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }

        .sk-desc { font-size:16px; line-height:1.85; color:#4a4a44; max-width:440px; margin-bottom:44px; opacity:0; }

        /* ── Category tabs ── */
        .sk-tabs { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:32px; }
        .sk-tab-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:#2e2e2c; margin-right:4px; flex-shrink:0; }
        .sk-tab { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.07em; text-transform:uppercase; padding:8px 16px; border-radius:6px; cursor:pointer; border:1px solid #1c1c1a; background:transparent; color:#4a4a44; transition:all .2s; display:inline-flex; align-items:center; gap:6px; }
        .sk-tab:hover { border-color:rgba(var(--accent-rgb),.35); color:var(--accent); background:rgba(var(--accent-rgb),.05); }
        .sk-tab.active { background:rgba(var(--accent-rgb),.12); border-color:rgba(var(--accent-rgb),.45); color:var(--accent); box-shadow:0 0 12px rgba(var(--accent-rgb),.1); }
        .sk-tab-count { display:inline-flex; align-items:center; justify-content:center; background:rgba(var(--accent-rgb),.15); border-radius:3px; padding:1px 6px; font-size:9px; color:var(--accent); font-weight:700; }

        /* ── Skills grid ── */
        .sk-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:12px; margin-bottom:44px; }

        .sk-chip {
          background: rgba(255,255,255,0.04);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 20px 14px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: default; opacity: 0;
          transition: border-color .22s, transform .22s, box-shadow .22s, background .22s;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 12px rgba(0,0,0,0.25);
          position: relative; overflow: hidden;
        }
        .sk-chip::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),.06) 0%, transparent 65%);
          opacity: 0; transition: opacity .25s;
        }
        .sk-chip:hover { border-color:rgba(var(--accent-rgb),.32); transform:translateY(-5px); background:rgba(255,255,255,0.06); box-shadow:inset 0 1px 0 rgba(255,255,255,0.10),0 10px 36px rgba(0,0,0,0.38),0 0 24px rgba(var(--accent-rgb),.06); }
        .sk-chip:hover::before { opacity: 1; }

        .sk-chip-icon { width:48px; height:48px; display:flex; align-items:center; justify-content:center; background:rgba(var(--accent-rgb),.07); border:1px solid rgba(var(--accent-rgb),.14); border-radius:10px; flex-shrink:0; transition:transform .25s; }
        .sk-chip:hover .sk-chip-icon { transform:scale(1.1) rotate(4deg); }

        .sk-icon-img { width:28px; height:28px; object-fit:contain; display:block; }
        .sk-icon-emoji { font-size:24px; line-height:1; }
        .sk-icon-text { font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:var(--accent); letter-spacing:-.02em; }

        .sk-chip-name { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.05em; color:#5a5a56; text-align:center; line-height:1.4; transition:color .2s; }
        .sk-chip:hover .sk-chip-name { color:#c8c4bc; }

        .sk-chip-cat { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:rgba(var(--accent-rgb),.5); padding:2px 7px; background:rgba(var(--accent-rgb),.07); border:1px solid rgba(var(--accent-rgb),.14); border-radius:3px; }

        /* ── Skeleton ── */
        @keyframes skSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk-skel-bar { display:block; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:skSkelShimmer 1.6s ease infinite; }
        .sk-chip-skel { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:12px; padding:20px 14px 16px; display:flex; flex-direction:column; align-items:center; gap:10px; }

        /* ── Empty state ── */
        .sk-empty { grid-column:1/-1; text-align:center; padding:60px 20px; }
        .sk-empty-title { font-family:'Bebas Neue',sans-serif; font-size:32px; color:#2a2a28; letter-spacing:.04em; margin-bottom:8px; }
        .sk-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a28; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Stats ── */
        .sk-stats { display:flex; align-items:stretch; background:linear-gradient(145deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.014) 100%); border:1px solid rgba(255,255,255,.08); box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 4px 20px rgba(0,0,0,.28); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-radius:6px; overflow:hidden; width:fit-content; opacity:0; }
        .sk-stat-item { padding:16px 30px; border-right:1px solid rgba(255,255,255,.07); text-align:center; }
        .sk-stat-item:last-child { border-right:none; }
        .sk-stat-num { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:.03em; line-height:1; color:var(--accent); }
        .sk-stat-label { font-family:'JetBrains Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#3a3a36; margin-top:4px; }

        /* ── Responsive ── */
        @media (max-width:1199px) { #skills{padding:80px 40px 80px} .sk-corner-tl,.sk-corner-br{width:120px;height:120px} }
        @media (max-width:1023px) { #skills{padding:70px 32px 90px} .sk-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))} }
        @media (max-width:767px)  { #skills{padding:60px 24px 90px;padding-top:80px} .sk-heading{font-size:clamp(52px,14vw,80px)} .sk-desc{font-size:14px;line-height:1.8;max-width:100%} .sk-stats{width:100%} .sk-stat-item{flex:1;padding:14px 16px} .sk-corner-tl,.sk-corner-br{width:80px;height:80px} .sk-scanline{left:24px;right:24px} }
        @media (max-width:599px)  { #skills{padding:50px 18px 80px;padding-top:70px} .sk-heading{font-size:clamp(44px,16vw,64px)} .sk-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px} .sk-chip{padding:16px 10px 14px} .sk-stat-num{font-size:28px} .sk-stat-item{padding:12px 10px} .sk-stat-label{font-size:9px} }
        @media (max-width:379px)  { #skills{padding:40px 14px 70px;padding-top:60px} .sk-heading{font-size:clamp(38px,18vw,52px)} .sk-grid{grid-template-columns:repeat(auto-fill,minmax(90px,1fr))} }
      `}</style>

      <section id="skills" ref={sectionRef}>
        <div className="sk-corner-tl" />
        <div className="sk-corner-br" />
        <div className="sk-scanline" />

        {["const", "import", "async", "return", "export", "=>", "type", "{}"].map((t, i) => (
          <div key={i} className="sk-float" style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>
            {t}
          </div>
        ))}

        <div className="sk-inner">

          {/* Header */}
          <div ref={headingRef}>
            <div className="sk-status-tag">
              <span className="sk-status-dot" />
              <span className="sk-status-text">My Tech Stack</span>
            </div>
            <h2 className="sk-heading">
              <span className="h-accent">S</span>kills &amp; <span className="h-accent">T</span>ools
            </h2>
            <div className="sk-role-line">Technologies I build with every day</div>
            <p className="sk-desc">
              Crafting fast, scalable, pixel-perfect web experiences — from
              frontend UI to backend APIs and everything in between.
            </p>
          </div>

          {/* Category filter tabs */}
          {!loading && categories.length > 1 && (
            <div className="sk-tabs">
              <span className="sk-tab-label">Browse //</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`sk-tab${activeTab === cat ? " active" : ""}`}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                  <span className="sk-tab-count">{categoryCount(cat)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Skills grid */}
          {loading ? (
            <SkillsSkeleton />
          ) : skills.length === 0 ? (
            <div className="sk-grid">
              <div className="sk-empty">
                <div className="sk-empty-title">No Skills Yet</div>
                <div className="sk-empty-sub">// Add skills from the admin panel</div>
              </div>
            </div>
          ) : (
            <div className="sk-grid">
              {displayed.map(skill => (
                <div key={skill.id} className="sk-chip">
                  <div className="sk-chip-icon">
                    <SkillIcon icon={skill.icon} name={skill.name} />
                  </div>
                  <span className="sk-chip-name">{skill.name}</span>
                  {skill.category && activeTab === "All" && (
                    <span className="sk-chip-cat">{skill.category}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {!loading && skills.length > 0 && (
            <div className="sk-stats">
              <div className="sk-stat-item">
                <div className="sk-stat-num">{skills.length}+</div>
                <div className="sk-stat-label">Total Skills</div>
              </div>
              {categories.slice(1).map(cat => (
                <div key={cat} className="sk-stat-item">
                  <div className="sk-stat-num">{categoryCount(cat)}+</div>
                  <div className="sk-stat-label">{cat.split(" ")[0]}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
