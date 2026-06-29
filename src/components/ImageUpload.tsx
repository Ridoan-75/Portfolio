"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, placeholder = "or paste image URL..." }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      onChange(data.url);
      setUrlInput("");
    } else {
      setError("Upload failed. Try again.");
    }
    setUploading(false);
    // reset file input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleUrlSet() {
    const url = urlInput.trim();
    if (!url) return;
    onChange(url);
    setShowUrl(false);
  }

  function handleClear() {
    onChange("");
    setUrlInput("");
    setShowUrl(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />

      {/* Main area */}
      {!value ? (
        <div style={{
          border: "1px dashed rgba(99,102,241,0.3)",
          borderRadius: "12px",
          padding: "20px 16px",
          background: "rgba(99,102,241,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          {/* Upload icon */}
          <div style={{
            width: "44px", height: "44px",
            background: "rgba(99,102,241,0.12)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>
            🖼️
          </div>

          {/* Select from PC button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
              background: uploading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              borderRadius: "9px",
              padding: "9px 22px",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              cursor: uploading ? "not-allowed" : "pointer",
              boxShadow: uploading ? "none" : "0 4px 14px rgba(99,102,241,0.28)",
              transition: "opacity 0.2s",
              display: "flex", alignItems: "center", gap: "7px",
            }}
            onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { if (!uploading) e.currentTarget.style.opacity = "1"; }}
          >
            {uploading ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Uploading...
              </>
            ) : (
              <>📁 Select from PC</>
            )}
          </button>

          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", margin: 0 }}>
            PNG, JPG, WEBP · Recommended: <span style={{ color: "rgba(99,102,241,0.7)" }}>1200×628px</span>
          </p>

          {/* URL toggle */}
          {!showUrl ? (
            <button
              type="button"
              onClick={() => setShowUrl(true)}
              style={{
                background: "none", border: "none",
                color: "rgba(99,102,241,0.7)", fontSize: "12px",
                cursor: "pointer", padding: 0, textDecoration: "underline",
                textDecorationStyle: "dotted",
              }}
            >
              or use image URL instead
            </button>
          ) : (
            <div style={{ display: "flex", gap: "6px", width: "100%" }}>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSet()}
                placeholder={placeholder}
                autoFocus
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.35)",
                  borderRadius: "9px",
                  padding: "8px 12px",
                  color: "white",
                  fontSize: "12px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={handleUrlSet}
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "none", borderRadius: "9px",
                  padding: "8px 14px", color: "white",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Set
              </button>
              <button
                type="button"
                onClick={() => setShowUrl(false)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "9px",
                  padding: "8px 10px", color: "rgba(255,255,255,0.4)",
                  fontSize: "12px", cursor: "pointer", flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Preview */
        <div style={{ position: "relative" }}>
          <img
            src={value}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: "150px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "block",
            }}
          />
          {/* Overlay actions */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px",
            opacity: 0,
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.55)";
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0)";
              e.currentTarget.style.opacity = "0";
            }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                border: "none", borderRadius: "8px",
                padding: "8px 14px", color: "white",
                fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}
            >
              📁 Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: "rgba(239,68,68,0.85)",
                border: "none", borderRadius: "8px",
                padding: "8px 14px", color: "white",
                fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ color: "#f87171", fontSize: "12px", margin: 0 }}>⚠ {error}</p>
      )}
    </div>
  );
}
