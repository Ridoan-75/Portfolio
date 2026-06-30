import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.education.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/education:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { degree, institution, period, badge, color, description, subjects } = await req.json();

    const item = await prisma.education.create({
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
    console.error("POST /api/education:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
