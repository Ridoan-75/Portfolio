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
    const { role, company, period, type, color, description, highlights } = await req.json();
    const item = await prisma.experience.update({
      where: { id },
      data: {
        role,
        company,
        period,
        type,
        color: color || "#6366f1",
        description,
        highlights: Array.isArray(highlights) ? highlights : [],
      },
    });
    return NextResponse.json(item);
  } catch (e) {
    console.error("PUT /api/experience:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/experience:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
