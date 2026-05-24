import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const toInt = (v: unknown, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
};

const toNum = (v: unknown, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toStr = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

const isValidCategory = (c: string): boolean =>
  ["FISH", "SHEEP", "VEGETABLES", "RICE"].includes(c);

const isValidFishTab = (t: string): boolean =>
  ["TENDER_SEEDS", "BULK_LOTS", "FAMILY_PACKS"].includes(t);

const isValidSheepKind = (k: string): boolean =>
  ["YOUNG_LAMB", "ADULT_SHEEP", "MUTTON"].includes(k);

function validateMeta(category: string, fishTab: string, metaJson: any) {
  const m: any = metaJson ?? {};

  if (category === "FISH") {
    if (!isValidFishTab(fishTab)) {
      return "fishTab is required for FISH";
    }

    if (!toStr(m.fishType)) {
      return "FISH product requires metaJson.fishType";
    }

    if (fishTab === "TENDER_SEEDS") {
      const count = toInt(m.countPerPack, 0);
      const perFish = toNum(m.perFishPrice, -1);

      if (!toStr(m.sizeLabel)) {
        return "Tender Seeds: sizeLabel is required";
      }

      if (count <= 0) {
        return "Tender Seeds: countPerPack must be > 0";
      }

      if (!Number.isFinite(perFish) || perFish < 0) {
        return "Tender Seeds: perFishPrice must be >= 0";
      }
    }

    if (fishTab === "BULK_LOTS") {
      const minOrderKg = toInt(m.minOrderKg, 0);
      const minFishKg = toNum(m.minFishKg, -1);
      const maxFishKg = toNum(m.maxFishKg, -1);

      if (minOrderKg <= 0) {
        return "Bulk Lots: minOrderKg must be > 0";
      }

      if (!toStr(m.bulkType)) {
        return "Bulk Lots: bulkType is required";
      }

      if (minFishKg < 0 || maxFishKg < 0) {
        return "Bulk Lots: minFishKg and maxFishKg must be >= 0";
      }

      if (maxFishKg > 0 && minFishKg > maxFishKg) {
        return "Bulk Lots: minFishKg cannot be greater than maxFishKg";
      }
    }

    if (fishTab === "FAMILY_PACKS") {
      if (!Array.isArray(m.services) || m.services.length === 0) {
        return "Family Packs: services are required";
      }
    }
  }

  if (category === "SHEEP") {
    const kind = toStr(m.kind);

    if (!isValidSheepKind(kind)) {
      return "SHEEP product requires valid metaJson.kind";
    }

    if (kind === "YOUNG_LAMB" || kind === "ADULT_SHEEP") {
      if (!toStr(m.sheepId)) {
        return "Live sheep requires sheepId";
      }

      const ageMonths = toInt(m.ageMonths, -1);
      const weightKg = toNum(m.weightKg, -1);

      if (ageMonths < 0) {
        return "Live sheep requires valid ageMonths";
      }

      if (weightKg <= 0) {
        return "Live sheep requires valid weightKg";
      }
    }

    if (kind === "MUTTON") {
      const minOrderKg = toInt(m.minOrderKg, 0);

      if (minOrderKg <= 0) {
        return "Mutton requires minOrderKg > 0";
      }

      if (!Array.isArray(m.services) || m.services.length === 0) {
        return "Mutton services are required";
      }
    }
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const fishTab = searchParams.get("fishTab");
    const includeInactive = searchParams.get("includeInactive") === "1";
    const take = Math.min(toInt(searchParams.get("take"), 100), 500);

    const where: any = {};
    if (!includeInactive) where.isActive = true;

    if (category) {
      if (!isValidCategory(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      where.category = category;
    }

    if (fishTab) {
      if (!isValidFishTab(fishTab)) {
        return NextResponse.json({ error: "Invalid fishTab" }, { status: 400 });
      }
      where.fishTab = fishTab;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [{ category: "asc" }, { createdAt: "desc" }],
      take,
      select: {
        id: true,
        category: true,
        fishTab: true,
        name_en: true,
        name_te: true,
        name_hi: true,
        unitLabel: true,
        price: true,
        stockQty: true,
        imageUrl: true,
        imageSource: true,
        isActive: true,
        metaJson: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const category = toStr(body.category);
    const fishTab = toStr(body.fishTab);

    const name_en = toStr(body.name_en);
    const name_te = body.name_te ? toStr(body.name_te) : null;
    const name_hi = body.name_hi ? toStr(body.name_hi) : null;

    const unitLabel = toStr(body.unitLabel);
    const price = toInt(body.price, 0);
    const stockQty = toInt(body.stockQty, 0);
    const imageUrl = body.imageUrl ? toStr(body.imageUrl) : null;
    const isActive = typeof body.isActive === "boolean" ? body.isActive : true;
    const metaJson = body.metaJson ?? null;

    if (!isValidCategory(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!name_en || !unitLabel) {
      return NextResponse.json(
        { error: "name_en and unitLabel are required" },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
    }

    if (stockQty < 0) {
      return NextResponse.json({ error: "stockQty must be >= 0" }, { status: 400 });
    }

    const metaError = validateMeta(category, fishTab, metaJson);
    if (metaError) {
      return NextResponse.json({ error: metaError }, { status: 400 });
    }

    const created = await prisma.product.create({
      data: {
        category: category as any,
        fishTab: category === "FISH" ? (fishTab as any) : null,
        name_en,
        name_te,
        name_hi,
        unitLabel,
        price,
        stockQty,
        imageUrl,
        isActive,
        metaJson,
      },
      select: {
        id: true,
        category: true,
        fishTab: true,
        name_en: true,
        name_te: true,
        name_hi: true,
        unitLabel: true,
        price: true,
        stockQty: true,
        imageUrl: true,
        isActive: true,
        metaJson: true,
      },
    });

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const id = toStr(body.id);
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        category: true,
        fishTab: true,
        metaJson: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data: any = {};

    if (body.price !== undefined) {
      const nextPrice = toInt(body.price, 0);
      if (nextPrice < 0) {
        return NextResponse.json({ error: "price must be >= 0" }, { status: 400 });
      }
      data.price = nextPrice;
    }

    if (body.stockQty !== undefined) {
      const nextStock = toInt(body.stockQty, 0);
      if (nextStock < 0) {
        return NextResponse.json({ error: "stockQty must be >= 0" }, { status: 400 });
      }
      data.stockQty = nextStock;
    }

    if (body.isActive !== undefined) data.isActive = !!body.isActive;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl ? toStr(body.imageUrl) : null;
    if (body.name_en !== undefined) data.name_en = toStr(body.name_en);
    if (body.name_te !== undefined) data.name_te = body.name_te ? toStr(body.name_te) : null;
    if (body.name_hi !== undefined) data.name_hi = body.name_hi ? toStr(body.name_hi) : null;
    if (body.unitLabel !== undefined) data.unitLabel = toStr(body.unitLabel);

    let nextFishTab = existing.fishTab ? String(existing.fishTab) : "";
    if (body.fishTab !== undefined) {
      nextFishTab = toStr(body.fishTab);

      if (existing.category === "FISH") {
        if (!isValidFishTab(nextFishTab)) {
          return NextResponse.json({ error: "Invalid fishTab" }, { status: 400 });
        }
        data.fishTab = nextFishTab;
      } else {
        data.fishTab = null;
      }
    }

    let nextMetaJson = existing.metaJson ?? null;
    if (body.metaJson !== undefined) {
      nextMetaJson = body.metaJson ?? null;
      data.metaJson = nextMetaJson;
    }

    const metaError = validateMeta(existing.category, nextFishTab, nextMetaJson);
    if (metaError) {
      return NextResponse.json({ error: metaError }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
      select: {
        id: true,
        category: true,
        fishTab: true,
        name_en: true,
        name_te: true,
        name_hi: true,
        unitLabel: true,
        price: true,
        stockQty: true,
        imageUrl: true,
        isActive: true,
        metaJson: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ product: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}