import type { Lang } from "../providers/LanguageProvider";

const EMPTY_RECORD: Record<string, unknown> = {};

export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : EMPTY_RECORD;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  FISH: "/categories/fish.jpg",
  SHEEP: "/categories/sheep.jpg",
  VEGETABLES: "/categories/vegetables.jpg",
  RICE: "/categories/rice.jpg",
};

const VEGETABLE_IMAGE_MAP: Record<string, string> = {
  tomato: "/products/vegetables/tomato.svg",
  tomatoes: "/products/vegetables/tomato.svg",
  "green chilli": "/products/vegetables/green-chilli.svg",
  "green chillies": "/products/vegetables/green-chilli.svg",
  spinach: "/products/vegetables/spinach.svg",
  cucumber: "/products/vegetables/cucumber.svg",
  onion: "/products/vegetables/onion.svg",
  "onion white": "/products/vegetables/onion.svg",
  "white onion": "/products/vegetables/onion.svg",
};

export function resolveProductImageUrl(
  productName?: string | null,
  category?: string | null,
  fallback?: string | null
) {
  const normalizedName = (productName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const targetCategory = (category ?? "").toUpperCase();

  if (normalizedName) {
    const matches = Object.entries(VEGETABLE_IMAGE_MAP).find(([keyword]) => {
      const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
      return (
        normalizedName.includes(normalizedKeyword) ||
        normalizedKeyword.includes(normalizedName) ||
        normalizedName.includes(keyword.replace(/\s+/g, ""))
      );
    });

    if (matches) return matches[1];
  }

  if (fallback && !fallback.startsWith("/categories/")) {
    return fallback;
  }

  if (targetCategory && CATEGORY_IMAGE_FALLBACKS[targetCategory]) {
    return CATEGORY_IMAGE_FALLBACKS[targetCategory];
  }

  return fallback ?? "/categories/vegetables.jpg";
}

export function getLocalizedName(
  p: { name_en: string; name_te?: string | null; name_hi?: string | null },
  lang: Lang
) {
  if (lang === "te") return p.name_te || p.name_en;
  if (lang === "hi") return p.name_hi || p.name_en;
  return p.name_en;
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN").format(amount);
}