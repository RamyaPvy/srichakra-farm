import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE ORDER
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Required fields
    if (!body?.phone || !body?.qty || !body?.location) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: phone, qty, location" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        item: body.item || "",
        buyerType: body.buyerType || "",
        name: body.name || "",
        phone: body.phone || "",
        qty: body.qty || "",
        location: body.location || "",
        notes: body.notes || "",
        status: "NEW",

        // ✅ must match schema exactly
        unitPrice: body.unitPrice || "",
        total: body.total || "",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET ALL ORDERS
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// UPDATE STATUS
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id || !body?.status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: id, status" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: body.id },
      data: { status: String(body.status).toUpperCase() },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
