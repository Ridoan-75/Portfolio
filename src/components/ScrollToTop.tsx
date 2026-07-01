"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setVisible(scrollTop > 300);
      setScrollPercent(percent);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = useCallback(() => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    const start = window.scrollY;
    const duration = Math.min(800, Math.max(300, start * 0.4));
    let startTime: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start * (1 - easeOutCubic(progress)));
      if (progress < 1) requestAnimationFrame(step);
      else { window.scrollTo(0, 0); isScrolling.current = false; }
    };
    requestAnimationFrame(step);
  }, []);

  const circumference = 2 * Math.PI * 20;
  const strokeOffset = circumference - scrollPercent * circumference;

  return (
    <>
      <style>{`
        @keyframes sttFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .stt-btn {
          position: fixed;
          bottom: 32px; right: 32px;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 999; padding: 0;
          transition: background .2s;
          animation: sttFloat 3s ease-in-out infinite;
        }

        .stt-btn:hover { background: rgba(var(--accent-rgb),0.1); }
        .stt-btn:active { transform: scale(0.92); }

        .stt-inner {
          position: absolute; width: 32px; height: 32px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: var(--accent); z-index: 2;
        }

        .stt-progress-ring {
          position: absolute; width: 48px; height: 48px;
          transform: rotate(-90deg); z-index: 1;
        }


        @media (max-width: 768px) {
          .stt-btn { bottom: 24px; right: 24px; }
        }
        @media (max-width: 599px) {
          .stt-btn { bottom: 20px; right: 20px; width: 44px; height: 44px; }
          .stt-progress-ring { width: 44px; height: 44px; }
          .stt-inner { width: 28px; height: 28px; }
        }
        @media (max-width: 379px) {
          .stt-btn { bottom: 16px; right: 16px; }
        }
        @media (hover: none) {
          .stt-btn:hover { background: transparent; }
          .stt-btn:active { transform: scale(0.92); }
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.button
            className="stt-btn"
            onClick={scrollTop}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <svg className="stt-progress-ring" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none"
                style={{ stroke: "rgba(var(--accent-rgb),.12)" }} strokeWidth="2" />
              <circle cx="24" cy="24" r="20" fill="none"
                style={{ stroke: "var(--accent)", transition: "stroke-dashoffset 0.15s ease" }}
                strokeWidth="2" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
              />
            </svg>

            <div className="stt-inner">
              <ArrowUp size={16} strokeWidth={2.5} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
