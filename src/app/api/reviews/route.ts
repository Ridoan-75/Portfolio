import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - public
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { reply: true },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST - public (anyone can review)
export async function POST(req: NextRequest) {
  try {
    const { name, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: { name, message },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}