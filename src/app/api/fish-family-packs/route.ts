import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const fishTypes = await prisma.fishType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        variants: {
          where: { isAvailable: true },
          orderBy: [{ serviceType: "asc" }, { sizeLabel: "asc" }],
        },
      },
    });

    return NextResponse.json({ success: true, fishTypes });
  } catch (e) {
    return NextResponse.json(
      { success: false, fishTypes: [], message: "Failed to load family packs" },
      { status: 500 }
    );
  }
}
