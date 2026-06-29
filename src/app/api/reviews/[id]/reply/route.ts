import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { message } = await req.json();

    const reply = await prisma.reviewReply.create({
      data: { message, reviewId: id, adminId: payload.userId },
    });
    return NextResponse.json(reply);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
