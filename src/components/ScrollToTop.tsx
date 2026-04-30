// components/ScrollToTop.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rocketTrailRef = useRef<HTMLDivElement>(null);

  // Track scroll position + visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      setVisible(scrollTop > 300);
      setScrollPercent(percent);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animating) return;
      setAnimating(true);

      const overlay = overlayRef.current;
      const trail = rocketTrailRef.current;
      if (!overlay || !trail) return;

      // ── Phase 1: Rocket trail shoots up from button ──
      trail.style.transition = "none";
      trail.style.opacity = "1";
      trail.style.transform = "scaleY(0)";
      trail.getBoundingClientRect();
      trail.style.transition =
        "transform 0.35s cubic-bezier(0.76, 0, 0.24, 1)";
      trail.style.transform = "scaleY(1)";

      // ── Phase 2: Overlay wipe UP ──
      setTimeout(() => {
        overlay.style.transition = "none";
        overlay.style.transform = "translateY(100%)";
        overlay.getBoundingClientRect();

        overlay.style.transition =
          "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)";
        overlay.style.transform = "translateY(0%)";

        // Hide trail
        trail.style.transition = "opacity 0.2s";
        trail.style.opacity = "0";
      }, 200);

      // ── Phase 3: Scroll while covered ──
      setTimeout(() => {
        window.scrollTo({ top: 0 });
      }, 520);

      // ── Phase 4: Overlay slides OFF upward ──
      setTimeout(() => {
        overlay.style.transition =
          "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)";
        overlay.style.transform = "translateY(-100%)";

        setTimeout(() => {
          overlay.style.transition = "none";
          overlay.style.transform = "translateY(100%)";
          trail.style.transition = "none";
          trail.style.opacity = "0";
          trail.style.transform = "scaleY(0)";
          setAnimating(false);
        }, 420);
      }, 620);
    },
    [animating],
  );

  // SVG circle progress
  const circumference = 2 * Math.PI * 20;
  const strokeOffset = circumference - scrollPercent * circumference;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes scrollTopPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,240,96,.4); }
          50% { box-shadow: 0 0 0 10px rgba(200,240,96,0); }
        }

        @keyframes scrollTopFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes scrollTopParticle {
          0% { transform: translateY(0) scale(1); opacity: .7; }
          100% { transform: translateY(-30px) scale(0); opacity: 0; }
        }

        .stt-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 999;
          padding: 0;
          animation: scrollTopFloat 3s ease-in-out infinite;
        }

        .stt-btn[data-animating="true"] {
          cursor: not-allowed;
          animation: none;
        }

        .stt-btn:hover .stt-inner {
          background: #d4f577;
          transform: scale(1.08);
        }

        .stt-btn:active .stt-inner {
          transform: scale(0.92);
        }

        .stt-inner {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #c8f060;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 20px rgba(200,240,96,.25);
          z-index: 2;
        }

        .stt-progress-ring {
          position: absolute;
          width: 52px;
          height: 52px;
          transform: rotate(-90deg);
          z-index: 1;
        }

        .stt-label {
          position: absolute;
          bottom: calc(100% + 10px);
          right: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #c8f060;
          background: #0e0e0c;
          border: 1px solid rgba(200,240,96,.15);
          border-radius: 3px;
          padding: 5px 10px;
          white-space: nowrap;
          pointer-events: none;
        }

        .stt-label::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 18px;
          width: 7px;
          height: 7px;
          background: #0e0e0c;
          border-right: 1px solid rgba(200,240,96,.15);
          border-bottom: 1px solid rgba(200,240,96,.15);
          transform: rotate(45deg);
        }

        .stt-particles {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 40px;
          pointer-events: none;
          z-index: 0;
        }

        .stt-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #c8f060;
          bottom: 0;
          animation: scrollTopParticle 1.2s ease-out infinite;
        }

        .stt-particle:nth-child(1) { left: 2px; animation-delay: 0s; }
        .stt-particle:nth-child(2) { left: 9px; animation-delay: .3s; }
        .stt-particle:nth-child(3) { left: 16px; animation-delay: .6s; }
      `}</style>

      {/* Rocket trail effect */}
      <div
        ref={rocketTrailRef}
        style={{
          position: "fixed",
          bottom: 0,
          right: 54,
          width: 2,
          height: "100vh",
          background:
            "linear-gradient(to top, #c8f060, rgba(200,240,96,.3), transparent)",
          transformOrigin: "bottom",
          transform: "scaleY(0)",
          opacity: 0,
          zIndex: 997,
          pointerEvents: "none",
        }}
      />

      {/* Full-screen wipe overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          transform: "translateY(100%)",
          zIndex: 998,
          pointerEvents: "none",
          willChange: "transform",
          overflow: "hidden",
        }}
      >
        {/* Overlay background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#c8f060",
          }}
        />
        {/* Grid pattern on overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(8,8,8,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,8,8,.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            pointerEvents: "none",
          }}
        />
        {/* Center text on overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#080808",
              opacity: 0.5,
            }}
          >
            ↑ Back to Top
          </span>
        </div>
      </div>

      {/* Button */}
      <AnimatePresence>
        {visible && (
          <motion.button
            className="stt-btn"
            data-animating={animating}
            onClick={scrollTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            {/* Progress ring */}
            <svg className="stt-progress-ring" viewBox="0 0 52 52">
              {/* Track */}
              <circle
                cx="26"
                cy="26"
                r="20"
                fill="none"
                stroke="rgba(200,240,96,.12)"
                strokeWidth="2"
              />
              {/* Progress */}
              <circle
                cx="26"
                cy="26"
                r="20"
                fill="none"
                stroke="#c8f060"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                style={{ transition: "stroke-dashoffset 0.15s ease" }}
              />
            </svg>

            {/* Inner circle */}
            <div className="stt-inner">
              <motion.div
                animate={
                  hovered && !animating
                    ? { y: [0, -3, 0] }
                    : { y: 0 }
                }
                transition={
                  hovered && !animating
                    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              >
                <ArrowUp size={18} color="#080808" strokeWidth={2.5} />
              </motion.div>
            </div>

            {/* Hover particles */}
            <AnimatePresence>
              {hovered && !animating && (
                <div className="stt-particles">
                  <span className="stt-particle" />
                  <span className="stt-particle" />
                  <span className="stt-particle" />
                </div>
              )}
            </AnimatePresence>

            {/* Tooltip on hover */}
            <AnimatePresence>
              {hovered && !animating && (
                <motion.div
                  className="stt-label"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  Back to Top
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
