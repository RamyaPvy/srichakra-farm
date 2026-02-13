"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useLanguage } from "@/context/LanguageContext";

type Lang = "te" | "hi" | "en";

const TEXT: Record<
  Lang,
  {
    pageTitle: string;
    bandTitle: string;
    availableToday: string;
    categoryLabel: string;
    loading: string;
    empty: string;
    availableQtyLabel: string;
    addToCart: string;
    back: string;
    cats: { All: string; Leafy: string; Roots: string; Seasonal: string; Fruits: string };
  }
> = {
  en: {
    pageTitle: "Fresh Vegetables",
    bandTitle: "Fresh Vegetables",
    availableToday: "Available Today",
    categoryLabel: "Category:",
    loading: "Loading vegetables...",
    empty: "No items available right now.",
    availableQtyLabel: "Available",
    addToCart: "Add to Cart",
    back: "Back to Home",
    cats: {
      All: "All",
      Leafy: "Leafy",
      Roots: "Roots",
      Seasonal: "Seasonal",
      Fruits: "Fruits",
    },
  },
  te: {
    pageTitle: "తాజా కూరగాయలు",
    bandTitle: "తాజా కూరగాయలు",
    availableToday: "ఈరోజు అందుబాటులో ఉన్నాయి",
    categoryLabel: "వర్గం:",
    loading: "లోడ్ అవుతోంది...",
    empty: "ప్రస్తుతం ఏవి అందుబాటులో లేవు.",
    availableQtyLabel: "అందుబాటులో",
    addToCart: "కార్ట్‌లో పెట్టండి",
    back: "హోమ్‌కి వెళ్ళండి",
    cats: {
      All: "అన్ని",
      Leafy: "ఆకుకూరలు",
      Roots: "వేరుకూరలు",
      Seasonal: "సీజనల్",
      Fruits: "ఫలాలు",
    },
  },
  hi: {
    pageTitle: "ताज़ी सब्ज़ियाँ",
    bandTitle: "ताज़ी सब्ज़ियाँ",
    availableToday: "आज उपलब्ध",
    categoryLabel: "श्रेणी:",
    loading: "लोड हो रहा है...",
    empty: "अभी कोई आइटम उपलब्ध नहीं है।",
    availableQtyLabel: "उपलब्ध",
    addToCart: "कार्ट में जोड़ें",
    back: "होम पर जाएँ",
    cats: {
      All: "सभी",
      Leafy: "पत्तेदार",
      Roots: "जड़ वाली",
      Seasonal: "मौसमी",
      Fruits: "फल",
    },
  },
};

type VegItem = {
  id: string;
  category: string;
  name: string;
  unit: string;
  price: string;
  availableQty: string;
  status: string;
  notes: string;
};

type Cat = "All" | "Leafy" | "Roots" | "Seasonal" | "Fruits";

const CATS: Cat[] = ["All", "Leafy", "Roots", "Seasonal", "Fruits"];

function imgForVeg(it: VegItem) {
  const c = (it.category || "").toLowerCase();
  if (c.includes("leaf")) return "/veg-leafy.jpg";
  if (c.includes("root")) return "/veg-roots.jpg";
  if (c.includes("season")) return "/veg-seasonal.jpg";
  if (c.includes("fruit")) return "/veg-fruits.jpg";
  return "/veg.jpg";
}

function buildOrderLink(it: VegItem) {
  return `/order?item=${encodeURIComponent(it.name)}&type=${encodeURIComponent(
    it.category
  )}&category=vegetables`;
}

export default function VegetablesPage() {
  const { lang } = useLanguage(); // ✅ hook inside component
  const t = useMemo(() => TEXT[lang], [lang]);

  const [items, setItems] = useState<VegItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<Cat>("All");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/inventory/vegetables", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data?.items) ? (data.items as VegItem[]) : [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const available = useMemo(() => {
    return items.filter((x) => (x.status || "").toLowerCase() === "available");
  }, [items]);

  const filtered = useMemo(() => {
    if (cat === "All") return available;
    return available.filter((x) => x.category === cat);
  }, [available, cat]);

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader title={t.pageTitle} backHref="/" />

      <div className="mx-auto max-w-md px-4 py-4 space-y-4">
        <div className="rounded-xl overflow-hidden border border-emerald-200 bg-white shadow-sm">
          {/* Green band title */}
          <div className="bg-emerald-700 text-white text-center py-3 font-bold">
            {t.bandTitle}
          </div>

          {/* Available today strip */}
          <div className="px-4 py-3 border-t border-emerald-100 bg-emerald-50">
            <div className="text-center text-sm font-semibold text-emerald-800">
              {t.availableToday}
            </div>
          </div>

          {/* Category dropdown */}
          <div className="p-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.categoryLabel}
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
              value={cat}
              onChange={(e) => setCat(e.target.value as Cat)}
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {t.cats[c]}
                </option>
              ))}
            </select>
          </div>

          {/* Items list */}
          <div className="p-4 space-y-3">
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                {t.loading}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                {t.empty}
              </div>
            ) : (
              filtered.map((it) => (
                <div
                  key={it.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-[120px_1fr]">
                    {/* Left image */}
                    <div
                      className="min-h-[120px] bg-cover bg-center"
                      style={{ backgroundImage: `url('${imgForVeg(it)}')` }}
                    />

                    {/* Right details */}
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          {it.name}
                        </div>

                        <div className="mt-1 text-sm text-gray-700">
                          <span className="font-semibold">{it.price}</span>
                          {it.unit ? <span> / {it.unit}</span> : null}
                        </div>

                        {it.availableQty ? (
                          <div className="mt-1 text-xs text-gray-600">
                            {t.availableQtyLabel}: {it.availableQty}
                          </div>
                        ) : null}

                        {it.notes ? (
                          <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                            {it.notes}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Link
                          href={buildOrderLink(it)}
                          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition"
                        >
                          {t.addToCart}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← {t.back}
        </Link>
      </div>
    </main>
  );
}
