"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const TECH = [
  "React", "Next.js", "TypeScript", "Node.js",
  "Tailwind CSS", "GraphQL", "PostgreSQL", "UI/UX Design",
  "Prisma", "GSAP", "Framer Motion", "REST API",
];

const STATUS_MSGS = [
  "initializing runtime...",
  "loading assets...",
  "compiling pages...",
  "building components...",
  "finalizing...",
  "portfolio ready",
];

const SEGS = 30;

/*
  RIDOAN — 13 individual SVG strokes, drawn left-to-right
  ViewBox 0 0 348 90

  R  → 3 strokes (accent colour — first letter highlight)
  I  → 1 stroke
  D  → 2 strokes
  O  → 1 stroke (4-segment bezier oval)
  A  → 3 strokes
  N  → 3 strokes
*/
const RIDOAN_PATHS: { d: string; accent: boolean }[] = [
  // ── R (x: 4–46) ──
  { d: "M 4,4 L 4,86",                                           accent: true  }, // vert
  { d: "M 4,4 L 28,4 Q 46,4 46,26 Q 46,47 28,47 L 4,47",        accent: true  }, // bowl
  { d: "M 22,47 L 46,86",                                        accent: true  }, // leg
  // ── I (x: 62) ──
  { d: "M 62,4 L 62,86",                                         accent: false }, // vert
  // ── D (x: 78–130) ──
  { d: "M 78,4 L 78,86",                                         accent: false }, // vert
  { d: "M 78,4 L 103,4 Q 130,4 130,45 Q 130,86 103,86 L 78,86", accent: false }, // curve
  // ── O (x: 144–202) — proper 4-segment bezier oval ──
  { d: "M 173,4 C 190,4 202,22 202,45 C 202,68 190,86 173,86 C 156,86 144,68 144,45 C 144,22 156,4 173,4",
                                                                  accent: false }, // oval
  // ── A (x: 216–272) ──
  { d: "M 216,86 L 244,4",                                       accent: false }, // left leg
  { d: "M 244,4 L 272,86",                                       accent: false }, // right leg
  { d: "M 229,54 L 259,54",                                      accent: false }, // crossbar
  // ── N (x: 284–340) ──
  { d: "M 284,4 L 284,86",                                       accent: false }, // left vert
  { d: "M 284,4 L 340,86",                                       accent: false }, // diagonal
  { d: "M 340,4 L 340,86",                                       accent: false }, // right vert
];

