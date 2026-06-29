"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

type Blog = { id: string; title: string; published: boolean; createdAt: string; category?: string | null };
type Review = { id: string; name: string; message: string; createdAt: string; reply: { message: string } | null };
type Skill = { id: string; name: string; icon: string | null; category: string | null };
type Project = { id: string; title: string; featured: boolean; createdAt: string };
type Tab = "blogs" | "reviews" | "skills" | "projects";

const TAB_META: Record<Tab, { icon: string; label: string }> = {
  blogs:    { icon: "✍️", label: "Blogs" },
  reviews:  { icon: "💬", label: "Reviews" },
  skills:   { icon: "⚡", label: "Skills" },
  projects: { icon: "🚀", label: "Projects" },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "white",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", color: "rgba(255,255,255,0.38)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "6px" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function FocusInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.55)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; props.onBlur?.(e); }}
    />
  );
}

function FocusTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, resize: "none", ...props.style }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.55)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; props.onBlur?.(e); }}
    />
  );
}

function Badge({ children, color = "zinc" }: { children: React.ReactNode; color?: "green" | "yellow" | "violet" | "zinc" }) {
  const colors = {
    green:  { bg: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.3)",  text: "#4ade80" },
    yellow: { bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.3)",  text: "#facc15" },
    violet: { bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)", text: "#a78bfa" },
    zinc:   { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.5)" },
  };
  const c = colors[color];
  return (
    <span style={{
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
        border: "none", borderRadius: "9px", padding: "9px 20px",
        color: "white", fontSize: "13px", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 4px 14px rgba(99,102,241,0.25)",
        transition: "opacity 0.2s",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "9px", padding: "9px 20px", color: "rgba(255,255,255,0.7)",
        fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "background 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
    >
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: "8px", padding: "6px 12px", color: "#f87171",
        fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "background 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
    >
      {children}
    </button>
  );
}

function EditBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "8px", padding: "6px 12px", color: "#818cf8",
        fontSize: "12px", fontWeight: 500, cursor: "pointer", transition: "background 0.2s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(13,13,20,0.8)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      padding: "24px",
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, count, icon, color }: { label: string; count: number; icon: string; color: string }) {
  return (
    <div style={{
      background: "rgba(13,13,20,0.8)",
      border: `1px solid rgba(255,255,255,0.07)`,
      borderRadius: "14px",
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      <div style={{
        width: "40px", height: "40px",
        background: color,
        borderRadius: "11px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "18px", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 3px" }}>{label}</p>
        <p style={{ color: "white", fontSize: "22px", fontWeight: 700, margin: 0, lineHeight: 1 }}>{count}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("blogs");
  const [blogs, setBlogs]       = useState<Blog[]>([]);
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [skills, setSkills]     = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [blogTitle, setBlogTitle]         = useState("");
  const [blogContent, setBlogContent]     = useState("");
  const [blogThumbnail, setBlogThumbnail] = useState("");
  const [blogTags, setBlogTags]           = useState("");
  const [blogCategory, setBlogCategory]   = useState("");
  const [blogPublished, setBlogPublished] = useState(false);
  const [editingBlog, setEditingBlog]     = useState<string | null>(null);

  const [skillName, setSkillName]         = useState("");
  const [skillIcon, setSkillIcon]         = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [editingSkill, setEditingSkill]   = useState<string | null>(null);

  const [projectTitle, setProjectTitle]           = useState("");
  const [projectDesc, setProjectDesc]             = useState("");
  const [projectThumbnail, setProjectThumbnail]   = useState("");
  const [projectTags, setProjectTags]             = useState("");
  const [projectLiveUrl, setProjectLiveUrl]       = useState("");
  const [projectGithubUrl, setProjectGithubUrl]   = useState("");
  const [projectFeatured, setProjectFeatured]     = useState(false);
  const [editingProject, setEditingProject]       = useState<string | null>(null);

  const [replyMessage, setReplyMessage] = useState<{ [key: string]: string }>({});

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [b, r, s, p] = await Promise.all([
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/project").then((r) => r.json()),
    ]);
    setBlogs(Array.isArray(b) ? b : []);
    setReviews(Array.isArray(r) ? r : []);
    setSkills(Array.isArray(s) ? s : []);
    setProjects(Array.isArray(p) ? p : []);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function saveBlog() {
    const body = { title: blogTitle, content: blogContent, thumbnail: blogThumbnail, tags: blogTags.split(",").map((t) => t.trim()).filter(Boolean), category: blogCategory.trim() || null, published: blogPublished };
    if (editingBlog) {
      await fetch(`/api/blog/${editingBlog}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setBlogTitle(""); setBlogContent(""); setBlogThumbnail(""); setBlogTags(""); setBlogCategory(""); setBlogPublished(false); setEditingBlog(null);
    fetchAll();
  }

  async function deleteBlog(id: string) { await fetch(`/api/blog/${id}`, { method: "DELETE" }); fetchAll(); }
  function editBlog(blog: Blog) { setEditingBlog(blog.id); setBlogTitle(blog.title); setBlogPublished(blog.published); setBlogCategory((blog as Blog & { category?: string }).category || ""); setActiveTab("blogs"); }

  async function deleteReview(id: string) { await fetch(`/api/reviews/${id}`, { method: "DELETE" }); fetchAll(); }
  async function replyReview(id: string) {
    await fetch(`/api/reviews/${id}/reply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: replyMessage[id] }) });
    setReplyMessage((prev) => ({ ...prev, [id]: "" }));
    fetchAll();
  }

  async function saveSkill() {
    const body = { name: skillName, icon: skillIcon, category: skillCategory };
    if (editingSkill) {
      await fetch(`/api/skills/${editingSkill}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setSkillName(""); setSkillIcon(""); setSkillCategory(""); setEditingSkill(null);
    fetchAll();
  }

  async function deleteSkill(id: string) { await fetch(`/api/skills/${id}`, { method: "DELETE" }); fetchAll(); }

  async function saveProject() {
    const body = { title: projectTitle, description: projectDesc, thumbnail: projectThumbnail, tags: projectTags.split(",").map((t) => t.trim()).filter(Boolean), liveUrl: projectLiveUrl, githubUrl: projectGithubUrl, featured: projectFeatured };
    if (editingProject) {
      await fetch(`/api/project/${editingProject}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/project", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setProjectTitle(""); setProjectDesc(""); setProjectThumbnail(""); setProjectTags(""); setProjectLiveUrl(""); setProjectGithubUrl(""); setProjectFeatured(false); setEditingProject(null);
    fetchAll();
  }

  async function deleteProject(id: string) { await fetch(`/api/project/${id}`, { method: "DELETE" }); fetchAll(); }

  const counts: Record<Tab, number> = { blogs: blogs.length, reviews: reviews.length, skills: skills.length, projects: projects.length };

  return (
    <div style={{ minHeight: "100vh", background: "#07070a", color: "white", fontFamily: "var(--font-space, sans-serif)" }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 32px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(13,13,20,0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px",
          }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.01em" }}>Dashboard</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", textTransform: "capitalize" }}>{activeTab}</span>
        </div>
        <button
          onClick={logout}
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.18)",
            borderRadius: "8px",
            padding: "6px 14px",
            color: "#f87171",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          Logout
        </button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
          <StatCard label="Blogs"    count={blogs.length}    icon="✍️" color="rgba(99,102,241,0.2)" />
          <StatCard label="Reviews"  count={reviews.length}  icon="💬" color="rgba(34,197,94,0.15)" />
          <StatCard label="Skills"   count={skills.length}   icon="⚡" color="rgba(234,179,8,0.15)"  />
          <StatCard label="Projects" count={projects.length} icon="🚀" color="rgba(139,92,246,0.2)"  />
        </div>

        {/* Tab Bar */}
        <div style={{
          display: "flex", gap: "6px", marginBottom: "24px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "5px",
        }}>
          {(Object.keys(TAB_META) as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                padding: "9px 12px",
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s",
                background: activeTab === tab ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                color: activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(99,102,241,0.25)" : "none",
              }}
            >
              <span style={{ fontSize: "14px" }}>{TAB_META[tab].icon}</span>
              {TAB_META[tab].label}
              {counts[tab] > 0 && (
                <span style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                  borderRadius: "5px", padding: "1px 6px", fontSize: "11px", fontWeight: 700,
                }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* BLOGS */}
        {activeTab === "blogs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingBlog ? "✏️ Edit Blog Post" : "✍️ New Blog Post"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Title">
                  <FocusInput value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="Post title" />
                </Field>
                <Field label="Content">
                  <FocusTextarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Write your content..." rows={5} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Category">
                    <FocusInput value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} placeholder="e.g. HTML, CSS, React" />
                  </Field>
                  <Field label="Tags">
                    <FocusInput value={blogTags} onChange={(e) => setBlogTags(e.target.value)} placeholder="tailwind, hooks, tips" />
                  </Field>
                </div>
                <Field label="Thumbnail">
                  <ImageUpload value={blogThumbnail} onChange={setBlogThumbnail} placeholder="https://..." />
                </Field>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <div style={{
                    width: "36px", height: "20px",
                    background: blogPublished ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.1)",
                    borderRadius: "10px", position: "relative", transition: "background 0.2s",
                    cursor: "pointer", flexShrink: 0,
                  }} onClick={() => setBlogPublished(!blogPublished)}>
                    <div style={{
                      position: "absolute", top: "2px",
                      left: blogPublished ? "18px" : "2px",
                      width: "16px", height: "16px",
                      background: "white", borderRadius: "50%",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Publish immediately</span>
                </label>
                <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
                  <PrimaryBtn onClick={saveBlog}>{editingBlog ? "Update Post" : "Publish Post"}</PrimaryBtn>
                  {editingBlog && (
                    <SecondaryBtn onClick={() => { setEditingBlog(null); setBlogTitle(""); setBlogContent(""); }}>Cancel</SecondaryBtn>
                  )}
                </div>
              </div>
            </Card>

            {blogs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 4px" }}>
                  All Posts ({blogs.length})
                </p>
                {blogs.map((blog) => (
                  <div key={blog.id} style={{
                    background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px", padding: "14px 18px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: blog.published ? "#4ade80" : "#facc15", flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: "0 0 3px", fontWeight: 500, fontSize: "14px" }}>{blog.title}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Badge color={blog.published ? "green" : "yellow"}>{blog.published ? "Published" : "Draft"}</Badge>
                          {blog.category && <Badge color="violet">{blog.category}</Badge>}
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <EditBtn onClick={() => editBlog(blog)}>Edit</EditBtn>
                      <DangerBtn onClick={() => deleteBlog(blog.id)}>Delete</DangerBtn>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {blogs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
                No blog posts yet. Create your first one above.
              </div>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reviews.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
                No reviews yet.
              </div>
            )}
            {reviews.map((review) => (
              <div key={review.id} style={{
                background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "18px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "15px", fontWeight: 700, flexShrink: 0,
                    }}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: "14px" }}>{review.name}</p>
                      <p style={{ margin: "0 0 4px", color: "rgba(255,255,255,0.6)", fontSize: "13px", lineHeight: 1.5 }}>{review.message}</p>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DangerBtn onClick={() => deleteReview(review.id)}>Delete</DangerBtn>
                </div>

                {review.reply ? (
                  <div style={{
                    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)",
                    borderRadius: "10px", padding: "12px 14px", marginLeft: "48px",
                  }}>
                    <p style={{ color: "#818cf8", fontSize: "11px", fontWeight: 600, margin: "0 0 4px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Your reply</p>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>{review.reply.message}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "8px", marginLeft: "48px" }}>
                    <FocusInput
                      value={replyMessage[review.id] || ""}
                      onChange={(e) => setReplyMessage((prev) => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder="Write a reply..."
                    />
                    <button
                      onClick={() => replyReview(review.id)}
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none",
                        borderRadius: "10px", padding: "10px 18px",
                        color: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                        whiteSpace: "nowrap", flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(99,102,241,0.2)",
                      }}
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SKILLS */}
        {activeTab === "skills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingSkill ? "✏️ Edit Skill" : "⚡ Add Skill"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Skill Name">
                    <FocusInput value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="e.g. React" />
                  </Field>
                  <Field label="Category">
                    <FocusInput value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} placeholder="e.g. Frontend" />
                  </Field>
                </div>
                <Field label="Icon">
                  <ImageUpload value={skillIcon} onChange={setSkillIcon} placeholder="https://icon.url/react.png" />
                </Field>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <PrimaryBtn onClick={saveSkill}>{editingSkill ? "Update" : "Add Skill"}</PrimaryBtn>
                {editingSkill && (
                  <SecondaryBtn onClick={() => { setEditingSkill(null); setSkillName(""); setSkillIcon(""); setSkillCategory(""); }}>Cancel</SecondaryBtn>
                )}
              </div>
            </Card>

            {skills.length > 0 && (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                  All Skills ({skills.length})
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                  {skills.map((skill) => (
                    <div key={skill.id} style={{
                      background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "12px", padding: "14px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {skill.icon && (
                          <img src={skill.icon} alt={skill.name} style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "6px", flexShrink: 0 }} />
                        )}
                        <div>
                          <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: "13px" }}>{skill.name}</p>
                          {skill.category && <Badge color="violet">{skill.category}</Badge>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <EditBtn onClick={() => { setEditingSkill(skill.id); setSkillName(skill.name); setSkillIcon(skill.icon || ""); setSkillCategory(skill.category || ""); }}>
                          Edit
                        </EditBtn>
                        <DangerBtn onClick={() => deleteSkill(skill.id)}>Del</DangerBtn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingProject ? "✏️ Edit Project" : "🚀 Add Project"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Title">
                  <FocusInput value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Project title" />
                </Field>
                <Field label="Description">
                  <FocusTextarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} placeholder="Describe your project..." rows={3} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Thumbnail">
                    <ImageUpload value={projectThumbnail} onChange={setProjectThumbnail} placeholder="https://..." />
                  </Field>
                  <Field label="Tags">
                    <FocusInput value={projectTags} onChange={(e) => setProjectTags(e.target.value)} placeholder="react, nodejs" />
                  </Field>
                  <Field label="Live URL">
                    <FocusInput value={projectLiveUrl} onChange={(e) => setProjectLiveUrl(e.target.value)} placeholder="https://..." />
                  </Field>
                  <Field label="GitHub URL">
                    <FocusInput value={projectGithubUrl} onChange={(e) => setProjectGithubUrl(e.target.value)} placeholder="https://github.com/..." />
                  </Field>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <div style={{
                    width: "36px", height: "20px",
                    background: projectFeatured ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.1)",
                    borderRadius: "10px", position: "relative", transition: "background 0.2s",
                    cursor: "pointer", flexShrink: 0,
                  }} onClick={() => setProjectFeatured(!projectFeatured)}>
                    <div style={{
                      position: "absolute", top: "2px",
                      left: projectFeatured ? "18px" : "2px",
                      width: "16px", height: "16px",
                      background: "white", borderRadius: "50%",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Featured project</span>
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <PrimaryBtn onClick={saveProject}>{editingProject ? "Update" : "Add Project"}</PrimaryBtn>
                  {editingProject && (
                    <SecondaryBtn onClick={() => { setEditingProject(null); setProjectTitle(""); setProjectDesc(""); }}>Cancel</SecondaryBtn>
                  )}
                </div>
              </div>
            </Card>

            {projects.length > 0 && (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                  All Projects ({projects.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {projects.map((project) => (
                    <div key={project.id} style={{
                      background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px", padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div>
                        <p style={{ margin: "0 0 5px", fontWeight: 500, fontSize: "14px" }}>{project.title}</p>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          {project.featured && <Badge color="violet">⭐ Featured</Badge>}
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <EditBtn onClick={() => { setEditingProject(project.id); setProjectTitle(project.title); setProjectFeatured(project.featured); }}>
                          Edit
                        </EditBtn>
                        <DangerBtn onClick={() => deleteProject(project.id)}>Delete</DangerBtn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
