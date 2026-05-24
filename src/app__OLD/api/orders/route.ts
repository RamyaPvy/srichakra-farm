import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function pad(num: number, size = 4) {
  return String(num).padStart(size, "0");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      phone,
      email,
      language = "en",
      deliveryType = "DELIVERY",

      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      pincode,
      mapLink,

      preferredSlot,
      notes,

      paymentMethod = "COD",
      subtotal,
      deliveryFee = 0,
      totalAmount,

      items,
    } = body;

    if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
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
        email: email || null,
        language,

        deliveryType,

        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        landmark: landmark || null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
        mapLink: mapLink || null,

        preferredSlot: preferredSlot || null,
        notes: notes || null,

        paymentMethod,

        subtotal: Number(subtotal ?? 0),
        deliveryFee: Number(deliveryFee ?? 0),
        totalAmount: Number(totalAmount ?? 0),

        items: {
          create: items.map((x: any) => ({
            productId: x.productId,
            qty: Number(x.qty ?? 1),
            priceEach: Number(x.priceEach ?? 0),
            lineTotal: Number(x.lineTotal ?? 0),
            nameSnapshot: String(x.nameSnapshot ?? ""),
            unitSnapshot: String(x.unitSnapshot ?? ""),
            imageUrl: x.imageUrl || null,
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
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}