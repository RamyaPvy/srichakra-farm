import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProductCard from "../../../components/ProductCard";

type CategoryType = "fish" | "sheep" | "vegetables" | "rice";
type DbCategory = "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
type FishTabRoute = "tender-seeds" | "bulk-lots" | "family-packs";
type DbFishTab = "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS";

const ROUTE_TO_DB_CATEGORY: Record<CategoryType, DbCategory> = {
  fish: "FISH",
  sheep: "SHEEP",
  vegetables: "VEGETABLES",
  rice: "RICE",
};

const FISH_TAB_ROUTE_TO_DB: Record<FishTabRoute, DbFishTab> = {
  "tender-seeds": "TENDER_SEEDS",
  "bulk-lots": "BULK_LOTS",
  "family-packs": "FAMILY_PACKS",
};

const FISH_TABS: { label: string; route: FishTabRoute }[] = [
  { label: "Tender Seeds", route: "tender-seeds" },
  { label: "Bulk Lots", route: "bulk-lots" },
  { label: "Family Packs", route: "family-packs" },
];

export default async function CategoryTabPage({
  params,
}: {
  params: Promise<{ type: string; tab: string }>;
}) {
  const resolvedParams = await params;
  const type = resolvedParams?.type as CategoryType;
  const tab = resolvedParams?.tab as FishTabRoute;

  if (!type || !(type in ROUTE_TO_DB_CATEGORY)) {
    notFound();
  }

  if (type !== "fish") {
    redirect(`/category/${type}`);
  }

  if (!tab || !(tab in FISH_TAB_ROUTE_TO_DB)) {
    redirect("/category/fish/tender-seeds");
  }

  const dbCategory = ROUTE_TO_DB_CATEGORY[type];
  const dbFishTab = FISH_TAB_ROUTE_TO_DB[tab];

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: dbCategory,
      fishTab: dbFishTab,
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Fish</h1>
          <p className="mt-1 text-sm text-zinc-600">Choose a tab and add items to cart.</p>
        </div>

        <Link className="text-sm underline" href="/">
          Back to Home
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FISH_TABS.map((t) => {
          const active = t.route === tab;
          return (
            <Link
              key={t.route}
              href={`/category/fish/${t.route}`}
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

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          No items available in this tab right now.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              activeFishTab={dbFishTab}
              p={{
                id: p.id,
                category: p.category as DbCategory,
                fishTab: p.fishTab as DbFishTab | null,
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