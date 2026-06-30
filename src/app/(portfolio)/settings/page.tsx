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

type BgType = "particles"|"aurora"|"grid"|"starfield"|"fireflies"|"warp"|"static"|"none";
type CursorType = "default"|"crosshair"|"tracer"|"radar"|"ghost"|"portal"|"snake"|"glitch"|"eye";
type ClickSoundType = "glitch"|"pop"|"faah"|"tap"|"crystal"|"yemete";
type HoverSoundType = "tick"|"whoosh"|"blip"|"flicker"|"swoosh";

interface Settings {
  accent: string; bg: BgType; cursor: CursorType;
  sound: boolean; clickSound: ClickSoundType; hoverSound: HoverSoundType;
}
const DEFAULTS: Settings = { accent:"#3b82f6", bg:"particles", cursor:"crosshair", sound:true, clickSound:"glitch", hoverSound:"tick" };

const ACCENTS = [
  { color:"#c8f060", name:"Lime"    }, { color:"#a3e635", name:"Green"   },
  { color:"#34d399", name:"Emerald" }, { color:"#2dd4bf", name:"Teal"    },
  { color:"#22d3ee", name:"Cyan"    }, { color:"#60a5fa", name:"Blue"    },
  { color:"#818cf8", name:"Indigo"  }, { color:"#a78bfa", name:"Purple"  },
  { color:"#e879f9", name:"Fuchsia" }, { color:"#f472b6", name:"Pink"    },
  { color:"#fb7185", name:"Rose"    }, { color:"#f87171", name:"Red"     },
  { color:"#fb923c", name:"Orange"  }, { color:"#facc15", name:"Yellow"  },
  { color:"#fde68a", name:"Amber"   }, { color:"#d946ef", name:"Magenta" },
  { color:"#38bdf8", name:"Sky"     }, { color:"#4ade80", name:"Mint"    },
  { color:"#f8fafc", name:"White"   }, { color:"#94a3b8", name:"Slate"   },
  { color:"#c084fc", name:"Violet"  },
];

const BG_OPTIONS: {id:BgType;label:string;icon:string}[] = [
  {id:"particles",label:"Particles",icon:"✦"},{id:"aurora",label:"Aurora",icon:"◈"},
  {id:"grid",label:"Grid",icon:"⊞"},{id:"starfield",label:"Stars",icon:"★"},
  {id:"fireflies",label:"Fireflies",icon:"✺"},{id:"warp",label:"Warp",icon:"≋"},
  {id:"static",label:"Static",icon:"▒"},{id:"none",label:"None",icon:"○"},
];

const CURSOR_OPTIONS: {id:CursorType;label:string;icon:string}[] = [
  {id:"default",label:"Default",icon:"↖"},{id:"crosshair",label:"Cross",icon:"✛"},
  {id:"tracer",label:"Tracer",icon:"≫"},{id:"radar",label:"Radar",icon:"◎"},
  {id:"ghost",label:"Ghost",icon:"◌"},{id:"portal",label:"Portal",icon:"⊙"},
  {id:"snake",label:"Snake",icon:"⌇"},{id:"glitch",label:"Glitch",icon:"⁒"},
  {id:"eye",label:"Eye",icon:"◉"},
];

const CLICK_SOUNDS: {id:ClickSoundType;label:string}[] = [
  {id:"glitch",label:"Glitch"},{id:"pop",label:"Pop"},{id:"faah",label:"Faah"},
  {id:"tap",label:"Tap"},{id:"crystal",label:"Crystal"},{id:"yemete",label:"Yemete"},
];
const HOVER_SOUNDS: {id:HoverSoundType;label:string}[] = [
  {id:"tick",label:"Tick"},{id:"whoosh",label:"Whoosh"},{id:"blip",label:"Blip"},
  {id:"flicker",label:"Flicker"},{id:"swoosh",label:"Swoosh"},
];

function hexToRgbStr(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}
function applySettings(s: Settings) {
  const r = document.documentElement;
  r.style.setProperty("--accent", s.accent);
  r.style.setProperty("--accent-rgb", hexToRgbStr(s.accent));
  r.style.setProperty("--accent-glow", s.accent + "40");
  soundManager.setEnabled(s.sound);
  soundManager.setClickSound(s.clickSound);
  soundManager.setHoverSound(s.hoverSound);
  localStorage.setItem("site-settings", JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("site-settings-change", { detail: s }));
}

