"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(sidebarRef.current, {
      x: -60,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "180px",
          background: "#080808",
          borderRight: "1px solid #1a1a18",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          zIndex: 1000,
        }}
      >
        {/* Avatar */}
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: "var(--accent)", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "18px", color: "#080808", marginBottom: "10px",
        }}>
          R
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "22px", color: "#f0ece4",
          letterSpacing: "0.05em", lineHeight: 1,
        }}>
          MR<span style={{ color: "var(--accent)" }}>H</span>
        </div>

        {/* Role */}
        <div style={{
          fontSize: "9px", color: "#4a4a44",
          letterSpacing: "0.06em", marginTop: "4px",
          fontFamily: "'JetBrains Mono', monospace",
          textTransform: "uppercase",
        }}>
          Full Stack Dev
        </div>

        {/* Open to Work */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "20px", padding: "4px 10px", marginTop: "12px",
          width: "fit-content",
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#c8f060", display: "inline-block",
            animation: "pulse 2s infinite",
          }} />
          <span style={{
            fontSize: "8px", color: "#c8f060",
            letterSpacing: "0.08em",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Open to Work
          </span>
        </div>

        {/* Bottom text */}
        <div style={{
          marginTop: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", color: "#2a2a28",
          letterSpacing: "0.08em",
        }}>
          ridoan@dev
        </div>
      </div>
    </>
  );
}