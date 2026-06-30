import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

function auth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  return token ? verifyToken(token) : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const { title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image, category } = await req.json();
    const cert = await prisma.certificate.update({
      where: { id },
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
    console.error("PUT /api/certificates:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/certificates:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
