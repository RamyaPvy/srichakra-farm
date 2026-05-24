"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";

type DbCategory = "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
type DbFishTab = "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS";

type ProductVM = {
  id: string;
  category: DbCategory;
  fishTab?: DbFishTab | null;
  name_en: string;
  unitLabel: string;
  price: number;
  stockQty: number;
  imageUrl?: string | null;
  metaJson?: any | null;
};

function safeNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function formatINR(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const hasDecimals = Math.abs(n - Math.round(n)) > 1e-9;
  return hasDecimals ? `Rs. ${n.toFixed(2)}` : `Rs. ${Math.round(n)}`;
}

function pretty(s: string): string {
  return s.replaceAll("_", " ").toLowerCase();
}

function titleize(s: string): string {
  return s
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm">
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-bold text-zinc-900">{value}</div>
    </div>
  );
}

type TenderBuyMode = "PACKS" | "COUNT" | "BUDGET";

export default function ProductCard({
  p,
  activeFishTab,
}: {
  p: ProductVM;
  activeFishTab?: DbFishTab;
}) {
  const m = p.metaJson || {};
  const inStock = safeNum(p.stockQty) > 0;

  const fishType = m.fishType ? String(m.fishType) : null;

  const sizeLabel = m.sizeLabel ? String(m.sizeLabel) : null;
  const sizeInch = m.sizeInch != null ? safeNum(m.sizeInch) : null;
  const countPerPack = m.countPerPack != null ? safeNum(m.countPerPack) : null;
  const perFishPrice = m.perFishPrice != null ? safeNum(m.perFishPrice) : null;

  const packPriceExact = useMemo(() => {
    if (m.packPriceExact != null && safeNum(m.packPriceExact) > 0) {
      return safeNum(m.packPriceExact);
    }

    if (perFishPrice != null && countPerPack != null && countPerPack > 0) {
      return perFishPrice * countPerPack;
    }

    return safeNum(p.price);
  }, [m.packPriceExact, perFishPrice, countPerPack, p.price]);

  const [openOptions, setOpenOptions] = useState(false);
  const [buyMode, setBuyMode] = useState<TenderBuyMode>("PACKS");
  const [packsWanted, setPacksWanted] = useState("1");
  const [fishCountWanted, setFishCountWanted] = useState("");
  const [budgetWanted, setBudgetWanted] = useState("");

  const tenderPackQtyToAdd = useMemo(() => {
    if (!countPerPack || countPerPack <= 0) return 1;

    if (buyMode === "PACKS") {
      return Math.max(1, Math.trunc(safeNum(packsWanted, 1)));
    }

    if (buyMode === "COUNT") {
      const desired = Math.max(1, Math.trunc(safeNum(fishCountWanted, 0)));
      return Math.max(1, Math.ceil(desired / countPerPack));
    }

    const budget = Math.max(0, safeNum(budgetWanted, 0));
    if (!budget || packPriceExact <= 0) return 1;
    return Math.max(1, Math.floor(budget / packPriceExact));
  }, [buyMode, packsWanted, fishCountWanted, budgetWanted, countPerPack, packPriceExact]);

  const tenderVariantKey = useMemo(() => {
    return `seed:${fishType ?? ""}-${sizeLabel ?? sizeInch ?? ""}-${countPerPack ?? ""}-${perFishPrice ?? ""}`;
  }, [fishType, sizeLabel, sizeInch, countPerPack, perFishPrice]);

  const tenderVariantLabel = useMemo(() => {
    const parts: string[] = [];
    if (fishType) parts.push(fishType);
    if (sizeLabel) parts.push(sizeLabel);
    else if (sizeInch) parts.push(`${sizeInch}"`);
    if (countPerPack) parts.push(`${countPerPack}/pack`);
    if (perFishPrice != null) parts.push(`${formatINR(perFishPrice)}/fish`);
    return parts.join(" • ");
  }, [fishType, sizeLabel, sizeInch, countPerPack, perFishPrice]);

  const bulkType = m.bulkType ? String(m.bulkType) : null;
  const minOrderKg = m.minOrderKg != null ? Math.max(1, Math.trunc(safeNum(m.minOrderKg, 1))) : 1;
  const minFishKg = m.minFishKg != null ? safeNum(m.minFishKg) : null;
  const maxFishKg = m.maxFishKg != null ? safeNum(m.maxFishKg) : null;
  const [bulkKgWanted, setBulkKgWanted] = useState("");

  const bulkQtyToAdd = useMemo(() => {
    const desired = safeNum(bulkKgWanted, 0);
    if (!Number.isFinite(desired) || desired <= 0) return minOrderKg;
    return Math.max(minOrderKg, Math.ceil(desired));
  }, [bulkKgWanted, minOrderKg]);

  const bulkVariantKey = useMemo(() => {
    return `bulk:${fishType ?? ""}-${bulkType ?? ""}-${minOrderKg}-${minFishKg ?? ""}-${maxFishKg ?? ""}`;
  }, [fishType, bulkType, minOrderKg, minFishKg, maxFishKg]);

  const bulkVariantLabel = useMemo(() => {
    const parts: string[] = [];
    if (fishType) parts.push(fishType);
    if (bulkType) parts.push(bulkType === "POND_STOCK" ? "Pond Stock" : "Market Bulk");
    parts.push(`Min ${minOrderKg}kg`);
    if (minFishKg != null && maxFishKg != null) parts.push(`${minFishKg}-${maxFishKg}kg fish`);
    return parts.join(" • ");
  }, [fishType, bulkType, minOrderKg, minFishKg, maxFishKg]);

  const services: string[] = Array.isArray(m.services) ? m.services.map(String) : [];
  const extraCharges: Record<string, number> =
    m.extraCharges && typeof m.extraCharges === "object" ? m.extraCharges : {};
  const prepMinutes: Record<string, number> =
    m.prepMinutes && typeof m.prepMinutes === "object" ? m.prepMinutes : {};

  const [selectedService, setSelectedService] = useState<string | null>(null);

  const familyExtra = selectedService ? safeNum(extraCharges[selectedService], 0) : 0;
  const familyPrep = selectedService ? safeNum(prepMinutes[selectedService], 0) : 0;
  const familyFinalPrice = safeNum(p.price) + familyExtra;

  const familyVariantKey = useMemo(
    () => `family:${fishType ?? ""}:${selectedService ?? ""}`,
    [fishType, selectedService]
  );

  const familyVariantLabel = useMemo(() => {
    if (!selectedService) return fishType ? `${fishType}` : "";
    return `${fishType ?? ""} • ${pretty(selectedService)} • +${formatINR(
      familyExtra
    )}/kg • ${familyPrep} min`;
  }, [fishType, selectedService, familyExtra, familyPrep]);

  const sheepKind = m.kind ? String(m.kind) : null;
  const sheepId = m.sheepId ? String(m.sheepId) : null;
  const sheepAgeMonths = m.ageMonths != null ? Math.trunc(safeNum(m.ageMonths)) : null;
  const sheepWeightKg = m.weightKg != null ? safeNum(m.weightKg) : null;
  const sheepWhatsapp = m.whatsappNumber ? String(m.whatsappNumber) : null;
  const sheepVideoCallAvailable = !!m.videoCallAvailable;

  const muttonMinOrderKg = m.minOrderKg != null ? Math.max(1, Math.trunc(safeNum(m.minOrderKg, 1))) : 1;
  const muttonFinalPrice =
    p.category === "SHEEP" && sheepKind === "MUTTON"
      ? safeNum(p.price) + (selectedService ? safeNum(extraCharges[selectedService], 0) : 0)
      : safeNum(p.price);

  const muttonVariantKey = useMemo(
    () => `mutton:${p.id}:${selectedService ?? ""}`,
    [p.id, selectedService]
  );

  const muttonVariantLabel = useMemo(() => {
    if (!selectedService) return "";
    return `${titleize(selectedService)} • +${formatINR(
      safeNum(extraCharges[selectedService], 0)
    )}/kg • ${safeNum(prepMinutes[selectedService], 0)} min`;
  }, [selectedService, extraCharges, prepMinutes]);

  const whatsappHref =
    sheepWhatsapp && sheepWhatsapp.trim()
      ? `https://wa.me/${sheepWhatsapp.replace(/\D/g, "")}`
      : null;

  const mainPrice =
    p.category === "FISH" && activeFishTab === "TENDER_SEEDS"
      ? packPriceExact
      : p.category === "FISH" && activeFishTab === "FAMILY_PACKS"
      ? familyFinalPrice
      : p.category === "SHEEP" && sheepKind === "MUTTON"
      ? muttonFinalPrice
      : safeNum(p.price);

  const qtyToAdd =
    p.category === "FISH" && activeFishTab === "TENDER_SEEDS"
      ? tenderPackQtyToAdd
      : p.category === "FISH" && activeFishTab === "BULK_LOTS"
      ? bulkQtyToAdd
      : 1;

  return (
    <div className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.imageUrl}
            alt={p.name_en}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-center">
            <div className="text-3xl">🛒</div>
            <div className="mt-2 text-xs font-semibold text-zinc-600">
              Image coming soon
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {fishType ? <Badge>{fishType}</Badge> : null}
          {activeFishTab === "TENDER_SEEDS" && sizeLabel ? (
            <Badge>{sizeLabel}</Badge>
          ) : activeFishTab === "TENDER_SEEDS" && sizeInch ? (
            <Badge>{sizeInch}"</Badge>
          ) : null}
          {activeFishTab === "BULK_LOTS" && bulkType ? (
            <Badge>{bulkType === "POND_STOCK" ? "Pond Stock" : "Market Bulk"}</Badge>
          ) : null}
          {p.category === "SHEEP" && sheepKind ? <Badge>{titleize(sheepKind)}</Badge> : null}
        </div>
      </div>

      <div className="p-4">
        <div className="line-clamp-2 min-h-[3rem] text-[15px] font-extrabold leading-6 text-zinc-950 sm:text-base">
          {p.name_en}
        </div>

        {p.category === "FISH" && activeFishTab === "TENDER_SEEDS" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label="Cost / fish" value={perFishPrice != null ? formatINR(perFishPrice) : "—"} />
            <Stat label="Fish / pack" value={countPerPack != null ? countPerPack : "—"} />
          </div>
        ) : null}

        {p.category === "FISH" && activeFishTab === "BULK_LOTS" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label="Minimum order" value={`${minOrderKg} kg`} />
            <Stat
              label="Fish size range"
              value={
                minFishKg != null && maxFishKg != null
                  ? `${minFishKg}-${maxFishKg} kg`
                  : "—"
              }
            />
          </div>
        ) : null}

        {p.category === "FISH" && activeFishTab === "FAMILY_PACKS" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label="Service" value={selectedService ? pretty(selectedService) : "Select"} />
            <Stat label="Prep time" value={selectedService ? `${familyPrep} min` : "—"} />
          </div>
        ) : null}

        {p.category === "SHEEP" &&
        (sheepKind === "YOUNG_LAMB" || sheepKind === "ADULT_SHEEP") ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label="Sheep ID" value={sheepId ?? "—"} />
            <Stat label="Weight" value={sheepWeightKg != null ? `${sheepWeightKg} kg` : "—"} />
            <Stat label="Age" value={sheepAgeMonths != null ? `${sheepAgeMonths} months` : "—"} />
            <Stat label="Live View" value={sheepVideoCallAvailable ? "Video call" : "Chat only"} />
          </div>
        ) : null}

        {p.category === "SHEEP" && sheepKind === "MUTTON" ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Stat label="Service" value={selectedService ? titleize(selectedService) : "Select"} />
            <Stat
              label="Prep time"
              value={selectedService ? `${safeNum(prepMinutes[selectedService], 0)} min` : "—"}
            />
            <Stat label="Min order" value={`${muttonMinOrderKg} kg`} />
            <Stat label="WhatsApp" value={sheepWhatsapp ? "Available" : "Not added"} />
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-extrabold text-zinc-950">
                {formatINR(mainPrice)}
              </div>
              <div className="text-xs font-medium text-zinc-600">per {p.unitLabel}</div>
            </div>

            <div
              className={
                inStock
                  ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800"
                  : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"
              }
            >
              {inStock ? `Stock: ${p.stockQty}` : "Out of stock"}
            </div>
          </div>
        </div>

        {!inStock ? (
          <p className="mt-3 text-sm font-semibold text-red-700">
            This item is currently not available.
          </p>
        ) : null}

        {((p.category === "FISH" &&
          (activeFishTab === "TENDER_SEEDS" ||
            activeFishTab === "BULK_LOTS" ||
            activeFishTab === "FAMILY_PACKS")) ||
          (p.category === "SHEEP" && sheepKind === "MUTTON")) && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setOpenOptions((v) => !v)}
              className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              {p.category === "SHEEP" && sheepKind === "MUTTON"
                ? "Choose service"
                : "Buy options"}
              <span className="text-zinc-500">{openOptions ? "▲" : "▼"}</span>
            </button>

            {openOptions ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                {p.category === "FISH" && activeFishTab === "TENDER_SEEDS" && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {(["PACKS", "COUNT", "BUDGET"] as TenderBuyMode[]).map((mode) => {
                        const active = buyMode === mode;
                        const label =
                          mode === "PACKS" ? "Packs" : mode === "COUNT" ? "Fish count" : "Budget";
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setBuyMode(mode)}
                            className={
                              active
                                ? "rounded-full bg-green-800 px-3 py-1.5 text-[12px] font-bold text-white"
                                : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-bold text-zinc-800"
                            }
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {buyMode === "PACKS" && (
                      <label className="block">
                        <div className="mb-1 text-[12px] font-semibold text-zinc-700">Packs</div>
                        <input
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-green-400"
                          value={packsWanted}
                          onChange={(e) => setPacksWanted(e.target.value)}
                          placeholder="e.g., 2"
                        />
                      </label>
                    )}

                    {buyMode === "COUNT" && (
                      <label className="block">
                        <div className="mb-1 text-[12px] font-semibold text-zinc-700">Fish count</div>
                        <input
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-green-400"
                          value={fishCountWanted}
                          onChange={(e) => setFishCountWanted(e.target.value)}
                          placeholder="e.g., 5000"
                        />
                      </label>
                    )}

                    {buyMode === "BUDGET" && (
                      <label className="block">
                        <div className="mb-1 text-[12px] font-semibold text-zinc-700">Budget (Rs.)</div>
                        <input
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-green-400"
                          value={budgetWanted}
                          onChange={(e) => setBudgetWanted(e.target.value)}
                          placeholder="e.g., 10000"
                        />
                      </label>
                    )}

                    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-3">
                      <div className="text-[12px] font-semibold text-zinc-600">Auto summary</div>
                      <div className="mt-1 text-sm font-bold text-zinc-900">
                        {tenderPackQtyToAdd} pack(s)
                      </div>
                    </div>
                  </>
                )}

                {p.category === "FISH" && activeFishTab === "BULK_LOTS" && (
                  <label className="block">
                    <div className="mb-1 text-[12px] font-semibold text-zinc-700">Kg required</div>
                    <input
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-semibold text-zinc-900 outline-none focus:border-green-400"
                      value={bulkKgWanted}
                      onChange={(e) => setBulkKgWanted(e.target.value)}
                      placeholder={`Min ${minOrderKg} kg`}
                    />
                    <div className="mt-2 text-[12px] font-semibold text-zinc-700">
                      Will add: <span className="font-extrabold text-zinc-900">{bulkQtyToAdd} kg</span>
                    </div>
                  </label>
                )}

                {p.category === "FISH" && activeFishTab === "FAMILY_PACKS" && (
                  <>
                    <div className="text-[12px] font-semibold text-zinc-700">Choose service</div>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const active = selectedService === s;
                        const extra = safeNum(extraCharges[s], 0);
                        const prep = safeNum(prepMinutes[s], 0);

                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedService(s)}
                            className={
                              active
                                ? "rounded-full bg-green-800 px-3 py-1.5 text-[12px] font-bold text-white"
                                : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-bold text-zinc-800"
                            }
                          >
                            {pretty(s)} {extra ? `(+${Math.round(extra)})` : ""} {prep ? `• ${prep}m` : ""}
                          </button>
                        );
                      })}
                    </div>

                    {selectedService ? (
                      <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-3">
                        <div className="text-[12px] font-semibold text-zinc-600">Final price</div>
                        <div className="mt-1 text-sm font-bold text-zinc-900">
                          {formatINR(familyFinalPrice)} / kg
                        </div>
                      </div>
                    ) : (
                      <div className="text-[12px] font-bold text-red-700">
                        Please select a service to add to cart
                      </div>
                    )}
                  </>
                )}

                {p.category === "SHEEP" && sheepKind === "MUTTON" && (
                  <>
                    <div className="text-[12px] font-semibold text-zinc-700">Choose mutton service</div>
                    <div className="flex flex-wrap gap-2">
                      {services.map((s) => {
                        const active = selectedService === s;
                        const extra = safeNum(extraCharges[s], 0);
                        const prep = safeNum(prepMinutes[s], 0);

                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedService(s)}
                            className={
                              active
                                ? "rounded-full bg-green-800 px-3 py-1.5 text-[12px] font-bold text-white"
                                : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-bold text-zinc-800"
                            }
                          >
                            {titleize(s)} {extra ? `(+${Math.round(extra)})` : ""} {prep ? `• ${prep}m` : ""}
                          </button>
                        );
                      })}
                    </div>

                    {selectedService ? (
                      <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-3">
                        <div className="text-[12px] font-semibold text-zinc-600">Final price</div>
                        <div className="mt-1 text-sm font-bold text-zinc-900">
                          {formatINR(muttonFinalPrice)} / kg
                        </div>
                      </div>
                    ) : (
                      <div className="text-[12px] font-bold text-red-700">
                        Please select a mutton service
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </div>
        )}

        {p.category === "SHEEP" &&
        (sheepKind === "YOUNG_LAMB" || sheepKind === "ADULT_SHEEP") &&
        whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-bold text-green-800 transition hover:bg-green-100"
          >
            Contact on WhatsApp
          </a>
        ) : null}

        <div className="mt-4">
          {inStock ? (
            <AddToCartButton
              product={{
                id: p.id,
                name_en: p.name_en,
                unitLabel: p.unitLabel,
                price: mainPrice,
                stockQty: safeNum(p.stockQty),
                imageUrl: p.imageUrl ?? null,
              }}
              qty={Math.max(1, Math.trunc(safeNum(qtyToAdd, 1)))}
              variant={{
                variantKey:
                  p.category === "SHEEP" && sheepKind === "MUTTON"
                    ? muttonVariantKey
                    : activeFishTab === "TENDER_SEEDS"
                    ? tenderVariantKey
                    : activeFishTab === "BULK_LOTS"
                    ? bulkVariantKey
                    : activeFishTab === "FAMILY_PACKS"
                    ? familyVariantKey
                    : "base",
                variantLabel:
                  p.category === "SHEEP" && sheepKind === "MUTTON"
                    ? muttonVariantLabel
                    : activeFishTab === "TENDER_SEEDS"
                    ? tenderVariantLabel
                    : activeFishTab === "BULK_LOTS"
                    ? bulkVariantLabel
                    : activeFishTab === "FAMILY_PACKS"
                    ? familyVariantLabel
                    : "",
                requireSelection:
                  p.category === "SHEEP" && sheepKind === "MUTTON"
                    ? !selectedService
                    : activeFishTab === "FAMILY_PACKS"
                    ? !selectedService
                    : false,
                activeFishTab,
              }}
            />
          ) : (
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-2xl bg-zinc-300 px-4 py-3 font-bold text-white"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}