import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.sheepItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const body = await req.json();

  const created = await prisma.sheepItem.create({
    data: {
      type: body.type ?? "live",
      tagId: body.tagId ?? "",
      weightKg: body.weightKg ?? "",
      ageMonths: body.ageMonths ?? "",
      price: body.price ?? "",
      status: body.status ?? "Available",
      notes: body.notes ?? "",
    },
  });

  return NextResponse.json({ success: true, item: created });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing id" },
      { status: 400 }
    );
  }

  await prisma.sheepItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
