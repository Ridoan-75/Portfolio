"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const educations = [
  {
    degree: "B.Sc in Computer Science & Engineering",
    institution: "University of Dhaka · Dhaka, Bangladesh",
    period: "2019 – 2023",
    badge: "Graduated",
    badgeColor: "#c8f060",
    subjects: ["Algorithms", "Data Structures", "OS", "Networking", "AI"],
    description:
      "Completed a four-year undergraduate program with a strong focus on software engineering principles, computer systems, and modern web technologies. Graduated with distinction and was an active member of the CS club.",
    achievements: [
      "Graduated with CGPA 3.8 out of 4.0",
      "Led the university web development club",
      "Completed capstone project on real-time collaboration tools",
    ],
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "Dhaka College · Science Division",
    period: "2016 – 2018",
    badge: "Completed",
    badgeColor: "#60a5fa",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "ICT"],
    description:
      "Completed HSC with a science background, building a strong analytical foundation. Developed an early interest in programming through ICT coursework and self-study.",
    achievements: [
      "GPA 5.0 out of 5.0",
      "Won inter-college math olympiad",
      "Represented school in national science fair",
    ],
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Motijheel Model School · Dhaka",
    period: "2014 – 2016",
    badge: "Completed",
    badgeColor: "#f472b6",
    subjects: ["Mathematics", "Science", "English", "ICT", "General Studies"],
    description:
      "Completed secondary education with top grades. First exposure to computers and programming sparked a deep passion for technology that led to a career in software development.",
    achievements: [
      "GPA 5.0 out of 5.0",
      "Best student award in ICT",
      "Active member of school science club",
    ],
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".edu-heading",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        scrollTrigger: { trigger: ".edu-heading", start: "top 85%" },
      }
    );

    gsap.fromTo(
      ".timeline-line",
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      }
    );

    const cards = gsap.utils.toArray<HTMLElement>(".edu-card");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .edu-card-inner {
          background: rgba(255,255,255,0.02);
          border: 1px solid #1a1a18;
          border-radius: 4px;
          padding: 28px 32px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .edu-card-inner:hover {
          transform: translateX(6px);
        }
      `}</style>

      <section
        id="education"
        ref={sectionRef}
        style={{
          padding: "100px 5%",
          position: "relative",
          background: "#080808",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* grid bg */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(200,240,96,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,240,96,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
          }}
        />

        {/* floating particles */}
        {["BSC", "HSC", "SSC", "GPA", "CS", "EDU"].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${8 + i * 16}%`,
              top: `${12 + (i % 3) * 28}%`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              opacity: 0.04,
              pointerEvents: "none",
              userSelect: "none",
              color: "#c8f060",
            }}
          >
            {p}
          </div>
        ))}

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          {/* Heading */}
          <div
            className="edu-heading"
            style={{ textAlign: "center", marginBottom: "72px", opacity: 0 }}
          >
            <div
              style={{
                display: "inline-block",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c8f060",
                border: "1px solid rgba(200,240,96,0.25)",
                padding: "6px 14px",
                borderRadius: "2px",
                marginBottom: "20px",
              }}
            >
              // academic background
            </div>

            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(40px, 5vw, 64px)",
                color: "#f0ece4",
                letterSpacing: "0.04em",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              EDU<span style={{ color: "#c8f060" }}>C</span>ATION
            </h2>

            <div
              style={{
                height: "1px",
                width: "48px",
                background: "#c8f060",
                margin: "12px auto 20px",
              }}
            />

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "#4a4a44",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.8,
                letterSpacing: "0.02em",
              }}
            >
              My academic journey that built the foundation for everything I create today.
            </p>
          </div>

          {/* Timeline */}
          <div
            className="timeline-container"
            style={{ position: "relative", paddingLeft: "40px" }}
          >
            {/* Vertical line */}
            <div
              className="timeline-line"
              style={{
                position: "absolute",
                left: "15px",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "linear-gradient(to bottom, #c8f060, #60a5fa, #f472b6)",
                borderRadius: "2px",
              }}
            />

            {educations.map((edu, i) => (
              <div
                key={i}
                className="edu-card"
                style={{
                  position: "relative",
                  marginBottom: "28px",
                  opacity: 0,
                }}
              >
                {/* Timeline dot */}
                <motion.div
                  whileInView={{ scale: [0, 1.4, 1] }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  style={{
                    position: "absolute",
                    left: "-32px",
                    top: "28px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: edu.badgeColor,
                    border: "2px solid #080808",
                    boxShadow: `0 0 10px ${edu.badgeColor}80`,
                  }}
                />

                {/* Card */}
                <div
                  className="edu-card-inner"
                  style={{
                    borderTopColor: edu.badgeColor + "60",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = edu.badgeColor + "40";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#1a1a18";
                  }}
                >
                  {/* accent top bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: edu.badgeColor,
                      opacity: 0.5,
                    }}
                  />

                  {/* Top Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "14px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#e8e4dc",
                          marginBottom: "5px",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          color: "#4a4a44",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {edu.institution}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "2px",
                          background: `${edu.badgeColor}15`,
                          color: edu.badgeColor,
                          border: `1px solid ${edu.badgeColor}35`,
                        }}
                      >
                        {edu.badge}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          color: "#3a3a36",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {edu.period}
                      </span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      marginBottom: "16px",
                    }}
                  >
                    {edu.subjects.map((subject) => (
                      <span
                        key={subject}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          background: "rgba(200,240,96,0.05)",
                          border: "1px solid rgba(200,240,96,0.12)",
                          borderRadius: "2px",
                          color: "#6a6a5a",
                        }}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                      color: "#4a4a44",
                      lineHeight: 1.8,
                      marginBottom: "16px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {edu.description}
                  </p>

                  {/* Achievements */}
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {edu.achievements.map((a) => (
                      <li
                        key={a}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          color: "#4a4a44",
                          letterSpacing: "0.04em",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: edu.badgeColor,
                            boxShadow: `0 0 6px ${edu.badgeColor}`,
                            flexShrink: 0,
                          }}
                        />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}