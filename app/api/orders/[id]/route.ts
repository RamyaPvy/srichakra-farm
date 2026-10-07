import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

type ValidStatus = (typeof VALID_STATUSES)[number];

function isValidStatus(value: string): value is ValidStatus {
  return VALID_STATUSES.includes(value as ValidStatus);
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const customer = await getCurrentCustomer();
    const admin = customer ? null : await getCurrentAdmin();
    if (!customer && !admin) {
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      customer &&
      order.customerId !== customer.id &&
      !(order.customerId === null && order.phone.replace(/\D/g, "") === customer.phone.replace(/\D/g, ""))
    ) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    if (!(await getCurrentAdmin())) {
      return NextResponse.json({ error: "Not logged in as admin." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const status = String(body?.status || "").trim().toUpperCase();

    if (!status || !isValidStatus(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Allowed values: PLACED, CONFIRMED, PACKING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updated,
    });
  } catch (error) {
    console.error("PATCH /api/orders/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}