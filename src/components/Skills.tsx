"use client";

import { useEffect, useRef, useState } from "react";
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
        name: "HTML5",
        level: 95,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#E44D26" d="M5 3l1.5 17L16 23l9.5-3L27 3z"/>
            <path fill="#F16529" d="M16 21.5V5H5.3L6.6 19.8z"/>
            <path fill="#EBEBEB" d="M16 10H10.5l.3 3.5H16V10z"/>
            <path fill="#fff" d="M16 17.5l-4.5-1.2-.3-3.3H8l.5 6 7.5 2z"/>
            <path fill="#EBEBEB" d="M16 13.5h5l-.5 5L16 19.7v-2.2l2.8-.8.2-3H16z"/>
          </svg>
        ),
      },
      {
        name: "CSS3",
        level: 92,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#1572B6" d="M5 3l1.5 17L16 23l9.5-3L27 3z"/>
            <path fill="#33A9DC" d="M16 21.5V5H5.3L6.6 19.8z"/>
            <path fill="#fff" d="M16 10H10.5l.3 3.5H16V10zM16 17.5l-4.5-1.2-.3-3.3H8l.5 6 7.5 2z"/>
            <path fill="#EBEBEB" d="M16 13.5h5l-.5 5L16 19.7v-2.2l2.8-.8.2-3H16z"/>
          </svg>
        ),
      },
      {
        name: "JavaScript",
        level: 90,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="4" fill="#F7DF1E"/>
            <path fill="#323330" d="M9 25.2l2.5-1.5c.5.9.9 1.6 1.9 1.6 1 0 1.6-.4 1.6-1.9V14h3v9.4c0 3.2-1.9 4.6-4.6 4.6-2.5 0-3.9-1.3-4.6-2.8zM19 24.9l2.5-1.4c.6 1.1 1.4 1.9 2.8 1.9 1.2 0 2-.6 2-1.4 0-.9-.8-1.3-2.2-1.8l-.7-.3c-2.2-.9-3.6-2.1-3.6-4.5 0-2.2 1.7-3.9 4.4-3.9 1.9 0 3.3.7 4.3 2.4l-2.4 1.5c-.5-.9-1.1-1.3-1.9-1.3-.9 0-1.4.5-1.4 1.3 0 .9.5 1.3 1.8 1.8l.7.3c2.5 1.1 4 2.2 4 4.7 0 2.7-2.1 4.1-4.9 4.1-2.7 0-4.4-1.3-5.3-3z"/>
          </svg>
        ),
      },
      {
        name: "TypeScript",
        level: 88,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="4" fill="#3178C6"/>
            <path fill="#fff" d="M18.5 17.5v1.8c.5.2 1 .4 1.6.4.6 0 1.1-.2 1.4-.5.3-.3.5-.7.5-1.2 0-.4-.1-.8-.3-1.1-.2-.3-.7-.6-1.4-.9-.5-.2-.8-.4-.9-.5-.1-.1-.1-.2-.1-.4 0-.2.1-.3.2-.4.1-.1.3-.1.6-.1.5 0 1 .2 1.4.5v-1.7c-.4-.2-.9-.3-1.5-.3-.6 0-1.1.2-1.5.5-.4.3-.6.8-.6 1.4 0 .8.4 1.5 1.3 1.9.5.2.8.4.9.5.1.1.2.3.2.5 0 .2-.1.4-.2.5-.2.1-.4.2-.7.2-.6 0-1.2-.3-1.7-.8z"/>
            <path fill="#fff" d="M14 14.1H11v-1.6h8.2v1.6H16.2V22H14z"/>
          </svg>
        ),
      },
      {
        name: "React.js",
        level: 93,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="3" fill="#61DAFB"/>
            <ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5"/>
            <ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(60 16 16)"/>
            <ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#61DAFB" strokeWidth="1.5" transform="rotate(120 16 16)"/>
          </svg>
        ),
      },
      {
        name: "Next.js",
        level: 90,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="14" fill="#000"/>
            <path fill="#fff" d="M10 10h3v8l7-8h3L16 18.5 23 24h-3l-7-8.5V24h-3z"/>
          </svg>
        ),
      },
      {
        name: "Vue.js",
        level: 78,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <polygon fill="#42B883" points="16,28 1,5 7,5 16,20 25,5 31,5"/>
            <polygon fill="#35495E" points="16,20 10,9 13,9 16,14 19,9 22,9"/>
          </svg>
        ),
      },
      {
        name: "Node.js",
        level: 85,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#3C873A" d="M16 2L4 8.5v15L16 30l12-6.5v-15z"/>
            <path fill="none" stroke="#fff" strokeWidth="1.5" d="M16 8v16M10 11l6 3 6-3M10 21l6-3 6 3"/>
          </svg>
        ),
      },
      {
        name: "jQuery",
        level: 80,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="16" fill="#0769AD"/>
            <path fill="#fff" d="M8 13s3-3 8 0c5 3 8 0 8 0s-2 5-8 5c-6 0-8-5-8-5z" opacity=".8"/>
            <path fill="#fff" d="M10 17s2-2 6 0c4 2 6 0 6 0s-1.5 4-6 4c-4.5 0-6-4-6-4z" opacity=".7"/>
            <circle cx="16" cy="16" r="2.5" fill="#fff"/>
          </svg>
        ),
      },
    ],
  },
  {
    title: "Styling & UI",
    tag: "02",
    color: "#60a5fa",
    skills: [
      {
        name: "Tailwind CSS",
        level: 94,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#06B6D4" d="M16 7c-4 0-6.7 2-8 6 1.6-2 3.5-2.7 5.5-2 1.1.4 1.9 1.3 2.8 2.1C17.7 14.5 19.3 15 21 15c4 0 6.7-2 8-6-1.6 2-3.5 2.7-5.5 2-1.1-.4-1.9-1.3-2.8-2.1C19.3 7.5 17.7 7 16 7zm-8 8c-4 0-6.7 2-8 6 1.6-2 3.5-2.7 5.5-2 1.1.4 1.9 1.3 2.8 2.1C9.7 22.5 11.3 23 13 23c4 0 6.7-2 8-6-1.6 2-3.5 2.7-5.5 2-1.1-.4-1.9-1.3-2.8-2.1C11.3 15.5 9.7 15 8 15z"/>
          </svg>
        ),
      },
      {
        name: "SASS",
        level: 88,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="14" fill="#CD6799"/>
            <path fill="#fff" d="M22.5 14.5c-1-.2-1.9 0-2.7.5-.3-.6-.6-1.2-.7-2-.1-.8 0-1.2.1-1.6s.4-.8.4-.8-.3-.1-.7.2c-.5.3-.8.8-.8 1.3 0 1.2.7 2.1 1 2.6-1.2.7-1.9 1.6-2.1 2.8-.3 1.9.9 2.8 2 2.8 1.4 0 2.5-1.2 2.4-2.8 0-.8-.3-1.4-.5-1.8.5-.2 1-.2 1.6 0 1.8.5 2.1 1.9 2 2.7-.1.8-.7 1.2-.9 1.4s-.1.2 0 .2c.2 0 1.8-.8 1.9-2.5.1-2-1.5-3-3-3z"/>
          </svg>
        ),
      },
      {
        name: "Bootstrap",
        level: 90,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="6" fill="#7952B3"/>
            <path fill="#fff" d="M9 8h7.5c3 0 5 1.5 5 4 0 1.5-.8 2.8-2.2 3.3C21 16 22 17.5 22 19.5c0 3-2 4.5-5.5 4.5H9zm3 7h4c1.2 0 2-.6 2-1.8s-.8-1.7-2-1.7h-4zm0 7h4.5c1.3 0 2-.7 2-2s-.8-2-2-2H12z"/>
          </svg>
        ),
      },
      {
        name: "Material UI",
        level: 82,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#0081CB" d="M2 20V8l8 4.5V18z"/>
            <path fill="#00B0FF" d="M2 8l8 4.5L18 7v11l-8 4.5L2 18z"/>
            <path fill="#0081CB" d="M18 7l12 7v6l-12-7z"/>
            <path fill="#00B0FF" d="M30 14l-12 7v5l12-7z"/>
          </svg>
        ),
      },
      {
        name: "Figma",
        level: 88,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect x="10" y="3" width="6" height="6" rx="2" fill="#FF7262"/>
            <rect x="16" y="3" width="6" height="6" rx="3" fill="#1ABCFE"/>
            <rect x="10" y="9" width="6" height="6" fill="#FF7262"/>
            <rect x="10" y="15" width="6" height="6" fill="#A259FF"/>
            <circle cx="19" cy="18" r="3" fill="#0ACF83"/>
            <rect x="10" y="21" width="6" height="6" rx="2" fill="#FF7262"/>
          </svg>
        ),
      },
      {
        name: "Photoshop",
        level: 85,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="4" fill="#001E36"/>
            <path fill="#31A8FF" d="M8 9h5c2.5 0 4 1.3 4 3.5S15.5 16 13 16H11v6H8zm3 5h1.8c1 0 1.7-.5 1.7-1.5s-.6-1.5-1.7-1.5H11zM20 14c1.5 0 2.5.6 2.5.6v-2s-.8-.3-2-.3c-3 0-4.5 1.5-4.5 4 0 2.3 1.5 4 4.5 4 1.2 0 2-.3 2-.3v-2s-1 .6-2.2.6c-1.3 0-2-.8-2-2s.8-2.6 1.7-2.6z"/>
          </svg>
        ),
      },
      {
        name: "Adobe XD",
        level: 80,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <rect width="32" height="32" rx="6" fill="#FF61F6"/>
            <path fill="#fff" d="M12 10l3 5-3 7H9l3-7-3-5zm8 0h3v12h-3zm0 0v4l4-4z"/>
          </svg>
        ),
      },
      {
        name: "Animation",
        level: 86,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="13" fill="none" stroke="#43E97B" strokeWidth="2"/>
            <polygon fill="#43E97B" points="13,10 13,22 23,16"/>
          </svg>
        ),
      },
    ],
  },
  {
    title: "Tools & DevOps",
    tag: "03",
    color: "#f472b6",
    skills: [
      {
        name: "Git",
        level: 90,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#F05032" d="M29.5 14.5L17.5 2.5c-1-.9-2.5-.9-3.4 0l-2.4 2.4 3 3c.7-.3 1.6-.2 2.2.4.6.6.7 1.5.4 2.2l3 3c.7-.3 1.6-.2 2.2.4.9.9.9 2.3 0 3.2s-2.3.9-3.2 0c-.6-.6-.8-1.5-.5-2.3l-2.8-2.8v7.4c.2.1.4.2.6.4.9.9.9 2.3 0 3.2s-2.3.9-3.2 0-.9-2.3 0-3.2c.2-.2.5-.4.8-.5V12.3c-.3-.1-.6-.3-.8-.5-.6-.6-.8-1.5-.5-2.3l-3-2.9L2.5 14.5c-.9.9-.9 2.5 0 3.4l12 12c.9.9 2.5.9 3.4 0l11.6-11.6c.9-1 .9-2.5 0-3.4z"/>
          </svg>
        ),
      },
      {
        name: "GitHub",
        level: 92,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#fff" d="M16 2C8.3 2 2 8.3 2 16c0 6.2 4 11.4 9.6 13.3.7.1.9-.3.9-.7v-2.4c-3.9.8-4.7-1.9-4.7-1.9-.6-1.6-1.5-2-1.5-2-1.2-.8.1-.8.1-.8 1.4.1 2.1 1.4 2.1 1.4 1.2 2.1 3.2 1.5 4 1.1.1-.9.5-1.5.9-1.8-3.1-.4-6.4-1.6-6.4-6.9 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.1-.4 3.7 1.4 1.1-.3 2.2-.4 3.3-.4 1.1 0 2.2.1 3.3.4 2.6-1.7 3.7-1.4 3.7-1.4.7 1.9.3 3.3.1 3.7.9 1 1.4 2.2 1.4 3.8 0 5.4-3.3 6.5-6.4 6.9.5.4.9 1.3.9 2.6v3.9c0 .4.3.8.9.7C26 27.4 30 22.2 30 16 30 8.3 23.7 2 16 2z"/>
          </svg>
        ),
      },
      {
        name: "Docker",
        level: 78,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#2496ED" d="M27.8 14.2c-.3-.2-1.2-.8-2.7-.7-.2-1.4-1.3-2.1-1.3-2.1s-1 1.1-.7 2.6c-.5.3-1.3.5-2.4.5H4c-.1 4.5 1.8 9 7.5 10.3 7.5 1.8 13.3-2.2 14.6-8.1 2.1.1 3.4-.8 3.7-1.4 0 0-.8-.7-2-1.1z"/>
            <rect x="8" y="10" width="3" height="3" rx=".4" fill="#2496ED"/>
            <rect x="12" y="10" width="3" height="3" rx=".4" fill="#2496ED"/>
            <rect x="16" y="10" width="3" height="3" rx=".4" fill="#2496ED"/>
            <rect x="12" y="6" width="3" height="3" rx=".4" fill="#2496ED"/>
            <rect x="16" y="6" width="3" height="3" rx=".4" fill="#2496ED"/>
          </svg>
        ),
      },
      {
        name: "Firebase",
        level: 84,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#FFA000" d="M7 24L11.5 5l4.5 8L7 24z"/>
            <path fill="#F57C00" d="M7 24l8-14 5 8-13 6z"/>
            <path fill="#FFCA28" d="M7 24L20 10l5 14-18 0z"/>
          </svg>
        ),
      },
      {
        name: "AWS",
        level: 75,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#FF9900" d="M9 19.5c-.5.2-1 .5-1 1.1 0 .6.6.9 1.2.9.7 0 1.5-.3 2.1-.7l.6 1.2C11 22.7 9.9 23 9 23c-1.5 0-2.7-.7-2.7-2.2 0-1.2.8-2 1.9-2.4L9 19.5zM22.5 21.2c0 .5.2.8.6.8.3 0 .5-.1.8-.2l.3 1c-.4.2-.9.3-1.4.3-1.1 0-1.8-.6-1.8-1.8v-3h-1v-1.1h1V15l1.5-.4v2.7h1.7v1.1h-1.7v2.8z"/>
            <path fill="#FF9900" d="M16 10c-3.3 0-6 1.1-6 3v.5c0 .3.2.5.5.5H21.5c.3 0 .5-.2.5-.5V13c0-1.9-2.7-3-6-3z"/>
          </svg>
        ),
      },
      {
        name: "Linux",
        level: 80,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#FCC624" d="M16 3c-1.5 0-3 .8-4 3-1 2.2-.8 5.5 0 8-.5.5-3 2-3 5s2 4 3 4.5l.5 2c.3 1 1 1.5 2 1.5h3c1 0 1.7-.5 2-1.5l.5-2c1-.5 3-1.5 3-4.5s-2.5-4.5-3-5c.8-2.5 1-5.8 0-8-1-2.2-2.5-3-4-3zm-2 9a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z"/>
          </svg>
        ),
      },
      {
        name: "Webpack",
        level: 76,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#8DD6F9" d="M16 3L4 9.5v13L16 29l12-6.5v-13zm0 3.2L25.2 11 16 15.8 6.8 11z"/>
            <path fill="#1C78C0" d="M16 6.2V15.8L6.8 11zm0 0V15.8L25.2 11z" opacity=".7"/>
          </svg>
        ),
      },
      {
        name: "Gulp",
        level: 74,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <path fill="#CF4647" d="M12 6c0 0-2 1.5-2 5s2 6 2 6v9c0 1.7 1.8 3 4 3s4-1.3 4-3V17s2-2.5 2-6-2-5-2-5H12zm4 19c-1.1 0-2-.7-2-1.5V22h4v1.5c0 .8-.9 1.5-2 1.5z"/>
          </svg>
        ),
      },
      {
        name: "Automation",
        level: 82,
        icon: (
          <svg viewBox="0 0 32 32" width="36" height="36">
            <circle cx="16" cy="16" r="4" fill="none" stroke="#94a3b8" strokeWidth="2"/>
            <path fill="none" stroke="#94a3b8" strokeWidth="2" d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Heading entrance
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true },
      });
      tl.fromTo(".sk-tag", { y: 20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" })
        .fromTo(".sk-title-char", { y: 60, opacity: 0, rotateX: -90 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.6, stagger: 0.04, ease: "power4.out" }, "-=0.2")
        .fromTo(".sk-line", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" }, "-=0.3")
        .fromTo(".sk-desc", { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
    }, headingRef);
    return () => ctx.revert();
  }, []);

  // Cards stagger
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sk-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out",
          scrollTrigger: { trigger: ".sk-cards-wrap", start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Skill items stagger per card
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".sk-card").forEach((card) => {
        gsap.fromTo(
          card.querySelectorAll(".sk-skill-row"),
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 78%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Progress bar fill animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll(".sk-card").forEach((card) => {
        gsap.fromTo(
          card.querySelectorAll(".sk-progress-fill"),
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 75%", once: true },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Floating particles
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".sk-float").forEach((el) => {
        gsap.to(el, {
          y: gsap.utils.random(-20, 20),
          x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(3, 5),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: gsap.utils.random(0, 2),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const titleText = "SKILLS & TOOLS";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .sk-tag {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c8f060;
          border: 1px solid rgba(200,240,96,0.2);
          padding: 7px 16px;
          border-radius: 2px;
          margin-bottom: 22px;
          background: rgba(200,240,96,0.04);
        }

        .sk-title-char {
          display: inline-block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 80px);
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .sk-line {
          height: 2px;
          width: 64px;
          background: linear-gradient(90deg, transparent, #c8f060, transparent);
          margin: 16px auto 22px;
        }

        .sk-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #5a5a56;
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.8;
        }

        .sk-card {
          background: rgba(255,255,255,0.015);
          border: 1px solid #1a1a18;
          border-radius: 8px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .sk-card:hover {
          border-color: var(--card-color);
          box-shadow: 0 0 40px rgba(0,0,0,0.3), 0 0 80px var(--card-glow);
        }

        .sk-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--card-color);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sk-card:hover .sk-card-accent {
          opacity: 0.8;
        }

        .sk-card-number {
          position: absolute;
          top: 20px;
          right: 24px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 64px;
          color: rgba(255,255,255,0.02);
          line-height: 1;
          user-select: none;
          transition: color 0.3s ease;
        }

        .sk-card:hover .sk-card-number {
          color: rgba(255,255,255,0.04);
        }

        .sk-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sk-card-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--card-color);
          box-shadow: 0 0 10px var(--card-color);
          animation: skPulse 2.5s ease infinite;
        }

        @keyframes skPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .sk-card-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--card-color);
        }

        .sk-skill-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: all 0.2s ease;
          cursor: default;
        }

        .sk-skill-row:last-child {
          border-bottom: none;
        }

        .sk-skill-row:hover {
          padding-left: 6px;
        }

        .sk-skill-row:hover .sk-skill-name {
          color: #e8e4dc;
        }

        .sk-skill-row:hover .sk-skill-icon {
          animation: skIconSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes skIconSpin {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(180deg); }
          100% { transform: scale(1.1) rotate(360deg); }
        }

        .sk-skill-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transform: scale(1) rotate(0deg);
          transition: transform 0.3s ease;
        }

        .sk-skill-info {
          flex: 1;
          min-width: 0;
        }

        .sk-skill-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          color: #6a6a60;
          letter-spacing: 0.06em;
          margin-bottom: 6px;
          transition: color 0.2s ease;
        }

        .sk-progress-track {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.04);
          border-radius: 2px;
          overflow: hidden;
        }

        .sk-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: var(--card-color);
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .sk-skill-row:hover .sk-progress-fill {
          opacity: 1;
        }

        .sk-skill-level {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #3a3a36;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          min-width: 32px;
          text-align: right;
          transition: color 0.2s ease;
        }

        .sk-skill-row:hover .sk-skill-level {
          color: var(--card-color);
        }

        .sk-float {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          opacity: 0.03;
          pointer-events: none;
          user-select: none;
          color: #c8f060;
        }

        .sk-total-strip {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 48px;
          flex-wrap: wrap;
        }

        .sk-total-item {
          text-align: center;
        }

        .sk-total-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .sk-total-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3a3a36;
          margin-top: 6px;
        }

        @media (max-width: 900px) {
          .sk-cards-wrap {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section
        id="skills"
        ref={sectionRef}
        style={{
          padding: "120px 5%",
          position: "relative",
          overflow: "hidden",
          background: "#080808",
          minHeight: "100vh",
        }}
      >
        {/* Grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(200,240,96,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,96,0.025) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            pointerEvents: "none",
          }}
        />

        {/* Floating code snippets */}
        {["const", "import", "async", "return", "export", "=>"].map((t, i) => (
          <div key={i} className="sk-float" style={{ left: `${6 + i * 16}%`, top: `${8 + (i % 3) * 32}%` }}>
            {t}
          </div>
        ))}

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          {/* Heading */}
          <div ref={headingRef} style={{ textAlign: "center", marginBottom: "72px" }}>
            <div className="sk-tag">what i work with</div>
            <h2 style={{ marginBottom: 0, lineHeight: 1 }}>
              {titleText.split("").map((char, i) => (
                <span
                  key={i}
                  className="sk-title-char"
                  style={{
                    color: char === "I" || char === "T" || char === "&" ? "#c8f060" : "#f0ece4",
                    marginRight: char === " " ? "14px" : undefined,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <div className="sk-line" />
            <p className="sk-desc">
              Technologies I use to build seamless, performant, and pixel-perfect web experiences.
            </p>
          </div>

          {/* Cards grid */}
          <div
            className="sk-cards-wrap"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {skillCategories.map((cat) => (
              <div
                key={cat.title}
                className="sk-card"
                style={
                  {
                    "--card-color": cat.color,
                    "--card-glow": `${cat.color}10`,
                  } as React.CSSProperties
                }
              >
                <div className="sk-card-accent" />
                <div className="sk-card-number">{cat.tag}</div>

                <div className="sk-card-header">
                  <span className="sk-card-dot" />
                  <span className="sk-card-title">{cat.title}</span>
                </div>

                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="sk-skill-row"
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="sk-skill-icon">{skill.icon}</div>
                    <div className="sk-skill-info">
                      <div className="sk-skill-name">{skill.name}</div>
                      <div className="sk-progress-track">
                        <div
                          className="sk-progress-fill"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                    <div
                      className="sk-skill-level"
                      style={{
                        color: hoveredSkill === skill.name ? cat.color : undefined,
                      }}
                    >
                      {skill.level}%
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom totals */}
          <div className="sk-total-strip">
            {skillCategories.map((cat) => (
              <div key={cat.title} className="sk-total-item">
                <div className="sk-total-num" style={{ color: cat.color }}>
                  {cat.skills.length}+
                </div>
                <div className="sk-total-label">{cat.title.split(" ")[0]}</div>
              </div>
            ))}
            <div className="sk-total-item">
              <div className="sk-total-num" style={{ color: "#c8f060" }}>
                {skillCategories.reduce((sum, c) => sum + c.skills.length, 0)}+
              </div>
              <div className="sk-total-label">Total</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
