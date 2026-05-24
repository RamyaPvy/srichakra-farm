import type { Lang } from "../providers";

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