export default function PageLoader() {
  const [progress, setProgress]   = useState(0);
  const [visible, setVisible]     = useState(true);
  const [phase, setPhase]         = useState<"loading" | "complete" | "reveal">("loading");
  const [accent, setAccent] = useState(() => {
    if (typeof window === "undefined") return "#c8f060";
    const fromRoot = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (fromRoot) return fromRoot;
    try {
      const s = localStorage.getItem("site-settings");
      if (s) {
        const p = JSON.parse(s);
        if (p.accent) return p.accent as string;
      }
    } catch {}
    return "#c8f060";
  });
  const [statusIdx, setStatusIdx] = useState(0);
  const [typed, setTyped]         = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const typingRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onSettings = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d?.accent) setAccent(d.accent);
    };
    window.addEventListener("site-settings-change", onSettings);
    return () => window.removeEventListener("site-settings-change", onSettings);
  }, []);

  // typewriter for status messages
  useEffect(() => {
    if (typingRef.current) clearInterval(typingRef.current);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTyped("");
    const msg = STATUS_MSGS[statusIdx];
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setTyped(msg.slice(0, i));
      if (i >= msg.length && typingRef.current) clearInterval(typingRef.current);
    }, 36);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [statusIdx]);

  // GSAP — runs once on mount, accent is already correct (lazy init)
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {

      // corner brackets draw in
      gsap.fromTo(".ld-br",
        { strokeDashoffset: 90 },
        { strokeDashoffset: 0, duration: 0.6, stagger: 0.09, ease: "power3.out", delay: 0.2 }
      );

      // ── RIDOAN path draw-in ──
      const paths = Array.from(
        containerRef.current!.querySelectorAll<SVGPathElement>(".ld-ridoan-path")
      );
      paths.forEach(p => {
        const len = p.getTotalLength();
        p.style.strokeDasharray  = `${len}`;
        p.style.strokeDashoffset = `${len}`;
      });
      // slower: 0.52s per stroke, 0.18s stagger → total ~2.9s for all 13 strokes
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.52,
        stagger: 0.18,
        ease: "power2.inOut",
        delay: 0.35,
        onComplete: () => {
          gsap.fromTo(".ld-ridoan-svg",
            { filter: `drop-shadow(0 0 0px transparent)` },
            {
              filter: `drop-shadow(0 0 20px ${accent}aa)`,
              duration: 0.35, ease: "power2.out",
              onComplete: () =>
                gsap.to(".ld-ridoan-svg", {
                  filter: `drop-shadow(0 0 8px ${accent}44)`,
                  duration: 0.8, ease: "power2.inOut",
                }),
            }
          );
        },
      });

      // dividers appear near end of draw
      gsap.fromTo(".ld-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, stagger: 0.15, ease: "expo.out", delay: 2.6 }
      );

      // role text after dividers
      gsap.fromTo(".ld-role",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 2.85 }
      );

      // progress + status — show early
      gsap.fromTo(".ld-bottom",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.85 }
      );
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // progress tick
  useEffect(() => {
    const dur = 2500;
    const t0  = performance.now();
    const tick = (now: number) => {
      const raw   = (now - t0) / dur;
      const eased = raw < 0.7
        ? raw * 1.2
        : 0.84 + Math.pow((raw - 0.7) / 0.3, 0.6) * 0.16;
      const p   = Math.min(Math.floor(eased * 100), 100);
      const idx = Math.min(
        Math.floor((p / 100) * (STATUS_MSGS.length - 1)),
        STATUS_MSGS.length - 1
      );
      setProgress(p);
      setStatusIdx(prev => prev === idx ? prev : idx);
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        setPhase("complete");
        setTimeout(() => setPhase("reveal"), 820);
        setTimeout(() => setVisible(false), 1520);
      }
    };
    const id = setTimeout(() => requestAnimationFrame(tick), 900);
    return () => clearTimeout(id);
  }, []);

  const filled = Math.round((progress / 100) * SEGS);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden",
            background: "#06070f",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

            /* grid */
            .ld-grid::before {
              content:''; position:absolute; inset:0;
              background-image:
                linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
              background-size:48px 48px; pointer-events:none;
            }

            /* scanline */
            .ld-scan {
              position:absolute; left:0; right:0; height:2px;
              background:linear-gradient(90deg,transparent,rgba(var(--accent-rgb),.18),transparent);
              animation:ldScan 6.5s ease-in-out infinite; pointer-events:none; z-index:1;
            }
            @keyframes ldScan {
              0%  {top:8%;  opacity:0}
              8%  {opacity:1}
              92% {opacity:1}
              100%{top:92%;opacity:0}
            }

            /* corner brackets */
            .ld-br {
              fill:none; stroke:rgba(var(--accent-rgb),.6);
              stroke-width:2; stroke-linecap:square;
              stroke-dasharray:90; stroke-dashoffset:90;
            }

            /* RIDOAN SVG paths — stroke colour set via inline style (no CSS-var flash) */
            .ld-ridoan-path {
              fill:none;
              stroke-linecap:round; stroke-linejoin:round;
              stroke-width:3;
            }

            /* dividers */
            .ld-divider {
              height:1px; transform-origin:center; transform:scaleX(0);
            }

            /* role */
            .ld-role {
              display:flex; align-items:center; gap:14px;
              font-family:'JetBrains Mono',monospace;
              font-size:12px; letter-spacing:.22em;
              text-transform:uppercase; color:#b0aca4;
              opacity:0;
            }
            .ld-role-line { flex:1; height:1px; background:rgba(255,255,255,.1); }

            /* progress + status */
            .ld-bottom { opacity:0; }
            .ld-seg {
              flex:1; height:5px; border-radius:1px;
              transition:background .1s ease, box-shadow .1s ease;
            }
            .ld-status {
              display:flex; align-items:center; gap:7px;
              font-family:'JetBrains Mono',monospace;
              font-size:12px; letter-spacing:.09em; color:#9a9690;
            }
            .ld-cursor {
              display:inline-block; width:7px; height:13px;
              background:var(--accent); border-radius:1px; flex-shrink:0;
              animation:ldCursorBlink .7s step-end infinite;
            }
            @keyframes ldCursorBlink { 0%,100%{opacity:.85} 50%{opacity:0} }

            /* flash */
            .ld-flash {
              position:absolute; inset:0; pointer-events:none;
              background:rgba(var(--accent-rgb),.04);
              animation:ldFlash .55s ease forwards;
            }
            @keyframes ldFlash { 0%{opacity:0} 35%{opacity:1} 100%{opacity:0} }

            /* marquee */
            .ld-marquee-wrap {
              position:absolute; bottom:0; left:0; right:0; overflow:hidden;
              border-top:1px solid rgba(255,255,255,.045);
              background:rgba(4,4,10,.96); padding:10px 0;
            }
            .ld-marquee-inner { display:flex; width:max-content; animation:ldMq 24s linear infinite; }
            @keyframes ldMq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
            .ld-marquee-item {
              font-family:'JetBrains Mono',monospace; font-size:10px;
              text-transform:uppercase; letter-spacing:.18em; color:#282824;
              padding:0 26px; white-space:nowrap;
              display:flex; align-items:center; gap:10px;
            }
            .ld-sep { width:3px; height:3px; border-radius:50%; background:var(--accent); opacity:.38; flex-shrink:0; }

            @media(max-width:520px){
              .ld-ridoan-path { stroke-width:2.5; }
              .ld-role { font-size:10px; letter-spacing:.16em; }
            }
          `}</style>

          {/* grid */}
          <div className="ld-grid" style={{ position:"absolute", inset:0 }} />
          <div className="ld-scan" />

          {/* radial glow */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.3, duration:2.5 }}
            style={{
              position:"absolute", borderRadius:"50%", pointerEvents:"none",
              width:"80vw", height:"80vw", maxWidth:760, maxHeight:760,
              background:"radial-gradient(circle,rgba(var(--accent-rgb),.05) 0%,transparent 65%)",
            }}
          />

          {/* faint watermark behind letters */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.6, duration:2.5 }}
            style={{
              position:"absolute", userSelect:"none", pointerEvents:"none",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(200px,42vw,520px)",
              color:"rgba(255,255,255,.008)",
              letterSpacing:"-0.04em", lineHeight:1, whiteSpace:"nowrap",
            }}
          >
            RDN
          </motion.div>

          {/* ── 4 corner brackets ── */}
          <svg style={{ position:"absolute",top:24,left:24,width:44,height:44,overflow:"visible" }}>
            <polyline className="ld-br" points="44,2 2,2 2,44" />
          </svg>
          <svg style={{ position:"absolute",top:24,right:24,width:44,height:44,overflow:"visible" }}>
            <polyline className="ld-br" points="2,2 42,2 42,44" />
          </svg>
          <svg style={{ position:"absolute",bottom:44,left:24,width:44,height:44,overflow:"visible" }}>
            <polyline className="ld-br" points="44,42 2,42 2,2" />
          </svg>
          <svg style={{ position:"absolute",bottom:44,right:24,width:44,height:44,overflow:"visible" }}>
            <polyline className="ld-br" points="2,42 42,42 42,2" />
          </svg>

          {/* ══════════════════════════════════════════════
              RIDOAN — 13 stroke paths drawn left→right
              R(3) I(1) D(2) O(1) A(3) N(3)
              stagger 0.105s × 12 + 0.38s draw = ~1.65s total
          ══════════════════════════════════════════════ */}
          <svg
            className="ld-ridoan-svg"
            viewBox="0 0 348 90"
            style={{
              width: "min(720px, 84vw)",
              height: "auto",
              display: "block",
              marginBottom: 20,
              flexShrink: 0,
              filter: `drop-shadow(0 0 3px ${accent}22)`,
            }}
          >
            {RIDOAN_PATHS.map((p, i) => (
              <path
                key={i}
                className="ld-ridoan-path"
                d={p.d}
                style={{ stroke: p.accent ? accent : "rgba(240,236,228,.9)" }}
              />
            ))}
          </svg>

          {/* ── top divider ── */}
          <div className="ld-divider" style={{
            width:"min(560px,84vw)", marginBottom:16,
            background:`linear-gradient(to right,transparent,${accent}65,transparent)`,
          }} />

          {/* ── FULL STACK DEVELOPER — visible ── */}
          <div className="ld-role" style={{ width:"min(560px,84vw)", marginBottom:16 }}>
            <div className="ld-role-line" />
            Full Stack Developer
            <div className="ld-role-line" />
          </div>

          {/* ── bottom divider ── */}
          <div className="ld-divider" style={{
            width:"min(560px,84vw)", marginBottom:26,
            background:`linear-gradient(to right,transparent,rgba(255,255,255,.12),transparent)`,
          }} />

          {/* ── progress + status ── */}
          <div className="ld-bottom" style={{ width:"min(560px,84vw)" }}>

            {/* segmented bar */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ display:"flex", gap:3, flex:1 }}>
                {Array.from({ length:SEGS }, (_,i) => (
                  <div key={i} className="ld-seg" style={{
                    background: i < filled
                      ? (i === filled-1 ? accent : `${accent}bb`)
                      : "rgba(255,255,255,.06)",
                    boxShadow: i === filled-1
                      ? `0 0 10px ${accent}, 0 0 22px ${accent}55`
                      : "none",
                  }} />
                ))}
              </div>
              <span style={{
                fontFamily:"'JetBrains Mono',monospace",
                fontSize:13, minWidth:38, textAlign:"right",
                color: progress > 40 ? accent : "#3a3a34",
                transition:"color .4s", letterSpacing:"0.06em",
              }}>
                {String(progress).padStart(3,"0")}
              </span>
            </div>

            {/* typewriter status */}
            <div className="ld-status">
              <span style={{ color:accent }}>$</span>
              <span>{typed}</span>
              <span className="ld-cursor" />
            </div>
          </div>

          {/* complete flash */}
          {phase !== "loading" && <div className="ld-flash" />}

          {/* reveal wipe from bottom */}
          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                initial={{ scaleY:0 }} animate={{ scaleY:1 }}
                transition={{ duration:0.65, ease:[0.76,0,0.24,1] }}
                style={{
                  position:"absolute", inset:0, background:"#06070f",
                  transformOrigin:"bottom", zIndex:10,
                }}
              />
            )}
          </AnimatePresence>

          {/* tech marquee */}
          <div className="ld-marquee-wrap">
            <div className="ld-marquee-inner">
              {[...TECH,...TECH,...TECH,...TECH].map((t,i) => (
                <span key={i} className="ld-marquee-item">
                  <span className="ld-sep" />{t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
