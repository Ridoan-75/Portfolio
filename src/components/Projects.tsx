"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

gsap.registerPlugin(ScrollTrigger);
const filters = ["All", "React", "Next.js", "Full Stack", "Landing Page"];

const projects = [
  {
    title: "SaaS Dashboard",
    category: "Full Stack",
    description:
      "A feature-rich analytics dashboard with real-time data visualization, user management, and role-based access control.",
    tags: ["Next.js", "TypeScript", "Express", "Tailwind", "Prisma", "PostgreSQL", "Node.js"],
    image: "/eco.png",
    live: "https://ecospark-frontend-gules.vercel.app",
    github: "https://github.com/Ridoan-75/ecospark-frontend",
    year: "2026",
    featured: true,
  },
  {
    title: "Medical Store E-commerce",
    category: "Full Stack",
    description:
      "Full-featured online store with Stripe payments, product filtering, cart system, and admin panel.",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL", "Node.js", "Tailwind"],
    color: "#a3e635",
    image: "/medistore.png",
    live: "https://medistore-client-lime.vercel.app/",
    github: "https://github.com/Ridoan-75/medistore-client",
    year: "2026",
    featured: true,
  },
  {
    title: "Nike Product Page",
    category: "Frontend",
    description:
      "A visually stunning product page with 3D model viewer, interactive color selector, and smooth GSAP animations.",
    tags: ["React", "tailwind", "Framer Motion", "Vercel"],
    color: "#c8f060",
    image: "/nike.png",
    live: "https://nike-1-drab.vercel.app/",
    github: "https://github.com/Ridoan-75/Nike",
    year: "2025",
    featured: false,
  },
  {
    title: "Dashboard Design",
    category: "Landing Page",
    description:
      "A clean and modern landing page for a SaaS product with smooth scroll animations and a call-to-action.",
    tags: ["Rect", "Tailwind", "Vercel"],
    color: "#a3e635",
    image: "/dashboard.png",
    live: "https://dashboard-ashen-psi.vercel.app/",
    github: "https://github.com/Ridoan-75/Dashboard",
    year: "2025",
    featured: false,
  },
  {
    title: "Food Website",
    category: "Frontend",
    description:
      "A modern restaurant website with menu filtering, reservation form, and GSAP-powered scroll animations.",
    tags: ["React js", "tailwind", "Vercel"],
    color: "#c8f060",
    image: "/foodie.png",
    live: "https://foodie-website-d3s3.vercel.app/",
    github: "https://github.com/Ridoan-75/Foodie-Website",
    year: "2025",
    featured: false,
  },
  {
    title: "Finance Landing Page",
    category: "React",
    description:
      "A sleek landing page for a finance app with interactive features, smooth animations, and responsive design.",
    tags: ["React", "Tailwind", "Vercel"],
    color: "#a3e635",
    image: "/finance.png",
    live: "https://finance-website-cyan.vercel.app",
    github: "https://github.com/Ridoan-75/Finance-Website",
    year: "2024",
    featured: false,
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
      }
    );
  }, [index]);

  // 🖱️ Mouse move এ 3D tilt effect (GSAP দিয়ে)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      gsap.to(el, {
        rotateX: ((y - cy) / cy) * -6,
        rotateY: ((x - cx) / cx) * 6,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 900,
      });
    },
    []
  );

  // 🖱️ Mouse leave এ card আবার flat position এ ফিরে আসবে
  const handleMouseLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1,0.6)",
      transformPerspective: 900,
    });
    setHovered(false);
  }, []);

  return (
    // 🎭 Framer Motion — filter change এ card layout animation
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ perspective: "900px" }}
    >
      <div ref={cardRef} style={{ opacity: 0 }}>
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            background: "#0c0c0a",
            border: `1px solid ${hovered ? "rgba(200,240,96,0.25)" : "#1a1a18"}`,
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
            transition: "border-color 0.3s",
            willChange: "transform",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: "200px",
              background: hovered
                ? "linear-gradient(135deg, #111108 0%, #080808 100%)"
                : "#080808",
              borderBottom: "1px solid #1a1a18",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              transition: "background 0.4s",
            }}
          >
            {/* 🔲 Grid pattern background (banner এর ভিতরে) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(200,240,96,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,96,.04) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                pointerEvents: "none",
              }}
            />

            {/* ✨ Glow orb effect (hover এ bright হয়) */}
            <div
              style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(200,240,96,${hovered ? "0.12" : "0.04"}) 0%, transparent 70%)`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                transition: "opacity 0.4s",
                pointerEvents: "none",
              }}
            />

            {/* ======================================== */}
            {/* 🖼️ Project Image                         */}
            {/* Next.js Image component use করা হয়েছে    */}
            {/* image load fail হলে project title দেখাবে  */}
            {/* Hover এ image একটু zoom হবে (scale effect) */}
            {/* ======================================== */}
            <motion.div
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: "relative",
                zIndex: 1,
                width: "85%",
                height: "75%",
                borderRadius: "3px",
                overflow: "hidden",
                border: "1px solid rgba(200,240,96,0.08)",
              }}
            >
              {!imageError ? (
                // ✅ Image load হলে — project এর screenshot দেখাবে
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 350px"
                  style={{ objectFit: "cover" }}
                  onError={() => setImageError(true)}
                />
              ) : (
                // ❌ Image load fail হলে — fallback UI দেখাবে (title + icon)
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #0e0e0c 0%, #080808 100%)",
                    gap: "8px",
                  }}
                >
                  {/* Fallback icon — image না থাকলে এই icon দেখাবে */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(200,240,96,0.3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "rgba(200,240,96,0.25)",
                      letterSpacing: "0.06em",
                      textAlign: "center",
                      padding: "0 12px",
                    }}
                  >
                    {project.title}
                  </span>
                </div>
              )}
            </motion.div>

            {/* 📅 Year badge (উপরে ডানদিকে project এর সাল দেখাবে) */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                padding: "4px 10px",
                background: "rgba(200,240,96,0.06)",
                border: "1px solid rgba(200,240,96,0.18)",
                borderRadius: "3px",
                fontSize: "11px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#c8f060",
                letterSpacing: "0.08em",
                zIndex: 2,
              }}
            >
              {project.year}
            </div>

            {/* ⭐ Featured badge (featured: true হলে উপরে বামদিকে দেখাবে) */}
            {project.featured && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "4px 10px",
                  background: "rgba(200,240,96,0.08)",
                  border: "1px solid rgba(200,240,96,0.2)",
                  borderRadius: "3px",
                  fontSize: "10px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#c8f060",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  zIndex: 2,
                }}
              >
                ★ Featured
              </motion.div>
            )}
          </div>

          {/* ====================================== */}
          {/* 📝 Content Section                     */}
          {/* Card এর নিচের অংশ — title, description,*/}
          {/* tags, আর buttons দেখায়।                */}
          {/* ====================================== */}
          <div
            style={{
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            {/* 🏷️ Category label (যেমন: React, Next.js, etc.) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: "inline-block",
                padding: "3px 10px",
                background: "rgba(200,240,96,0.06)",
                border: "1px solid rgba(200,240,96,0.15)",
                borderRadius: "2px",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#c8f060",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px",
                width: "fit-content",
                cursor: "default",
              }}
            >
              {project.category}
            </motion.div>

            {/* 📌 Project title */}
            <h3
              style={{
                fontSize: "18px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 400,
                color: "#f0ece4",
                marginBottom: "10px",
                letterSpacing: "0.04em",
              }}
            >
              {project.title}
            </h3>

            {/* 📖 Project description */}
            <p
              style={{
                fontSize: "13px",
                color: "#9a9a90",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.75,
                marginBottom: "18px",
                flex: 1,
              }}
            >
              {project.description}
            </p>

            {/* 🏷️ Technology tags (কি কি tech use করা হয়েছে) */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "20px",
              }}
            >
              {project.tags.map((tag, tagIdx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * tagIdx, duration: 0.3 }}
                  whileHover={{
                    borderColor: "rgba(200,240,96,0.3)",
                    color: "#c8f060",
                    transition: { duration: 0.2 },
                  }}
                  style={{
                    padding: "3px 9px",
                    background: "#0e0e0c",
                    border: "1px solid #2a2a25",
                    borderRadius: "2px",
                    fontSize: "10px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#8a8a80",
                    letterSpacing: "0.06em",
                    cursor: "default",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* 🔗 Action buttons (Live Demo + GitHub) */}
            <div style={{ display: "flex", gap: "8px" }}>
              <CardBtn href={project.live} primary>
                Live Demo ↗
              </CardBtn>
              <CardBtn href={project.github}>GitHub →</CardBtn>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================
// 🔘 CardBtn Component (Magnetic Button)
// ---------------------------------------------
// Card এর ভিতরের button — Live Demo আর GitHub।
// GSAP দিয়ে magnetic hover effect আছে —
// mouse কাছে আনলে button mouse এর দিকে টানবে।
// =============================================
function CardBtn({
  children,
  href,
  primary,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      // ✨ Framer Motion — hover এ button একটু বড় হবে
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      // 🧲 GSAP magnetic effect — mouse move এ button follow করবে
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(el, { x, y, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() =>
        gsap.to(ref.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1,0.5)",
        })
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "3px",
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.08em",
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
        textTransform: "uppercase",
        ...(primary
          ? {
              background: "rgba(200,240,96,0.08)",
              border: "1px solid rgba(200,240,96,0.25)",
              color: "#c8f060",
            }
          : {
              background: "transparent",
              border: "1px solid #1e1e1a",
              color: "#9a9a90",
            }),
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (primary) {
          el.style.background = "rgba(200,240,96,0.15)";
        } else {
          el.style.borderColor = "rgba(200,240,96,0.2)";
          el.style.color = "#c8f060";
        }
      }}
      onMouseOut={(e) => {
        const el = e.currentTarget as HTMLElement;
        if (primary) {
          el.style.background = "rgba(200,240,96,0.08)";
        } else {
          el.style.borderColor = "#1e1e1a";
          el.style.color = "#9a9a90";
        }
      }}
    >
      {children}
    </motion.a>
  );
}

// =============================================
// 🔘 FilterPill Component (Filter Button)
// ---------------------------------------------
// উপরের filter buttons — All, React, Next.js, etc.
// Active filter highlight হবে।
// GSAP magnetic effect + count badge আছে।
// =============================================
function FilterPill({
  label,
  active,
  onClick,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      // ✨ Framer Motion — hover + tap animation
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
      // 🧲 GSAP magnetic effect
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(el, { x, y, duration: 0.2, ease: "power2.out" });
      }}
      onMouseLeave={() =>
        gsap.to(ref.current, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1,0.5)",
        })
      }
      style={{
        padding: "7px 16px",
        borderRadius: "3px",
        border: active
          ? "1px solid rgba(200,240,96,0.35)"
          : "1px solid #1a1a18",
        background: active ? "rgba(200,240,96,0.08)" : "transparent",
        color: active ? "#c8f060" : "#8a8a80",
        fontSize: "11px",
        fontFamily: "'JetBrains Mono', monospace",
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {label}
      {/* 🔢 Filter count badge */}
      <span
        style={{
          fontSize: "10px",
          background: active ? "rgba(200,240,96,0.12)" : "#0e0e0c",
          border: `1px solid ${active ? "rgba(200,240,96,0.2)" : "#1a1a18"}`,
          borderRadius: "2px",
          padding: "1px 5px",
          color: active ? "#a3e635" : "#7a7a70",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {count}
      </span>
    </motion.button>
  );
}

// =============================================
// 🏠 Main Projects Component (এটাই export হয়)
// ---------------------------------------------
// পুরো Projects section এটা render করে —
// heading, filters, project grid, আর GitHub CTA।
//
// 🎨 Animations breakdown:
// - Heading: GSAP scroll-triggered fade + skew
// - Tag badge: GSAP scale + bounce
// - Line: GSAP scaleX from left
// - Filters: GSAP fade-in
// - Cards: GSAP staggered scroll animation
// - Filter change: Framer Motion AnimatePresence
// =============================================
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const headingRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // 🔍 Filter logic — active filter অনুযায়ী project filter করে
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // 🔢 প্রতিটা filter এ কতটা project আছে সেটা count করে
  const getCount = (f: string) =>
    f === "All"
      ? projects.length
      : projects.filter((p) => p.category === f).length;

  // 🎬 GSAP heading animations — page scroll এ heading section animate হবে
  useEffect(() => {
    // Tag badge animation (Selected Work badge)
    gsap.fromTo(
      tagRef.current,
      { y: 24, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    // Main heading animation (Featured Projects title)
    gsap.fromTo(
      headingRef.current,
      { y: 40, opacity: 0, skewY: 2 },
      {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 0.9,
        ease: "power4.out",
        delay: 0.1,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    // Accent line animation (title এর নিচে সবুজ line)
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    // Filter buttons animation
    gsap.fromTo(
      filterRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.4,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section
      id="projects"
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
      {/* 🔤 Google Fonts import + responsive CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        @media (max-width: 900px) {
          #projects { padding: 80px 24px 100px !important; }
          .proj-grid { grid-template-columns: 1fr !important; }
          .proj-filters { gap: 6px !important; }
        }
        @media (max-width: 520px) {
          .proj-filters { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>

      {/* 🔲 Grid background pattern (পুরো section এ subtle grid) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(200,240,96,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,96,.03) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* 📐 Corner decorations (উপরে-বামে আর নিচে-ডানে border) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "180px",
          height: "180px",
          borderRight: "1px solid rgba(200,240,96,.06)",
          borderBottom: "1px solid rgba(200,240,96,.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "180px",
          height: "180px",
          borderLeft: "1px solid rgba(200,240,96,.06)",
          borderTop: "1px solid rgba(200,240,96,.06)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ====================================== */}
        {/* 📝 Heading Section                     */}
        {/* "Selected Work" badge + "Featured      */}
        {/* Projects" title + accent line +         */}
        {/* subtitle text                           */}
        {/* ====================================== */}
        <div style={{ marginBottom: "56px" }}>
          {/* 🏷️ "Selected Work" tag badge */}
          <div
            ref={tagRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(200,240,96,.06)",
              border: "1px solid rgba(200,240,96,.2)",
              borderRadius: "3px",
              padding: "7px 14px",
              marginBottom: "20px",
              opacity: 0,
            }}
          >
            {/* 🟢 Glowing dot */}
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#c8f060",
                boxShadow: "0 0 6px #c8f060",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "#c8f060",
              }}
            >
              Selected Work
            </span>
          </div>

          {/* 🔤 Main heading + subtitle */}
          <div ref={headingRef} style={{ opacity: 0 }}>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(56px, 8vw, 100px)",
                lineHeight: 0.92,
                letterSpacing: ".02em",
                color: "#f0ece4",
                marginBottom: "16px",
              }}
            >
              Featured <span style={{ color: "#c8f060" }}>Projects</span>
            </h2>

            {/* 🟢 Accent line (heading এর নিচে সবুজ gradient line) */}
            <div
              ref={lineRef}
              style={{
                height: "2px",
                width: "56px",
                background: "linear-gradient(90deg, #c8f060, transparent)",
                marginBottom: "18px",
              }}
            />

            {/* 📖 Subtitle text */}
            <p
              style={{
                fontSize: "15px",
                color: "#8a8a80",
                lineHeight: 1.8,
                maxWidth: "480px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              A curated collection of work — from SaaS platforms to creative
              landing pages, all built with precision and care.
            </p>
          </div>
        </div>
        <div
          ref={filterRef}
          className="proj-filters"
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "52px",
            opacity: 0,
          }}
        >
          {filters.map((f) => (
            <FilterPill
              key={f}
              label={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
              count={getCount(f)}
            />
          ))}
        </div>

        <motion.div
          className="proj-grid"
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
            gap: "20px",
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <GithubCTA />
        </div>
      </div>
    </section>
  );
}


// =============================================
function GithubCTA() {
  const ref = useRef<HTMLAnchorElement>(null);

  // 🎬 GSAP scroll animation — button scroll এ আসলে fade-in হবে
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      }
    );
  }, []);

  return (
    <motion.a
      ref={ref}
      href="https://github.com/Ridoan-75?tab=repositories"
      target="_blank"
      rel="noopener noreferrer"
      // ✨ Framer Motion — hover এ lift + glow effect
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 28px",
        borderRadius: "3px",
        background: "transparent",
        border: "1px solid #1e1e1a",
        color: "#9a9a90",
        fontSize: "12px",
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.1em",
        textDecoration: "none",
        textTransform: "uppercase",
        transition: "all 0.25s",
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(200,240,96,0.3)";
        el.style.color = "#c8f060";
        el.style.background = "rgba(200,240,96,0.04)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "#1e1e1a";
        el.style.color = "#9a9a90";
        el.style.background = "transparent";
      }}
    >
      {/* GitHub icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
      View All Projects on GitHub ↗
    </motion.a>
  );
}
