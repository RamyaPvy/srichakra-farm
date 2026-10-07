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
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=85",
  tomatoes: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=85",
  "green chilli": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg/1280px-Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg",
  "green chillies": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg/1280px-Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=85",
  cucumber: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=1200&q=85",
  onion: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=85",
  "onion white": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=85",
  "white onion": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=85",
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

  if (fallback && !fallback.startsWith("/categories/")) {
    return fallback;
  }

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