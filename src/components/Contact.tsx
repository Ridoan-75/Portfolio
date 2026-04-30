"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const WEB3FORMS_ACCESS_KEY = "e88bb764-be56-443b-95cb-505c057759ed";

const contactInfo = [
  {
    label: "Email",
    value: "ridoan437@gmail.com",
    href: "mailto:ridoan437@gmail.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,12 2,6" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Chattogram, Bangladesh",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Availability",
    value: "Open to Remote",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function SuccessOverlay({ onReset }: { onReset: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo(
      contentRef.current,
      { scale: 0.7, opacity: 0, y: 40 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 }
    );

    const colors = ["#c8f060", "#a3e635", "#ffffff", "#6a6a62", "#f0ece4"];
    for (let i = 0; i < 28; i++) {
      const dot = document.createElement("span");
      const size = Math.random() * 6 + 3;
      Object.assign(dot.style, {
        position: "fixed",
        left: "50%",
        top: "50%",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: colors[Math.floor(Math.random() * colors.length)],
        pointerEvents: "none",
        zIndex: "9999",
        transform: "translate(-50%,-50%)",
      });
      document.body.appendChild(dot);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 220 + 80;
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
        onComplete: () => dot.remove(),
      });
    }

    const env = document.querySelector(".success-envelope");
    if (env) {
      gsap.fromTo(
        env,
        { y: 0, rotate: -15 },
        {
          y: -18,
          rotate: 8,
          duration: 0.5,
          ease: "power2.out",
          yoyo: true,
          repeat: 3,
          delay: 0.4,
        }
      );
    }
  }, []);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: onReset,
    });
  };

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(8,8,8,0.97)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        ref={contentRef}
        style={{
          textAlign: "center",
          padding: "40px 32px",
          opacity: 0,
        }}
      >
        <div
          className="success-envelope"
          style={{
            fontSize: "72px",
            marginBottom: "24px",
            display: "inline-block",
          }}
        >
          ✉️
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "2px solid rgba(200,240,96,0.3)",
            background: "rgba(200,240,96,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8f060" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "42px",
            color: "#f0ece4",
            letterSpacing: "0.04em",
            lineHeight: 1,
            marginBottom: "10px",
          }}
        >
          Message <span style={{ color: "#c8f060" }}>Sent!</span>
        </div>

        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#8a8a80",
            letterSpacing: "0.06em",
            marginBottom: "6px",
            textTransform: "uppercase",
          }}
        >
          Delivered to ridoan437@gmail.com
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "#7a7a70",
            lineHeight: 1.7,
            marginBottom: "28px",
          }}
        >
          I&apos;ll get back to you as soon as possible.
        </p>

        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#080808",
            background: "#c8f060",
            border: "none",
            padding: "12px 24px",
            borderRadius: "3px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#d4f577";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#c8f060";
          }}
        >
          Send Another →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    gsap.fromTo(
      tagRef.current,
      { y: 24, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );
    gsap.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );
    gsap.fromTo(
      rightRef.current,
      { x: 60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      }
    );
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        gsap.fromTo(
          rightRef.current,
          { x: -8 },
          { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );
        return;
      }
      setErrors({});
      setLoading(true);

      if (btnRef.current) {
        gsap.to(btnRef.current, { scale: 0.96, duration: 0.15, ease: "power2.out" });
      }

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
            from_name: "Portfolio Contact Form",
            replyto: form.email,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setLoading(false);
          setSent(true);
          setForm({ name: "", email: "", subject: "", message: "" });
        } else {
          throw new Error("Failed");
        }
      } catch {
        setLoading(false);
        const mailto = `mailto:ridoan437@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
        window.open(mailto, "_blank");
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      }

      if (btnRef.current) {
        gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form]
  );

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focusedField === field ? "rgba(200,240,96,0.03)" : "#0c0c0a",
    border: `1px solid ${errors[field] ? "rgba(255,80,80,0.4)" : focusedField === field ? "rgba(200,240,96,0.3)" : "#1a1a18"}`,
    borderRadius: "3px",
    padding: "13px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    color: "#e8e4dc",
    outline: "none",
    transition: "border-color 0.25s, background 0.25s, box-shadow 0.25s",
    boxSizing: "border-box" as const,
    resize: "none" as const,
    boxShadow: focusedField === field ? "0 0 0 3px rgba(200,240,96,0.06)" : "none",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#8a8a80",
    marginBottom: "8px",
    display: "block",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        padding: "110px 60px 120px",
        background: "#080808",
        color: "#e8e4dc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        #contact::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(200,240,96,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,240,96,.03) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          z-index: 0;
        }
        .contact-input::placeholder { color: #5a5a50; }
        @media (max-width: 900px) {
          #contact { padding: 80px 24px 100px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: 0, width: 180, height: 180, borderRight: "1px solid rgba(200,240,96,.06)", borderBottom: "1px solid rgba(200,240,96,.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 180, height: 180, borderLeft: "1px solid rgba(200,240,96,.06)", borderTop: "1px solid rgba(200,240,96,.06)", pointerEvents: "none" }} />

      <div style={{ position: "absolute", left: 60, right: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(200,240,96,.08), transparent)", top: "50%", pointerEvents: "none", zIndex: 0, animation: "heroScan 7s ease-in-out infinite" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ marginBottom: "64px" }}>
          <motion.div
            ref={tagRef}
            initial={{ y: 24, opacity: 0, scale: 0.9 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(200,240,96,.06)", border: "1px solid rgba(200,240,96,.2)",
              borderRadius: "3px", padding: "7px 14px", marginBottom: "20px", opacity: 0,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8f060", boxShadow: "0 0 6px #c8f060", flexShrink: 0, animation: "heroBlink 2s ease infinite" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", letterSpacing: ".1em", textTransform: "uppercase", color: "#c8f060" }}>
              Let&apos;s Work Together
            </span>
          </motion.div>

          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(56px,8vw,100px)", lineHeight: 0.92, letterSpacing: ".02em", color: "#f0ece4", marginBottom: "16px" }}>
            Get In <span style={{ color: "#c8f060" }}>Touch</span>
          </h2>

          <div style={{ height: "2px", width: "56px", background: "linear-gradient(90deg, #c8f060, transparent)", marginBottom: "18px" }} />

          <p style={{ fontSize: "15px", color: "#8a8a80", lineHeight: 1.8, maxWidth: "480px" }}>
            Have a project in mind or want to hire me? Drop a message and I&apos;ll get back to you.
          </p>
        </div>

        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "64px", alignItems: "start" }}
        >
          {/* LEFT INFO */}
          <div ref={leftRef} style={{ opacity: 0 }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
              {contactInfo.map((info, i) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ x: 6, borderColor: "rgba(200,240,96,0.25)" }}
                  style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "16px 18px",
                    background: "#0c0c0a",
                    border: "1px solid #1a1a18",
                    borderRadius: "3px",
                    textDecoration: "none",
                    transition: "border-color 0.25s, background 0.25s",
                    color: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(200,240,96,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "#0c0c0a";
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    style={{
                      width: 40, height: 40, borderRadius: "3px",
                      background: "rgba(200,240,96,0.06)", border: "1px solid rgba(200,240,96,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#c8f060", flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </motion.div>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8a8a80", marginBottom: "3px" }}>
                      {info.label}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#b0b0a4" }}>
                      {info.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                background: "#0c0c0a", border: "1px solid #1a1a18",
                borderRadius: "3px", overflow: "hidden",
              }}
            >
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid #1a1a18",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                {["#ff5f57","#febc2e","#28c840"].map((c) => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
                ))}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#6a6a60", letterSpacing: ".06em", marginLeft: 8 }}>
                  response_time.sh
                </span>
              </div>
              <div style={{ padding: "18px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", lineHeight: 2 }}>
                <div style={{ color: "#6a6a60" }}>$ ping ridoan437@gmail.com</div>
                <div style={{ color: "#8a8a80" }}>{">"} avg response: <span style={{ color: "#c8f060" }}>24h</span></div>
                <div style={{ color: "#8a8a80" }}>{">"} timezone: <span style={{ color: "#c8f060" }}>GMT+6</span></div>
                <div style={{ color: "#8a8a80" }}>{">"} status: <span style={{ color: "#c8f060" }}>● online</span></div>
                <div style={{ color: "#6a6a60", marginTop: "4px" }}>$ _</div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT FORM */}
          <div ref={rightRef} style={{ opacity: 0, position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                background: "#0c0c0a",
                border: "1px solid #1a1a18",
                borderRadius: "4px",
                padding: "36px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -1, left: -1, width: 20, height: 20, borderTop: "2px solid rgba(200,240,96,0.4)", borderLeft: "2px solid rgba(200,240,96,0.4)" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 20, height: 20, borderBottom: "2px solid rgba(200,240,96,0.4)", borderRight: "2px solid rgba(200,240,96,0.4)" }} />

              <AnimatePresence>
                {sent && <SuccessOverlay onReset={() => setSent(false)} />}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label style={labelStyle}>Your Name</label>
                    <input
                      className="contact-input"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("name")}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,80,80,0.7)", marginTop: "4px", display: "block" }}
                        >
                          {errors.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <label style={labelStyle}>Email Address</label>
                    <input
                      className="contact-input"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("email")}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,80,80,0.7)", marginTop: "4px", display: "block" }}
                        >
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  style={{ marginBottom: "16px" }}
                >
                  <label style={labelStyle}>Subject</label>
                  <input
                    className="contact-input"
                    type="text"
                    placeholder="Project Inquiry / Hiring / Freelance"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("subject")}
                  />
                  <AnimatePresence>
                    {errors.subject && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,80,80,0.7)", marginTop: "4px", display: "block" }}
                      >
                        {errors.subject}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  style={{ marginBottom: "24px" }}
                >
                  <label style={labelStyle}>Message</label>
                  <textarea
                    className="contact-input"
                    rows={5}
                    placeholder="Tell me about your project..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    style={{ ...inputStyle("message"), resize: "none" }}
                  />
                  <AnimatePresence>
                    {errors.message && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,80,80,0.7)", marginTop: "4px", display: "block" }}
                      >
                        {errors.message}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.button
                  ref={btnRef}
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  style={{
                    width: "100%",
                    padding: "15px 24px",
                    borderRadius: "3px",
                    border: "none",
                    background: loading ? "rgba(200,240,96,0.5)" : "#c8f060",
                    color: "#080808",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      (e.currentTarget as HTMLElement).style.background = "#d4f577";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = loading ? "rgba(200,240,96,0.5)" : "#c8f060";
                  }}
                >
                  {loading ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Send Message
                    </>
                  )}
                </motion.button>

                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#6a6a60", textAlign: "center", marginTop: "14px", letterSpacing: "0.06em" }}>
                  Message goes directly to ridoan437@gmail.com
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes heroScan {
          0%, 100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </section>
  );
}
