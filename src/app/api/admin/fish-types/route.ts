import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all fish types
export async function GET() {
  const fishTypes = await prisma.fishType.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ success: true, fishTypes });
}

// CREATE fish type
export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.name?.trim()) {
    return NextResponse.json(
      { success: false, message: "Fish type name is required" },
      { status: 400 }
    );
  }

  const fishType = await prisma.fishType.create({
    data: {
      name: body.name.trim(),
      description: body.description || "",
      imageUrl: body.imageUrl || "",
      isActive: body.isActive ?? true,
    },
  });

  return NextResponse.json({ success: true, fishType });
}
