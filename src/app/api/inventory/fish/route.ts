import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all fish items (optional filter by type)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // seed | bulk | fresh

  const items = await prisma.fishItem.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, items });
}

// CREATE fish item
export async function POST(req: Request) {
  const body = await req.json();

  const item = await prisma.fishItem.create({
    data: {
      type: body.type ?? "fresh",
      name: body.name,
      detail: body.detail,
      price: body.price,
      status: body.status || "Available",
    },
  });

  return NextResponse.json({ success: true, item });
}
