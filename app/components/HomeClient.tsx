"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

type ProductDTO = {
  id: string;
  category: "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
  name_en: string;
  name_te?: string | null;
  name_hi?: string | null;
  unitLabel: string;
  price: number;
  stockQty: number;
  imageUrl?: string | null;
};

const categoryLabelMap: Record<ProductDTO["category"], string> = {
  FISH: "Fish",
  SHEEP: "Sheep / Mutton",
  VEGETABLES: "Vegetables",
  RICE: "Rice",
};

const categoryOptions: { key: ProductDTO["category"] | null; label: string }[] = [
  { key: null, label: "All" },
  { key: "FISH", label: "Fish" },
  { key: "SHEEP", label: "Sheep / Mutton" },
  { key: "VEGETABLES", label: "Vegetables" },
  { key: "RICE", label: "Rice" },
];

export default function HomeClient() {
  const [category, setCategory] = useState<ProductDTO["category"] | null>(null);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);

  async function load(cat?: ProductDTO["category"] | null) {
    setLoading(true);
    try {
      const qs = cat ? `?category=${cat}&take=8` : `?take=8`;
      const res = await fetch(`/api/products${qs}`);
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(category);
  }, [category]);

  return (
    <section className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
            {category ? `${categoryLabelMap[category]} Picks` : "Fresh Picks"}
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            {category
              ? `Browse fresh ${categoryLabelMap[category].toLowerCase()} items available now`
              : "Browse fresh items available now from SriChakra Farm"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categoryOptions.map((option) => {
          const active = category === option.key;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => setCategory(option.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-green-800 text-white shadow-sm"
                  : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-green-300 hover:bg-green-50 hover:text-green-900"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl border border-zinc-200 bg-zinc-100"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center text-sm text-zinc-600">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}