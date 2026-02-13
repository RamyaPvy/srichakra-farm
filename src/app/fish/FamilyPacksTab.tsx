"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type FishServiceType = "RAW" | "CUT" | "COOKED" | "PICKLE";

type FishVariant = {
  id: string;
  serviceType: FishServiceType;
  sizeLabel: string;     // "1 kg" | "2 kg" | "500 g"
  price: string;         // "₹320/kg" | "500/kg" | "₹280"
  notes: string;
  prepTimeMins: string;
};

type FishType = {
  id: string;
  name: string;
  description: string;
  variants: FishVariant[];
};

const SERVICE_LABEL: Record<FishServiceType, string> = {
  RAW: "Raw Fish",
  CUT: "Cut Pieces",
  COOKED: "Cooked",
  PICKLE: "Pickle",
};

const SERVICE_PRIORITY: FishServiceType[] = ["RAW", "CUT", "COOKED", "PICKLE"];

// --- helpers
function parsePriceNumber(price: string): number {
  const match = (price || "").match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function formatMoney(n: number) {
  const val = Math.round(n * 100) / 100;
  return `₹${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}`;
}

function isKgLabel(sizeLabel: string) {
  return (sizeLabel || "").toLowerCase().includes("kg");
}

function qtyStep(sizeLabel: string) {
  // kg -> allow 0.5 increments; grams/pack -> 1
  return isKgLabel(sizeLabel) ? 0.5 : 1;
}

function buildOrderLink(params: {
  fishName: string;
  service: FishServiceType;
  sizeLabel: string;
  unitPriceText: string;
  qty: number;
  total: number;
}) {
  const itemText = `${params.fishName} - ${SERVICE_LABEL[params.service]} - ${params.sizeLabel}`;
  const item = encodeURIComponent(itemText);
  const type = encodeURIComponent("family");

  return (
    `/order?item=${item}&type=${type}&category=fish` +
    `&unitPrice=${encodeURIComponent(params.unitPriceText)}` +
    `&qty=${encodeURIComponent(String(params.qty))}` +
    `&total=${encodeURIComponent(formatMoney(params.total))}`
  );
}

export default function FamilyPacksTab() {
  const [fishTypes, setFishTypes] = useState<FishType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFishId, setSelectedFishId] = useState("");
  const [selectedService, setSelectedService] = useState<FishServiceType>("RAW");

  // NEW: selected variant id
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  // qty
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/fish-family-packs", { cache: "no-store" });
        const data = await res.json();
        const list: FishType[] = Array.isArray(data?.fishTypes) ? data.fishTypes : [];
        setFishTypes(list);

        if (list.length) {
          const firstFish = list[0];
          setSelectedFishId(firstFish.id);

          const availableServices = new Set(firstFish.variants.map((v) => v.serviceType));
          const firstAvailableService =
            SERVICE_PRIORITY.find((s) => availableServices.has(s)) ?? "RAW";
          setSelectedService(firstAvailableService);
        }
      } catch {
        setFishTypes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedFish = useMemo(
    () => fishTypes.find((f) => f.id === selectedFishId),
    [fishTypes, selectedFishId]
  );

  const servicesAvailable = useMemo(() => {
    if (!selectedFish) return [];
    const set = new Set(selectedFish.variants.map((v) => v.serviceType));
    return SERVICE_PRIORITY.filter((s) => set.has(s));
  }, [selectedFish]);

  const variantsForService = useMemo(() => {
    if (!selectedFish) return [];
    return selectedFish.variants.filter((v) => v.serviceType === selectedService);
  }, [selectedFish, selectedService]);

  // When fish changes -> choose first available service + first variant
  useEffect(() => {
    if (!selectedFish) return;

    const availableServices = new Set(selectedFish.variants.map((v) => v.serviceType));
    const firstAvailableService =
      SERVICE_PRIORITY.find((s) => availableServices.has(s)) ?? "RAW";

    setSelectedService(firstAvailableService);
    setQty(1);
  }, [selectedFishId]); // eslint-disable-line react-hooks/exhaustive-deps

  // When service changes -> select first variant of that service
  useEffect(() => {
    const first = variantsForService[0];
    setSelectedVariantId(first?.id || "");
    setQty(1);
  }, [selectedService, selectedFishId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedVariant = useMemo(() => {
    return variantsForService.find((v) => v.id === selectedVariantId) || variantsForService[0];
  }, [variantsForService, selectedVariantId]);

  const unitPriceNumber = useMemo(() => {
    if (!selectedVariant) return 0;
    return parsePriceNumber(selectedVariant.price);
  }, [selectedVariant]);

  const step = useMemo(() => {
    if (!selectedVariant) return 1;
    return qtyStep(selectedVariant.sizeLabel);
  }, [selectedVariant]);

  const total = useMemo(() => {
    return unitPriceNumber * qty;
  }, [unitPriceNumber, qty]);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        Loading family packs...
      </div>
    );
  }

  if (!fishTypes.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        No family packs yet. Add FishType & FishVariant in Prisma Studio.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Fish Type */}
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="text-sm font-semibold text-gray-700 mb-2">Fish Type</div>
        <select
          className="w-full rounded-md border border-gray-200 p-2 text-sm"
          value={selectedFishId}
          onChange={(e) => setSelectedFishId(e.target.value)}
        >
          {fishTypes.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {selectedFish?.description ? (
          <div className="mt-2 text-xs text-gray-600">{selectedFish.description}</div>
        ) : null}
      </div>

      {/* Options */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">Select Option</div>
        <div className="flex flex-wrap gap-2">
          {servicesAvailable.map((svc) => {
            const active = svc === selectedService;
            return (
              <button
                key={svc}
                onClick={() => setSelectedService(svc)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {SERVICE_LABEL[svc]}
              </button>
            );
          })}
        </div>
      </div>

      {/* If no variants */}
      {variantsForService.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
          No packs available for this option.
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
          {/* Variants selector (sizes) */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">Choose Pack</div>
            <div className="grid grid-cols-1 gap-2">
              {variantsForService.map((v) => {
                const active = v.id === (selectedVariant?.id || "");
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-emerald-700 bg-emerald-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900">{v.sizeLabel}</div>
                      {v.notes ? <div className="text-xs text-gray-600 mt-1">{v.notes}</div> : null}
                      {v.prepTimeMins ? (
                        <div className="text-xs text-gray-500 mt-1">
                          Prep time: {v.prepTimeMins} mins
                        </div>
                      ) : null}
                    </div>

                    <div className="text-sm font-extrabold text-emerald-800 whitespace-nowrap">
                      {v.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing + Quantity */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-600">Unit Price</div>
                <div className="text-lg font-extrabold text-gray-900">
                  {selectedVariant?.price}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  (Fixed price — customer cannot edit)
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-gray-600">Total</div>
                <div className="text-2xl font-extrabold text-emerald-800">
                  {formatMoney(total)}
                </div>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-700">
                Quantity {isKgLabel(selectedVariant?.sizeLabel || "") ? "(kg)" : "(packs)"}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(step, Math.round((q - step) * 100) / 100))}
                  disabled={qty <= step}
                  className={`h-9 w-9 rounded-lg border text-lg font-bold ${
                    qty <= step
                      ? "border-gray-100 bg-white text-gray-300"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  −
                </button>

                <input
                  className="h-9 w-20 rounded-lg border border-gray-200 text-center text-sm outline-none"
                  value={qty}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isNaN(v) || v <= 0) return;
                    setQty(v);
                  }}
                />

                <button
                  type="button"
                  onClick={() => setQty((q) => Math.round((q + step) * 100) / 100)}
                  className="h-9 w-9 rounded-lg border border-gray-200 bg-white text-lg font-bold hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Order CTA */}
          <div className="flex justify-end">
            <Link
              href={buildOrderLink({
                fishName: selectedFish?.name ?? "Fish",
                service: selectedService,
                sizeLabel: selectedVariant?.sizeLabel ?? "",
                unitPriceText: selectedVariant?.price ?? "",
                qty,
                total,
              })}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-800 transition"
            >
              Order Now • {formatMoney(total)}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
