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

function SkillIcon({ icon, name }: { icon: string | null; name: string }) {
  if (!icon) {
    return <span className="sk-icon-text">{name.slice(0, 2).toUpperCase()}</span>;
  }
  if (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:")) {
    return <img src={icon} alt={name} className="sk-icon-img" />;
  }
  return <span className="sk-icon-emoji">{icon}</span>;
}

function SkillsSkeleton() {
  const sections = [5, 4, 6];
  return (
    <div>
      {sections.map((count, si) => (
        <div key={si}>
          {si > 0 && <div className="sk-divider" />}
          <div className="sk-cat-section">
            {/* fake category header */}
            <div className="sk-cat-head">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="sk-skel-bar" style={{ width: 3, height: 20, borderRadius: 2 }} />
                <div className="sk-skel-bar" style={{ width: 110, height: 16, borderRadius: 4 }} />
              </div>
              <div className="sk-skel-bar" style={{ width: 60, height: 22, borderRadius: 4 }} />
            </div>
            <div className="sk-grid">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="sk-chip-skel">
                  <div className="sk-skel-bar" style={{ width: 64, height: 64, borderRadius: 12 }} />
                  <div className="sk-chip-skel-name sk-skel-bar" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills]   = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/skills")
      .then(r => r.json())
      .then(data => { setSkills(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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

  useEffect(() => {
    if (loading || skills.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sk-chip",
        { y: 28, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 0.42, stagger: 0.03,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".sk-cat-section", start: "top 86%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [skills, loading]);

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

  const skillsByCategory = useMemo(() => {
    const map: Record<string, Skill[]> = {};
    skills.forEach(s => {
      const cat = s.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    });
    return map;
  }, [skills]);

  const categoryNames = useMemo(() => Object.keys(skillsByCategory).sort(), [skillsByCategory]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #skills {
          min-height: 100vh;
          display: flex; flex-direction: column;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
        }

        .sk-corner-tl { position:absolute; top:0; left:0; width:180px; height:180px; border-right:1px solid rgba(var(--accent-rgb),.08); border-bottom:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .sk-corner-br { position:absolute; bottom:0; right:0; width:180px; height:180px; border-left:1px solid rgba(var(--accent-rgb),.08); border-top:1px solid rgba(var(--accent-rgb),.08); pointer-events:none; }
        .sk-scanline { position:absolute; left:60px; right:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),.12),transparent); top:50%; pointer-events:none; z-index:0; animation:skScan 7s ease-in-out infinite; }
        @keyframes skScan { 0%,100%{transform:translateY(-140px);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateY(140px);opacity:0} }

        .sk-float { position:absolute; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.1em; opacity:.03; pointer-events:none; user-select:none; color:var(--accent); }

        .sk-inner { max-width:1100px; margin:0 auto; width:100%; position:relative; z-index:1; }

        /* ── Header ── */
        .sk-status-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2); border-radius:3px; padding:7px 14px; width:fit-content; margin-bottom:24px; opacity:0; }
        .sk-status-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:skBlink 2s ease infinite; flex-shrink:0; }
        @keyframes skBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .sk-status-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }

        .sk-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,120px); line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:20px; opacity:0; }
        .sk-heading .h-accent { color:var(--accent); }

        .sk-role-line { font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:#e8e4dc; margin-bottom:18px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; opacity:0; }
        .sk-role-line::before { content:''; width:28px; height:1px; background:var(--accent); flex-shrink:0; }

        .sk-desc { font-size:16px; line-height:1.85; color:#e8e4dc; max-width:440px; margin-bottom:44px; opacity:0; }

        /* ── Divider ── */
        .sk-divider { height:1px; background:rgba(255,255,255,0.06); margin:0; }

        /* ── Category section ── */
        .sk-cat-section { padding: 28px 0; }
        .sk-cat-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; }
        .sk-cat-title {
          font-family:'Bebas Neue',sans-serif; font-size:22px;
          color:#e8e4dc; line-height:1; letter-spacing:.04em;
          display:flex; align-items:center; gap:12px;
        }
        .sk-cat-title::before { content:''; width:3px; height:20px; background:var(--accent); border-radius:2px; flex-shrink:0; }
        .sk-cat-count {
          font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(var(--accent-rgb),.65);
          background:rgba(var(--accent-rgb),.08); border:1px solid rgba(var(--accent-rgb),.18);
          border-radius:4px; padding:3px 9px;
        }

        /* ── Skills grid ── */
        .sk-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:12px; }

        .sk-chip {
          background: rgba(255,255,255,0.04);
          -webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          padding: 16px 12px 0;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: default; opacity: 0;
          transition: border-color .22s, transform .22s, box-shadow .22s, background .22s;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 12px rgba(0,0,0,0.25);
          position: relative; overflow: hidden;
        }
        .sk-chip::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(var(--accent-rgb),.08) 0%, transparent 65%);
          opacity: 0; transition: opacity .25s;
        }
        .sk-chip:hover { border-color:rgba(var(--accent-rgb),.35); transform:translateY(-6px); background:rgba(255,255,255,0.07); box-shadow:inset 0 1px 0 rgba(255,255,255,0.12),0 12px 40px rgba(0,0,0,0.4),0 0 28px rgba(var(--accent-rgb),.08); }
        .sk-chip:hover::before { opacity: 1; }

        /* Icon container */
        .sk-chip-icon { width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:rgba(var(--accent-rgb),.07); border:1px solid rgba(var(--accent-rgb),.16); border-radius:14px; flex-shrink:0; box-shadow:0 0 0 rgba(var(--accent-rgb),0); transition:box-shadow .25s, border-color .25s; }
        .sk-chip:hover .sk-chip-icon { box-shadow:0 4px 20px rgba(var(--accent-rgb),.18); border-color:rgba(var(--accent-rgb),.35); }

        /* Spin on hover / tap */
        @keyframes skIconSpin {
          0%   { transform: rotate(0deg)   scale(1); }
          55%  { transform: rotate(210deg) scale(1.18); }
          100% { transform: rotate(360deg) scale(1.1); }
        }
        .sk-chip:hover .sk-icon-img,
        .sk-chip:hover .sk-icon-emoji,
        .sk-chip:hover .sk-icon-text,
        .sk-chip:active .sk-icon-img,
        .sk-chip:active .sk-icon-emoji,
        .sk-chip:active .sk-icon-text {
          animation: skIconSpin 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        /* Icon image — bigger */
        .sk-icon-img { width:44px; height:44px; object-fit:contain; display:block; }
        .sk-icon-emoji { font-size:34px; line-height:1; }
        .sk-icon-text { font-family:'DM Sans',sans-serif; font-size:18px; font-weight:700; color:var(--accent); letter-spacing:-.02em; }

        /* Skill name — full-width bottom bar, flush with card edges */
        .sk-chip-name {
          font-family:'DM Sans',sans-serif; font-size:11px; font-weight:600;
          letter-spacing:.04em; text-transform:uppercase;
          color:rgba(var(--accent-rgb),.8);
          text-align:center; line-height:1.3;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          align-self: stretch;
          margin: auto -12px 0;
          padding: 8px 12px;
          background: rgba(var(--accent-rgb),.07);
          border-top: 1px solid rgba(var(--accent-rgb),.15);
          transition: background .2s, color .2s, border-color .2s;
        }
        .sk-chip:hover .sk-chip-name {
          background: rgba(var(--accent-rgb),.14);
          border-color: rgba(var(--accent-rgb),.32);
          color: var(--accent);
        }

        /* ── Skeleton ── */
        @keyframes skSkelShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk-skel-bar { display:block; background:linear-gradient(90deg,#181816 25%,#222220 50%,#181816 75%); background-size:200% 100%; animation:skSkelShimmer 1.6s ease infinite; }
        .sk-chip-skel { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:16px 12px 0; display:flex; flex-direction:column; align-items:center; gap:10px; overflow:hidden; }
        .sk-chip-skel-name { align-self:stretch; height:30px; margin:auto -12px 0; background:rgba(255,255,255,.04); border-top:1px solid rgba(255,255,255,.06); }

        /* ── Empty state ── */
        .sk-empty { grid-column:1/-1; text-align:center; padding:60px 20px; }
        .sk-empty-title { font-family:'Bebas Neue',sans-serif; font-size:32px; color:#2a2a28; letter-spacing:.04em; margin-bottom:8px; }
        .sk-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a2a28; letter-spacing:.08em; text-transform:uppercase; }

        /* ── Stats ── */
        .sk-stats { display:flex; align-items:stretch; background:linear-gradient(145deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,.014) 100%); border:1px solid rgba(255,255,255,.08); box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 4px 20px rgba(0,0,0,.28); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-radius:6px; overflow:hidden; width:fit-content; opacity:0; margin-top:8px; }
        .sk-stat-item { padding:16px 30px; border-right:1px solid rgba(255,255,255,.07); text-align:center; }
        .sk-stat-item:last-child { border-right:none; }
        .sk-stat-num { font-family:'Bebas Neue',sans-serif; font-size:38px; letter-spacing:.03em; line-height:1; color:var(--accent); }
        .sk-stat-label { font-family:'JetBrains Mono',monospace; font-size:11px; text-transform:uppercase; letter-spacing:.12em; color:#7a7670; margin-top:4px; }

        /* ── Responsive ── */
        @media (max-width:1199px) { .sk-corner-tl,.sk-corner-br{width:120px;height:120px} }
        @media (max-width:1023px) { .sk-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))} }
        @media (max-width:767px) {
          .sk-heading{font-size:clamp(52px,14vw,80px)}
          .sk-desc{font-size:15px;line-height:1.8;max-width:100%}
          .sk-cat-title{font-size:20px}
          .sk-chip-name{font-size:12px;padding:8px 10px}
          .sk-stats{width:100%} .sk-stat-item{flex:1;padding:14px 16px}
          .sk-corner-tl,.sk-corner-br{width:80px;height:80px}
          .sk-scanline{left:24px;right:24px}
        }
        @media (max-width:599px) {
          .sk-heading{font-size:clamp(44px,16vw,64px)}
          .sk-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px}
          .sk-chip{padding:14px 12px 0;gap:9px}
          .sk-chip-icon{width:56px;height:56px}
          .sk-icon-img{width:36px;height:36px} .sk-icon-emoji{font-size:28px}
          .sk-chip-name{font-size:12px;padding:7px 12px;letter-spacing:.03em;margin:auto -12px 0}
          .sk-chip-skel-name{margin:auto -12px 0}
          .sk-cat-title{font-size:18px} .sk-cat-count{font-size:10px}
          .sk-stat-num{font-size:28px} .sk-stat-item{padding:12px 10px} .sk-stat-label{font-size:10px}
        }
        @media (max-width:379px) {
          .sk-heading{font-size:clamp(38px,18vw,52px)}
          .sk-grid{grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px}
          .sk-chip-name{font-size:11px;padding:6px 12px}
        }
      `}</style>

      <section id="skills" ref={sectionRef}>
        <div className="page-card">
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

            {/* Category sections with dividers */}
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
              categoryNames.map((cat, idx) => (
                <div key={cat}>
                  {idx > 0 && <div className="sk-divider" />}
                  <div className="sk-cat-section">
                    <div className="sk-cat-head">
                      <span className="sk-cat-title">{cat}</span>
                      <span className="sk-cat-count">{skillsByCategory[cat].length} skills</span>
                    </div>
                    <div className="sk-grid">
                      {skillsByCategory[cat].map(skill => (
                        <div key={skill.id} className="sk-chip">
                          <div className="sk-chip-icon">
                            <SkillIcon icon={skill.icon} name={skill.name} />
                          </div>
                          <span className="sk-chip-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Stats */}
            {!loading && skills.length > 0 && (
              <div className="sk-stats">
                <div className="sk-stat-item">
                  <div className="sk-stat-num">{skills.length}+</div>
                  <div className="sk-stat-label">Total Skills</div>
                </div>
                {categoryNames.map(cat => (
                  <div key={cat} className="sk-stat-item">
                    <div className="sk-stat-num">{skillsByCategory[cat].length}+</div>
                    <div className="sk-stat-label">{cat.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
