import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - public
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST - admin only
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, thumbnail, tags, category, liveUrl, githubUrl, featured } = await req.json();

    const project = await prisma.project.create({
      data: {
        title,
        description,
        thumbnail,
        tags: tags || [],
        category: category || null,
        liveUrl,
        githubUrl,
        featured: featured || false,
      },
    });

    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}