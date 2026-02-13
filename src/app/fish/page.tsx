"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { useLanguage } from "@/context/LanguageContext";
import FamilyPacksTab from "./FamilyPacksTab";

type Lang = "te" | "hi" | "en";

const TEXT: Record<
  Lang,
  {
    pageTitle: string;
    tabs: { seed: string; bulk: string; family: string };
    categoryLabel: string;
    loading: string;
    empty: string;
    view: string;
    back: string;
  }
> = {
  en: {
    pageTitle: "Fish",
    tabs: { seed: "Tender Seeds", bulk: "Bulk Lots", family: "Family Packs" },
    categoryLabel: "Category:",
    loading: "Loading items...",
    empty: "No items available right now.",
    view: "View Details",
    back: "Back to Home",
  },
  te: {
    pageTitle: "చేపలు",
    tabs: { seed: "టెండర్ సీడ్స్", bulk: "బల్క్ లాట్స్", family: "ఫ్యామిలీ ప్యాక్స్" },
    categoryLabel: "వర్గం:",
    loading: "లోడ్ అవుతోంది...",
    empty: "ప్రస్తుతం ఐటెమ్స్ అందుబాటులో లేవు.",
    view: "వివరాలు చూడండి",
    back: "హోమ్‌కి వెళ్ళండి",
  },
  hi: {
    pageTitle: "मछली",
    tabs: { seed: "टेंडर सीड्स", bulk: "बल्क लॉट्स", family: "फैमिली पैक्स" },
    categoryLabel: "श्रेणी:",
    loading: "लोड हो रहा है...",
    empty: "अभी कोई आइटम उपलब्ध नहीं है।",
    view: "विवरण देखें",
    back: "होम पर जाएँ",
  },
};

type FishItem = {
  id: string;
  type: string; // seed | bulk | fresh
  name: string;
  detail?: string;
  price: string;
  status: string;
};

type Tab = "seed" | "bulk" | "family";

function buildOrderLink(it: FishItem) {
  const item = encodeURIComponent(it.name);
  const type = encodeURIComponent(it.type);
  return `/order?item=${item}&type=${type}&category=fish`;
}

export default function FishPage() {
  const { lang } = useLanguage();
  const t = useMemo(() => TEXT[lang], [lang]);

  const [items, setItems] = useState<FishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("seed");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/inventory/fish", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data?.items) ? (data.items as FishItem[]) : [];
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

  const seeds = useMemo(() => available.filter((x) => x.type === "seed"), [available]);
  const bulk = useMemo(() => available.filter((x) => x.type === "bulk"), [available]);

  // For Family Packs, we DO NOT use FishItem anymore.
  const activeArr = useMemo(() => {
    if (tab === "seed") return seeds;
    if (tab === "bulk") return bulk;
    return []; // family is handled by <FamilyPacksTab />
  }, [tab, seeds, bulk]);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(activeArr.map((x) => x.name)))];
  }, [activeArr]);

  const filtered = useMemo(() => {
    if (category === "All") return activeArr;
    return activeArr.filter((x) => x.name === category);
  }, [activeArr, category]);

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader title={t.pageTitle} backHref="/" />

      <div className="mx-auto max-w-md px-4 py-4 space-y-4">
        <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white shadow-sm">
          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Fish categories"
            className="grid grid-cols-3 bg-emerald-700 text-white text-sm font-semibold"
          >
            {(["seed", "bulk", "family"] as Tab[]).map((tabKey) => {
              const isActive = tab === tabKey;
              return (
                <button
                  key={tabKey}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tabKey}`}
                  id={`tab-${tabKey}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setTab(tabKey);
                    setCategory("All");
                  }}
                  className={`py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-white/70 ${
                    isActive ? "bg-emerald-800" : "bg-emerald-700"
                  }`}
                >
                  {t.tabs[tabKey]}
                </button>
              );
            })}
          </div>

          {/* Category dropdown (hide for family tab) */}
          {tab !== "family" && (
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.categoryLabel}
              </label>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <select
                  className="w-full bg-transparent text-sm outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Panel */}
          <div
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="p-4 space-y-3"
          >
            {tab === "family" ? (
              <FamilyPacksTab />
            ) : loading ? (
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
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{it.name}</div>
                    {it.detail ? (
                      <div className="mt-1 text-xs text-gray-600 truncate">{it.detail}</div>
                    ) : null}
                  </div>

                  <div className="ml-3 flex items-center gap-3">
                    <div className="text-sm font-bold text-emerald-700 whitespace-nowrap">
                      {it.price}
                    </div>

                    <Link
                      href={buildOrderLink(it)}
                      className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition whitespace-nowrap"
                    >
                      {t.view}
                    </Link>
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
