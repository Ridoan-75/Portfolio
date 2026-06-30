import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - public
export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

    const skills = await prisma.skill.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST - admin only
export async function POST(req: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, category } = await req.json();

    const skill = await prisma.skill.create({
      data: { name, icon, category },
    });

    return NextResponse.json(skill);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}