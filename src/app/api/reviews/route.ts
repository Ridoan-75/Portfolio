import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

// GET - public
export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

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
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

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