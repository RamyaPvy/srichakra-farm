"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  category: "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
  fishTab: "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS" | null;
  name_en: string;
  unitLabel: string;
  price: number;
  stockQty: number;
  isActive: boolean;
  metaJson?: any | null;
};

function formatMoneyINR(amt: number): string {
  if (!Number.isFinite(amt)) return "—";
  const hasDecimals = Math.abs(amt - Math.round(amt)) > 1e-9;
  return hasDecimals ? `Rs. ${amt.toFixed(2)}` : `Rs. ${Math.round(amt)}`;
}

function getStockStatus(stockQty: number) {
  if (stockQty <= 0) {
    return {
      label: "OUT OF STOCK",
      className:
        "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700",
    };
  }

  if (stockQty <= 5) {
    return {
      label: "LOW STOCK",
      className:
        "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800",
    };
  }

  return {
    label: "IN STOCK",
    className:
      "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
  };
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 font-bold">{title}</div>
      {children}
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/products?includeInactive=1&take=300");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e: any) {
      setMsg(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fishByTab = useMemo(() => {
    const groups: Record<string, Product[]> = {
      TENDER_SEEDS: [],
      BULK_LOTS: [],
      FAMILY_PACKS: [],
    };

    for (const p of products.filter((x) => x.category === "FISH")) {
      if (p.fishTab) groups[p.fishTab].push(p);
    }

    return groups;
  }, [products]);

  const sheepByKind = useMemo(() => {
    const groups: Record<string, Product[]> = {
      YOUNG_LAMB: [],
      ADULT_SHEEP: [],
      MUTTON: [],
    };

    for (const p of products.filter((x) => x.category === "SHEEP")) {
      const kind = String((p.metaJson as any)?.kind || "");
      if (groups[kind]) groups[kind].push(p);
    }

    return groups;
  }, [products]);

  const vegetables = useMemo(
    () => products.filter((x) => x.category === "VEGETABLES"),
    [products]
  );

  const rice = useMemo(
    () => products.filter((x) => x.category === "RICE"),
    [products]
  );

  const summary = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive).length;
    const inactive = products.filter((p) => !p.isActive).length;
    const outOfStock = products.filter((p) => p.stockQty <= 0).length;
    const lowStock = products.filter((p) => p.stockQty > 0 && p.stockQty <= 5).length;
    const healthyStock = products.filter((p) => p.stockQty > 5).length;

    return {
      total,
      active,
      inactive,
      outOfStock,
      lowStock,
      healthyStock,
    };
  }, [products]);

  const patch = async (id: string, body: any) => {
    setMsg(null);

    const res = await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Update failed");

    return data.product as Product;
  };

  const updateField = async (
    p: Product,
    field: "price" | "stockQty",
    value: string
  ) => {
    try {
      const num = Number(value);
      if (!Number.isFinite(num) || num < 0) return;

      const updated = await patch(p.id, { [field]: Math.trunc(num) });

      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, ...updated } : x))
      );
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Error"}`);
    }
  };

  const toggleActive = async (p: Product) => {
    try {
      const updated = await patch(p.id, { isActive: !p.isActive });

      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, ...updated } : x))
      );
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Error"}`);
    }
  };

  const renderTable = (rows: Product[]) => {
    if (!rows.length) {
      return (
        <div className="text-sm text-zinc-600">
          No items in this section yet.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Stock Status</th>
              <th className="py-2 pr-4">Active</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => {
              const stockStatus = getStockStatus(p.stockQty);
              const sheepKind =
                p.category === "SHEEP"
                  ? String((p.metaJson as any)?.kind || "")
                  : "";

              return (
                <tr key={p.id} className="border-t align-top">
                  <td className="py-3 pr-4">
                    <div className="font-semibold">{p.name_en}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {p.category}
                      {p.category === "FISH" && p.fishTab ? ` • ${p.fishTab}` : ""}
                      {p.category === "SHEEP" && sheepKind ? ` • ${sheepKind}` : ""}
                    </div>
                  </td>

                  <td className="py-3 pr-4">{p.unitLabel}</td>

                  <td className="py-3 pr-4">
                    <input
                      className="w-24 rounded-lg border px-2 py-1"
                      defaultValue={String(p.price)}
                      onBlur={(e) => updateField(p, "price", e.target.value)}
                    />
                    <div className="mt-1 text-xs text-zinc-500">
                      {formatMoneyINR(p.price)}
                    </div>
                  </td>

                  <td className="py-3 pr-4">
                    <input
                      className="w-24 rounded-lg border px-2 py-1"
                      defaultValue={String(p.stockQty)}
                      onBlur={(e) => updateField(p, "stockQty", e.target.value)}
                    />
                  </td>

                  <td className="py-3 pr-4">
                    <span className={stockStatus.className}>
                      {stockStatus.label}
                    </span>
                  </td>

                  <td className="py-3 pr-4">
                    <button
                      onClick={() => toggleActive(p)}
                      className={
                        p.isActive
                          ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                          : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                      }
                    >
                      {p.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Owner Inventory</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage Fish, Sheep, Vegetables, and Rice inventory.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
            href="/admin/products/new"
          >
            + Add Product
          </Link>

          <button
            className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
            onClick={fetchProducts}
          >
            Refresh
          </button>
        </div>
      </div>

      {msg && (
        <div className="mt-4 rounded-xl border px-4 py-3 text-sm">{msg}</div>
      )}

      {loading ? (
        <div className="mt-10 text-sm text-zinc-600">Loading...</div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Total Products</div>
              <div className="mt-2 text-2xl font-bold">{summary.total}</div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Active</div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {summary.active}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Inactive</div>
              <div className="mt-2 text-2xl font-bold text-red-700">
                {summary.inactive}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Healthy Stock</div>
              <div className="mt-2 text-2xl font-bold text-emerald-700">
                {summary.healthyStock}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Low Stock</div>
              <div className="mt-2 text-2xl font-bold text-yellow-700">
                {summary.lowStock}
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm text-zinc-500">Out of Stock</div>
              <div className="mt-2 text-2xl font-bold text-red-700">
                {summary.outOfStock}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <SectionCard title="Fish — Tender Seeds">
              {renderTable(fishByTab.TENDER_SEEDS)}
            </SectionCard>

            <SectionCard title="Fish — Bulk Lots">
              {renderTable(fishByTab.BULK_LOTS)}
            </SectionCard>

            <SectionCard title="Fish — Family Packs">
              {renderTable(fishByTab.FAMILY_PACKS)}
            </SectionCard>

            <SectionCard title="Sheep — Young Lambs">
              {renderTable(sheepByKind.YOUNG_LAMB)}
            </SectionCard>

            <SectionCard title="Sheep — Adult Sheep">
              {renderTable(sheepByKind.ADULT_SHEEP)}
            </SectionCard>

            <SectionCard title="Sheep — Mutton Services">
              {renderTable(sheepByKind.MUTTON)}
            </SectionCard>

            <SectionCard title="Vegetables">
              {renderTable(vegetables)}
            </SectionCard>

            <SectionCard title="Rice">
              {renderTable(rice)}
            </SectionCard>
          </div>
        </>
      )}

      <div className="mt-10 text-xs text-zinc-500">
        Customer pages reflect active products automatically.
      </div>
    </div>
  );
}