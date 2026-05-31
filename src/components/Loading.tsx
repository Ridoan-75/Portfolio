// components/PageLoader.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Tailwind CSS",
  "GraphQL",
  "PostgreSQL",
  "UI/UX Design",
];

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"loading" | "complete" | "reveal">(
    "loading",
  );
  const [accent, setAccent] = useState("#c8f060");
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accent) setAccent(parsed.accent);
      }
    } catch {}
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loader-status-tag",
        { y: 20, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );
      gsap.fromTo(
        ".loader-corner",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2)",
          delay: 0.5,
          stagger: 0.08,
        },
      );
      gsap.fromTo(
        ".loader-track-dot",
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 0.8 },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Progress animation
  useEffect(() => {
    const duration = 2400;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = elapsed / duration;
      // Eased — fast start, dramatic slowdown near end
      const eased =
        raw < 0.7
          ? raw * 1.2
          : 0.84 + Math.pow((raw - 0.7) / 0.3, 0.6) * 0.16;
      const p = Math.min(Math.floor(eased * 100), 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(tick);
      } else {
        setPhase("complete");
        setTimeout(() => setPhase("reveal"), 700);
        setTimeout(() => setVisible(false), 1400);
      }
    };

    const timer = setTimeout(() => requestAnimationFrame(tick), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={containerRef}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#080808",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "hidden",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

            .loader-grid-bg::before {
              content: '';
              position: absolute;
              inset: 0;
              background-image:
                linear-gradient(rgba(200,240,96,.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200,240,96,.03) 1px, transparent 1px);
              background-size: 44px 44px;
              pointer-events: none;
            }

            .loader-scanline {
              position: absolute;
              left: 0; right: 0;
              height: 1px;
              background: linear-gradient(90deg, transparent, rgba(200,240,96,.1), transparent);
              animation: loaderScan 4s ease-in-out infinite;
              pointer-events: none;
            }

            @keyframes loaderScan {
              0%   { top: 20%; opacity: 0; }
              10%  { opacity: 1; }
              90%  { opacity: 1; }
              100% { top: 80%; opacity: 0; }
            }

            .loader-corner-tl {
              position: absolute;
              top: 0; left: 0;
              width: 120px; height: 120px;
              border-right: 1px solid rgba(200,240,96,.08);
              border-bottom: 1px solid rgba(200,240,96,.08);
              pointer-events: none;
            }

            .loader-corner-br {
              position: absolute;
              bottom: 0; right: 0;
              width: 120px; height: 120px;
              border-left: 1px solid rgba(200,240,96,.08);
              border-top: 1px solid rgba(200,240,96,.08);
              pointer-events: none;
            }

            .loader-track {
              position: absolute;
              width: 1px;
              background: linear-gradient(to bottom, transparent, #1a1a18 30%, #1a1a18 70%, transparent);
              top: 10%; bottom: 10%;
            }

            .loader-track-left { left: 60px; }
            .loader-track-right { right: 60px; }

            .loader-track-dot {
              position: absolute;
              width: 5px; height: 5px;
              border-radius: 50%;
              background: var(--accent);
              left: -2px;
              box-shadow: 0 0 6px var(--accent);
              animation: loaderTrack 3.5s ease-in-out infinite;
            }

            .loader-track-dot.rev {
              animation-direction: reverse;
              animation-delay: 1.5s;
            }

            @keyframes loaderTrack {
              0%   { top: 0; }
              100% { top: calc(100% - 5px); }
            }

            .loader-status-tag {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: rgba(var(--accent-rgb),.06);
              border: 1px solid rgba(var(--accent-rgb),.18);
              border-radius: 3px;
              padding: 6px 14px;
              margin-bottom: 32px;
              opacity: 0;
            }

            .loader-status-dot {
              width: 7px; height: 7px;
              border-radius: 50%;
              background: var(--accent);
              box-shadow: 0 0 6px var(--accent);
              animation: loaderBlink 2s ease infinite;
              flex-shrink: 0;
            }

            @keyframes loaderBlink { 0%,100%{opacity:1} 50%{opacity:.3} }

            .loader-status-text {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              letter-spacing: .12em;
              text-transform: uppercase;
              color: var(--accent);
            }

            .loader-marquee-wrap {
              position: absolute;
              bottom: 0; left: 0; right: 0;
              overflow: hidden;
              border-top: 1px solid #1a1a18;
              background: rgba(5,5,5,.9);
              padding: 12px 0;
            }

            .loader-marquee-inner {
              display: flex;
              width: max-content;
              animation: loaderMarquee 18s linear infinite;
            }

            @keyframes loaderMarquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }

            .loader-marquee-item {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: .15em;
              color: #3a3a36;
              padding: 0 28px;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 12px;
              transition: color .3s;
            }

            .loader-marquee-dot {
              width: 4px; height: 4px;
              border-radius: 50%;
              background: var(--accent);
              opacity: .4;
              flex-shrink: 0;
            }

            @media (max-width: 520px) {
              .loader-track-left { left: 20px; }
              .loader-track-right { right: 20px; }
              .loader-corner-tl { width: 60px; height: 60px; }
              .loader-corner-br { width: 60px; height: 60px; }
            }
          `}</style>

          {/* Grid background */}
          <div
            className="loader-grid-bg"
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Scanline */}
          <div className="loader-scanline" />

          {/* Corner decorations */}
          <div className="loader-corner loader-corner-tl" />
          <div className="loader-corner loader-corner-br" />

          {/* Track lines with animated dots */}
          <div className="loader-track loader-track-left">
            <span className="loader-track-dot" />
          </div>
          <div className="loader-track loader-track-right">
            <span className="loader-track-dot rev" />
          </div>

          {/* Radial glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.35, scale: 1 }}
            transition={{ delay: 0.4, duration: 1.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: "50vw",
              height: "50vw",
              maxWidth: 500,
              maxHeight: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(200,240,96,.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* Status tag */}
          <div className="loader-status-tag">
            <span className="loader-status-dot" />
            <span className="loader-status-text">Loading Portfolio</span>
          </div>

          {/* Big decorative text behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            style={{
              position: "absolute",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(120px, 25vw, 280px)",
              color: "rgba(200,240,96,.02)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            RDN
          </motion.div>

          {/* Name — per letter stagger */}
          <div style={{ overflow: "hidden", marginBottom: 12 }}>
            <motion.div
              ref={nameRef}
              style={{ display: "flex", gap: 0 }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.4 },
                },
              }}
            >
              {"RIDOAN".split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { y: "130%", opacity: 0, skewY: 8 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      skewY: 0,
                      transition: {
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(64px, 12vw, 130px)",
                    color: i === 0 ? accent : "#f0ece4",
                    letterSpacing: "0.04em",
                    lineHeight: 0.92,
                    display: "inline-block",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Role line */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 40,
            }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
              style={{
                width: 28,
                height: 1,
                background: accent,
                transformOrigin: "left",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6a6a60",
              }}
            >
              Full Stack Developer
            </span>
          </motion.div>

          {/* Progress section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              width: "min(260px, 70vw)",
            }}
          >
            {/* Progress track */}
            <div
              style={{
                width: "100%",
                height: 1,
                background: "#1a1a18",
                position: "relative",
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              {/* Fill */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  transformOrigin: "left",
                  background:
                    `linear-gradient(to right, ${accent}, ${accent}aa)`,
                  scaleX: progress / 100,
                }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
              {/* Glow at tip */}
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  left: `${progress}%`,
                  width: 8,
                  height: 9,
                  borderRadius: "50%",
                  background: "rgba(200,240,96,.5)",
                  filter: "blur(4px)",
                  opacity: progress > 0 && progress < 100 ? 1 : 0,
                  transition: "opacity 0.3s",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Counter row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <motion.span
                animate={{
                  color:
                    phase === "complete" || phase === "reveal"
                      ? accent
                      : "#3a3a36",
                }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                }}
              >
                {String(progress).padStart(3, "0")}
              </motion.span>

              <AnimatePresence>
                {phase !== "loading" && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: accent,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Complete
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Tech marquee */}
          <div className="loader-marquee-wrap">
            <div className="loader-marquee-inner">
              {[...techStack, ...techStack, ...techStack, ...techStack].map(
                (item, i) => (
                  <span key={i} className="loader-marquee-item">
                    <span className="loader-marquee-dot" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Reveal wipe */}
          <AnimatePresence>
            {phase === "reveal" && (
              <>
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#080808",
                    transformOrigin: "bottom",
                    zIndex: 10,
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
