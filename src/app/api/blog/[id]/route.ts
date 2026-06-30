import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("admin_token")?.value;
    const isAdmin = token ? !!verifyToken(token) : false;

    if (isAdmin) {
      const blog = await prisma.blog.findUnique({ where: { id } });
      if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(blog);
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json(blog);
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    if (code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, content, thumbnail, images, tags, category, published } = await req.json();
    const blog = await prisma.blog.update({
      where: { id },
      data: { title, content, thumbnail: thumbnail || null, images: images || [], tags, category: category || null, published },
    });
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token || !verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
