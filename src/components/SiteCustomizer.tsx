"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { soundManager } from "@/lib/SoundManager";

const TRACKS = [
  { id: 1, label: "Track 1", src: "/music/Track-1.mp3" },
  { id: 2, label: "Track 2", src: "/music/Track-2.mp3" },
  { id: 3, label: "Track 3", src: "/music/Track-3.mp3" },
  { id: 4, label: "Track 4", src: "/music/Track-4.mp3" },
  { id: 5, label: "Track 5", src: "/music/Track-5.mp3" },
];

type BgType = "particles" | "aurora" | "grid" | "starfield" | "fireflies" | "warp" | "static" | "none";
type CursorType = "default" | "crosshair" | "tracer" | "radar" | "ghost" | "portal" | "snake" | "glitch" | "eye";
type ClickSoundType = "glitch" | "pop" | "faah" | "tap" | "crystal" | "yemete";
type HoverSoundType = "tick" | "whoosh" | "blip" | "flicker" | "swoosh";

interface Settings {
  accent: string;
  bg: BgType;
  cursor: CursorType;
  sound: boolean;
  clickSound: ClickSoundType;
  hoverSound: HoverSoundType;
}

const DEFAULTS: Settings = {
  accent: "#c8f060",
  bg: "particles",
  cursor: "crosshair",
  sound: true,
  clickSound: "glitch",
  hoverSound: "tick",
};

const ACCENTS = [
  { color: "#c8f060", name: "Lime" },
  { color: "#60a5fa", name: "Blue" },
  { color: "#f472b6", name: "Pink" },
  { color: "#a78bfa", name: "Purple" },
  { color: "#fb923c", name: "Orange" },
  { color: "#34d399", name: "Emerald" },
  { color: "#f87171", name: "Red" },
];

const BG_OPTIONS: { id: BgType; label: string; icon: string }[] = [
  { id: "particles", label: "Particles", icon: "✦" },
  { id: "aurora",    label: "Aurora",    icon: "◈" },
  { id: "grid",      label: "Grid",      icon: "⊞" },
  { id: "starfield", label: "Stars",     icon: "★" },
  { id: "fireflies", label: "Fireflies", icon: "✺" },
  { id: "warp",      label: "Warp",      icon: "≋" },
  { id: "static",    label: "Static",    icon: "▒" },
  { id: "none",      label: "None",      icon: "○" },
];

const CURSOR_OPTIONS: { id: CursorType; label: string; icon: string }[] = [
  { id: "default",   label: "Default",   icon: "↖" },
  { id: "crosshair", label: "Cross",     icon: "✛" },
  { id: "tracer",    label: "Tracer",    icon: "≫" },
  { id: "radar",     label: "Radar",     icon: "◎" },
  { id: "ghost",     label: "Ghost",     icon: "◌" },
  { id: "portal",    label: "Portal",    icon: "⊙" },
  { id: "snake",     label: "Snake",     icon: "⌇" },
  { id: "glitch",    label: "Glitch",    icon: "⁒" },
  { id: "eye",       label: "Eye",       icon: "◉" },
];

const CLICK_SOUND_OPTIONS: { id: ClickSoundType; label: string }[] = [
  { id: "glitch",  label: "Glitch" },
  { id: "pop",     label: "Pop" },
  { id: "faah",    label: "Faah" },
  { id: "tap",     label: "Tap" },
  { id: "crystal", label: "Crystal" },
  { id: "yemete",  label: "Yemete" },
];

const HOVER_SOUND_OPTIONS: { id: HoverSoundType; label: string }[] = [
  { id: "tick",    label: "Tick" },
  { id: "whoosh",  label: "Whoosh" },
  { id: "blip",    label: "Blip" },
  { id: "flicker", label: "Flicker" },
  { id: "swoosh",  label: "Swoosh" },
];

