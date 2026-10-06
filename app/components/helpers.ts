import type { Lang } from "../providers/LanguageProvider";

const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  FISH: "/categories/fish.jpg",
  SHEEP: "/categories/sheep.jpg",
  VEGETABLES: "/categories/vegetables.jpg",
  RICE: "/categories/rice.jpg",
};

const VEGETABLE_IMAGE_MAP: Record<string, string> = {
  tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80",
  tomatoes: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=80",
  "green chilli": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
  "green chillies": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=80",
  cucumber: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=1200&q=80",
  onion: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=80",
  "onion white": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=80",
  "white onion": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=80",
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