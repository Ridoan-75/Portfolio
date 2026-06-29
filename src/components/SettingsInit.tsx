"use client";

import { useEffect } from "react";
import { soundManager } from "@/lib/SoundManager";

function hexToRgbStr(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function SettingsInit() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("site-settings");
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.accent) {
        document.documentElement.style.setProperty("--accent", s.accent);
        document.documentElement.style.setProperty("--accent-rgb", hexToRgbStr(s.accent));
        document.documentElement.style.setProperty("--accent-glow", s.accent + "40");
      }
      if (typeof s.sound === "boolean") soundManager.setEnabled(s.sound);
      if (s.clickSound) soundManager.setClickSound(s.clickSound);
      if (s.hoverSound) soundManager.setHoverSound(s.hoverSound);
      window.dispatchEvent(new CustomEvent("site-settings-change", { detail: s }));
    } catch {}
  }, []);
  return null;
}
