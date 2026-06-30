import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET - public (published only) | admin (all)
export async function GET(req: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

    const token = req.cookies.get("admin_token")?.value;
    const isAdmin = token ? !!verifyToken(token) : false;

    const blogs = await prisma.blog.findMany({
      where: isAdmin ? {} : { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
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

    const { title, content, thumbnail, images, tags, category, published } = await req.json();

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        thumbnail: thumbnail || null,
        images: images || [],
        tags: tags || [],
        category: category || null,
        published: published || false,
        authorId: payload.userId,
      },
    });

    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}