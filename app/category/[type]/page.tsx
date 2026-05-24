import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProductCard from "../../components/ProductCard";

type RouteType = "fish" | "sheep" | "vegetables" | "rice";
type DbCategory = "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
type DbFishTab = "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS";

type ProductRow = {
  id: string;
  category: DbCategory;
  fishTab: DbFishTab | null;
  name_en: string;
  name_te: string | null;
  name_hi: string | null;
  unitLabel: string;
  price: number;
  stockQty: number;
  imageUrl: string | null;
  metaJson: unknown | null;
};

const ROUTE_TO_DB: Record<RouteType, DbCategory> = {
  fish: "FISH",
  sheep: "SHEEP",
  vegetables: "VEGETABLES",
  rice: "RICE",
};

const TITLES: Record<RouteType, string> = {
  fish: "Fish",
  sheep: "Sheep / Mutton",
  vegetables: "Vegetables",
  rice: "Raw Rice",
};

type SheepTabRoute = "young-lambs" | "adult-sheep" | "mutton";

const SHEEP_TABS: { label: string; route: SheepTabRoute }[] = [
  { label: "Young Lambs", route: "young-lambs" },
  { label: "Adult Sheep", route: "adult-sheep" },
  { label: "Mutton", route: "mutton" },
];

function toNumberOrNull(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams?: Promise<{ tab?: string; minKg?: string; maxKg?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const type = resolvedParams?.type as RouteType;

  if (!type || !(type in ROUTE_TO_DB)) {
    notFound();
  }

  if (type === "fish") {
    redirect("/category/fish/tender-seeds");
  }

  const dbCategory = ROUTE_TO_DB[type];
  const rawSheepTab = resolvedSearchParams?.tab ?? "young-lambs";

  const sheepTab: SheepTabRoute =
    rawSheepTab === "adult-sheep" || rawSheepTab === "mutton" || rawSheepTab === "young-lambs"
      ? rawSheepTab
      : "young-lambs";

  const minKg = toNumberOrNull(resolvedSearchParams?.minKg);
  const maxKg = toNumberOrNull(resolvedSearchParams?.maxKg);

  const allProducts: ProductRow[] = await prisma.product.findMany({
    where: {
      isActive: true,
      category: dbCategory,
    },
    orderBy: { name_en: "asc" },
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
      metaJson: true,
    },
  });

  let products =
    type === "sheep"
      ? allProducts.filter((p) => {
          const meta = (p.metaJson ?? {}) as Record<string, unknown>;
          const kind = String(meta.kind || "");

          if (sheepTab === "young-lambs") return kind === "YOUNG_LAMB";
          if (sheepTab === "adult-sheep") return kind === "ADULT_SHEEP";
          return kind === "MUTTON";
        })
      : allProducts;

  if (type === "sheep" && sheepTab !== "mutton" && (minKg !== null || maxKg !== null)) {
    products = products.filter((p) => {
      const meta = (p.metaJson ?? {}) as Record<string, unknown>;
      const weightKg = Number(meta.weightKg ?? 0);

      if (minKg !== null && weightKg < minKg) return false;
      if (maxKg !== null && weightKg > maxKg) return false;
      return true;
    });
  }

  const buildSheepTabHref = (tab: SheepTabRoute, nextMinKg?: string, nextMaxKg?: string) => {
    const qs = new URLSearchParams();
    qs.set("tab", tab);
    if (nextMinKg) qs.set("minKg", nextMinKg);
    if (nextMaxKg) qs.set("maxKg", nextMaxKg);
    return `/category/sheep?${qs.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{TITLES[type]}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {type === "sheep"
              ? "Select young lambs, adult sheep, or mutton services."
              : "Select items and add to cart."}
          </p>
        </div>

        <Link className="text-sm underline" href="/">
          Back to Home
        </Link>
      </div>

      {type === "sheep" && (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {SHEEP_TABS.map((t) => {
              const active = t.route === sheepTab;

              return (
                <Link
                  key={t.route}
                  href={buildSheepTabHref(
                    t.route,
                    minKg !== null ? String(minKg) : undefined,
                    maxKg !== null ? String(maxKg) : undefined
                  )}
                  className={
                    active
                      ? "rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border bg-white px-4 py-2 text-sm font-semibold text-zinc-800"
                  }
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          {sheepTab !== "mutton" && (
            <div className="mt-5 rounded-2xl border bg-white p-4">
              <div className="text-sm font-bold text-zinc-900">Filter by Weight</div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={buildSheepTabHref(sheepTab)}
                  className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                >
                  All
                </Link>
                <Link
                  href={buildSheepTabHref(sheepTab, "5", "10")}
                  className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                >
                  5–10 kg
                </Link>
                <Link
                  href={buildSheepTabHref(sheepTab, "10", "15")}
                  className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                >
                  10–15 kg
                </Link>
                <Link
                  href={buildSheepTabHref(sheepTab, "15", "20")}
                  className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                >
                  15–20 kg
                </Link>
                <Link
                  href={buildSheepTabHref(sheepTab, "20", "25")}
                  className="rounded-full border bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                >
                  20–25 kg
                </Link>
              </div>

              <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <input type="hidden" name="tab" value={sheepTab} />

                <label className="block">
                  <div className="mb-1 text-xs font-semibold text-zinc-700">Min kg</div>
                  <input
                    name="minKg"
                    defaultValue={minKg !== null ? String(minKg) : ""}
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="e.g., 15"
                  />
                </label>

                <label className="block">
                  <div className="mb-1 text-xs font-semibold text-zinc-700">Max kg</div>
                  <input
                    name="maxKg"
                    defaultValue={maxKg !== null ? String(maxKg) : ""}
                    className="w-full rounded-xl border px-3 py-2"
                    placeholder="e.g., 25"
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Apply
                </button>

                <Link
                  href={buildSheepTabHref(sheepTab)}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold text-zinc-800"
                >
                  Clear
                </Link>
              </form>
            </div>
          )}
        </>
      )}

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          No items available right now.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={{
                id: p.id,
                category: p.category,
                fishTab: p.fishTab,
                name_en: p.name_en,
                unitLabel: p.unitLabel,
                price: p.price,
                stockQty: p.stockQty,
                imageUrl: p.imageUrl,
                metaJson: p.metaJson ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}