"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const WEB3FORMS_ACCESS_KEY = "e88bb764-be56-443b-95cb-505c057759ed";

const contactInfo = [
  {
    label: "Email",
    value: "ridoan437@gmail.com",
    href: "mailto:ridoan437@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,12 2,6"/>
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Chattogram, Bangladesh",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    label: "Availability",
    value: "Open to Remote",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

// ── Success Overlay ──
function SuccessOverlay({ onReset }: { onReset: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(contentRef.current,
      { scale: 0.7, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 }
    );
    // confetti
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#3b82f6";
    const colors = [accent, "#ffffff", "#6a6a62", "#f0ece4"];
    for (let i = 0; i < 28; i++) {
      const dot = document.createElement("span");
      const size = Math.random() * 6 + 3;
      Object.assign(dot.style, {
        position: "fixed", left: "50%", top: "50%",
        width: `${size}px`, height: `${size}px`,
        borderRadius: "50%",
        background: colors[Math.floor(Math.random() * colors.length)],
        pointerEvents: "none", zIndex: "9999",
        transform: "translate(-50%,-50%)",
      });
      document.body.appendChild(dot);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 220 + 80;
      gsap.to(dot, {
        x: Math.cos(angle) * dist, y: Math.sin(angle) * dist,
        opacity: 0, scale: 0, duration: 1.1, ease: "power3.out", delay: 0.15,
        onComplete: () => dot.remove(),
      });
    }
    gsap.fromTo(".success-envelope",
      { y: 0, rotate: -15 },
      { y: -18, rotate: 8, duration: 0.5, ease: "power2.out", yoyo: true, repeat: 3, delay: 0.4 }
    );
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.35, ease: "power2.in", onComplete: onReset,
    });
  };

  return (
    <div ref={overlayRef} style={{
      position: "absolute", inset: 0,
      background: "rgba(8,8,8,0.97)", zIndex: 20,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "4px", backdropFilter: "blur(6px)", opacity: 0,
    }}>
      <div ref={contentRef} style={{ textAlign: "center", padding: "40px 32px", opacity: 0 }}>
        <div className="success-envelope" style={{ fontSize: "72px", marginBottom: "24px", display: "inline-block" }}>
          ✉️
        </div>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: "2px solid rgba(var(--accent-rgb),0.3)", background: "rgba(var(--accent-rgb),0.06)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px",
          color: "#f0ece4", letterSpacing: "0.04em", lineHeight: 1, marginBottom: "10px",
        }}>
          Message <span style={{ color: "var(--accent)" }}>Sent!</span>
        </div>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#8a8a80", letterSpacing: "0.06em", marginBottom: "6px", textTransform: "uppercase" }}>
          Delivered to ridoan437@gmail.com
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#7a7a70", lineHeight: 1.7, marginBottom: "28px" }}>
          I&apos;ll get back to you as soon as possible.
        </p>
        <button
          onClick={handleClose}
          className="ct-send-btn"
          style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#080808", background: "var(--accent)", border: "none",
            padding: "12px 24px", borderRadius: "3px", cursor: "pointer",
          }}
        >
          Send Another →
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const infoRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // ── heading entrance — exact hero pattern
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ct-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".ct-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".ct-role-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".ct-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // ── left/right col entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
      gsap.fromTo(rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── info cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ct-info-card",
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 80%", once: true } }
      );
      gsap.fromTo(".ct-terminal",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 75%", once: true } }
      );
      gsap.fromTo(".ct-form-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power4.out", delay: 0.1,
          scrollTrigger: { trigger: rightRef.current, start: "top 80%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── form fields stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ct-field",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".ct-form-card", start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── floating particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".ct-float").forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-20, 20), x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(3, 5), ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: gsap.utils.random(0, 2),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── info card hover
  const onInfoEnter = useCallback((i: number) => {
    const el = infoRefs.current[i];
    if (!el) return;
    gsap.to(el, { x: 6, borderColor: "rgba(var(--accent-rgb),0.35)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 28px rgba(0,0,0,0.35), 0 0 20px rgba(var(--accent-rgb),0.1)", duration: 0.28, ease: "power3.out" });
    gsap.to(el.querySelector(".ct-info-icon"), { scale: 1.15, rotation: 8, duration: 0.3, ease: "back.out(2)" });
  }, []);

  const onInfoLeave = useCallback((i: number) => {
    const el = infoRefs.current[i];
    if (!el) return;
    gsap.to(el, { x: 0, borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09), 0 3px 16px rgba(0,0,0,0.28), 0 1px 3px rgba(0,0,0,0.35)", duration: 0.35, ease: "power2.out" });
    gsap.to(el.querySelector(".ct-info-icon"), { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      gsap.fromTo(rightRef.current, { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1,0.3)" });
      return;
    }
    setErrors({});
    setLoading(true);
    if (btnRef.current) gsap.to(btnRef.current, { scale: 0.96, duration: 0.15 });
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: form.name, email: form.email,
          subject: form.subject, message: form.message,
          from_name: "Portfolio Contact Form", replyto: form.email,
        }),
      });
      const data = await res.json();
      if (data.success) { setLoading(false); setSent(true); setForm({ name: "", email: "", subject: "", message: "" }); }
      else throw new Error("Failed");
    } catch {
      setLoading(false);
      const mailto = `mailto:ridoan437@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.open(mailto, "_blank");
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    if (btnRef.current) gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box",
    background: focusedField === field ? "rgba(var(--accent-rgb),0.03)" : "#0c0c0a",
    border: `1px solid ${errors[field] ? "rgba(255,80,80,0.4)" : focusedField === field ? "rgba(var(--accent-rgb),0.3)" : "#1a1a18"}`,
    borderRadius: "3px", padding: "13px 16px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    color: "#e8e4dc", outline: "none",
    transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(var(--accent-rgb),0.06)" : "none",
    resize: "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        #contact {
          min-height: 100vh;
          display: flex; flex-direction: column;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
        }

        .ct-corner-tl { position: absolute; top: 0; left: 0; width: 180px; height: 180px; border-right: 1px solid rgba(var(--accent-rgb),.08); border-bottom: 1px solid rgba(var(--accent-rgb),.08); pointer-events: none; }
        .ct-corner-br { position: absolute; bottom: 0; right: 0; width: 180px; height: 180px; border-left: 1px solid rgba(var(--accent-rgb),.08); border-top: 1px solid rgba(var(--accent-rgb),.08); pointer-events: none; }

        .ct-scanline {
          position: absolute; left: 60px; right: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.12), transparent);
          top: 50%; pointer-events: none; z-index: 0;
          animation: ctScan 7s ease-in-out infinite;
        }
        @keyframes ctScan {
          0%,100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; } 85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }

        .ct-inner { max-width: 1100px; margin: 0 auto; width: 100%; position: relative; z-index: 1; }

        /* ── status tag ── */
        .ct-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px;
          width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .ct-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
          animation: ctBlink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes ctBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .ct-status-text {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          letter-spacing: .1em; text-transform: uppercase; color: var(--accent);
        }

        /* ── heading ── */
        .ct-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .ct-heading .h-accent { color: var(--accent); }

        /* ── role line ── */
        .ct-role-line {
          font-family: 'JetBrains Mono', monospace; font-size: 14px;
          letter-spacing: .08em; text-transform: uppercase; color: #e8e4dc;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap; opacity: 0;
        }
        .ct-role-line::before { content: ''; width: 28px; height: 1px; background: var(--accent); flex-shrink: 0; }

        /* ── desc ── */
        .ct-desc {
          font-size: 16px; line-height: 1.85; color: #e8e4dc;
          max-width: 440px; margin-bottom: 52px; opacity: 0;
        }

        /* ── two-col grid ── */
        .ct-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 64px;
          align-items: stretch;
        }

        /* ── info card ── */
        .ct-info-card {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 18px;
          background: linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.016) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.09),
            0 3px 16px rgba(0,0,0,0.28),
            0 1px 3px rgba(0,0,0,0.35);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 6px;
          text-decoration: none; color: inherit;
          will-change: transform; margin-bottom: 10px;
          transition: border-color .25s ease, box-shadow .25s ease;
        }
        .ct-info-card:last-child { margin-bottom: 0; }
        .ct-info-card:hover {
          border-color: rgba(var(--accent-rgb),0.3);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.12),
            0 6px 28px rgba(0,0,0,0.35),
            0 0 20px rgba(var(--accent-rgb),0.1);
        }

        .ct-info-icon {
          width: 40px; height: 40px; border-radius: 3px;
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.15);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); flex-shrink: 0; will-change: transform;
        }

        .ct-info-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: .1em; text-transform: uppercase; color: #8a8a80; margin-bottom: 3px;
        }
        .ct-info-value {
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #b0b0a4;
        }

        /* ── terminal block ── */
        .ct-terminal {
          background: linear-gradient(145deg, rgba(255,255,255,0.048) 0%, rgba(255,255,255,0.014) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 3px 16px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 6px; overflow: hidden; margin-top: 20px;
        }
        .ct-terminal-bar {
          padding: 10px 14px; border-bottom: 1px solid #1a1a18;
          display: flex; align-items: center; gap: 6px;
        }
        .ct-terminal-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .ct-terminal-title {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #6a6a60; letter-spacing: .06em; margin-left: 8px;
        }
        .ct-terminal-body {
          padding: 18px; font-family: 'JetBrains Mono', monospace;
          font-size: 12px; line-height: 2;
        }

        /* ── form card ── */
        .ct-form-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.018) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 6px 32px rgba(0,0,0,0.32),
            0 1px 4px rgba(0,0,0,0.4);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 6px; padding: 36px 32px;
          position: relative; overflow: hidden; opacity: 0;
          height: 100%; box-sizing: border-box;
        }
        .ct-form-corner-tl {
          position: absolute; top: -1px; left: -1px;
          width: 20px; height: 20px;
          border-top: 2px solid rgba(var(--accent-rgb),0.4);
          border-left: 2px solid rgba(var(--accent-rgb),0.4);
        }
        .ct-form-corner-br {
          position: absolute; bottom: -1px; right: -1px;
          width: 20px; height: 20px;
          border-bottom: 2px solid rgba(var(--accent-rgb),0.4);
          border-right: 2px solid rgba(var(--accent-rgb),0.4);
        }

        /* ── form fields ── */
        .ct-field { opacity: 0; }
        .ct-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          letter-spacing: .1em; text-transform: uppercase; color: #8a8a80;
          margin-bottom: 8px; display: block;
        }
        .ct-input::placeholder { color: #5a5a50; }
        .ct-error {
          font-family: 'JetBrains Mono', monospace; font-size: 10px;
          color: rgba(255,80,80,0.7); margin-top: 4px; display: block;
        }

        /* ── send button ── */
        .ct-send-btn {
          width: 100%; padding: 15px 24px; border-radius: 3px; border: none;
          background: var(--accent); color: #080808;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          letter-spacing: .12em; text-transform: uppercase; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px;
          transition: filter .2s;
        }
        .ct-send-btn:hover:not(:disabled) { filter: brightness(1.12); }
        .ct-send-btn:disabled { background: rgba(var(--accent-rgb),0.5); cursor: not-allowed; }

        /* ── float ── */
        .ct-float {
          position: absolute; font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .1em; opacity: .03;
          pointer-events: none; user-select: none; color: var(--accent);
        }

        @keyframes ctSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* ── stats strip ── */
        .ct-stats {
          display: flex; align-items: stretch; margin-top: 52px;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border-radius: 6px;
          overflow: hidden; width: fit-content; opacity: 0;
        }
        .ct-stat-item { padding: 16px 30px; border-right: 1px solid rgba(255,255,255,0.07); text-align: center; }
        .ct-stat-item:last-child { border-right: none; }
        .ct-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: .03em; line-height: 1; }
        .ct-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: #3a3a36; margin-top: 4px; }

        /* ── responsive — exact hero breakpoints ── */
        @media (max-width: 1199px) {
          .ct-heading { font-size: clamp(52px, 8vw, 100px); }
          .ct-corner-tl, .ct-corner-br { width: 120px; height: 120px; }
          .ct-stat-item { padding: 14px 24px; }
          .ct-stat-num { font-size: 34px; }
          .ct-grid { gap: 48px; }
        }
        @media (max-width: 1023px) {
          .ct-heading { font-size: clamp(48px, 8vw, 80px); }
          .ct-grid { grid-template-columns: 1fr; gap: 40px; }
          .ct-desc { max-width: 100%; }
          .ct-corner-tl, .ct-corner-br { width: 100px; height: 100px; }
          .ct-scanline { left: 32px; right: 32px; }
        }
        @media (max-width: 767px) {
          .ct-heading { font-size: clamp(52px, 14vw, 80px); }
          .ct-desc { font-size: 14px; }
          .ct-stats { width: 100%; }
          .ct-stat-item { flex: 1; padding: 14px 16px; }
          .ct-corner-tl, .ct-corner-br { width: 80px; height: 80px; }
          .ct-scanline { left: 24px; right: 24px; }
          .ct-form-card { padding: 24px 20px; }
        }
        @media (max-width: 599px) {
          .ct-heading { font-size: clamp(44px, 16vw, 64px); }
          .ct-role-line { font-size: 10px; gap: 8px; letter-spacing: .06em; }
          .ct-role-line::before { width: 20px; }
          .ct-desc { font-size: 13px; }
          .ct-stat-num { font-size: 28px; }
          .ct-stat-item { padding: 12px 10px; }
          .ct-corner-tl, .ct-corner-br { width: 60px; height: 60px; }
          .ct-grid { gap: 32px; }
        }
        @media (max-width: 379px) {
          .ct-heading { font-size: clamp(38px, 18vw, 52px); }
          .ct-corner-tl, .ct-corner-br { width: 40px; height: 40px; }
          .ct-scanline { left: 14px; right: 14px; }
          .ct-status-text { font-size: 11px; }
        }
        @media (min-width: 1600px) {
          .ct-inner { max-width: 1300px; }
          .ct-heading { font-size: clamp(80px, 9vw, 130px); }
          .ct-desc { font-size: 17px; max-width: 500px; }
          .ct-stat-item { padding: 18px 36px; }
          .ct-stat-num { font-size: 42px; }
        }
      `}</style>

      <section id="contact" ref={sectionRef}>
        <div className="page-card">
        <div className="ct-corner-tl" />
        <div className="ct-corner-br" />
        <div className="ct-scanline" />

        {["mail", "send", "ping", "@", "http", "async", "post", "{}"].map((t, i) => (
          <div key={i} className="ct-float"
            style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>{t}</div>
        ))}

        <div className="ct-inner">

          {/* ── Heading — exact hero pattern ── */}
          <div ref={headingRef}>
            <div className="ct-status-tag">
              <span className="ct-status-dot" />
              <span className="ct-status-text">Let&apos;s Work Together</span>
            </div>

            <h2 className="ct-heading">
              Get In <span className="h-accent">T</span>ouch
            </h2>

            <div className="ct-role-line">
              Have a project in mind? Let&apos;s talk
            </div>

            <p className="ct-desc">
              Open to remote roles, freelance projects, and collaborations.
              Drop a message and I&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* ── Two-col grid ── */}
          <div className="ct-grid">

            {/* ── LEFT ── */}
            <div ref={leftRef} style={{ opacity: 0, display: "flex", flexDirection: "column" }}>
              {/* info cards */}
              <div style={{ marginBottom: "0" }}>
                {contactInfo.map((info, i) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="ct-info-card"
                    ref={(el) => { infoRefs.current[i] = el; }}
                    onMouseEnter={() => onInfoEnter(i)}
                    onMouseLeave={() => onInfoLeave(i)}
                  >
                    <div className="ct-info-icon">{info.icon}</div>
                    <div>
                      <div className="ct-info-label">{info.label}</div>
                      <div className="ct-info-value">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* terminal */}
              <div className="ct-terminal" style={{ flex: 1 }}>
                <div className="ct-terminal-bar">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <span key={c} className="ct-terminal-dot" style={{ background: c }} />
                  ))}
                  <span className="ct-terminal-title">response_time.sh</span>
                </div>
                <div className="ct-terminal-body">
                  <div style={{ color: "#6a6a60" }}>$ ping ridoan437@gmail.com</div>
                  <div style={{ color: "#8a8a80" }}>{"> "}avg response: <span style={{ color: "var(--accent)" }}>24h</span></div>
                  <div style={{ color: "#8a8a80" }}>{"> "}timezone: <span style={{ color: "var(--accent)" }}>GMT+6</span></div>
                  <div style={{ color: "#8a8a80" }}>{"> "}status: <span style={{ color: "var(--accent)" }}>● online</span></div>
                  <div style={{ color: "#6a6a60", marginTop: "4px" }}>$ _</div>
                </div>
              </div>
            </div>

            {/* ── RIGHT FORM ── */}
            <div ref={rightRef} style={{ opacity: 0, position: "relative" }}>
              <div className="ct-form-card">
                <div className="ct-form-corner-tl" />
                <div className="ct-form-corner-br" />

                <AnimatePresence>
                  {sent && <SuccessOverlay onReset={() => setSent(false)} />}
                </AnimatePresence>

                <form onSubmit={handleSubmit} noValidate>
                  {/* name + email */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div className="ct-field">
                      <label className="ct-label">Your Name</label>
                      <input className="ct-input" type="text" placeholder="John Doe"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                        style={inputStyle("name")} />
                      {errors.name && <span className="ct-error">{errors.name}</span>}
                    </div>
                    <div className="ct-field">
                      <label className="ct-label">Email Address</label>
                      <input className="ct-input" type="email" placeholder="john@example.com"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                        style={inputStyle("email")} />
                      {errors.email && <span className="ct-error">{errors.email}</span>}
                    </div>
                  </div>

                  {/* subject */}
                  <div className="ct-field" style={{ marginBottom: "16px" }}>
                    <label className="ct-label">Subject</label>
                    <input className="ct-input" type="text" placeholder="Project Inquiry / Hiring / Freelance"
                      value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      onFocus={() => setFocusedField("subject")} onBlur={() => setFocusedField(null)}
                      style={inputStyle("subject")} />
                    {errors.subject && <span className="ct-error">{errors.subject}</span>}
                  </div>

                  {/* message */}
                  <div className="ct-field" style={{ marginBottom: "24px" }}>
                    <label className="ct-label">Message</label>
                    <textarea className="ct-input" rows={5} placeholder="Tell me about your project..."
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                      style={{ ...inputStyle("message"), resize: "none" }} />
                    {errors.message && <span className="ct-error">{errors.message}</span>}
                  </div>

                  {/* submit */}
                  <button ref={btnRef} type="submit" disabled={loading} className="ct-send-btn">
                    {loading ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "ctSpin 0.8s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>

                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                    color: "#6a6a60", textAlign: "center", marginTop: "14px", letterSpacing: "0.06em",
                  }}>
                    Message goes directly to ridoan437@gmail.com
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* ── Stats strip — exact hero stats bar ── */}
          <div className="ct-stats">
            <div className="ct-stat-item">
              <div className="ct-stat-num" style={{ color: "var(--accent)" }}>24h</div>
              <div className="ct-stat-label">Response</div>
            </div>
            <div className="ct-stat-item">
              <div className="ct-stat-num" style={{ color: "#60a5fa" }}>GMT+6</div>
              <div className="ct-stat-label">Timezone</div>
            </div>
            <div className="ct-stat-item">
              <div className="ct-stat-num" style={{ color: "#93c5fd" }}>100%</div>
              <div className="ct-stat-label">Remote Ready</div>
            </div>
            <div className="ct-stat-item">
              <div className="ct-stat-num" style={{ color: "var(--accent)" }}>●</div>
              <div className="ct-stat-label">Online</div>
            </div>
          </div>

        </div>
        </div>
      </section>
    </>
  );
}