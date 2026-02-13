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
    tabs: { all: string; young: string; adult: string };
    bannerAlt: string;
    loading: string;
    empty: string;
    priceLabel: string;
    view: string;
    back: string;
  }
> = {
  en: {
    pageTitle: "Sheep Selection",
    tabs: { all: "All", young: "Young Lambs", adult: "Adult Sheep" },
    bannerAlt: "Sheep banner",
    loading: "Loading sheep...",
    empty: "No items available right now.",
    priceLabel: "Price",
    view: "View Details",
    back: "Back to Home",
  },
  te: {
    pageTitle: "గొర్రెల ఎంపిక",
    tabs: { all: "అన్ని", young: "చిన్న గొర్రె పిల్లలు", adult: "పెద్ద గొర్రెలు" },
    bannerAlt: "గొర్రెల బ్యానర్",
    loading: "లోడ్ అవుతోంది...",
    empty: "ప్రస్తుతం ఏవి అందుబాటులో లేవు.",
    priceLabel: "ధర",
    view: "వివరాలు చూడండి",
    back: "హోమ్‌కి వెళ్ళండి",
  },
  hi: {
    pageTitle: "भेड़ चयन",
    tabs: { all: "सभी", young: "छोटे मेमने", adult: "बड़ी भेड़ें" },
    bannerAlt: "भेड़ बैनर",
    loading: "लोड हो रहा है...",
    empty: "अभी कोई आइटम उपलब्ध नहीं है।",
    priceLabel: "कीमत",
    view: "विवरण देखें",
    back: "होम पर जाएँ",
  },
};

type SheepItem = {
  id: string;
  type: string; // live | mutton (future use)
  tagId: string;
  weightKg: string;
  ageMonths: string; // "11 Months", "1.2 Years", "14", etc.
  price: string;
  status: string;
  notes: string;
};

type Tab = "all" | "young" | "adult";

function buildOrderLink(it: SheepItem) {
  return `/order?item=${encodeURIComponent(it.tagId)}&type=${encodeURIComponent(
    it.type
  )}&category=sheep`;
}

// ✅ Robust age parser: supports "11 Months", "1.2 Years", "14", etc.
function ageToMonths(ageText: string): number | null {
  const raw = (ageText || "").trim().toLowerCase();
  if (!raw) return null;

  const numMatch = raw.match(/(\d+(\.\d+)?)/);
  if (!numMatch) return null;

  const n = Number(numMatch[1]);
  if (!Number.isFinite(n)) return null;

  if (raw.includes("year")) return Math.round(n * 12);
  if (raw.includes("month")) return Math.round(n);

  // if unit missing, assume it's months
  return Math.round(n);
}

export default function SheepPage() {
  const { lang } = useLanguage(); // ✅ hook inside component
  const t = useMemo(() => TEXT[lang], [lang]);

  const [items, setItems] = useState<SheepItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/inventory/sheep", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data?.items) ? (data.items as SheepItem[]) : [];
        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // ✅ Make status check case-insensitive (Available/AVAILABLE/active etc.)
  const available = useMemo(() => {
    return items.filter((x) => {
      const s = (x.status || "").toLowerCase();
      return s === "available" || s === "active";
    });
  }, [items]);

  const filtered = useMemo(() => {
    if (tab === "all") return available;

    return available.filter((x) => {
      const months = ageToMonths(x.ageMonths);
      if (months == null) return false;
      return tab === "young" ? months < 12 : months >= 12;
    });
  }, [available, tab]);

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader title={t.pageTitle} backHref="/" />

      <div className="mx-auto max-w-md px-4 py-4 space-y-4">
        {/* Tabs */}
        <div className="rounded-xl border border-emerald-200 bg-white shadow-sm p-2">
          <div className="grid grid-cols-3 gap-2">
            {(["all", "young", "adult"] as Tab[]).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`rounded-lg py-2 text-sm font-semibold transition ${
                  tab === k
                    ? "bg-emerald-700 text-white shadow"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                }`}
              >
                {t.tabs[k]}
              </button>
            ))}
          </div>
        </div>

        {/* Banner image */}
        <div
          className="relative h-40 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm"
          aria-label={t.bannerAlt}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/sheep.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* List */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
            {t.loading}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
            {t.empty}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((it) => (
              <div
                key={it.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="grid grid-cols-[120px_1fr]">
                  {/* Left image */}
                  <div
                    className="min-h-[120px] bg-cover bg-center"
                    style={{ backgroundImage: "url('/sheep.jpg')" }}
                  />

                  {/* Right details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-extrabold text-gray-900">
                          {it.tagId || "-"}
                        </div>

                        <div className="mt-1 text-sm text-gray-700">
                          <span className="font-semibold">
                            {it.weightKg || "-"} kg
                          </span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span>{it.ageMonths || "-"}</span>
                        </div>

                        {it.notes ? (
                          <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                            {it.notes}
                          </div>
                        ) : null}
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-sm text-gray-500">{t.priceLabel}</div>
                        <div className="text-base font-bold text-gray-900">
                          {it.price}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href={buildOrderLink(it)}
                        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 transition"
                      >
                        {t.view}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
