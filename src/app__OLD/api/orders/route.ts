import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function pad(num: number, size = 4) {
  return String(num).padStart(size, "0");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toNullableText(value: unknown): string | null {
  const text = toText(value).trim();
  return text || null;
}

function toNumber(value: unknown, fallback = 0): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export async function POST(req: Request) {
  try {
    const requestBody: unknown = await req.json();
    if (!isRecord(requestBody)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const customerName = toText(requestBody.customerName).trim();
    const phone = toText(requestBody.phone).trim();
    const items = Array.isArray(requestBody.items)
      ? requestBody.items.filter(isRecord)
      : [];

    if (
      !customerName ||
      !phone ||
      items.length === 0 ||
      items.length !== (Array.isArray(requestBody.items) ? requestBody.items.length : 0) ||
      items.some((item) => !toText(item.productId))
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Generate order number
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const prefix = `SCF-${yyyy}${mm}${dd}-`;

    const countToday = await prisma.order.count({
      where: { orderNumber: { startsWith: prefix } },
    });

    const orderNumber = `${prefix}${pad(countToday + 1)}`;

    const created = await prisma.order.create({
      data: {
        orderNumber,
        status: "PLACED",

        customerName,
        phone,
        email: toNullableText(requestBody.email),
        language: toText(requestBody.language) || "en",

        deliveryType: requestBody.deliveryType === "PICKUP" ? "PICKUP" : "DELIVERY",

        addressLine1: toNullableText(requestBody.addressLine1),
        addressLine2: toNullableText(requestBody.addressLine2),
        landmark: toNullableText(requestBody.landmark),
        city: toNullableText(requestBody.city),
        state: toNullableText(requestBody.state),
        pincode: toNullableText(requestBody.pincode),
        mapLink: toNullableText(requestBody.mapLink),

        preferredSlot: toNullableText(requestBody.preferredSlot),
        notes: toNullableText(requestBody.notes),

        paymentMethod: "COD",

        subtotal: toNumber(requestBody.subtotal),
        deliveryFee: toNumber(requestBody.deliveryFee),
        totalAmount: toNumber(requestBody.totalAmount),

        items: {
          create: items.map((item) => ({
            productId: toText(item.productId),
            qty: toNumber(item.qty, 1),
            priceEach: toNumber(item.priceEach),
            lineTotal: toNumber(item.lineTotal),
            nameSnapshot: toText(item.nameSnapshot),
            unitSnapshot: toText(item.unitSnapshot),
            imageUrl: toNullableText(item.imageUrl),
          })),
        },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    return NextResponse.json({
      orderId: created.id,
      orderNumber: created.orderNumber,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}