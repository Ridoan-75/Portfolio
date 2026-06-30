"use client";

export default function ParticleBackground() {
  return (
    <>
      <style>{`
        .pro-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #06070f;
        }

        /* ── Diagonal grid ── */
        .pro-bg::before {
          content: '';
          position: absolute;
          inset: -50%;
          width: 200%;
          height: 200%;
          background-image:
            linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
          background-size: 52px 52px;
          transform: rotate(-8deg);
        }

        /* ── Vertical beam — blue left ── */
        .pro-beam-1 {
          position: absolute;
          top: -100%;
          left: 20%;
          width: 1px;
          height: 60%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(59,130,246,0.22) 30%,
            rgba(59,130,246,0.38) 50%,
            rgba(59,130,246,0.22) 70%,
            transparent
          );
          animation: beamDown 9s ease-in-out infinite;
          filter: blur(0.5px);
        }

        /* ── Vertical beam — light blue right ── */
        .pro-beam-2 {
          position: absolute;
          top: -100%;
          right: 25%;
          width: 1px;
          height: 55%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(147,197,253,0.18) 30%,
            rgba(147,197,253,0.28) 50%,
            rgba(147,197,253,0.18) 70%,
            transparent
          );
          animation: beamDown 13s ease-in-out infinite 4s;
          filter: blur(0.5px);
        }

        /* ── Horizontal beam — blue ── */
        .pro-beam-3 {
          position: absolute;
          left: -60%;
          top: 42%;
          width: 50%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(59,130,246,0.08) 30%,
            rgba(59,130,246,0.14) 50%,
            rgba(59,130,246,0.08) 70%,
            transparent
          );
          animation: beamRight 16s ease-in-out infinite 2s;
          filter: blur(0.5px);
        }

        @keyframes beamDown {
          0%   { top: -65%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 115%; opacity: 0; }
        }
        @keyframes beamRight {
          0%   { left: -55%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }

        /* ── Corner glows ── */
        .pro-corner-tl {
          position: absolute;
          top: -140px;
          left: -80px;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(59,130,246,0.09) 0%,
            rgba(59,130,246,0.03) 45%,
            transparent 70%
          );
          animation: cPulse 12s ease-in-out infinite;
        }

        .pro-corner-br {
          position: absolute;
          bottom: -120px;
          right: -100px;
          width: 580px;
          height: 580px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(147,197,253,0.07) 0%,
            rgba(147,197,253,0.02) 45%,
            transparent 70%
          );
          animation: cPulse 15s ease-in-out infinite 5s;
        }

        .pro-corner-tr {
          position: absolute;
          top: -60px;
          right: -40px;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(59,130,246,0.06) 0%,
            rgba(59,130,246,0.02) 45%,
            transparent 70%
          );
          animation: cPulse 18s ease-in-out infinite 2s;
        }

        @keyframes cPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.55; transform: scale(1.08); }
        }

        /* ── Scan lines ── */
        .pro-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.05) 3px,
            rgba(0,0,0,0.05) 4px
          );
        }

        /* ── Top accent line ── */
        .pro-top-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(59,130,246,0.4) 30%,
            rgba(147,197,253,0.35) 60%,
            rgba(59,130,246,0.3) 85%,
            transparent 100%
          );
        }

        /* ── Vignette ── */
        .pro-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 90% 85% at 50% 50%,
            transparent 20%,
            rgba(3,4,12,0.7) 100%
          );
        }
      `}</style>

      <div className="pro-bg">
        <div className="pro-scanlines" />
        <div className="pro-corner-tl" />
        <div className="pro-corner-br" />
        <div className="pro-corner-tr" />
        <div className="pro-beam-1" />
        <div className="pro-beam-2" />
        <div className="pro-beam-3" />
        <div className="pro-top-line" />
        <div className="pro-vignette" />
      </div>
    </>
  );
}