function hexToRgbStr(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function applySettings(s: Settings) {
  const root = document.documentElement;
  root.style.setProperty("--accent", s.accent);
  root.style.setProperty("--accent-rgb", hexToRgbStr(s.accent));
  root.style.setProperty("--accent-glow", s.accent + "40");
  soundManager.setEnabled(s.sound);
  soundManager.setClickSound(s.clickSound);
  soundManager.setHoverSound(s.hoverSound);
  localStorage.setItem("site-settings", JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("site-settings-change", { detail: s }));
}

export default function SiteCustomizer() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const gearRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("site-settings");
      if (saved) {
        const parsed = JSON.parse(saved) as Settings;
        const merged = { ...DEFAULTS, ...parsed };
        setSettings(merged);
        applySettings(merged);
      } else {
        applySettings(DEFAULTS);
      }
    } catch { applySettings(DEFAULTS); }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "g" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    const isMobile = window.innerWidth < 768;
    if (open) {
      // reset scroll
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (isMobile) {
        gsap.fromTo(panelRef.current,
          { y: "100%", opacity: 0, pointerEvents: "none" },
          { y: 0, opacity: 1, pointerEvents: "all", duration: 0.45, ease: "power4.out" }
        );
      } else {
        gsap.fromTo(panelRef.current,
          { scale: 0.88, opacity: 0, pointerEvents: "none", y: 24 },
          { scale: 1, opacity: 1, pointerEvents: "all", y: 0, duration: 0.45, ease: "back.out(1.4)" }
        );
      }
      if (backdropRef.current)
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      if (isMobile) {
        gsap.to(panelRef.current, { y: "100%", opacity: 0, pointerEvents: "none", duration: 0.32, ease: "power3.in" });
      } else {
        gsap.to(panelRef.current, { scale: 0.9, opacity: 0, pointerEvents: "none", y: 16, duration: 0.28, ease: "power3.in" });
      }
      if (backdropRef.current)
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
    }
  }, [open]);

  useEffect(() => {
    if (!gearRef.current) return;
    gsap.to(gearRef.current.querySelector(".gear-icon"), {
      rotation: open ? 120 : 0,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  }, [open]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
    const onTime = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[currentTrack].src;
    audio.load();
    if (musicPlaying) audio.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume;
  }, [musicVolume]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) { audio.pause(); setMusicPlaying(false); }
    else {
      if (!audio.src) { audio.src = TRACKS[currentTrack].src; audio.load(); }
      audio.play().catch(() => {});
      setMusicPlaying(true);
    }
  };

  const selectTrack = (i: number) => { setCurrentTrack(i); setMusicPlaying(true); };
  const prevTrack = () => selectTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
  const nextTrack = () => selectTrack((currentTrack + 1) % TRACKS.length);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  const fmtTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      applySettings(next);
      return next;
    });
  }, []);

  return (
    <>
      <style>{`
        .sc-gear-btn {
          position: fixed;
          bottom: 92px; right: 28px;
          width: 46px; height: 46px;
          border-radius: 50%;
          background: #131311;
          border: 1px solid rgba(var(--accent-rgb),0.3);
          box-shadow: 4px 4px 10px rgba(0,0,0,0.5), -2px -2px 6px rgba(255,255,255,0.03), 0 0 18px rgba(var(--accent-rgb),0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 9999;
          color: var(--accent);
          transition: box-shadow .25s, border-color .25s, transform .2s;
        }
        .sc-gear-btn:hover {
          border-color: rgba(var(--accent-rgb),0.55);
          box-shadow: 4px 4px 12px rgba(0,0,0,0.6), -2px -2px 8px rgba(255,255,255,0.04), 0 0 28px rgba(var(--accent-rgb),0.2);
          transform: scale(1.06);
        }
        @media (max-width: 768px) { .sc-gear-btn { bottom: 80px; right: 20px; } }
        @media (max-width: 479px) { .sc-gear-btn { bottom: 74px; right: 16px; width: 42px; height: 42px; } }

        .sc-backdrop {
          position: fixed; inset: 0; z-index: 9997;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer; opacity: 0;
        }

        /* ── Desktop: centered modal ── */
        .sc-panel {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) scale(0.88);
          width: min(680px, 92vw);
          max-height: 90vh;
          background: #111110;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            12px 12px 40px rgba(0,0,0,0.75),
            -4px -4px 18px rgba(255,255,255,0.02),
            0 0 80px rgba(var(--accent-rgb),0.07);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          opacity: 0;
          pointer-events: none;
          will-change: transform, opacity;
          overflow: hidden;
        }

        /* ── Mobile: bottom sheet ── */
        @media (max-width: 767px) {
          .sc-panel {
            top: auto; left: 0; right: 0; bottom: 0;
            width: 100%;
            max-height: 92vh;
            border-radius: 20px 20px 0 0;
            border-bottom: none;
            transform: translateY(100%);
          }
        }
        @media (max-width: 479px) {
          .sc-panel { max-height: 95vh; border-radius: 16px 16px 0 0; }
        }

        /* ── Scrollable body ── */
        .sc-panel-body-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .sc-panel-body-scroll::-webkit-scrollbar { width: 4px; }
        .sc-panel-body-scroll::-webkit-scrollbar-track { background: transparent; }
        .sc-panel-body-scroll::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb),0.25);
          border-radius: 2px;
        }
        .sc-panel-body-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--accent-rgb),0.45);
        }

        .sc-accent-stripe {
          height: 3px;
          background: linear-gradient(90deg, var(--accent) 0%, rgba(var(--accent-rgb),0.4) 60%, transparent 100%);
          border-radius: 20px 20px 0 0;
          flex-shrink: 0;
        }
        @media (max-width: 767px) { .sc-accent-stripe { display: none; } }

        .sc-drag-handle {
          display: none;
          justify-content: center;
          padding: 12px 0 4px;
          flex-shrink: 0;
        }
        .sc-drag-handle-bar {
          width: 36px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.12);
        }
        @media (max-width: 767px) { .sc-drag-handle { display: flex; } }

        /* ── Header ── */
        .sc-header {
          padding: 18px 24px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; gap: 12px;
          flex-shrink: 0;
          background: #111110;
        }
        @media (max-width: 767px) { .sc-header { padding: 14px 18px 12px; } }

        .sc-header-icon {
          width: 34px; height: 34px; border-radius: 8px;
          background: #1a1a17;
          border: 1px solid rgba(var(--accent-rgb),0.2);
          box-shadow: inset 2px 2px 4px rgba(0,0,0,0.4), inset -1px -1px 2px rgba(255,255,255,0.03);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sc-header-text { flex: 1; min-width: 0; }
        .sc-header-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--accent);
          display: block;
        }
        .sc-header-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .08em;
          color: #3a3a36; display: block; margin-top: 2px;
        }
        .sc-header-hint {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; letter-spacing: .06em; color: #2a2a28;
          background: #0e0e0c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px; padding: 3px 7px;
          flex-shrink: 0;
        }
        @media (max-width: 767px) { .sc-header-hint { display: none; } }
        .sc-close-btn {
          width: 30px; height: 30px; border-radius: 8px;
          background: #1a1a17;
          border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.4), -1px -1px 3px rgba(255,255,255,0.03);
          color: #4a4a44;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: border-color .2s, color .2s, box-shadow .2s;
        }
        .sc-close-btn:hover {
          border-color: rgba(var(--accent-rgb),0.35); color: var(--accent);
          box-shadow: 2px 2px 8px rgba(0,0,0,0.5), 0 0 10px rgba(var(--accent-rgb),0.1);
        }

        /* ── Body ── */
        .sc-body {
          padding: 24px 24px 28px;
          display: flex; flex-direction: column; gap: 28px;
        }
        @media (max-width: 479px) { .sc-body { padding: 16px 16px 22px; gap: 20px; } }

        .sc-section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .18em;
          text-transform: uppercase; color: #4a4a44;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .sc-section-num { color: var(--accent); font-size: 8px; opacity: 0.6; }
        .sc-section-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05), transparent);
        }

        /* ── Accent swatches ── */
        .sc-colors {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }
        .sc-swatch-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .sc-swatch {
          width: 100%; aspect-ratio: 1; border-radius: 50%;
          cursor: pointer; border: 2px solid transparent;
          transition: transform .2s, border-color .2s, box-shadow .2s;
          position: relative;
          box-shadow: 3px 3px 8px rgba(0,0,0,0.5), -1px -1px 4px rgba(255,255,255,0.05);
        }
        .sc-swatch:hover { transform: scale(1.1); }
        .sc-swatch.active {
          border-color: rgba(255,255,255,0.85);
          transform: scale(1.18);
          box-shadow: 3px 3px 10px rgba(0,0,0,0.6), 0 0 16px currentColor;
        }
        .sc-swatch.active::after {
          content: '✓'; position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #080808; font-weight: 800;
        }
        .sc-swatch-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; letter-spacing: .04em;
          color: #3a3a36; text-align: center;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; width: 100%;
        }
        .sc-swatch-wrap:has(.sc-swatch.active) .sc-swatch-name { color: #8a8a80; }

        /* ── Option grid ── */
        .sc-opt-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .sc-opt-btn {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 6px;
          padding: 14px 4px 13px;
          border-radius: 12px;
          background: #151513;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 4px 4px 10px rgba(0,0,0,0.5), -2px -2px 6px rgba(255,255,255,0.03);
          color: #4a4a44;
          cursor: pointer;
          transition: all .2s;
          min-height: 64px;
        }
        .sc-opt-btn:hover {
          color: #8a8a80;
          box-shadow: 5px 5px 12px rgba(0,0,0,0.55), -2px -2px 7px rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.09);
          transform: translateY(-1px);
        }
        .sc-opt-btn.active {
          background: #131311;
          border-color: rgba(var(--accent-rgb),0.4);
          color: var(--accent);
          box-shadow:
            inset 3px 3px 8px rgba(0,0,0,0.5),
            inset -1px -1px 4px rgba(255,255,255,0.02),
            0 0 16px rgba(var(--accent-rgb),0.12);
        }
        .sc-opt-icon { font-size: 16px; line-height: 1; font-style: normal; }
        .sc-opt-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .06em;
          text-transform: uppercase; line-height: 1;
        }
        @media (max-width: 479px) {
          .sc-opt-btn { min-height: 54px; padding: 10px 3px; border-radius: 10px; }
          .sc-opt-icon { font-size: 13px; }
          .sc-opt-label { font-size: 7.5px; }
        }

        @media (hover: none) and (pointer: coarse) {
          .sc-cursor-section { display: none; }
        }

        /* ── Toggle row ── */
        .sc-toggle-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: #151513;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          box-shadow: inset 2px 2px 6px rgba(0,0,0,0.4), inset -1px -1px 3px rgba(255,255,255,0.02);
          margin-bottom: 14px;
        }
        .sc-toggle-info { display: flex; flex-direction: column; gap: 3px; }
        .sc-toggle-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase; color: #8a8a80;
        }
        .sc-toggle-desc {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; letter-spacing: .06em; color: #3a3a36;
        }
        .sc-toggle {
          width: 44px; height: 24px; border-radius: 12px;
          background: #0e0e0c;
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.6), inset -1px -1px 3px rgba(255,255,255,0.02);
          cursor: pointer; position: relative;
          transition: background .25s, box-shadow .25s;
          flex-shrink: 0; border: none;
        }
        .sc-toggle.on {
          background: var(--accent);
          box-shadow: inset 2px 2px 5px rgba(0,0,0,0.3), 0 0 14px rgba(var(--accent-rgb),0.4);
        }
        .sc-toggle::after {
          content: ''; position: absolute; top: 4px; left: 4px;
          width: 16px; height: 16px; border-radius: 50%;
          background: #2a2a28;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
          transition: transform .25s cubic-bezier(.34,1.56,.64,1), background .25s;
        }
        .sc-toggle.on::after { transform: translateX(20px); background: #080808; }

        .sc-sub-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px; letter-spacing: .12em;
          text-transform: uppercase; color: #2e2e2c;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .sc-sub-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.03); }

        /* ── Sound grid ── */
        .sc-sound-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }
        .sc-sound-btn {
          padding: 10px 6px;
          border-radius: 8px;
          background: #151513;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 3px 3px 7px rgba(0,0,0,0.45), -1px -1px 4px rgba(255,255,255,0.02);
          color: #4a4a44;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; letter-spacing: .06em;
          text-transform: uppercase;
          cursor: pointer; text-align: center;
          transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 5px;
        }
        .sc-sound-btn:hover { color: #7a7a70; border-color: rgba(255,255,255,0.09); }
        .sc-sound-btn.active {
          background: #131311;
          border-color: rgba(var(--accent-rgb),0.35);
          color: var(--accent);
          box-shadow: inset 2px 2px 6px rgba(0,0,0,0.45), 0 0 10px rgba(var(--accent-rgb),0.1);
        }
        .sc-sound-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        /* ── Music ── */
        .sc-music-wrap {
          background: #151513;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 18px;
          box-shadow: inset 2px 2px 8px rgba(0,0,0,0.45), inset -1px -1px 4px rgba(255,255,255,0.02);
        }
        .sc-music-track-name {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase; color: var(--accent);
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
        }
        .sc-music-eq { display: flex; align-items: flex-end; gap: 2px; height: 10px; flex-shrink: 0; }
        .sc-music-eq-bar {
          width: 3px; background: var(--accent); border-radius: 1px;
          animation: sc-eq var(--dur) ease-in-out infinite alternate;
        }
        @keyframes sc-eq { from { height: 2px; } to { height: 10px; } }
        .sc-music-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .sc-music-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px; color: #3a3a36; min-width: 28px; flex-shrink: 0;
        }
        .sc-music-seek {
          flex: 1; height: 4px; -webkit-appearance: none; appearance: none;
          background: #0e0e0c;
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.6);
          border-radius: 2px; cursor: pointer; outline: none;
        }
        .sc-music-seek::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px;
          border-radius: 50%; background: var(--accent); cursor: pointer;
          box-shadow: 0 0 8px rgba(var(--accent-rgb),0.5);
        }
        .sc-music-controls { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 14px; }
        .sc-music-btn {
          background: transparent; border: none;
          color: #5a5a56; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color .2s; padding: 0;
        }
        .sc-music-btn:hover { color: var(--accent); }
        .sc-music-play {
          width: 42px; height: 42px; border-radius: 50%;
          background: #1a1a17;
          border: 1px solid rgba(var(--accent-rgb),0.3);
          box-shadow: 3px 3px 8px rgba(0,0,0,0.5), -1px -1px 5px rgba(255,255,255,0.03), 0 0 12px rgba(var(--accent-rgb),0.1);
          color: var(--accent);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .2s;
        }
        .sc-music-play:hover {
          box-shadow: 4px 4px 10px rgba(0,0,0,0.55), 0 0 20px rgba(var(--accent-rgb),0.2);
          border-color: rgba(var(--accent-rgb),0.55);
        }
        .sc-music-volume { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .sc-music-vol-icon { color: #3a3a36; flex-shrink: 0; }
        .sc-music-vol-slider {
          flex: 1; height: 4px; -webkit-appearance: none; appearance: none;
          background: #0e0e0c;
          box-shadow: inset 1px 1px 3px rgba(0,0,0,0.6);
          border-radius: 2px; cursor: pointer; outline: none;
        }
        .sc-music-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px;
          border-radius: 50%; background: var(--accent); cursor: pointer;
          box-shadow: 0 0 8px rgba(var(--accent-rgb),0.4);
        }
        .sc-music-tracklist {
          display: flex; flex-direction: column; gap: 3px;
          border-top: 1px solid rgba(255,255,255,0.04); padding-top: 10px;
        }
        .sc-music-track-btn {
          padding: 9px 12px; border: 1px solid transparent;
          border-radius: 7px; background: transparent;
          color: #4a4a44;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: .08em; text-transform: uppercase;
          cursor: pointer; text-align: left;
          transition: all .2s;
          display: flex; align-items: center; gap: 8px;
        }
        .sc-music-track-btn:hover {
          color: #8a8a80; background: rgba(255,255,255,0.02);
          border-color: rgba(255,255,255,0.06);
        }
        .sc-music-track-btn.active {
          border-color: rgba(var(--accent-rgb),0.25);
          color: var(--accent);
          background: rgba(var(--accent-rgb),0.05);
          box-shadow: inset 1px 1px 4px rgba(0,0,0,0.3);
        }
        .sc-music-track-num { font-size: 8px; color: #2a2a28; min-width: 16px; }
        .sc-music-track-btn.active .sc-music-track-num { color: var(--accent); opacity: 0.5; }

        /* ── Reset ── */
        .sc-reset {
          width: 100%; padding: 14px 18px;
          border-radius: 12px;
          background: #151513;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 3px 3px 8px rgba(0,0,0,0.45), -1px -1px 5px rgba(255,255,255,0.02);
          color: #3a3a36;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9.5px; letter-spacing: .12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .25s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .sc-reset:hover {
          border-color: rgba(var(--accent-rgb),0.25); color: var(--accent);
          box-shadow: 4px 4px 10px rgba(0,0,0,0.5), 0 0 14px rgba(var(--accent-rgb),0.08);
        }
      `}</style>

      <audio ref={audioRef} loop />

      {open && (
        <div ref={backdropRef} className="sc-backdrop" onClick={() => setOpen(false)} />
      )}

      <button
        ref={gearRef}
        className="sc-gear-btn"
        onClick={() => setOpen((o) => !o)}
        title="Customize site [G]"
      >
        <svg className="gear-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <div className="sc-panel" ref={panelRef}>
        <div className="sc-accent-stripe" />
        <div className="sc-drag-handle"><div className="sc-drag-handle-bar" /></div>

        {/* Sticky header */}
        <div className="sc-header">
          <div className="sc-header-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </div>
          <div className="sc-header-text">
            <span className="sc-header-title">Site Customizer</span>
            <span className="sc-header-sub">Personalize your experience</span>
          </div>
          <span className="sc-header-hint">G</span>
          <button className="sc-close-btn" onClick={() => setOpen(false)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="sc-panel-body-scroll" ref={bodyRef}>
          <div className="sc-body">

            {/* 01 Accent */}
            <div>
              <div className="sc-section-label">
                <span className="sc-section-num">01</span>Accent Color
              </div>
              <div className="sc-colors">
                {ACCENTS.map((a) => (
                  <div key={a.color} className="sc-swatch-wrap">
                    <button
                      className={`sc-swatch${settings.accent === a.color ? " active" : ""}`}
                      style={{ background: a.color }}
                      title={a.name}
                      onClick={() => update({ accent: a.color })}
                    />
                    <span className="sc-swatch-name">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 02 Background */}
            <div>
              <div className="sc-section-label">
                <span className="sc-section-num">02</span>Background
              </div>
              <div className="sc-opt-grid">
                {BG_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    className={`sc-opt-btn${settings.bg === b.id ? " active" : ""}`}
                    onClick={() => update({ bg: b.id })}
                  >
                    <em className="sc-opt-icon">{b.icon}</em>
                    <span className="sc-opt-label">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 03 Cursor */}
            <div className="sc-cursor-section">
              <div className="sc-section-label">
                <span className="sc-section-num">03</span>Cursor
              </div>
              <div className="sc-opt-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {CURSOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    className={`sc-opt-btn${settings.cursor === c.id ? " active" : ""}`}
                    onClick={() => update({ cursor: c.id })}
                  >
                    <em className="sc-opt-icon">{c.icon}</em>
                    <span className="sc-opt-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 04 Sound */}
            <div>
              <div className="sc-section-label">
                <span className="sc-section-num">04</span>Sound
              </div>
              <div className="sc-toggle-row">
                <div className="sc-toggle-info">
                  <span className="sc-toggle-label">UI Sounds</span>
                  <span className="sc-toggle-desc">{settings.sound ? "Enabled" : "Disabled"}</span>
                </div>
                <button
                  className={`sc-toggle${settings.sound ? " on" : ""}`}
                  onClick={() => update({ sound: !settings.sound })}
                />
              </div>
              {settings.sound && (
                <>
                  <div className="sc-sub-label">Click Sound</div>
                  <div className="sc-sound-grid" style={{ marginBottom: "14px" }}>
                    {CLICK_SOUND_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        className={`sc-sound-btn${settings.clickSound === s.id ? " active" : ""}`}
                        onClick={() => { update({ clickSound: s.id }); soundManager.playClick(); }}
                        onMouseEnter={() => soundManager.playClick()}
                      >
                        <span className="sc-sound-dot" />{s.label}
                      </button>
                    ))}
                  </div>
                  <div className="sc-sub-label">Hover Sound</div>
                  <div className="sc-sound-grid">
                    {HOVER_SOUND_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        className={`sc-sound-btn${settings.hoverSound === s.id ? " active" : ""}`}
                        onClick={() => { update({ hoverSound: s.id }); soundManager.playHover(); }}
                        onMouseEnter={() => soundManager.playHover()}
                      >
                        <span className="sc-sound-dot" />{s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 05 Music */}
            <div>
              <div className="sc-section-label">
                <span className="sc-section-num">05</span>Music
              </div>
              <div className="sc-music-wrap">
                <div className="sc-music-track-name">
                  <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {TRACKS[currentTrack].label}
                  </span>
                  {musicPlaying && (
                    <div className="sc-music-eq">
                      {[0.4, 0.7, 0.5, 0.9, 0.6].map((dur, i) => (
                        <div key={i} className="sc-music-eq-bar" style={{ "--dur": `${dur}s` } as React.CSSProperties} />
                      ))}
                    </div>
                  )}
                </div>
                <div className="sc-music-progress">
                  <span className="sc-music-time">{fmtTime(progress)}</span>
                  <input type="range" className="sc-music-seek" min={0} max={duration || 100} step={0.1} value={progress} onChange={seek} />
                  <span className="sc-music-time" style={{ textAlign: "right" }}>{fmtTime(duration)}</span>
                </div>
                <div className="sc-music-controls">
                  <button className="sc-music-btn" onClick={prevTrack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" />
                    </svg>
                  </button>
                  <button className="sc-music-play" onClick={toggleMusic}>
                    {musicPlaying ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                  <button className="sc-music-btn" onClick={nextTrack}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
                    </svg>
                  </button>
                </div>
                <div className="sc-music-volume">
                  <svg className="sc-music-vol-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <input type="range" className="sc-music-vol-slider" min={0} max={1} step={0.01} value={musicVolume} onChange={(e) => setMusicVolume(Number(e.target.value))} />
                </div>
                <div className="sc-music-tracklist">
                  {TRACKS.map((t, i) => (
                    <button key={t.id} className={`sc-music-track-btn${currentTrack === i ? " active" : ""}`} onClick={() => selectTrack(i)}>
                      <span className="sc-music-track-num">0{t.id}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset */}
            <button className="sc-reset" onClick={() => { setSettings(DEFAULTS); applySettings(DEFAULTS); }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Reset to defaults
            </button>

          </div>
        </div>
      </div>
    </>
  );
}