export default function SettingsPage() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [musicVolume, setMusicVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("site-settings");
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".st-tag",    {y:30,opacity:0,scale:0.9}, {y:0,opacity:1,scale:1,duration:0.7,ease:"back.out(1.7)",delay:0.1});
      gsap.fromTo(".st-h1",    {y:60,opacity:0,skewY:3},   {y:0,opacity:1,skewY:0,duration:1,ease:"power4.out",delay:0.25});
      gsap.fromTo(".st-sub",   {y:20,opacity:0},            {y:0,opacity:1,duration:0.6,ease:"power3.out",delay:0.45});
      gsap.fromTo(".st-block", {y:40,opacity:0},            {y:0,opacity:1,duration:0.55,stagger:0.1,ease:"power3.out",delay:0.5});
    }, headingRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = musicVolume;
    const t = () => setProgress(a.currentTime);
    const l = () => setDuration(a.duration);
    a.addEventListener("timeupdate", t); a.addEventListener("loadedmetadata", l);
    return () => { a.removeEventListener("timeupdate", t); a.removeEventListener("loadedmetadata", l); };
  }, [musicVolume]);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.src = TRACKS[currentTrack].src; a.load();
    if (musicPlaying) a.play().catch(()=>{});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = musicVolume; }, [musicVolume]);

  const toggleMusic = () => {
    const a = audioRef.current; if (!a) return;
    if (musicPlaying) { a.pause(); setMusicPlaying(false); }
    else { if (!a.src) { a.src = TRACKS[currentTrack].src; a.load(); } a.play().catch(()=>{}); setMusicPlaying(true); }
  };
  const selectTrack = (i: number) => { setCurrentTrack(i); setMusicPlaying(true); };
  const fmtTime = (s: number) => (!s||isNaN(s)) ? "0:00" : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,"0")}`;
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current; if (!a) return;
    a.currentTime = Number(e.target.value); setProgress(Number(e.target.value));
  };

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings(p => { const n = {...p,...patch}; applySettings(n); return n; });
  }, []);

  return (
    <>
      <style>{`
        #settings-page {
          padding: 80px 60px 100px;
          min-height: 100vh;
          color: #e8e4dc;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }
        .st-inner { max-width: 900px; margin: 0 auto; }

        .st-tag {
          display:inline-flex; align-items:center; gap:8px;
          background:rgba(var(--accent-rgb),.06); border:1px solid rgba(var(--accent-rgb),.2);
          border-radius:3px; padding:7px 14px; margin-bottom:24px; opacity:0;
        }
        .st-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); animation:stBlink 2s ease infinite; }
        @keyframes stBlink{0%,100%{opacity:1}50%{opacity:.3}}
        .st-tag-text { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); }
        .st-h1 {
          font-family:'Bebas Neue',sans-serif; font-size:clamp(56px,10vw,110px);
          line-height:.92; letter-spacing:.02em; color:#f0ece4; margin-bottom:18px; opacity:0;
        }
        .st-h1 .ha { color:var(--accent); }
        .st-sub {
          font-family:'JetBrains Mono',monospace; font-size:14px; letter-spacing:.08em;
          text-transform:uppercase; color:#6a6a60; margin-bottom:52px;
          display:flex; align-items:center; gap:12px; opacity:0;
        }
        .st-sub::before { content:''; width:28px; height:1px; background:var(--accent); }

        .st-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        .st-block {
          background:linear-gradient(145deg,rgba(255,255,255,.055) 0%,rgba(255,255,255,.016) 100%);
          border:1px solid rgba(255,255,255,.09);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 3px 16px rgba(0,0,0,.28);
          border-radius:14px; padding:24px; opacity:0;
          transition:border-color .25s;
        }
        .st-block:hover { border-color:rgba(var(--accent-rgb),.15); }
        @media(min-width:1024px){ .st-block-full { grid-column:1/-1; } }

        /* ── Section label ── */
        .sc-section-label {
          font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.18em;
          text-transform:uppercase; color:#7a7a70; margin-bottom:18px;
          display:flex; align-items:center; gap:8px;
        }
        .sc-section-num { color:var(--accent); font-size:8px; opacity:.7; }
        .sc-section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(255,255,255,.07),transparent); }

        /* ── Accent swatches ── */
        .sc-colors {
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:10px; row-gap:16px;
        }
        .sc-swatch-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; }
        .sc-swatch {
          width:100%; aspect-ratio:1; border-radius:50%; cursor:pointer;
          border:2px solid transparent;
          transition:transform .2s,border-color .2s,box-shadow .2s; position:relative;
          box-shadow:3px 3px 8px rgba(0,0,0,.5),-1px -1px 4px rgba(255,255,255,.05);
        }
        .sc-swatch:hover { transform:scale(1.1); }
        .sc-swatch.active {
          border-color:rgba(255,255,255,.85); transform:scale(1.18);
          box-shadow:3px 3px 10px rgba(0,0,0,.6),0 0 16px currentColor;
        }
        .sc-swatch.active::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:11px; color:#080808; font-weight:800; }
        /* ★ FIXED: readable swatch names */
        .sc-swatch-name {
          font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:.04em;
          color:#9a9a8e; text-align:center; white-space:nowrap;
        }
        .sc-swatch-wrap:has(.sc-swatch.active) .sc-swatch-name { color:#e8e4dc; }

        /* ── Option grid (BG & Cursor) ── */
        .sc-opt-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .sc-opt-btn {
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:6px; padding:14px 4px 13px; border-radius:12px;
          background:#151513; border:1px solid rgba(255,255,255,.05);
          box-shadow:4px 4px 10px rgba(0,0,0,.5),-2px -2px 6px rgba(255,255,255,.03);
          color:#7a7a70; cursor:pointer; transition:all .2s; min-height:64px;
        }
        .sc-opt-btn:hover { color:#b0b0a8; border-color:rgba(255,255,255,.09); transform:translateY(-1px); }
        .sc-opt-btn.active {
          background:#131311; border-color:rgba(var(--accent-rgb),.4); color:var(--accent);
          box-shadow:inset 3px 3px 8px rgba(0,0,0,.5),0 0 16px rgba(var(--accent-rgb),.12);
        }
        .sc-opt-icon { font-size:16px; line-height:1; font-style:normal; }
        .sc-opt-label {
          font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.06em;
          text-transform:uppercase; line-height:1;
          /* ★ FIXED: readable option labels */
          color:inherit;
        }

        @media(hover:none) and (pointer:coarse){ .sc-cursor-section { display:none; } }

        /* ── Sound toggle ── */
        .sc-toggle-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 18px; background:#151513;
          border:1px solid rgba(255,255,255,.05); border-radius:12px;
          box-shadow:inset 2px 2px 6px rgba(0,0,0,.4),inset -1px -1px 3px rgba(255,255,255,.02);
          margin-bottom:14px;
        }
        .sc-toggle-info { display:flex; flex-direction:column; gap:3px; }
        .sc-toggle-label {
          font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em;
          text-transform:uppercase;
          /* ★ FIXED: readable toggle label */
          color:#a0a098;
        }
        .sc-toggle-desc { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:.06em; color:#6a6a60; }
        .sc-toggle {
          width:44px; height:24px; border-radius:12px; background:#0e0e0c;
          box-shadow:inset 2px 2px 5px rgba(0,0,0,.6),inset -1px -1px 3px rgba(255,255,255,.02);
          cursor:pointer; position:relative; transition:background .25s,box-shadow .25s;
          flex-shrink:0; border:none;
        }
        .sc-toggle.on { background:var(--accent); box-shadow:inset 2px 2px 5px rgba(0,0,0,.3),0 0 14px rgba(var(--accent-rgb),.4); }
        .sc-toggle::after {
          content:''; position:absolute; top:4px; left:4px;
          width:16px; height:16px; border-radius:50%; background:#2a2a28;
          box-shadow:2px 2px 5px rgba(0,0,0,.5);
          transition:transform .25s cubic-bezier(.34,1.56,.64,1),background .25s;
        }
        .sc-toggle.on::after { transform:translateX(20px); background:#080808; }

        .sc-sub-label {
          font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:.12em;
          text-transform:uppercase; color:#6a6a60; margin-bottom:8px;
          display:flex; align-items:center; gap:6px;
        }
        .sc-sub-label::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.03); }

        /* ── Sound buttons ── */
        .sc-sound-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
        .sc-sound-btn {
          padding:10px 6px; border-radius:8px; background:#151513;
          border:1px solid rgba(255,255,255,.05);
          box-shadow:3px 3px 7px rgba(0,0,0,.45),-1px -1px 4px rgba(255,255,255,.02);
          color:#8a8a80;
          font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.06em;
          text-transform:uppercase; cursor:pointer; text-align:center; transition:all .2s;
          display:flex; align-items:center; justify-content:center; gap:5px;
        }
        .sc-sound-btn:hover { color:#a0a098; border-color:rgba(255,255,255,.09); }
        .sc-sound-btn.active {
          background:#131311; border-color:rgba(var(--accent-rgb),.35); color:var(--accent);
          box-shadow:inset 2px 2px 6px rgba(0,0,0,.45),0 0 10px rgba(var(--accent-rgb),.1);
        }
        .sc-sound-dot { width:4px; height:4px; border-radius:50%; background:currentColor; flex-shrink:0; }

        /* ── Music ── */
        .sc-music-wrap {
          background:#151513; border:1px solid rgba(255,255,255,.05); border-radius:14px;
          padding:18px; box-shadow:inset 2px 2px 8px rgba(0,0,0,.45),inset -1px -1px 4px rgba(255,255,255,.02);
        }
        .sc-music-track-name {
          font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em;
          text-transform:uppercase; color:var(--accent); margin-bottom:12px;
          display:flex; align-items:center; gap:8px;
        }
        .sc-music-eq { display:flex; align-items:flex-end; gap:2px; height:10px; flex-shrink:0; }
        .sc-music-eq-bar { width:3px; background:var(--accent); border-radius:1px; animation:sc-eq var(--dur) ease-in-out infinite alternate; }
        @keyframes sc-eq{from{height:2px}to{height:10px}}
        .sc-music-progress { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .sc-music-time { font-family:'JetBrains Mono',monospace; font-size:8px; color:#7a7a70; min-width:28px; flex-shrink:0; }
        .sc-music-seek {
          flex:1; height:4px; -webkit-appearance:none; appearance:none;
          background:#0e0e0c; box-shadow:inset 1px 1px 3px rgba(0,0,0,.6);
          border-radius:2px; cursor:pointer; outline:none;
        }
        .sc-music-seek::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; border-radius:50%; background:var(--accent); cursor:pointer; box-shadow:0 0 8px rgba(var(--accent-rgb),.5); }
        .sc-music-controls { display:flex; align-items:center; justify-content:center; gap:16px; margin-bottom:14px; }
        .sc-music-btn { background:transparent; border:none; color:#8a8a80; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:color .2s; padding:0; }
        .sc-music-btn:hover { color:var(--accent); }
        .sc-music-play {
          width:42px; height:42px; border-radius:50%; background:#1a1a17;
          border:1px solid rgba(var(--accent-rgb),.3);
          box-shadow:3px 3px 8px rgba(0,0,0,.5),-1px -1px 5px rgba(255,255,255,.03),0 0 12px rgba(var(--accent-rgb),.1);
          color:var(--accent); display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s;
        }
        .sc-music-play:hover { box-shadow:4px 4px 10px rgba(0,0,0,.55),0 0 20px rgba(var(--accent-rgb),.2); border-color:rgba(var(--accent-rgb),.55); }
        .sc-music-volume { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
        .sc-music-vol-icon { color:#7a7a70; flex-shrink:0; }
        .sc-music-vol-slider {
          flex:1; height:4px; -webkit-appearance:none; appearance:none;
          background:#0e0e0c; box-shadow:inset 1px 1px 3px rgba(0,0,0,.6);
          border-radius:2px; cursor:pointer; outline:none;
        }
        .sc-music-vol-slider::-webkit-slider-thumb { -webkit-appearance:none; width:12px; height:12px; border-radius:50%; background:var(--accent); cursor:pointer; box-shadow:0 0 8px rgba(var(--accent-rgb),.4); }
        .sc-music-tracklist { display:flex; flex-direction:column; gap:3px; border-top:1px solid rgba(255,255,255,.04); padding-top:10px; }
        .sc-music-track-btn {
          padding:9px 12px; border:1px solid transparent; border-radius:7px;
          background:transparent; color:#8a8a7a;
          font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em;
          text-transform:uppercase; cursor:pointer; text-align:left;
          transition:all .2s; display:flex; align-items:center; gap:8px;
        }
        .sc-music-track-btn:hover { color:#8a8a80; background:rgba(255,255,255,.02); border-color:rgba(255,255,255,.06); }
        .sc-music-track-btn.active { border-color:rgba(var(--accent-rgb),.25); color:var(--accent); background:rgba(var(--accent-rgb),.05); }
        .sc-music-track-num { font-size:8px; color:#6a6a60; min-width:16px; }
        .sc-music-track-btn.active .sc-music-track-num { color:rgba(var(--accent-rgb),.5); }

        /* ── Reset ── */
        .sc-reset {
          width:100%; padding:14px 18px; border-radius:12px; background:#151513;
          border:1px solid rgba(255,255,255,.05);
          box-shadow:3px 3px 8px rgba(0,0,0,.45),-1px -1px 5px rgba(255,255,255,.02);
          color:#7a7a70; font-family:'JetBrains Mono',monospace; font-size:9.5px;
          letter-spacing:.12em; text-transform:uppercase; cursor:pointer;
          transition:all .25s; display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .sc-reset:hover { border-color:rgba(var(--accent-rgb),.25); color:var(--accent); box-shadow:4px 4px 10px rgba(0,0,0,.5),0 0 14px rgba(var(--accent-rgb),.08); }

        /* ── Responsive ── */
        @media(max-width:1023px){ .st-grid { grid-template-columns:1fr; } }
        @media(max-width:767px){
          #settings-page { padding:100px 20px 80px; }
          .sc-colors { grid-template-columns:repeat(5,1fr); gap:8px; row-gap:14px; }
          .sc-opt-grid { grid-template-columns:repeat(3,1fr); gap:6px; }
          .sc-opt-btn { min-height:56px; padding:10px 4px; border-radius:10px; }
          .st-block { padding:18px 16px; }
        }
        @media(max-width:479px){
          #settings-page { padding:90px 14px 70px; }
          .sc-colors { grid-template-columns:repeat(4,1fr); gap:6px; row-gap:12px; }
          .sc-opt-grid { grid-template-columns:repeat(2,1fr); gap:6px; }
          .sc-sound-grid { grid-template-columns:repeat(2,1fr); }
          .sc-toggle-row { padding:12px 14px; }
        }
      `}</style>

      <audio ref={audioRef} loop />

      <section id="settings-page">
        <div className="st-inner" ref={headingRef}>

          <div className="st-tag"><span className="st-dot" /><span className="st-tag-text">Personalization</span></div>
          <h1 className="st-h1"><span className="ha">S</span>ettings</h1>
          <div className="st-sub">Customize your experience</div>

          <div className="st-grid">

            {/* 01 Accent */}
            <div className="st-block">
              <div className="sc-section-label"><span className="sc-section-num">01</span>Accent Colour</div>
              <div className="sc-colors">
                {ACCENTS.map(a => (
                  <div key={a.color} className="sc-swatch-wrap">
                    <button className={`sc-swatch${settings.accent===a.color?" active":""}`} style={{background:a.color}} title={a.name} onClick={() => update({accent:a.color})} />
                    <span className="sc-swatch-name">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 03 Cursor */}
            <div className="st-block sc-cursor-section">
              <div className="sc-section-label"><span className="sc-section-num">03</span>Cursor</div>
              <div className="sc-opt-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                {CURSOR_OPTIONS.map(c => (
                  <button key={c.id} className={`sc-opt-btn${settings.cursor===c.id?" active":""}`} onClick={() => update({cursor:c.id})}>
                    <em className="sc-opt-icon">{c.icon}</em>
                    <span className="sc-opt-label">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 02 Background */}
            <div className="st-block st-block-full">
              <div className="sc-section-label"><span className="sc-section-num">02</span>Background</div>
              <div className="sc-opt-grid">
                {BG_OPTIONS.map(b => (
                  <button key={b.id} className={`sc-opt-btn${settings.bg===b.id?" active":""}`} onClick={() => update({bg:b.id})}>
                    <em className="sc-opt-icon">{b.icon}</em>
                    <span className="sc-opt-label">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 04 Sound */}
            <div className="st-block">
              <div className="sc-section-label"><span className="sc-section-num">04</span>Sound Effects</div>
              <div className="sc-toggle-row">
                <div className="sc-toggle-info">
                  <span className="sc-toggle-label">UI Sounds</span>
                  <span className="sc-toggle-desc">{settings.sound?"Enabled":"Disabled"}</span>
                </div>
                <button className={`sc-toggle${settings.sound?" on":""}`} onClick={() => update({sound:!settings.sound})} />
              </div>
              {settings.sound && (<>
                <div className="sc-sub-label">Click Sound</div>
                <div className="sc-sound-grid" style={{marginBottom:"14px"}}>
                  {CLICK_SOUNDS.map(s => (
                    <button key={s.id} className={`sc-sound-btn${settings.clickSound===s.id?" active":""}`}
                      onClick={() => { update({clickSound:s.id}); soundManager.playClick(); }}
                      onMouseEnter={() => soundManager.playClick()}>
                      <span className="sc-sound-dot" />{s.label}
                    </button>
                  ))}
                </div>
                <div className="sc-sub-label">Hover Sound</div>
                <div className="sc-sound-grid">
                  {HOVER_SOUNDS.map(s => (
                    <button key={s.id} className={`sc-sound-btn${settings.hoverSound===s.id?" active":""}`}
                      onClick={() => { update({hoverSound:s.id}); soundManager.playHover(); }}
                      onMouseEnter={() => soundManager.playHover()}>
                      <span className="sc-sound-dot" />{s.label}
                    </button>
                  ))}
                </div>
              </>)}
            </div>

            {/* 05 Music */}
            <div className="st-block">
              <div className="sc-section-label"><span className="sc-section-num">05</span>Music Player</div>
              <div className="sc-music-wrap">
                <div className="sc-music-track-name">
                  <span style={{flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis"}}>{TRACKS[currentTrack].label}</span>
                  {musicPlaying && (
                    <div className="sc-music-eq">
                      {[.4,.7,.5,.9,.6].map((d,i) => <div key={i} className="sc-music-eq-bar" style={{"--dur":`${d}s`} as React.CSSProperties}/>)}
                    </div>
                  )}
                </div>
                <div className="sc-music-progress">
                  <span className="sc-music-time">{fmtTime(progress)}</span>
                  <input type="range" className="sc-music-seek" min={0} max={duration||100} step={0.1} value={progress} onChange={seek}/>
                  <span className="sc-music-time" style={{textAlign:"right"}}>{fmtTime(duration)}</span>
                </div>
                <div className="sc-music-controls">
                  <button className="sc-music-btn" onClick={() => selectTrack((currentTrack-1+TRACKS.length)%TRACKS.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                  </button>
                  <button className="sc-music-play" onClick={toggleMusic}>
                    {musicPlaying
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                  </button>
                  <button className="sc-music-btn" onClick={() => selectTrack((currentTrack+1)%TRACKS.length)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                  </button>
                </div>
                <div className="sc-music-volume">
                  <svg className="sc-music-vol-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <input type="range" className="sc-music-vol-slider" min={0} max={1} step={0.01} value={musicVolume} onChange={e=>setMusicVolume(Number(e.target.value))}/>
                </div>
                <div className="sc-music-tracklist">
                  {TRACKS.map((t,i) => (
                    <button key={t.id} className={`sc-music-track-btn${currentTrack===i?" active":""}`} onClick={() => selectTrack(i)}>
                      <span className="sc-music-track-num">0{t.id}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div style={{marginTop:"24px"}}>
            <button className="sc-reset" onClick={() => { setSettings(DEFAULTS); applySettings(DEFAULTS); }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset to defaults
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
