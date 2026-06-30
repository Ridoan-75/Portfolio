"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type ToolbarBtnProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
};

function ToolbarBtn({ onClick, active, title, children, danger }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: "28px", height: "28px",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "5px", border: "none", cursor: "pointer", fontSize: "13px",
        background: active
          ? "rgba(99,102,241,0.3)"
          : danger
          ? "rgba(239,68,68,0.1)"
          : "transparent",
        color: active
          ? "#a5b4fc"
          : danger
          ? "#f87171"
          : "rgba(255,255,255,0.6)",
        transition: "background 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = danger ? "rgba(239,68,68,0.1)" : "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.08)", margin: "0 2px", flexShrink: 0 }} />;
}

export default function RichTextEditor({ value, onChange, placeholder = "Write your blog content here..." }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
        spellcheck: "true",
      },
    },
    immediatelyRender: false,
  });

  // Sync external value (e.g. when editing a saved post)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const h = (level: 1 | 2 | 3) => editor.isActive("heading", { level });

  return (
    <>
      <style>{`
        .rte-wrap { border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; background: rgba(255,255,255,0.03); transition: border-color 0.2s; }
        .rte-wrap:focus-within { border-color: rgba(99,102,241,0.55); }
        .rte-toolbar { display: flex; align-items: center; gap: 2px; padding: 6px 10px; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
        .rte-content { min-height: 320px; padding: 16px 18px; outline: none; font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.82); font-family: inherit; }
        .rte-content p { margin: 0 0 1em; }
        .rte-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: rgba(255,255,255,0.2); pointer-events: none; float: left; height: 0; }
        .rte-content h1 { font-size: 1.7em; font-weight: 700; color: #f0ece4; margin: 1.4em 0 0.5em; line-height: 1.2; }
        .rte-content h2 { font-size: 1.35em; font-weight: 700; color: #f0ece4; margin: 1.3em 0 0.45em; border-bottom: 1px solid rgba(255,255,255,0.07); padding-bottom: 0.35em; }
        .rte-content h3 { font-size: 1.1em; font-weight: 700; color: #e8e4dc; margin: 1.2em 0 0.4em; }
        .rte-content strong { color: #e0dcd4; }
        .rte-content em { color: #ccc8c0; }
        .rte-content u { text-decoration: underline; }
        .rte-content a { color: #818cf8; text-decoration: underline; }
        .rte-content ul, .rte-content ol { padding-left: 1.5em; margin: 0.6em 0 1em; }
        .rte-content li { margin-bottom: 0.3em; }
        .rte-content blockquote { border-left: 3px solid rgba(99,102,241,0.5); padding: 10px 16px; margin: 1.4em 0; background: rgba(99,102,241,0.05); border-radius: 0 6px 6px 0; color: #9a9890; }
        .rte-content blockquote p { margin: 0; }
        .rte-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.84em; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.18); border-radius: 4px; padding: 2px 6px; color: #a5b4fc; }
        .rte-content pre { background: #0a0a08; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 16px 20px; overflow-x: auto; margin: 1.4em 0; }
        .rte-content pre code { background: none; border: none; padding: 0; color: #c8c4bc; font-size: 0.88em; }
        .rte-content img { max-width: 100%; border-radius: 6px; margin: 1em 0; border: 1px solid rgba(255,255,255,0.08); display: block; }
        .rte-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2em 0; }
        .rte-content [data-text-align="center"] { text-align: center; }
        .rte-content [data-text-align="right"] { text-align: right; }
        .rte-content .is-editor-empty:first-child::before { content: attr(data-placeholder); color: rgba(255,255,255,0.2); pointer-events: none; float: left; height: 0; }
        .rte-wordcount { padding: 5px 14px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: rgba(255,255,255,0.22); text-align: right; }
      `}</style>

      <div className="rte-wrap">
        {/* Toolbar */}
        <div className="rte-toolbar">
          {/* History */}
          <ToolbarBtn title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↩</ToolbarBtn>
          <ToolbarBtn title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↪</ToolbarBtn>
          <Divider />

          {/* Headings */}
          <ToolbarBtn title="Heading 1" active={h(1)} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <b style={{ fontSize: "12px" }}>H1</b>
          </ToolbarBtn>
          <ToolbarBtn title="Heading 2" active={h(2)} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <b style={{ fontSize: "12px" }}>H2</b>
          </ToolbarBtn>
          <ToolbarBtn title="Heading 3" active={h(3)} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <b style={{ fontSize: "12px" }}>H3</b>
          </ToolbarBtn>
          <Divider />

          {/* Inline marks */}
          <ToolbarBtn title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <b>B</b>
          </ToolbarBtn>
          <ToolbarBtn title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <i>I</i>
          </ToolbarBtn>
          <ToolbarBtn title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <u style={{ textDecorationLine: "underline" }}>U</u>
          </ToolbarBtn>
          <ToolbarBtn title="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <s>S</s>
          </ToolbarBtn>
          <ToolbarBtn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            {"</>"}
          </ToolbarBtn>
          <Divider />

          {/* Lists */}
          <ToolbarBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>≡</ToolbarBtn>
          <ToolbarBtn title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <span style={{ fontSize: "11px" }}>1.</span>
          </ToolbarBtn>
          <Divider />

          {/* Blocks */}
          <ToolbarBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolbarBtn>
          <ToolbarBtn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <span style={{ fontSize: "10px", fontFamily: "monospace" }}>{ "{ }" }</span>
          </ToolbarBtn>
          <ToolbarBtn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolbarBtn>
          <Divider />

          {/* Align */}
          <ToolbarBtn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⬅</ToolbarBtn>
          <ToolbarBtn title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>⬛</ToolbarBtn>
          <ToolbarBtn title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>➡</ToolbarBtn>
          <Divider />

          {/* Link & Image */}
          <ToolbarBtn title="Link" active={editor.isActive("link")} onClick={setLink}>🔗</ToolbarBtn>
          <ToolbarBtn title="Image" onClick={addImage}>🖼</ToolbarBtn>
          <Divider />

          {/* Clear */}
          <ToolbarBtn title="Clear formatting" danger onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>✕</ToolbarBtn>
        </div>

        {/* Editor body */}
        <EditorContent editor={editor} />

        {/* Word count */}
        <div className="rte-wordcount">
          {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </div>
      </div>
    </>
  );
}
