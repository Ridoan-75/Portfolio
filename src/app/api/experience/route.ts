import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

    const items = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error("GET /api/experience:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role, company, period, type, color, description, highlights } = await req.json();

    const item = await prisma.experience.create({
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
    console.error("POST /api/experience:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
