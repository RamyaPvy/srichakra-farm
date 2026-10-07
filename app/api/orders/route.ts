import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type IncomingOrderItem = {
  productId: string;
  qty: number;
  variantKey?: string;
  variantLabel?: string;
  priceEach: number;
  unitSnapshot: string;
  nameSnapshot: string;
  imageUrl?: string | null;
};

type CreateOrderBody = {
  customerName: string;
  phone: string;
  email?: string | null;
  language?: string;

  deliveryType?: "DELIVERY" | "PICKUP";
  addressLine1?: string | null;
  addressLine2?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  mapLink?: string | null;

  preferredSlot?: string | null;
  notes?: string | null;

  paymentMethod?: "COD";
  items: IncomingOrderItem[];
};

function normalizePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "");
}

function isValidPhone(phone: string) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 10 && normalized.length <= 15;
}

function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(String(pincode || "").trim());
}

function generateOrderNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);

  return `SCF-${yyyy}${mm}${dd}-${hh}${min}-${rand}`;
}

export async function GET(req: NextRequest) {
  try {
    const customer = await getCurrentCustomer();
    const admin = customer ? null : await getCurrentAdmin();
    if (!customer && !admin) {
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const phoneRaw = String(searchParams.get("phone") || "").trim();
    const orderNumberRaw = String(searchParams.get("orderNumber") || "").trim();
    const takeRaw = Number(searchParams.get("take") || 20);
    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(Math.trunc(takeRaw), 1), 50) : 20;

    const normalizedSearchPhone = normalizePhone(customer?.phone ?? phoneRaw);
    if (!normalizedSearchPhone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }
    if (customer && phoneRaw && normalizePhone(phoneRaw) !== normalizedSearchPhone) {
      return NextResponse.json({ error: "You can only view your own orders." }, { status: 403 });
    }

    const phoneConditions = customer
      ? [{ customerId: customer.id }, { phone: normalizedSearchPhone }]
      : [{ phone: normalizedSearchPhone }, { phone: phoneRaw }];

    const orders = await prisma.order.findMany({
      where: {
        ...(orderNumberRaw ? { orderNumber: orderNumberRaw } : {}),
        OR: phoneConditions,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ error: "Sign in before placing an order." }, { status: 401 });
    }

    const body = (await req.json()) as CreateOrderBody;

    if (!body.customerName?.trim()) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!isValidPhone(body.phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const deliveryType = body.deliveryType || "DELIVERY";

    if (deliveryType === "DELIVERY") {
      if (!body.addressLine1?.trim() || !body.city?.trim() || !body.pincode?.trim()) {
        return NextResponse.json(
          { error: "Address, city and pincode are required for delivery" },
          { status: 400 }
        );
      }

      if (!isValidPincode(body.pincode)) {
        return NextResponse.json({ error: "Please enter a valid 6-digit pincode" }, { status: 400 });
      }
    }

    if (!Array.isArray(body.items) || body.items.length > 100) {
      return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });
    }

    const normalizedItems = body.items.map((item) => ({
      productId: String(item.productId),
      qty: Number(item.qty),
      variantKey: item.variantKey ? String(item.variantKey) : "base",
      variantLabel: item.variantLabel ? String(item.variantLabel) : null,
      priceEach: Number(item.priceEach),
      unitSnapshot: String(item.unitSnapshot || ""),
      nameSnapshot: String(item.nameSnapshot || ""),
      imageUrl: item.imageUrl ? String(item.imageUrl) : null,
    }));

    const productIds = [...new Set(normalizedItems.map((item) => item.productId))];

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingItems = normalizedItems.filter((item) => !foundIds.has(item.productId));
      const missingNames = [...new Set(missingItems.map((item) => item.nameSnapshot).filter(Boolean))];

      return NextResponse.json(
        {
          error:
            missingNames.length > 0
              ? `These cart items no longer exist in inventory: ${missingNames.join(", ")}. Please clear cart and add them again.`
              : "One or more products no longer exist. Please clear cart and add items again.",
        },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      if (!Number.isSafeInteger(item.qty) || item.qty <= 0 || !Number.isFinite(item.priceEach)) {
        return NextResponse.json({ error: "Cart contains invalid quantity or price." }, { status: 400 });
      }

      const meta = product.metaJson && typeof product.metaJson === "object" && !Array.isArray(product.metaJson)
        ? product.metaJson as Record<string, unknown>
        : {};
      let expectedPrice = product.price;
      const variantParts = item.variantKey.split(":");

      if (product.category === "FISH" && product.fishTab === "TENDER_SEEDS") {
        const packPrice = Number(meta.packPriceExact);
        const perFishPrice = Number(meta.perFishPrice);
        const countPerPack = Number(meta.countPerPack);
        expectedPrice = Number.isFinite(packPrice) && packPrice > 0
          ? packPrice
          : Number.isFinite(perFishPrice) && Number.isFinite(countPerPack)
            ? perFishPrice * countPerPack
            : product.price;
      } else if (
        (product.category === "FISH" && product.fishTab === "FAMILY_PACKS") ||
        (product.category === "SHEEP" && meta.kind === "MUTTON")
      ) {
        const service = product.category === "FISH" ? variantParts[2] : variantParts[2];
        const charges = meta.extraCharges && typeof meta.extraCharges === "object" && !Array.isArray(meta.extraCharges)
          ? meta.extraCharges as Record<string, unknown>
          : {};
        if (!service || !(service in charges)) {
          return NextResponse.json({ error: "Select a valid product service before ordering." }, { status: 400 });
        }
        const extraCharge = Number(charges[service]);
        if (!Number.isFinite(extraCharge) || extraCharge < 0) {
          return NextResponse.json({ error: "Product service pricing is invalid." }, { status: 400 });
        }
        expectedPrice += extraCharge;
      }

      if (Math.round(item.priceEach) !== Math.round(expectedPrice)) {
        return NextResponse.json({ error: `${product.name_en} price changed. Refresh the shop and try again.` }, { status: 409 });
      }

      item.nameSnapshot = product.name_en;
      item.unitSnapshot = product.unitLabel;
      item.imageUrl = product.imageUrl;
    }

    const qtyByProductId = new Map<string, number>();
    for (const item of normalizedItems) {
      qtyByProductId.set(item.productId, (qtyByProductId.get(item.productId) ?? 0) + item.qty);
    }

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `${item.nameSnapshot} no longer exists. Please clear cart and add again.` },
          { status: 400 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `${product.name_en} is no longer available` },
          { status: 400 }
        );
      }

      if (product.stockQty <= 0) {
        return NextResponse.json({ error: `${product.name_en} is out of stock` }, { status: 400 });
      }
    }

    for (const product of products) {
      const requiredQty = qtyByProductId.get(product.id) ?? 0;

      if (requiredQty > product.stockQty) {
        return NextResponse.json(
          {
            error: `Only ${product.stockQty} available for ${product.name_en}. Please reduce quantity in cart.`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.priceEach * item.qty, 0);
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;
    const order = await prisma.$transaction(async (tx) => {
      for (const product of products) {
        const requiredQty = qtyByProductId.get(product.id) ?? 0;

        if (requiredQty > 0) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stockQty: {
                decrement: requiredQty,
              },
            },
          });
        }
      }

      const created = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PLACED",
          customerId: customer.id,

          customerName: customer.fullName,
          phone: normalizePhone(customer.phone),
          email: customer.email,
          language: body.language?.trim() || "en",

          deliveryType,
          addressLine1: deliveryType === "DELIVERY" ? body.addressLine1?.trim() || null : null,
          addressLine2: deliveryType === "DELIVERY" ? body.addressLine2?.trim() || null : null,
          landmark: deliveryType === "DELIVERY" ? body.landmark?.trim() || null : null,
          city: deliveryType === "DELIVERY" ? body.city?.trim() || null : null,
          state: deliveryType === "DELIVERY" ? body.state?.trim() || null : null,
          pincode: deliveryType === "DELIVERY" ? body.pincode?.trim() || null : null,
          mapLink: deliveryType === "DELIVERY" ? body.mapLink?.trim() || null : null,

          preferredSlot: body.preferredSlot?.trim() || null,
          notes: body.notes?.trim() || null,

          paymentMethod: body.paymentMethod || "COD",

          subtotal: Math.round(subtotal),
          deliveryFee: Math.round(deliveryFee),
          totalAmount: Math.round(totalAmount),

          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              variantKey: item.variantKey,
              variantLabel: item.variantLabel,
              qty: item.qty,
              priceEach: Math.round(item.priceEach),
              lineTotal: Math.round(item.priceEach * item.qty),
              nameSnapshot: item.nameSnapshot,
              unitSnapshot: item.unitSnapshot,
              imageUrl: item.imageUrl,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}