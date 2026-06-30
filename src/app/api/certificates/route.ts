import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json([], { status: 200 });
    }

    const certs = await prisma.certificate.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(certs);
  } catch (e) {
    console.error("GET /api/certificates:", e);
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

    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image, category } = await req.json();

    const cert = await prisma.certificate.create({
      data: {
        title,
        issuer,
        issueDate,
        expiryDate: expiryDate || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        image: image || null,
        category: category || null,
      },
    });
    return NextResponse.json(cert);
  } catch (e) {
    console.error("POST /api/certificates:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
