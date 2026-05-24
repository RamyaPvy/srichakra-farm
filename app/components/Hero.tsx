"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLanguage } from "../providers/LanguageProvider";

const categories = [
  { label: "Fish", href: "/category/fish/tender-seeds" },
  { label: "Sheep / Mutton", href: "/category/sheep" },
  { label: "Vegetables", href: "/category/vegetables" },
  { label: "Rice", href: "/category/rice" },
];

export default function Hero() {
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");

  const placeholder =
    lang === "te"
      ? "చేపలు, మటన్, కూరగాయలు, బియ్యం కోసం వెతకండి..."
      : lang === "hi"
      ? "मछली, मटन, सब्ज़ियाँ, चावल खोजें..."
      : "Search fish, mutton, vegetables, rice...";

  const searchHref = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return "/category/fish/tender-seeds";

    if (
      q.includes("fish") ||
      q.includes("rohu") ||
      q.includes("catla") ||
      q.includes("seed")
    ) {
      return "/category/fish/tender-seeds";
    }

    if (
      q.includes("sheep") ||
      q.includes("mutton") ||
      q.includes("lamb")
    ) {
      return "/category/sheep";
    }

    if (
      q.includes("vegetable") ||
      q.includes("tomato") ||
      q.includes("onion") ||
      q.includes("chilli")
    ) {
      return "/category/vegetables";
    }

    if (q.includes("rice")) {
      return "/category/rice";
    }

    return "/category/fish/tender-seeds";
  }, [query]);

  return (
    <section className="pt-5">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-green-400 focus:bg-white"
            />

            <Link
              href={searchHref}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-green-800 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
            >
              Search
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 hover:text-green-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}