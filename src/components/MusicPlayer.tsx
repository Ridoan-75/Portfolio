"use client";

import { useEffect, useRef, useState } from "react";

const TRACKS = [
  { id: 1, label: "Track 1", src: "/music/Track-1.mp3" },
  { id: 2, label: "Track 2", src: "/music/Track-2.mp3" },
  { id: 3, label: "Track 3", src: "/music/Track-3.mp3" },
  { id: 4, label: "Track 4", src: "/music/Track-4.mp3" },
  { id: 5, label: "Track 5", src: "/music/Track-5.mp3" },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = TRACKS[currentTrack].src;
    audio.load();
    if (playing) audio.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const selectTrack = (i: number) => {
    setCurrentTrack(i);
    setPlaying(true);
  };

  const prevTrack = () => selectTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
  const nextTrack = () => selectTrack((currentTrack + 1) % TRACKS.length);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <style>{`
        .mp-wrap {
          position: fixed;
          bottom: 32px; left: 32px;
          z-index: 9999;
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 6px;
        }
        @media (max-width: 768px) { .mp-wrap { bottom: 24px; left: 24px; } }
        @media (max-width: 599px) { .mp-wrap { bottom: 20px; left: 20px; } }

        .mp-panel {
          background: #0e0e0c;
          border: 1px solid #1a1a18;
          border-radius: 8px;
          padding: 14px;
          width: 240px;
          display: flex; flex-direction: column; gap: 12px;
        }

        .mp-track-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--accent);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .mp-controls {
          display: flex; align-items: center; justify-content: center; gap: 14px;
        }
        .mp-btn {
          background: transparent; border: none;
          color: #5a5a56; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color .2s;
          padding: 0;
        }
        .mp-btn:hover { color: var(--accent); }
        .mp-play-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(var(--accent-rgb),0.1);
          border: 1px solid rgba(var(--accent-rgb),0.3) !important;
          color: var(--accent) !important;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s, border-color .2s;
        }
        .mp-play-btn:hover {
          background: rgba(var(--accent-rgb),0.2) !important;
          border-color: rgba(var(--accent-rgb),0.6) !important;
        }

        .mp-progress {
          display: flex; align-items: center; gap: 6px;
        }
        .mp-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; color: #3a3a36; min-width: 28px;
        }
        .mp-seek {
          flex: 1; height: 3px;
          -webkit-appearance: none; appearance: none;
          background: #1a1a18; border-radius: 2px; cursor: pointer;
          outline: none;
        }
        .mp-seek::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--accent); cursor: pointer;
        }

        .mp-volume {
          display: flex; align-items: center; gap: 8px;
        }
        .mp-vol-icon { color: #3a3a36; flex-shrink: 0; }
        .mp-vol-slider {
          flex: 1; height: 3px;
          -webkit-appearance: none; appearance: none;
          background: #1a1a18; border-radius: 2px; cursor: pointer;
          outline: none;
        }
        .mp-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--accent); cursor: pointer;
        }

        .mp-tracklist {
          display: flex; flex-direction: column; gap: 4px;
          border-top: 1px solid #1a1a18; padding-top: 10px;
        }
        .mp-track-btn {
          padding: 7px 10px; border: 1px solid transparent;
          border-radius: 3px; background: transparent;
          color: #4a4a44;
          font-family: 'JetBrains Mono', monospace; font-size: 9px;
          letter-spacing: .08em; text-transform: uppercase;
          cursor: pointer; text-align: left;
          transition: border-color .2s, color .2s, background .2s;
          display: flex; align-items: center; gap: 8px;
        }
        .mp-track-btn:hover { color: #8a8a80; border-color: #1a1a18; }
        .mp-track-btn.active {
          border-color: rgba(var(--accent-rgb),0.3);
          color: var(--accent);
          background: rgba(var(--accent-rgb),0.05);
        }
        .mp-track-num {
          font-size: 8px; color: #2a2a28; min-width: 14px;
        }
        .mp-track-btn.active .mp-track-num { color: var(--accent); opacity: 0.6; }

        .mp-equalizer {
          display: flex; align-items: flex-end; gap: 2px; height: 12px;
        }
        .mp-bar {
          width: 3px; background: var(--accent); border-radius: 1px;
          animation: eq-bounce var(--dur) ease-in-out infinite alternate;
        }
        @keyframes eq-bounce {
          from { height: 3px; }
          to   { height: 12px; }
        }

        .mp-toggle-btn {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(var(--accent-rgb),0.1);
          border: 1px solid rgba(var(--accent-rgb),0.3);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--accent);
          transition: background .2s, border-color .2s;
        }
        .mp-toggle-btn:hover {
          background: rgba(var(--accent-rgb),0.18);
          border-color: rgba(var(--accent-rgb),0.5);
        }
      `}</style>

      <audio ref={audioRef} loop />

      <div className="mp-wrap">
        {expanded && (
          <div className="mp-panel">
            {/* Track name + equalizer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="mp-track-label">{TRACKS[currentTrack].label}</div>
              {playing && (
                <div className="mp-equalizer">
                  {[0.4, 0.7, 0.5, 0.9, 0.6].map((dur, i) => (
                    <div
                      key={i}
                      className="mp-bar"
                      style={{ "--dur": `${dur}s` } as React.CSSProperties}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="mp-progress">
              <span className="mp-time">{fmt(progress)}</span>
              <input
                type="range"
                className="mp-seek"
                min={0}
                max={duration || 100}
                step={0.1}
                value={progress}
                onChange={seek}
              />
              <span className="mp-time" style={{ textAlign: "right" }}>{fmt(duration)}</span>
            </div>

            {/* Controls */}
            <div className="mp-controls">
              <button className="mp-btn" onClick={prevTrack} title="Previous">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <line x1="5" y1="19" x2="5" y2="5" />
                </svg>
              </button>
              <button className="mp-play-btn" onClick={togglePlay}>
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>
              <button className="mp-btn" onClick={nextTrack} title="Next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>
            </div>

            {/* Volume */}
            <div className="mp-volume">
              <svg className="mp-vol-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input
                type="range"
                className="mp-vol-slider"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>

            {/* Tracklist */}
            <div className="mp-tracklist">
              {TRACKS.map((t, i) => (
                <button
                  key={t.id}
                  className={`mp-track-btn${currentTrack === i ? " active" : ""}`}
                  onClick={() => selectTrack(i)}
                >
                  <span className="mp-track-num">0{t.id}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          className="mp-toggle-btn"
          onClick={() => setExpanded((v) => !v)}
          title="Music Player"
        >
          {expanded ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}