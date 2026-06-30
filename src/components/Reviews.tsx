"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Review = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  reply: { message: string } | null;
};

const starIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setFetching(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rv-status-tag",
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.1,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".rv-heading",
        { y: 60, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1, ease: "power4.out", delay: 0.25,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".rv-role-line",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.45,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
      gsap.fromTo(".rv-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.6,
          scrollTrigger: { trigger: headingRef.current, start: "top 82%", once: true } }
      );
    }, headingRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rv-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: ".rv-grid", start: "top 82%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reviews]);

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", boxSizing: "border-box",
    background: focusedField === field ? "rgba(var(--accent-rgb),0.03)" : "#0c0c0a",
    border: `1px solid ${focusedField === field ? "rgba(var(--accent-rgb),0.3)" : "#1a1a18"}`,
    borderRadius: "3px", padding: "13px 16px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
    color: "#e8e4dc", outline: "none",
    transition: "border-color 0.25s, background 0.25s",
    resize: "none",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setName("");
        setMessage("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        fetchReviews();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        #reviews {
          padding: 80px 60px 80px;
          min-height: 100vh;
          color: #e8e4dc;
          position: relative; overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        #reviews::before {
          content: ''; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(var(--accent-rgb),.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb),.04) 1px, transparent 1px);
          background-size: 44px 44px; pointer-events: none; z-index: 0;
        }
        .rv-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        .rv-status-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(var(--accent-rgb),.06); border: 1px solid rgba(var(--accent-rgb),.2);
          border-radius: 3px; padding: 7px 14px; width: fit-content; margin-bottom: 24px; opacity: 0;
        }
        .rv-status-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
          box-shadow: 0 0 6px var(--accent); animation: rvBlink 2s ease infinite;
        }
        @keyframes rvBlink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .rv-status-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }

        .rv-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(56px, 10vw, 120px);
          line-height: .92; letter-spacing: .02em;
          color: #f0ece4; margin-bottom: 20px; opacity: 0;
        }
        .rv-heading .h-accent { color: var(--accent); }
        .rv-role-line {
          font-family: 'JetBrains Mono', monospace; font-size: 14px; letter-spacing:.08em;
          text-transform: uppercase; color: #6a6a60; margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap; opacity: 0;
        }
        .rv-role-line::before { content: ''; width: 28px; height: 1px; background: var(--accent); flex-shrink: 0; }
        .rv-desc { font-size: 16px; line-height: 1.85; color: #4a4a44; max-width: 500px; margin-bottom: 52px; opacity: 0; }

        .rv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 64px;
        }
        .rv-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.016) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.09), 0 3px 16px rgba(0,0,0,0.28);
          backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 10px; padding: 24px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          opacity: 0;
        }
        .rv-card:hover {
          border-color: rgba(var(--accent-rgb),0.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 6px 28px rgba(0,0,0,0.35), 0 0 20px rgba(var(--accent-rgb),0.06);
        }
        .rv-card-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: rgba(var(--accent-rgb),0.12); border: 1px solid rgba(var(--accent-rgb),0.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--accent);
          flex-shrink: 0;
        }
        .rv-card-name { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; color: #e8e4dc; }
        .rv-card-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #4a4a44; letter-spacing: 0.06em; }
        .rv-card-msg { font-size: 14px; color: #8a8a80; line-height: 1.75; margin-top: 12px; }
        .rv-reply {
          margin-top: 14px; padding: 12px 14px;
          background: rgba(var(--accent-rgb),0.04); border: 1px solid rgba(var(--accent-rgb),0.12);
          border-radius: 6px;
        }
        .rv-reply-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.08em; margin-bottom: 5px; }
        .rv-reply-text { font-size: 13px; color: #8a8a80; line-height: 1.65; }

        .rv-form-wrap {
          background: linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.018) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 32px rgba(0,0,0,0.32);
          backdrop-filter: blur(14px) saturate(1.4);
          border-radius: 10px; padding: 36px 32px;
          max-width: 600px;
          position: relative;
        }
        .rv-form-title {
          font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.04em;
          color: #f0ece4; margin-bottom: 6px;
        }
        .rv-form-subtitle {
          font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #4a4a44;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
        }
        .rv-label {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing:.1em;
          text-transform: uppercase; color: #8a8a80; margin-bottom: 8px; display: block;
        }
        .rv-submit-btn {
          width: 100%; padding: 14px 24px; border-radius: 3px; border: none;
          background: var(--accent); color: #080808;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          letter-spacing: .12em; text-transform: uppercase; font-weight: 600;
          cursor: pointer; transition: filter .2s;
        }
        .rv-submit-btn:hover:not(:disabled) { filter: brightness(1.1); }
        .rv-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rv-success {
          background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
          border-radius: 6px; padding: 14px 18px; margin-bottom: 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #86efac; letter-spacing: 0.06em;
        }
        .rv-empty {
          text-align: center; padding: 60px 20px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: #3a3a36; letter-spacing: 0.08em; text-transform: uppercase;
        }
        @media (max-width: 767px) {
          #reviews { padding: 80px 24px 80px; padding-top: 100px; }
          .rv-grid { grid-template-columns: 1fr; }
          .rv-form-wrap { padding: 24px 20px; }
          .rv-heading { font-size: clamp(52px, 14vw, 80px); }
        }
        @media (max-width: 599px) {
          #reviews { padding: 50px 18px 80px; padding-top: 90px; }
          .rv-heading { font-size: clamp(44px, 16vw, 64px); }
        }
      `}</style>

      <section id="reviews" ref={sectionRef}>
        <div className="rv-inner">
          {/* Heading */}
          <div ref={headingRef}>
            <div className="rv-status-tag">
              <span className="rv-status-dot" />
              <span className="rv-status-text">Client Feedback</span>
            </div>
            <h2 className="rv-heading">
              What People <span className="h-accent">S</span>ay
            </h2>
            <div className="rv-role-line">
              Honest words from real collaborators
            </div>
            <p className="rv-desc">
              Reviews left by clients, colleagues, and collaborators I&apos;ve worked with.
              Drop yours below — I read every one.
            </p>
          </div>

          {/* Review cards */}
          {fetching ? (
            <div className="rv-empty">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="rv-empty">No reviews yet — be the first!</div>
          ) : (
            <div className="rv-grid">
              {reviews.map((review) => (
                <div key={review.id} className="rv-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <div className="rv-card-avatar">{review.name[0].toUpperCase()}</div>
                    <div>
                      <div className="rv-card-name">{review.name}</div>
                      <div className="rv-card-date">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => <span key={i}>{starIcon}</span>)}
                    </div>
                  </div>
                  <p className="rv-card-msg">&ldquo;{review.message}&rdquo;</p>
                  {review.reply && (
                    <div className="rv-reply">
                      <div className="rv-reply-label">↳ Reply from Ridoan</div>
                      <div className="rv-reply-text">{review.reply.message}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Submit form */}
          <div className="rv-form-wrap">
            <div className="rv-form-title">Leave a Review</div>
            <div className="rv-form-subtitle">{"// Share your experience working with me"}</div>

            {submitted && (
              <div className="rv-success">✓ Review submitted! Thank you for your feedback.</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: "16px" }}>
                <label className="rv-label">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  style={inputStyle("name")}
                  required
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label className="rv-label">Your Review</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Share your experience working with Ridoan..."
                  rows={4}
                  style={{ ...inputStyle("message"), resize: "none" }}
                  required
                />
              </div>
              <button type="submit" disabled={loading || !name.trim() || !message.trim()} className="rv-submit-btn">
                {loading ? "Submitting..." : "Submit Review →"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
