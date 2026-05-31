"use client";

import { useEffect, useRef } from "react";

type BgType = "particles" | "aurora" | "grid" | "starfield" | "fireflies" | "warp" | "static" | "none";

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number = 0;
    const mouse = { x: -9999, y: -9999 };

    let bgType: BgType = "particles";
    let currentAccent = "#c8f060";
    let particleCount = 110;
    let showStars = true;
    let showRipple = true;

    try {
      const saved = localStorage.getItem("site-settings");
      if (saved) {
        const s = JSON.parse(saved);
        currentAccent = s.accent || "#c8f060";
        bgType = s.bg || "particles";
      }
    } catch { /* no saved settings */ }

    // ── PARTICLES ──
    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number; pulseSpeed: number };
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      }));
    };

    type Star = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    const stars: Star[] = [];
    let starTimer = 0;
    const spawnStar = () => stars.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5,
      vx: Math.random() * 4 + 2, vy: Math.random() * 1.5 + 0.5,
      life: 0, maxLife: Math.random() * 60 + 40,
    });

    type Ripple = { x: number; y: number; r: number; alpha: number };
    const ripples: Ripple[] = [];
    const onClick = (e: MouseEvent) => {
      if (!showRipple) return;
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.5 });
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * (Math.random() * 2 + 1),
          vy: Math.sin(angle) * (Math.random() * 2 + 1),
          r: Math.random() * 2 + 1, alpha: 0.9, pulse: 0, pulseSpeed: 0.03,
        });
        if (particles.length > 220) particles.shift();
      }
    };

    // ── AURORA ──
    type AuroraBlob = { x: number; y: number; vx: number; vy: number; rx: number; ry: number; alpha: number; t: number };
    let auroraBlobs: AuroraBlob[] = [];

    const initAurora = () => {
      auroraBlobs = Array.from({ length: 6 }, () => ({
        x: Math.random() * canvas.width, y: (Math.random() * 0.7 + 0.05) * canvas.height,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.1,
        rx: Math.random() * 320 + 180, ry: Math.random() * 140 + 80,
        alpha: Math.random() * 0.07 + 0.025, t: Math.random() * Math.PI * 2,
      }));
    };

    // ── GRID ──
    type GridDot = { x: number; y: number; pulse: number; pulseSpeed: number; baseAlpha: number };
    let gridDots: GridDot[] = [];
    let gridCols = 0, gridRows = 0;
    const GRID = 60;

    const initGrid = () => {
      gridCols = Math.floor(canvas.width / GRID) + 2;
      gridRows = Math.floor(canvas.height / GRID) + 2;
      gridDots = Array.from({ length: gridCols * gridRows }, (_, i) => ({
        x: (i % gridCols) * GRID, y: Math.floor(i / gridCols) * GRID,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        baseAlpha: Math.random() * 0.25 + 0.05,
      }));
    };

    // ── STARFIELD ──
    type StarfieldStar = { x: number; y: number; z: number; pz: number };
    let sfStars: StarfieldStar[] = [];
    const SF_COUNT = 200;

    const initStarfield = () => {
      sfStars = Array.from({ length: SF_COUNT }, () => ({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * canvas.width,
        pz: 0,
      }));
    };

    // ── FIREFLIES ──
    type Firefly = { x: number; y: number; vx: number; vy: number; alpha: number; phase: number; phaseSpeed: number; r: number };
    let fireflies: Firefly[] = [];
    const FF_COUNT = 60;

    const initFireflies = () => {
      fireflies = Array.from({ length: FF_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random(),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.03 + 0.01,
        r: Math.random() * 2.5 + 1.5,
      }));
    };

    // ── WARP ──
    type WarpLine = { angle: number; speed: number; dist: number; maxDist: number; width: number };
    let warpLines: WarpLine[] = [];
    const WARP_COUNT = 120;

    const initWarp = () => {
      warpLines = Array.from({ length: WARP_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 4 + 1.5,
        dist: Math.random() * 400,
        maxDist: Math.random() * 300 + 200,
        width: Math.random() * 1.2 + 0.3,
      }));
    };

    // ── STATIC ──
    let noiseOffset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (bgType === "grid") initGrid();
      else if (bgType === "aurora") initAurora();
      else if (bgType === "starfield") initStarfield();
      else if (bgType === "fireflies") initFireflies();
      else if (bgType === "warp") initWarp();
      else initParticles();
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("click", onClick);

    const drawParticles = () => {
      const [r, g, b] = hexToRgb(currentAccent);

      if (showStars) {
        starTimer++;
        if (starTimer > 90) { spawnStar(); starTimer = 0; }
        for (let i = stars.length - 1; i >= 0; i--) {
          const s = stars[i]; s.x += s.vx; s.y += s.vy; s.life++;
          const prog = s.life / s.maxLife;
          const a = Math.max(0, Math.min(1, prog < 0.3 ? prog / 0.3 : 1 - (prog - 0.3) / 0.7));
          const tl = 60;
          const grad = ctx.createLinearGradient(s.x - s.vx * tl, s.y - s.vy * tl, s.x, s.y);
          grad.addColorStop(0, `${currentAccent}00`);
          const alphaHex = Math.floor(Math.max(0, a * 0.6) * 255).toString(16).padStart(2, "0");
          grad.addColorStop(1, `${currentAccent}${alphaHex}`);
          ctx.beginPath(); ctx.moveTo(s.x - s.vx * tl, s.y - s.vy * tl); ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0, a * 0.9)})`; ctx.fill();
          if (s.life >= s.maxLife) stars.splice(i, 1);
        }
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i]; rp.r += 4; rp.alpha -= 0.012;
        if (rp.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        const rippleAlpha = Math.max(0, rp.alpha);
        ctx.strokeStyle = `${currentAccent}${Math.floor(rippleAlpha * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1; ctx.stroke();
      }

      while (particles.length > particleCount) particles.shift();
      while (particles.length < particleCount) particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8, alpha: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2, pulseSpeed: Math.random() * 0.02 + 0.008,
      });

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) { const f = (150 - dist) / 150; p.vx += (dx / dist) * f * 0.025; p.vy += (dy / dist) * f * 0.025; }
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2.5) { p.vx = (p.vx / spd) * 2.5; p.vy = (p.vy / spd) * 2.5; }
        p.pulse += p.pulseSpeed;
        const pa = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3);
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grd.addColorStop(0, `rgba(${r},${g},${b},${pa * 0.4})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${pa})`; ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${0.18 * (1 - d / 140)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
        const dx = mouse.x - particles[i].x, dy = mouse.y - particles[i].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.45 * (1 - d / 180)})`; ctx.lineWidth = 0.8; ctx.stroke();
        }
      }

      if (mouse.x > 0) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        mg.addColorStop(0, `rgba(${r},${g},${b},0.06)`); mg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2); ctx.fillStyle = mg; ctx.fill();
      }
    };

    const drawAurora = () => {
      const [r, g, b] = hexToRgb(currentAccent);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      auroraBlobs.forEach((blob) => {
        blob.t += 0.004; blob.x += blob.vx; blob.y += blob.vy;
        if (blob.x < -blob.rx) blob.vx = Math.abs(blob.vx);
        if (blob.x > canvas.width + blob.rx) blob.vx = -Math.abs(blob.vx);
        if (blob.y < blob.ry * 0.5) blob.vy = Math.abs(blob.vy);
        if (blob.y > canvas.height * 0.85 + blob.ry) blob.vy = -Math.abs(blob.vy);
        const pulse = 0.7 + Math.sin(blob.t) * 0.3;
        const scaleY = blob.ry / blob.rx;
        ctx.save();
        ctx.translate(blob.x, blob.y);
        ctx.scale(1, scaleY);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.rx);
        grad.addColorStop(0, `rgba(${r},${g},${b},${blob.alpha * pulse * 1.8})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${blob.alpha * pulse * 0.7})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(0, 0, blob.rx, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.restore();
      });
    };

    const drawGrid = () => {
      const [r, g, b] = hexToRgb(currentAccent);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      gridDots.forEach((dot) => {
        dot.pulse += dot.pulseSpeed;
        const a = dot.baseAlpha * (0.4 + Math.sin(dot.pulse) * 0.6);
        const mx = mouse.x - dot.x, my = mouse.y - dot.y;
        const md = Math.sqrt(mx * mx + my * my);
        const boost = md < 150 ? (1 - md / 150) * 0.6 : 0;
        ctx.beginPath(); ctx.arc(dot.x, dot.y, 1.5 + boost * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(a + boost, 0.9)})`; ctx.fill();
      });
      for (let j = 0; j < gridRows; j++) {
        for (let i = 0; i < gridCols - 1; i++) {
          const a = gridDots[j * gridCols + i], bDot = gridDots[j * gridCols + i + 1];
          if (!a || !bDot) continue;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bDot.x, bDot.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(a.baseAlpha, bDot.baseAlpha) * 0.25})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      for (let i = 0; i < gridCols; i++) {
        for (let j = 0; j < gridRows - 1; j++) {
          const a = gridDots[j * gridCols + i], bDot = gridDots[(j + 1) * gridCols + i];
          if (!a || !bDot) continue;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(bDot.x, bDot.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(a.baseAlpha, bDot.baseAlpha) * 0.25})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      if (mouse.x > 0) {
        const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        mg.addColorStop(0, `rgba(${r},${g},${b},0.08)`); mg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2); ctx.fillStyle = mg; ctx.fill();
      }
    };

    const drawStarfield = () => {
      const [r, g, b] = hexToRgb(currentAccent);
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const speed = 3;

      sfStars.forEach((s) => {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0) {
          s.x = Math.random() * canvas.width - cx;
          s.y = Math.random() * canvas.height - cy;
          s.z = canvas.width;
          s.pz = s.z;
        }
        const sx = (s.x / s.z) * canvas.width + cx;
        const sy = (s.y / s.z) * canvas.height + cy;
        const px = (s.x / s.pz) * canvas.width + cx;
        const py = (s.y / s.pz) * canvas.height + cy;
        const size = Math.max(0.5, (1 - s.z / canvas.width) * 3);
        const alpha = 1 - s.z / canvas.width;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.8})`;
        ctx.lineWidth = size;
        ctx.stroke();
      });
    };

    const drawFireflies = () => {
      const [r, g, b] = hexToRgb(currentAccent);
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach((f) => {
        f.phase += f.phaseSpeed;
        f.vx += (Math.random() - 0.5) * 0.05;
        f.vy += (Math.random() - 0.5) * 0.05;
        const spd = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
        if (spd > 0.8) { f.vx = (f.vx / spd) * 0.8; f.vy = (f.vy / spd) * 0.8; }
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 0) f.y = canvas.height;
        if (f.y > canvas.height) f.y = 0;

        const a = (Math.sin(f.phase) * 0.5 + 0.5) * 0.9 + 0.1;
        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
        glow.addColorStop(0, `rgba(${r},${g},${b},${a * 0.5})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.6})`;
        ctx.fill();
      });
    };

    const drawWarp = () => {
      const [r, g, b] = hexToRgb(currentAccent);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      warpLines.forEach((line) => {
        line.dist += line.speed;
        if (line.dist > line.maxDist) {
          line.angle = Math.random() * Math.PI * 2;
          line.dist = 0;
          line.maxDist = Math.random() * 300 + 200;
          line.speed = Math.random() * 4 + 1.5;
          line.width = Math.random() * 1.2 + 0.3;
        }

        const progress = line.dist / line.maxDist;
        const alpha = Math.min(progress * 2, 1) * (1 - progress * 0.6);

        const x1 = cx + Math.cos(line.angle) * (line.dist * 0.4);
        const y1 = cy + Math.sin(line.angle) * (line.dist * 0.4);
        const x2 = cx + Math.cos(line.angle) * line.dist;
        const y2 = cy + Math.sin(line.angle) * line.dist;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${alpha})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.stroke();
      });

      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      cg.addColorStop(0, `rgba(${r},${g},${b},0.12)`);
      cg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();
    };

    const drawStatic = () => {
      noiseOffset += 0.5;
      const [r, g, b] = hexToRgb(currentAccent);
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random();
        if (noise > 0.97) {
          const bright = Math.random() * 0.6 + 0.2;
          data[i] = r * bright;
          data[i + 1] = g * bright;
          data[i + 2] = b * bright;
          data[i + 3] = Math.floor(bright * 180);
        } else {
          data[i] = data[i + 1] = data[i + 2] = 0;
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.015)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const onSettings = (e: Event) => {
      const d = (e as CustomEvent).detail;
      const prevBg = bgType;
      currentAccent = d.accent || "#c8f060";
      bgType = d.bg || "particles";

      if (bgType !== prevBg) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bgType === "grid") initGrid();
        else if (bgType === "aurora") initAurora();
        else if (bgType === "starfield") initStarfield();
        else if (bgType === "fireflies") initFireflies();
        else if (bgType === "warp") initWarp();
        else if (bgType === "particles") initParticles();
      }
    };
    window.addEventListener("site-settings-change", onSettings);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (bgType === "particles") drawParticles();
      else if (bgType === "aurora") drawAurora();
      else if (bgType === "grid") drawGrid();
      else if (bgType === "starfield") drawStarfield();
      else if (bgType === "fireflies") drawFireflies();
      else if (bgType === "warp") drawWarp();
      else if (bgType === "static") drawStatic();
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      window.removeEventListener("site-settings-change", onSettings);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}