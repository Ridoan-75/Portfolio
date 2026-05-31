"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: "Languages & Frameworks",
    tag: "01",
    color: "#c8f060",
    skills: [
      {
        name: "HTML5", level: 95,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#E44D26" d="M5 3l1.5 17L16 23l9.5-3L27 3z"/><path fill="#F16529" d="M16 21.5V5H5.3L6.6 19.8z"/><path fill="#EBEBEB" d="M16 10H10.5l.3 3.5H16V10z"/><path fill="#fff" d="M16 17.5l-4.5-1.2-.3-3.3H8l.5 6 7.5 2z"/><path fill="#EBEBEB" d="M16 13.5h5l-.5 5L16 19.7v-2.2l2.8-.8.2-3H16z"/></svg>,
      },
      {
        name: "CSS3", level: 92,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#1572B6" d="M5 3l1.5 17L16 23l9.5-3L27 3z"/><path fill="#33A9DC" d="M16 21.5V5H5.3L6.6 19.8z"/><path fill="#fff" d="M16 10H10.5l.3 3.5H16V10zM16 17.5l-4.5-1.2-.3-3.3H8l.5 6 7.5 2z"/><path fill="#EBEBEB" d="M16 13.5h5l-.5 5L16 19.7v-2.2l2.8-.8.2-3H16z"/></svg>,
      },
      {
        name: "JavaScript", level: 90,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="4" fill="#F7DF1E"/><path fill="#323330" d="M9 25.2l2.5-1.5c.5.9.9 1.6 1.9 1.6 1 0 1.6-.4 1.6-1.9V14h3v9.4c0 3.2-1.9 4.6-4.6 4.6-2.5 0-3.9-1.3-4.6-2.8zM19 24.9l2.5-1.4c.6 1.1 1.4 1.9 2.8 1.9 1.2 0 2-.6 2-1.4 0-.9-.8-1.3-2.2-1.8l-.7-.3c-2.2-.9-3.6-2.1-3.6-4.5 0-2.2 1.7-3.9 4.4-3.9 1.9 0 3.3.7 4.3 2.4l-2.4 1.5c-.5-.9-1.1-1.3-1.9-1.3-.9 0-1.4.5-1.4 1.3 0 .9.5 1.3 1.8 1.8l.7.3c2.5 1.1 4 2.2 4 4.7 0 2.7-2.1 4.1-4.9 4.1-2.7 0-4.4-1.3-5.3-3z"/></svg>,
      },
      {
        name: "TypeScript", level: 88,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="4" fill="#3178C6"/><path fill="#fff" d="M18.5 17.5v1.8c.5.2 1 .4 1.6.4.6 0 1.1-.2 1.4-.5.3-.3.5-.7.5-1.2 0-.4-.1-.8-.3-1.1-.2-.3-.7-.6-1.4-.9-.5-.2-.8-.4-.9-.5-.1-.1-.1-.2-.1-.4 0-.2.1-.3.2-.4.1-.1.3-.1.6-.1.5 0 1 .2 1.4.5v-1.7c-.4-.2-.9-.3-1.5-.3-.6 0-1.1.2-1.5.5-.4.3-.6.8-.6 1.4 0 .8.4 1.5 1.3 1.9.5.2.8.4.9.5.1.1.2.3.2.5 0 .2-.1.4-.2.5-.2.1-.4.2-.7.2-.6 0-1.2-.3-1.7-.8z"/><path fill="#fff" d="M14 14.1H11v-1.6h8.2v1.6H16.2V22H14z"/></svg>,
      },
      {
        name: "React.js", level: 93,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="3" fill="#61DAFB"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 16 16)"/></svg>,
      },
      {
        name: "Next.js", level: 90,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="14" fill="#000"/><path fill="#fff" d="M10 10h3v8l7-8h3L16 18.5 23 24h-3l-7-8.5V24h-3z"/></svg>,
      },
      {
        name: "Node.js", level: 85,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#3C873A" d="M16 2L4 8.5v15L16 30l12-6.5v-15z"/><path fill="none" stroke="#fff" strokeWidth="1.5" d="M16 8v16M10 11l6 3 6-3M10 21l6-3 6 3"/></svg>,
      },
      {
        name: "Vue.js", level: 78,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><polygon fill="#42B883" points="16,28 1,5 7,5 16,20 25,5 31,5"/><polygon fill="#35495E" points="16,20 10,9 13,9 16,14 19,9 22,9"/></svg>,
      },
    ],
  },
  {
    title: "Styling & UI",
    tag: "02",
    color: "#60a5fa",
    skills: [
      {
        name: "Tailwind CSS", level: 94,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#06B6D4" d="M16 7c-4 0-6.7 2-8 6 1.6-2 3.5-2.7 5.5-2 1.1.4 1.9 1.3 2.8 2.1C17.7 14.5 19.3 15 21 15c4 0 6.7-2 8-6-1.6 2-3.5 2.7-5.5 2-1.1-.4-1.9-1.3-2.8-2.1C19.3 7.5 17.7 7 16 7zm-8 8c-4 0-6.7 2-8 6 1.6-2 3.5-2.7 5.5-2 1.1.4 1.9 1.3 2.8 2.1C9.7 22.5 11.3 23 13 23c4 0 6.7-2 8-6-1.6 2-3.5 2.7-5.5 2-1.1-.4-1.9-1.3-2.8-2.1C11.3 15.5 9.7 15 8 15z"/></svg>,
      },
      {
        name: "ShadCN UI", level: 90,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#18181B"/><line x1="16" y1="8" x2="24" y2="24" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><line x1="8" y1="24" x2="16" y2="8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/></svg>,
      },
      {
        name: "SASS", level: 88,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="14" fill="#CD6799"/><path fill="#fff" d="M22.5 14.5c-1-.2-1.9 0-2.7.5-.3-.6-.6-1.2-.7-2-.1-.8 0-1.2.1-1.6s.4-.8.4-.8-.3-.1-.7.2c-.5.3-.8.8-.8 1.3 0 1.2.7 2.1 1 2.6-1.2.7-1.9 1.6-2.1 2.8-.3 1.9.9 2.8 2 2.8 1.4 0 2.5-1.2 2.4-2.8 0-.8-.3-1.4-.5-1.8.5-.2 1-.2 1.6 0 1.8.5 2.1 1.9 2 2.7-.1.8-.7 1.2-.9 1.4s-.1.2 0 .2c.2 0 1.8-.8 1.9-2.5.1-2-1.5-3-3-3z"/></svg>,
      },
      {
        name: "Bootstrap", level: 90,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#7952B3"/><path fill="#fff" d="M9 8h7.5c3 0 5 1.5 5 4 0 1.5-.8 2.8-2.2 3.3C21 16 22 17.5 22 19.5c0 3-2 4.5-5.5 4.5H9zm3 7h4c1.2 0 2-.6 2-1.8s-.8-1.7-2-1.7h-4zm0 7h4.5c1.3 0 2-.7 2-2s-.8-2-2-2H12z"/></svg>,
      },
      {
        name: "Figma", level: 88,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect x="10" y="3" width="6" height="6" rx="2" fill="#FF7262"/><rect x="16" y="3" width="6" height="6" rx="3" fill="#1ABCFE"/><rect x="10" y="9" width="6" height="6" fill="#FF7262"/><rect x="10" y="15" width="6" height="6" fill="#A259FF"/><circle cx="19" cy="18" r="3" fill="#0ACF83"/><rect x="10" y="21" width="6" height="6" rx="2" fill="#FF7262"/></svg>,
      },
      {
        name: "Framer Motion", level: 84,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#0055FF"/><path fill="#fff" d="M8 8h16v8H16zm0 8h8l8 8H16l-8-8zm0 8h8v-8l-8 8z"/></svg>,
      },
      {
        name: "Material UI", level: 82,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#0081CB" d="M2 20V8l8 4.5V18z"/><path fill="#00B0FF" d="M2 8l8 4.5L18 7v11l-8 4.5L2 18z"/><path fill="#0081CB" d="M18 7l12 7v6l-12-7z"/><path fill="#00B0FF" d="M30 14l-12 7v5l12-7z"/></svg>,
      },
      {
        name: "Adobe XD", level: 80,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#470137"/><path fill="#FF61F6" d="M12 10l3 5-3 7H9l3-7-3-5zm7 0h3v12h-3zm0 0v4l4-4z"/></svg>,
      },
    ],
  },
  {
    title: "Backend & DevOps",
    tag: "03",
    color: "#f472b6",
    skills: [
      {
        name: "PostgreSQL", level: 88,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="10" rx="10" ry="5" fill="#4a7faa"/><path fill="#336791" d="M6 10v12c0 2.8 4.5 5 10 5s10-2.2 10-5V10c0 2.8-4.5 5-10 5S6 12.8 6 10z"/></svg>,
      },
      {
        name: "Prisma ORM", level: 86,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#5a67d8" d="M16 3L4 26h24L16 3z" opacity="0.3"/><path fill="#fff" d="M16 3L4 26l8-4 4-19z" opacity="0.9"/><path fill="#fff" d="M16 3l12 23-8-4L16 3z" opacity="0.5"/></svg>,
      },
      {
        name: "Better Auth", level: 85,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="6" fill="#1a1a2e"/><path fill="#c8f060" d="M16 6l-8 4v8c0 5 3.5 9 8 10 4.5-1 8-5 8-10V10z" opacity="0.8"/><path fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 16l2 2 4-4"/></svg>,
      },
      {
        name: "Express.js", level: 87,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><rect width="32" height="32" rx="4" fill="#000"/><path fill="#fff" d="M5 20c4-1 6-5 6-9h2c0 4 2 8 6 9v2c-3-1-5-3-6-5-1 2-3 4-6 5v-2zm14-3h2l2 5h-2l-.5-1.5h-3L17 22h-2l4-5zm1 1l-1 2h2l-1-2z"/></svg>,
      },
      {
        name: "Git", level: 90,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#F05032" d="M29.5 14.5L17.5 2.5c-1-.9-2.5-.9-3.4 0l-2.4 2.4 3 3c.7-.3 1.6-.2 2.2.4.6.6.7 1.5.4 2.2l3 3c.7-.3 1.6-.2 2.2.4.9.9.9 2.3 0 3.2s-2.3.9-3.2 0c-.6-.6-.8-1.5-.5-2.3l-2.8-2.8v7.4c.2.1.4.2.6.4.9.9.9 2.3 0 3.2s-2.3.9-3.2 0-.9-2.3 0-3.2c.2-.2.5-.4.8-.5V12.3c-.3-.1-.6-.3-.8-.5-.6-.6-.8-1.5-.5-2.3l-3-2.9L2.5 14.5c-.9.9-.9 2.5 0 3.4l12 12c.9.9 2.5.9 3.4 0l11.6-11.6c.9-1 .9-2.5 0-3.4z"/></svg>,
      },
      {
        name: "Docker", level: 78,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#2496ED" d="M27.8 14.2c-.3-.2-1.2-.8-2.7-.7-.2-1.4-1.3-2.1-1.3-2.1s-1 1.1-.7 2.6c-.5.3-1.3.5-2.4.5H4c-.1 4.5 1.8 9 7.5 10.3 7.5 1.8 13.3-2.2 14.6-8.1 2.1.1 3.4-.8 3.7-1.4 0 0-.8-.7-2-1.1z"/><rect x="8" y="10" width="3" height="3" rx=".4" fill="#2496ED"/><rect x="12" y="10" width="3" height="3" rx=".4" fill="#2496ED"/><rect x="16" y="10" width="3" height="3" rx=".4" fill="#2496ED"/><rect x="12" y="6" width="3" height="3" rx=".4" fill="#2496ED"/><rect x="16" y="6" width="3" height="3" rx=".4" fill="#2496ED"/></svg>,
      },
      {
        name: "Firebase", level: 84,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#FFA000" d="M7 24L11.5 5l4.5 8L7 24z"/><path fill="#F57C00" d="M7 24l8-14 5 8-13 6z"/><path fill="#FFCA28" d="M7 24L20 10l5 14-18 0z"/></svg>,
      },
      {
        name: "Linux", level: 80,
        icon: <svg viewBox="0 0 32 32" width="28" height="28"><path fill="#FCC624" d="M16 3c-1.5 0-3 .8-4 3-1 2.2-.8 5.5 0 8-.5.5-3 2-3 5s2 4 3 4.5l.5 2c.3 1 1 1.5 2 1.5h3c1 0 1.7-.5 2-1.5l.5-2c1-.5 3-1.5 3-4.5s-2.5-4.5-3-5c.8-2.5 1-5.8 0-8-1-2.2-2.5-3-4-3zm-2 9a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/></svg>,
      },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRefs = useRef<(HTMLDivElement | null)[][]>(skillCategories.map(() => []));
  const fillRefs = useRef<(HTMLDivElement | null)[][]>(skillCategories.map(() => []));
  const hoveredRef = useRef<string | null>(null);

  // ── heading entrance — exact hero pattern
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

  // ── cards stagger entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sk-card",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: "power4.out",
          scrollTrigger: { trigger: ".sk-cards-grid", start: "top 80%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── skill rows stagger per card
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".sk-card").forEach((card) => {
        gsap.fromTo(card.querySelectorAll(".sk-row"),
          { x: -28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 78%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── progress bars on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".sk-card").forEach((card) => {
        gsap.fromTo(card.querySelectorAll(".sk-fill"),
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.2, stagger: 0.05, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 76%", once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── stats entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sk-stats",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".sk-stats", start: "top 88%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── floating particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".sk-float").forEach((el) => {
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

  // ── card hover
  const onCardEnter = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, { y: -8, duration: 0.35, ease: "power2.out" });
    gsap.to(card.querySelector(".sk-card-accent"), { opacity: 1, duration: 0.25 });
    gsap.to(card.querySelector(".sk-card-glow"), { opacity: 1, duration: 0.4 });
    gsap.to(card.querySelector(".sk-card-num"), { opacity: 0.07, duration: 0.3 });
  }, []);

  const onCardLeave = useCallback((i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(card.querySelector(".sk-card-accent"), { opacity: 0, duration: 0.3 });
    gsap.to(card.querySelector(".sk-card-glow"), { opacity: 0, duration: 0.4 });
    gsap.to(card.querySelector(".sk-card-num"), { opacity: 0.02, duration: 0.3 });
  }, []);

  // ── row hover
  const onRowEnter = useCallback((
    rowEl: HTMLDivElement | null,
    fillEl: HTMLDivElement | null,
    levelEl: HTMLElement | null,
    nameEl: HTMLElement | null,
    accentEl: HTMLElement | null,
    color: string
  ) => {
    if (!rowEl) return;
    gsap.to(rowEl, { x: 8, duration: 0.28, ease: "power3.out" });
    gsap.to(rowEl.querySelector(".sk-icon"), { scale: 1.2, rotation: 8, duration: 0.32, ease: "back.out(2)" });
    if (nameEl) gsap.to(nameEl, { color: "#e8e4dc", duration: 0.18 });
    if (levelEl) gsap.to(levelEl, { color, duration: 0.18 });
    if (fillEl) gsap.to(fillEl, { opacity: 1, duration: 0.18 });
    if (accentEl) gsap.to(accentEl, { opacity: 1, scaleY: 1, duration: 0.22, ease: "power2.out" });
  }, []);

  const onRowLeave = useCallback((
    rowEl: HTMLDivElement | null,
    fillEl: HTMLDivElement | null,
    levelEl: HTMLElement | null,
    nameEl: HTMLElement | null,
    accentEl: HTMLElement | null,
  ) => {
    if (!rowEl) return;
    gsap.to(rowEl, { x: 0, duration: 0.35, ease: "power2.out" });
    gsap.to(rowEl.querySelector(".sk-icon"), { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" });
    if (nameEl) gsap.to(nameEl, { color: "#5a5a56", duration: 0.2 });
    if (levelEl) gsap.to(levelEl, { color: "#2a2a28", duration: 0.2 });
    if (fillEl) gsap.to(fillEl, { opacity: 0.6, duration: 0.2 });
    if (accentEl) gsap.to(accentEl, { opacity: 0, scaleY: 0, duration: 0.2 });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── exact hero padding & min-height ── */
        #skills {
          padding: 80px 60px 80px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #080808;
          color: #e8e4dc;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── grid bg — exact hero ── */
        #skills::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none; z-index: 0;
        }

        /* ── corner brackets — exact hero ── */
        .sk-corner-tl {
          position: absolute; top: 0; left: 0;
          width: 180px; height: 180px;
          border-right: 1px solid rgba(var(--accent-rgb),.08);
          border-bottom: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }
        .sk-corner-br {
          position: absolute; bottom: 0; right: 0;
          width: 180px; height: 180px;
          border-left: 1px solid rgba(var(--accent-rgb),.08);
          border-top: 1px solid rgba(var(--accent-rgb),.08);
          pointer-events: none;
        }

        /* ── scanline — exact hero ── */
        .sk-scanline {
          position: absolute; left: 60px; right: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb),.12), transparent);
          top: 50%; pointer-events: none; z-index: 0;
          animation: skScan 7s ease-in-out infinite;
        }
        @keyframes skScan {
          0%,100% { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; } 85% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0; }
        }

        /* ── inner wrapper — same max-width as hero ── */
        .sk-inner {
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* ── status tag — exact hero ── */
        .sk-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06);
          border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px;
          width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .sk-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
          animation: skBlink 2s ease infinite; flex-shrink: 0;
        }
        @keyframes skBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .sk-status-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--accent);
        }

        /* ── heading — exact hero font-size & line-height ── */
        .sk-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .sk-heading .h-accent { color: var(--accent); }

        /* ── role line — exact hero ── */
        .sk-role-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px; letter-spacing: .08em;
          text-transform: uppercase; color: #6a6a60;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          opacity: 0;
        }
        .sk-role-line::before {
          content: ''; width: 28px; height: 1px;
          background: var(--accent); flex-shrink: 0;
        }

        /* ── desc — exact hero ── */
        .sk-desc {
          font-size: 16px; line-height: 1.85; color: #4a4a44;
          max-width: 440px; margin-bottom: 48px; opacity: 0;
        }

        /* ── cards grid ── */
        .sk-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
        }

        /* ── single card ── */
        .sk-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.018) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 4px 24px rgba(0,0,0,0.32),
            0 1px 4px rgba(0,0,0,0.4);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 6px;
          padding: 28px 28px 20px 32px;
          position: relative; overflow: hidden;
          opacity: 0; will-change: transform;
          transition: border-color .3s ease, box-shadow .35s ease, background .35s ease;
        }
        .sk-card:hover {
          border-color: var(--cc);
          background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 8px 40px rgba(0,0,0,0.38),
            0 0 32px rgba(0,0,0,0.1);
        }

        .sk-card-glow {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          background: radial-gradient(ellipse at top, var(--cc-glow) 0%, transparent 62%);
          transition: opacity .4s;
        }

        .sk-card-accent {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: var(--cc); opacity: 0;
          box-shadow: 0 0 12px var(--cc-glow);
        }

        .sk-card-num {
          position: absolute; top: 14px; right: 18px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 80px; line-height: 1;
          color: rgba(255,255,255,.04);
          user-select: none; pointer-events: none;
        }

        .sk-card-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
        }
        .sk-card-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--cc); box-shadow: 0 0 10px var(--cc);
          animation: skPulse 2.5s ease infinite; flex-shrink: 0;
        }
        @keyframes skPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        .sk-card-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase; color: var(--cc);
        }

        /* ── skill row ── */
        .sk-row {
          display: flex; align-items: center; gap: 14px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,.03);
          cursor: default; position: relative;
          will-change: transform;
        }
        .sk-row:last-child { border-bottom: none; }

        /* left accent pulse */
        .sk-row-accent {
          position: absolute; left: -32px; top: 4px; bottom: 4px;
          width: 2px; border-radius: 2px;
          background: var(--cc); opacity: 0;
          transform: scaleY(0); transform-origin: center;
        }

        .sk-icon {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; will-change: transform;
        }

        .sk-info { flex: 1; min-width: 0; }

        .sk-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; font-weight: 500;
          letter-spacing: .06em; color: #5a5a56;
          margin-bottom: 6px;
        }

        .sk-track {
          width: 100%; height: 2px;
          background: rgba(255,255,255,.04);
          border-radius: 2px; overflow: hidden;
        }
        .sk-fill {
          height: 100%; border-radius: 2px;
          background: var(--cc); opacity: .6;
        }

        .sk-level {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .05em;
          color: #2a2a28; flex-shrink: 0;
          min-width: 30px; text-align: right;
        }

        /* ── stats strip — exact hero stats bar ── */
        .sk-stats {
          display: flex; align-items: stretch;
          margin-top: 52px;
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.014) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 20px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border-radius: 6px;
          overflow: hidden; width: fit-content; opacity: 0;
        }
        .sk-stat-item {
          padding: 16px 30px;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .sk-stat-item:last-child { border-right: none; }
        .sk-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 38px; letter-spacing: .03em; line-height: 1;
        }
        .sk-stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; text-transform: uppercase;
          letter-spacing: .12em; color: #3a3a36; margin-top: 4px;
        }

        /* ── floating code words ── */
        .sk-float {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .1em;
          opacity: .03; pointer-events: none;
          user-select: none; color: var(--accent);
        }

        /* ────────────────────────────
           RESPONSIVE — exact hero breakpoints
        ──────────────────────────── */
        @media (max-width: 1199px) {
          #skills { padding: 80px 40px 80px; }
          .sk-heading { font-size: clamp(52px, 8vw, 100px); }
          .sk-corner-tl, .sk-corner-br { width: 120px; height: 120px; }
          .sk-stat-item { padding: 14px 24px; }
          .sk-stat-num { font-size: 34px; }
        }
        @media (max-width: 1023px) {
          #skills { padding: 70px 32px 90px; }
          .sk-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .sk-heading { font-size: clamp(48px, 8vw, 80px); }
          .sk-desc { font-size: 15px; }
          .sk-role-line { font-size: 12px; }
          .sk-corner-tl, .sk-corner-br { width: 100px; height: 100px; }
          .sk-scanline { left: 32px; right: 32px; }
        }
        @media (max-width: 767px) {
          #skills { padding: 60px 24px 90px; padding-top: 80px; }
          .sk-cards-grid { grid-template-columns: 1fr; }
          .sk-heading { font-size: clamp(52px, 14vw, 80px); }
          .sk-desc { font-size: 14px; line-height: 1.8; max-width: 100%; }
          .sk-stats { width: 100%; }
          .sk-stat-item { flex: 1; padding: 14px 16px; }
          .sk-corner-tl, .sk-corner-br { width: 80px; height: 80px; }
          .sk-scanline { left: 24px; right: 24px; }
        }
        @media (max-width: 599px) {
          #skills { padding: 50px 18px 80px; padding-top: 70px; }
          .sk-heading { font-size: clamp(44px, 16vw, 64px); }
          .sk-role-line { font-size: 10px; gap: 8px; letter-spacing: .06em; }
          .sk-role-line::before { width: 20px; }
          .sk-desc { font-size: 13px; }
          .sk-stat-num { font-size: 28px; }
          .sk-stat-item { padding: 12px 10px; }
          .sk-stat-label { font-size: 9px; letter-spacing: .08em; }
          .sk-card { padding: 22px 22px 16px 24px; }
          .sk-corner-tl, .sk-corner-br { width: 60px; height: 60px; }
        }
        @media (max-width: 379px) {
          #skills { padding: 40px 14px 70px; padding-top: 60px; }
          .sk-heading { font-size: clamp(38px, 18vw, 52px); }
          .sk-desc { font-size: 12px; }
          .sk-stat-num { font-size: 24px; }
          .sk-stat-item { padding: 10px 8px; }
          .sk-corner-tl, .sk-corner-br { width: 40px; height: 40px; }
          .sk-scanline { left: 14px; right: 14px; }
          .sk-status-text { font-size: 11px; }
        }
        @media (hover: none) {
          .sk-card:hover { transform: none !important; }
          .sk-row:hover { transform: none !important; }
        }
        @media (min-width: 1600px) {
          .sk-inner { max-width: 1300px; }
          .sk-heading { font-size: clamp(80px, 9vw, 130px); }
          .sk-desc { font-size: 17px; max-width: 500px; }
          .sk-stat-item { padding: 18px 36px; }
          .sk-stat-num { font-size: 42px; }
        }
      `}</style>

      <section id="skills" ref={sectionRef}>
        <div className="sk-corner-tl" />
        <div className="sk-corner-br" />
        <div className="sk-scanline" />

        {["const", "import", "async", "return", "export", "=>", "type", "{}"].map((t, i) => (
          <div key={i} className="sk-float"
            style={{ left: `${5 + i * 12}%`, top: `${10 + (i % 4) * 22}%` }}>
            {t}
          </div>
        ))}

        <div className="sk-inner">

          {/* ── heading block ── */}
          <div ref={headingRef}>
            <div className="sk-status-tag">
              <span className="sk-status-dot" />
              <span className="sk-status-text">My Tech Stack</span>
            </div>

            <h2 className="sk-heading">
              <span className="h-accent">S</span>kills &amp; <span className="h-accent">T</span>ools
            </h2>

            <div className="sk-role-line">
              Technologies I build with every day
            </div>

            <p className="sk-desc">
              Crafting fast, scalable, pixel-perfect web experiences — from
              frontend UI to backend APIs and everything in between.
            </p>
          </div>

          {/* ── cards ── */}
          <div className="sk-cards-grid">
            {skillCategories.map((cat, ci) => (
              <div
                key={cat.tag}
                ref={(el) => { cardRefs.current[ci] = el; }}
                className="sk-card"
                style={{
                  "--cc": cat.color,
                  "--cc-glow": `${cat.color}38`,
                } as React.CSSProperties}
                onMouseEnter={() => onCardEnter(ci)}
                onMouseLeave={() => onCardLeave(ci)}
              >
                <div className="sk-card-glow" />
                <div className="sk-card-accent" />
                <div className="sk-card-num">{cat.tag}</div>

                <div className="sk-card-header">
                  <span className="sk-card-dot" />
                  <span className="sk-card-title">{cat.title}</span>
                </div>

                {cat.skills.map((skill, si) => (
                  <div
                    key={skill.name}
                    className="sk-row"
                    style={{ "--cc": cat.color } as React.CSSProperties}
                    ref={(el) => { rowRefs.current[ci][si] = el; }}
                    onMouseEnter={(e) => {
                      const row = e.currentTarget;
                      const fill = row.querySelector<HTMLDivElement>(".sk-fill");
                      const level = row.querySelector<HTMLElement>(".sk-level");
                      const name = row.querySelector<HTMLElement>(".sk-name");
                      const accent = row.querySelector<HTMLElement>(".sk-row-accent");
                      onRowEnter(row as HTMLDivElement, fill, level, name, accent, cat.color);
                    }}
                    onMouseLeave={(e) => {
                      const row = e.currentTarget;
                      const fill = row.querySelector<HTMLDivElement>(".sk-fill");
                      const level = row.querySelector<HTMLElement>(".sk-level");
                      const name = row.querySelector<HTMLElement>(".sk-name");
                      const accent = row.querySelector<HTMLElement>(".sk-row-accent");
                      onRowLeave(row as HTMLDivElement, fill, level, name, accent);
                    }}
                  >
                    <div className="sk-row-accent" />
                    <div className="sk-icon">{skill.icon}</div>
                    <div className="sk-info">
                      <div className="sk-name">{skill.name}</div>
                      <div className="sk-track">
                        <div
                          className="sk-fill"
                          ref={(el) => { fillRefs.current[ci][si] = el; }}
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                    <div className="sk-level">{skill.level}%</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ── stats strip — exact hero stats bar ── */}
          <div className="sk-stats">
            {skillCategories.map((cat) => (
              <div key={cat.tag} className="sk-stat-item">
                <div className="sk-stat-num" style={{ color: cat.color }}>
                  {cat.skills.length}+
                </div>
                <div className="sk-stat-label">{cat.title.split(" ")[0]}</div>
              </div>
            ))}
            <div className="sk-stat-item">
              <div className="sk-stat-num" style={{ color: "var(--accent)" }}>
                {skillCategories.reduce((s, c) => s + c.skills.length, 0)}+
              </div>
              <div className="sk-stat-label">Total Skills</div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}