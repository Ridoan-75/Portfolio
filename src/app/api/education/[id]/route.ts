import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token ? verifyToken(token) : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { degree, institution, period, badge, color, description, subjects } = await req.json();
    const item = await prisma.education.update({
      where: { id },
      data: {
        degree,
        institution,
        period,
        badge,
        color: color || "#6366f1",
        description,
        subjects: Array.isArray(subjects) ? subjects : [],
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error("PUT /api/education:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.education.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/education:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
