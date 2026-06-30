"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false, loading: () => (
  <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", minHeight: "320px", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
    Loading editor...
  </div>
) });

type Blog = { id: string; title: string; published: boolean; createdAt: string; category?: string | null; thumbnail?: string | null; images?: string[]; tags?: string[]; content?: string };
type Skill = { id: string; name: string; icon: string | null; category: string | null };
type Project = { id: string; title: string; description: string; thumbnail: string | null; tags: string[]; category: string | null; liveUrl: string | null; githubUrl: string | null; featured: boolean; createdAt: string };
type Certificate = { id: string; title: string; issuer: string; issueDate: string; expiryDate?: string | null; credentialId?: string | null; credentialUrl?: string | null; image?: string | null; category?: string | null };
type Experience = { id: string; role: string; company: string; period: string; type: string; color: string; description: string; highlights: string[]; order: number };
type Education = { id: string; degree: string; institution: string; period: string; badge: string; color: string; description: string; subjects: string[]; order: number };
type Tab = "blogs" | "skills" | "projects" | "certificates" | "experience" | "education";

const TAB_META: Record<Tab, { icon: string; label: string }> = {
  blogs:        { icon: "✍️", label: "Blogs" },
  skills:       { icon: "⚡", label: "Skills" },
  projects:     { icon: "🚀", label: "Projects" },
  certificates: { icon: "🎓", label: "Certs" },
  experience:   { icon: "💼", label: "Exp" },
  education:    { icon: "📚", label: "Edu" },
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
  const [blogs, setBlogs]               = useState<Blog[]>([]);
  const [skills, setSkills]             = useState<Skill[]>([]);
  const [projects, setProjects]         = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [experiences, setExperiences]   = useState<Experience[]>([]);
  const [educations, setEducations]     = useState<Education[]>([]);

  // Experience form state
  const [expRole, setExpRole]           = useState("");
  const [expCompany, setExpCompany]     = useState("");
  const [expPeriod, setExpPeriod]       = useState("");
  const [expType, setExpType]           = useState("");
  const [expColor, setExpColor]         = useState("#6366f1");
  const [expDesc, setExpDesc]           = useState("");
  const [expHighlights, setExpHighlights] = useState("");
  const [editingExp, setEditingExp]     = useState<string | null>(null);

  // Education form state
  const [eduDegree, setEduDegree]       = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduPeriod, setEduPeriod]       = useState("");
  const [eduBadge, setEduBadge]         = useState("");
  const [eduColor, setEduColor]         = useState("#6366f1");
  const [eduDesc, setEduDesc]           = useState("");
  const [eduSubjects, setEduSubjects]   = useState("");
  const [editingEdu, setEditingEdu]     = useState<string | null>(null);

  const [certTitle, setCertTitle]             = useState("");
  const [certIssuer, setCertIssuer]           = useState("");
  const [certIssueDate, setCertIssueDate]     = useState("");
  const [certExpiryDate, setCertExpiryDate]   = useState("");
  const [certCredId, setCertCredId]           = useState("");
  const [certCredUrl, setCertCredUrl]         = useState("");
  const [certImage, setCertImage]             = useState("");
  const [certCategory, setCertCategory]       = useState("");
  const [editingCert, setEditingCert]         = useState<string | null>(null);

  const [blogTitle, setBlogTitle]         = useState("");
  const [blogContent, setBlogContent]     = useState("");
  const [blogThumbnail, setBlogThumbnail] = useState("");
  const [blogImage2, setBlogImage2]       = useState("");
  const [blogImage3, setBlogImage3]       = useState("");
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
  const [projectCategory, setProjectCategory]     = useState("");
  const [projectLiveUrl, setProjectLiveUrl]       = useState("");
  const [projectGithubUrl, setProjectGithubUrl]   = useState("");
  const [projectFeatured, setProjectFeatured]     = useState(false);
  const [editingProject, setEditingProject]       = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const [b, s, p, c, ex, ed] = await Promise.all([
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/project").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/education").then((r) => r.json()),
    ]);
    setBlogs(Array.isArray(b) ? b : []);
    setSkills(Array.isArray(s) ? s : []);
    setProjects(Array.isArray(p) ? p : []);
    setCertificates(Array.isArray(c) ? c : []);
    setExperiences(Array.isArray(ex) ? ex : []);
    setEducations(Array.isArray(ed) ? ed : []);
  }

  function resetExp() { setExpRole(""); setExpCompany(""); setExpPeriod(""); setExpType(""); setExpColor("#6366f1"); setExpDesc(""); setExpHighlights(""); setEditingExp(null); }
  async function saveExp() {
    const body = { role: expRole, company: expCompany, period: expPeriod, type: expType, color: expColor, description: expDesc, highlights: expHighlights.split("\n").map(h => h.trim()).filter(Boolean) };
    const url = editingExp ? `/api/experience/${editingExp}` : "/api/experience";
    const method = editingExp ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.error || "Failed to save experience"); return; }
    resetExp(); fetchAll();
  }
  async function deleteExp(id: string) {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Failed to delete"); return; }
    fetchAll();
  }
  function editExp(e: Experience) { setEditingExp(e.id); setExpRole(e.role); setExpCompany(e.company); setExpPeriod(e.period); setExpType(e.type); setExpColor(e.color); setExpDesc(e.description); setExpHighlights(e.highlights.join("\n")); setActiveTab("experience"); }

  function resetEdu() { setEduDegree(""); setEduInstitution(""); setEduPeriod(""); setEduBadge(""); setEduColor("#6366f1"); setEduDesc(""); setEduSubjects(""); setEditingEdu(null); }
  async function saveEdu() {
    const body = { degree: eduDegree, institution: eduInstitution, period: eduPeriod, badge: eduBadge, color: eduColor, description: eduDesc, subjects: eduSubjects.split(",").map(s => s.trim()).filter(Boolean) };
    const url = editingEdu ? `/api/education/${editingEdu}` : "/api/education";
    const method = editingEdu ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.error || "Failed to save education"); return; }
    resetEdu(); fetchAll();
  }
  async function deleteEdu(id: string) {
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Failed to delete"); return; }
    fetchAll();
  }
  function editEdu(e: Education) { setEditingEdu(e.id); setEduDegree(e.degree); setEduInstitution(e.institution); setEduPeriod(e.period); setEduBadge(e.badge); setEduColor(e.color); setEduDesc(e.description); setEduSubjects(e.subjects.join(", ")); setActiveTab("education"); }

  function resetCert() {
    setCertTitle(""); setCertIssuer(""); setCertIssueDate(""); setCertExpiryDate("");
    setCertCredId(""); setCertCredUrl(""); setCertImage(""); setCertCategory(""); setEditingCert(null);
  }

  async function saveCert() {
    const body = { title: certTitle, issuer: certIssuer, issueDate: certIssueDate, expiryDate: certExpiryDate || null, credentialId: certCredId || null, credentialUrl: certCredUrl || null, image: certImage || null, category: certCategory || null };
    const url = editingCert ? `/api/certificates/${editingCert}` : "/api/certificates";
    const method = editingCert ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(d.error || "Failed to save certificate"); return; }
    resetCert(); fetchAll();
  }

  async function deleteCert(id: string) {
    const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Failed to delete"); return; }
    fetchAll();
  }

  function editCert(c: Certificate) {
    setEditingCert(c.id); setCertTitle(c.title); setCertIssuer(c.issuer);
    setCertIssueDate(c.issueDate); setCertExpiryDate(c.expiryDate || "");
    setCertCredId(c.credentialId || ""); setCertCredUrl(c.credentialUrl || "");
    setCertImage(c.image || ""); setCertCategory(c.category || "");
    setActiveTab("certificates");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function saveBlog() {
    const images = [blogImage2.trim(), blogImage3.trim()].filter(Boolean);
    const body = { title: blogTitle, content: blogContent, thumbnail: blogThumbnail || null, images, tags: blogTags.split(",").map((t) => t.trim()).filter(Boolean), category: blogCategory.trim() || null, published: blogPublished };
    if (editingBlog) {
      await fetch(`/api/blog/${editingBlog}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setBlogTitle(""); setBlogContent(""); setBlogThumbnail(""); setBlogImage2(""); setBlogImage3(""); setBlogTags(""); setBlogCategory(""); setBlogPublished(false); setEditingBlog(null);
    fetchAll();
  }

  async function deleteBlog(id: string) { await fetch(`/api/blog/${id}`, { method: "DELETE" }); fetchAll(); }
  function editBlog(blog: Blog) {
    setEditingBlog(blog.id);
    setBlogTitle(blog.title);
    setBlogContent(blog.content || "");
    setBlogThumbnail(blog.thumbnail || "");
    setBlogImage2((blog.images || [])[0] || "");
    setBlogImage3((blog.images || [])[1] || "");
    setBlogTags((blog.tags || []).join(", "));
    setBlogCategory(blog.category || "");
    setBlogPublished(blog.published);
    setActiveTab("blogs");
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
    const body = { title: projectTitle, description: projectDesc, thumbnail: projectThumbnail, tags: projectTags.split(",").map((t) => t.trim()).filter(Boolean), category: projectCategory.trim() || null, liveUrl: projectLiveUrl, githubUrl: projectGithubUrl, featured: projectFeatured };
    if (editingProject) {
      await fetch(`/api/project/${editingProject}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/project", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setProjectTitle(""); setProjectDesc(""); setProjectThumbnail(""); setProjectTags(""); setProjectCategory(""); setProjectLiveUrl(""); setProjectGithubUrl(""); setProjectFeatured(false); setEditingProject(null);
    fetchAll();
  }

  async function deleteProject(id: string) { await fetch(`/api/project/${id}`, { method: "DELETE" }); fetchAll(); }

  const counts: Record<Tab, number> = { blogs: blogs.length, skills: skills.length, projects: projects.length, certificates: certificates.length, experience: experiences.length, education: educations.length };

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "12px" }}>
          <StatCard label="Blogs"    count={blogs.length}        icon="✍️" color="rgba(99,102,241,0.2)"  />
          <StatCard label="Skills"   count={skills.length}       icon="⚡" color="rgba(234,179,8,0.15)"  />
          <StatCard label="Projects" count={projects.length}     icon="🚀" color="rgba(139,92,246,0.2)"  />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "28px" }}>
          <StatCard label="Certs"      count={certificates.length} icon="🎓" color="rgba(59,130,246,0.2)"  />
          <StatCard label="Experience" count={experiences.length}  icon="💼" color="rgba(16,185,129,0.2)"  />
          <StatCard label="Education"  count={educations.length}   icon="📚" color="rgba(245,158,11,0.2)"  />
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
                  <RichTextEditor value={blogContent} onChange={setBlogContent} placeholder="Write your blog content here..." />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Category">
                    <FocusInput value={blogCategory} onChange={(e) => setBlogCategory(e.target.value)} placeholder="e.g. HTML, CSS, React" />
                  </Field>
                  <Field label="Tags">
                    <FocusInput value={blogTags} onChange={(e) => setBlogTags(e.target.value)} placeholder="tailwind, hooks, tips" />
                  </Field>
                </div>
                <Field label="Image 1 — Thumbnail (main card image)">
                  <ImageUpload value={blogThumbnail} onChange={setBlogThumbnail} placeholder="https://..." />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Image 2 (optional)">
                    <ImageUpload value={blogImage2} onChange={setBlogImage2} placeholder="https://..." />
                  </Field>
                  <Field label="Image 3 (optional)">
                    <ImageUpload value={blogImage3} onChange={setBlogImage3} placeholder="https://..." />
                  </Field>
                </div>
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

        {/* EXPERIENCE */}
        {activeTab === "experience" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingExp ? "✏️ Edit Experience" : "💼 Add Experience"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Role / Title">
                    <FocusInput value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="e.g. Full Stack Developer" />
                  </Field>
                  <Field label="Company">
                    <FocusInput value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="e.g. Freelance" />
                  </Field>
                  <Field label="Period">
                    <FocusInput value={expPeriod} onChange={e => setExpPeriod(e.target.value)} placeholder="e.g. 2023 – Present" />
                  </Field>
                  <Field label="Type / Badge">
                    <FocusInput value={expType} onChange={e => setExpType(e.target.value)} placeholder="e.g. Freelance, Full-time" />
                  </Field>
                  <Field label="Accent Color">
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <FocusInput value={expColor} onChange={e => setExpColor(e.target.value)} placeholder="#6366f1" />
                      <input type="color" value={expColor} onChange={e => setExpColor(e.target.value)}
                        style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, background: "none", cursor: "pointer", padding: 2 }} />
                    </div>
                  </Field>
                </div>
                <Field label="Description">
                  <FocusTextarea value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Describe this experience..." rows={3} />
                </Field>
                <Field label="Highlights (one per line)">
                  <FocusTextarea value={expHighlights} onChange={e => setExpHighlights(e.target.value)} placeholder={"Delivered 5+ client projects\nFull stack Next.js apps"} rows={3} />
                </Field>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <PrimaryBtn onClick={saveExp}>{editingExp ? "Update" : "Add Experience"}</PrimaryBtn>
                {editingExp && <SecondaryBtn onClick={resetExp}>Cancel</SecondaryBtn>}
              </div>
            </Card>
            {experiences.length > 0 && (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                  All Experiences ({experiences.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {experiences.map(exp => (
                    <div key={exp.id} style={{ background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 4, height: 36, borderRadius: 2, background: exp.color, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "14px" }}>{exp.role}</p>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Badge color="violet">{exp.company}</Badge>
                            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{exp.period}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <EditBtn onClick={() => editExp(exp)}>Edit</EditBtn>
                        <DangerBtn onClick={() => deleteExp(exp.id)}>Delete</DangerBtn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {experiences.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No experience yet.</div>}
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === "education" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingEdu ? "✏️ Edit Education" : "📚 Add Education"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Field label="Degree / Program">
                  <FocusInput value={eduDegree} onChange={e => setEduDegree(e.target.value)} placeholder="e.g. Diploma in Computer Science" />
                </Field>
                <Field label="Institution">
                  <FocusInput value={eduInstitution} onChange={e => setEduInstitution(e.target.value)} placeholder="e.g. Chattogram Polytechnic · Bangladesh" />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Period">
                    <FocusInput value={eduPeriod} onChange={e => setEduPeriod(e.target.value)} placeholder="e.g. 2021 – 2025" />
                  </Field>
                  <Field label="Badge / Status">
                    <FocusInput value={eduBadge} onChange={e => setEduBadge(e.target.value)} placeholder="e.g. Ongoing, Completed" />
                  </Field>
                  <Field label="Accent Color">
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <FocusInput value={eduColor} onChange={e => setEduColor(e.target.value)} placeholder="#6366f1" />
                      <input type="color" value={eduColor} onChange={e => setEduColor(e.target.value)}
                        style={{ width: 36, height: 36, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, background: "none", cursor: "pointer", padding: 2 }} />
                    </div>
                  </Field>
                </div>
                <Field label="Description">
                  <FocusTextarea value={eduDesc} onChange={e => setEduDesc(e.target.value)} placeholder="Describe this education..." rows={3} />
                </Field>
                <Field label="Subjects (comma separated)">
                  <FocusInput value={eduSubjects} onChange={e => setEduSubjects(e.target.value)} placeholder="e.g. Algorithms, OS, Web Dev" />
                </Field>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <PrimaryBtn onClick={saveEdu}>{editingEdu ? "Update" : "Add Education"}</PrimaryBtn>
                {editingEdu && <SecondaryBtn onClick={resetEdu}>Cancel</SecondaryBtn>}
              </div>
            </Card>
            {educations.length > 0 && (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                  All Education ({educations.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {educations.map(edu => (
                    <div key={edu.id} style={{ background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 4, height: 36, borderRadius: 2, background: edu.color, flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: "14px" }}>{edu.degree}</p>
                          <div style={{ display: "flex", gap: 8 }}>
                            <Badge color="yellow">{edu.badge}</Badge>
                            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{edu.period}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <EditBtn onClick={() => editEdu(edu)}>Edit</EditBtn>
                        <DangerBtn onClick={() => deleteEdu(edu.id)}>Delete</DangerBtn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {educations.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>No education yet.</div>}
          </div>
        )}

        {/* CERTIFICATES */}
        {activeTab === "certificates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card>
              <h2 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
                {editingCert ? "✏️ Edit Certificate" : "🎓 Add Certificate"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="Title">
                    <FocusInput value={certTitle} onChange={(e) => setCertTitle(e.target.value)} placeholder="e.g. AWS Certified Developer" />
                  </Field>
                  <Field label="Issuer">
                    <FocusInput value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} placeholder="e.g. Amazon Web Services" />
                  </Field>
                  <Field label="Issue Date">
                    <FocusInput value={certIssueDate} onChange={(e) => setCertIssueDate(e.target.value)} placeholder="e.g. Jan 2024" />
                  </Field>
                  <Field label="Expiry Date (optional)">
                    <FocusInput value={certExpiryDate} onChange={(e) => setCertExpiryDate(e.target.value)} placeholder="e.g. Jan 2027" />
                  </Field>
                  <Field label="Category (optional)">
                    <FocusInput value={certCategory} onChange={(e) => setCertCategory(e.target.value)} placeholder="e.g. Cloud, Web Dev" />
                  </Field>
                  <Field label="Credential ID (optional)">
                    <FocusInput value={certCredId} onChange={(e) => setCertCredId(e.target.value)} placeholder="ABC123XYZ" />
                  </Field>
                </div>
                <Field label="Verify URL (optional)">
                  <FocusInput value={certCredUrl} onChange={(e) => setCertCredUrl(e.target.value)} placeholder="https://verify.example.com/..." />
                </Field>
                <Field label="Certificate Image (optional)">
                  <ImageUpload value={certImage} onChange={setCertImage} placeholder="https://..." />
                </Field>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <PrimaryBtn onClick={saveCert}>{editingCert ? "Update" : "Add Certificate"}</PrimaryBtn>
                {editingCert && <SecondaryBtn onClick={resetCert}>Cancel</SecondaryBtn>}
              </div>
            </Card>

            {certificates.length > 0 && (
              <>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", margin: 0 }}>
                  All Certificates ({certificates.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {certificates.map((cert) => (
                    <div key={cert.id} style={{
                      background: "rgba(13,13,20,0.8)", border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "12px", padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        {cert.image && (
                          <img src={cert.image} alt={cert.title} style={{ width: "44px", height: "32px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <p style={{ margin: "0 0 4px", fontWeight: 500, fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cert.title}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <Badge color="violet">{cert.issuer}</Badge>
                            {cert.category && <Badge color="zinc">{cert.category}</Badge>}
                            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>{cert.issueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <EditBtn onClick={() => editCert(cert)}>Edit</EditBtn>
                        <DangerBtn onClick={() => deleteCert(cert.id)}>Delete</DangerBtn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {certificates.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.2)", fontSize: "14px" }}>
                No certificates yet. Add your first one above.
              </div>
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
                  <Field label="Category">
                    <FocusInput value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)} placeholder="Full Stack, Frontend..." />
                  </Field>
                  <Field label="Tags">
                    <FocusInput value={projectTags} onChange={(e) => setProjectTags(e.target.value)} placeholder="react, nodejs, tailwind" />
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
                        <EditBtn onClick={() => { setEditingProject(project.id); setProjectTitle(project.title); setProjectDesc(project.description); setProjectThumbnail(project.thumbnail || ""); setProjectTags(project.tags.join(", ")); setProjectCategory(project.category || ""); setProjectLiveUrl(project.liveUrl || ""); setProjectGithubUrl(project.githubUrl || ""); setProjectFeatured(project.featured); setActiveTab("projects"); }}>
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
