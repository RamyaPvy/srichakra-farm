"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "../../../components/helpers";
import CloudImagePicker from "../CloudImagePicker";

type Category = "FISH" | "SHEEP" | "VEGETABLES" | "RICE";
type FishTab = "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS";
type SheepKind = "YOUNG_LAMB" | "ADULT_SHEEP" | "MUTTON";

type TenderSeedSize = "1-1.5 inch" | "3 inch" | "5 inch";
type FishType =
  | "ROHU"
  | "CATLA"
  | "GRASS"
  | "GOLDEN"
  | "COMMON_CARP"
  | "MIRROR_CARP";

type BulkType = "POND_STOCK" | "MARKET_BULK";

type ProductPayload = {
  category: Category;
  fishTab: FishTab | null;
  name_en: string;
  name_te: string | null;
  name_hi: string | null;
  unitLabel: string;
  price: number;
  stockQty: number;
  imageUrl: string | null;
  isActive: boolean;
  metaJson: Record<string, unknown> | null;
};

const FISH_TYPES: FishType[] = [
  "ROHU",
  "CATLA",
  "GRASS",
  "GOLDEN",
  "COMMON_CARP",
  "MIRROR_CARP",
];

const TENDER_SEED_SIZES: TenderSeedSize[] = ["1-1.5 inch", "3 inch", "5 inch"];

const FAMILY_SERVICES = [
  "RAW",
  "CLEANED",
  "CURRY_CUT",
  "FRY_CUT",
  "PICKLE_CUT",
];

const MUTTON_SERVICES = [
  "RAW_MIX",
  "HEAD",
  "LEGS",
  "LIVER",
  "INTESTINES",
  "BONLESS",
  "CURRY",
  "FRY",
  "PICKLE",
];

function titleize(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function ServicePriceFields({
  services,
  prices,
  prepMinutes,
  onPriceChange,
  onPrepChange,
}: {
  services: readonly string[];
  prices: Record<string, string>;
  prepMinutes: Record<string, string>;
  onPriceChange: (service: string, value: string) => void;
  onPrepChange: (service: string, value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <div key={service} className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-zinc-700">
            {titleize(service)} extra charge (₹)
            <input
              type="number"
              min="0"
              value={prices[service]}
              onChange={(event) => onPriceChange(service, event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Prep time (minutes)
            <input
              type="number"
              min="0"
              value={prepMinutes[service]}
              onChange={(event) => onPrepChange(service, event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default function NewProductPage() {
  const router = useRouter();

  const [category, setCategory] = useState<Category>("FISH");
  const [fishTab, setFishTab] = useState<FishTab>("TENDER_SEEDS");
  const [sheepKind, setSheepKind] = useState<SheepKind>("YOUNG_LAMB");

  const [nameEn, setNameEn] = useState("");
  const [nameTe, setNameTe] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [unitLabel, setUnitLabel] = useState("kg");
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [fishType, setFishType] = useState<FishType>("ROHU");
  const [sizeLabel, setSizeLabel] = useState<TenderSeedSize>("1-1.5 inch");
  const [countPerPack, setCountPerPack] = useState("");
  const [perFishPrice, setPerFishPrice] = useState("");

  const [bulkType, setBulkType] = useState<BulkType>("POND_STOCK");
  const [minOrderKg, setMinOrderKg] = useState("");
  const [minFishKg, setMinFishKg] = useState("");
  const [maxFishKg, setMaxFishKg] = useState("");

  const [familyServicePrices, setFamilyServicePrices] = useState<Record<string, string>>(
    Object.fromEntries(FAMILY_SERVICES.map((s) => [s, "0"]))
  );
  const [familyServicePrep, setFamilyServicePrep] = useState<Record<string, string>>(
    Object.fromEntries(FAMILY_SERVICES.map((s) => [s, "0"]))
  );

  const [sheepId, setSheepId] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [videoCallAvailable, setVideoCallAvailable] = useState(true);

  const [muttonServicePrices, setMuttonServicePrices] = useState<Record<string, string>>(
    Object.fromEntries(MUTTON_SERVICES.map((s) => [s, "0"]))
  );
  const [muttonServicePrep, setMuttonServicePrep] = useState<Record<string, string>>(
    Object.fromEntries(MUTTON_SERVICES.map((s) => [s, "0"]))
  );
  const [muttonMinOrderKg, setMuttonMinOrderKg] = useState("1");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const vegetableAssetOptions = [
    { label: "Tomato", value: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=1200&q=85" },
    { label: "Green Chilli", value: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg/1280px-Very_small_round_shaped_green_chili_peppers_from_West_Bengal%2C_India%2C_photographed_on_December_22%2C_2023.jpg" },
    { label: "Spinach", value: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=85" },
    { label: "Cucumber", value: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=1200&q=85" },
    { label: "Onion", value: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=1200&q=85" },
  ];

  const effectiveUnitLabel = useMemo(() => {
    if (category === "FISH") {
      if (fishTab === "TENDER_SEEDS") return "pack";
      return "kg";
    }

    if (category === "SHEEP") {
      if (sheepKind === "MUTTON") return "kg";
      return "each";
    }

    return unitLabel.trim() || "kg";
  }, [category, fishTab, sheepKind, unitLabel]);

  const suggestedName = useMemo(() => {
    if (category === "FISH") {
      if (fishTab === "TENDER_SEEDS") {
        return `${titleize(fishType)} Tender Seeds - ${sizeLabel}`;
      }
      if (fishTab === "BULK_LOTS") {
        return `${titleize(fishType)} ${bulkType === "POND_STOCK" ? "Pond Stock" : "Market Bulk"}`;
      }
      return `${titleize(fishType)} Family Pack`;
    }

    if (category === "SHEEP") {
      if (sheepKind === "YOUNG_LAMB") return sheepId ? `Young Lamb - ${sheepId}` : "Young Lamb";
      if (sheepKind === "ADULT_SHEEP") return sheepId ? `Adult Sheep - ${sheepId}` : "Adult Sheep";
      return "Premium Mutton";
    }

    return "";
  }, [category, fishTab, fishType, sizeLabel, bulkType, sheepKind, sheepId]);

  function parseIntSafe(value: string, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
  }

  function parseNumSafe(value: string, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function updateFamilyPrice(service: string, value: string) {
    setFamilyServicePrices((prev) => ({ ...prev, [service]: value }));
  }

  function updateFamilyPrep(service: string, value: string) {
    setFamilyServicePrep((prev) => ({ ...prev, [service]: value }));
  }

  function updateMuttonPrice(service: string, value: string) {
    setMuttonServicePrices((prev) => ({ ...prev, [service]: value }));
  }

  function updateMuttonPrep(service: string, value: string) {
    setMuttonServicePrep((prev) => ({ ...prev, [service]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const finalName = nameEn.trim() || suggestedName.trim();

    if (!finalName) {
      setMsg("❌ Product name is required.");
      return;
    }

    const finalPrice = parseIntSafe(price, 0);
    const finalStock = parseIntSafe(stockQty, 0);

    if (finalPrice < 0) {
      setMsg("❌ Price must be 0 or more.");
      return;
    }

    if (finalStock < 0) {
      setMsg("❌ Stock must be 0 or more.");
      return;
    }

    const payload: ProductPayload = {
      category,
      fishTab: category === "FISH" ? fishTab : null,
      name_en: finalName,
      name_te: nameTe.trim() || null,
      name_hi: nameHi.trim() || null,
      unitLabel: effectiveUnitLabel,
      price: finalPrice,
      stockQty: finalStock,
      imageUrl: imageUrl.trim() || null,
      isActive,
      metaJson: null,
    };

    if (category === "FISH") {
      if (fishTab === "TENDER_SEEDS") {
        if (parseIntSafe(countPerPack, 0) <= 0) {
          setMsg("❌ Count per pack must be greater than 0.");
          return;
        }

        payload.metaJson = {
          fishType,
          sizeLabel,
          countPerPack: parseIntSafe(countPerPack, 0),
          perFishPrice: parseNumSafe(perFishPrice, 0),
          packPriceExact: finalPrice,
        };
      }

      if (fishTab === "BULK_LOTS") {
        payload.metaJson = {
          fishType,
          bulkType,
          minOrderKg: Math.max(1, parseIntSafe(minOrderKg, 1)),
          minFishKg: parseNumSafe(minFishKg, 0),
          maxFishKg: parseNumSafe(maxFishKg, 0),
        };
      }

      if (fishTab === "FAMILY_PACKS") {
        payload.metaJson = {
          fishType,
          services: FAMILY_SERVICES,
          extraCharges: Object.fromEntries(
            FAMILY_SERVICES.map((s) => [s, parseIntSafe(familyServicePrices[s], 0)])
          ),
          prepMinutes: Object.fromEntries(
            FAMILY_SERVICES.map((s) => [s, parseIntSafe(familyServicePrep[s], 0)])
          ),
        };
      }
    }

    if (category === "SHEEP") {
      if (sheepKind === "YOUNG_LAMB" || sheepKind === "ADULT_SHEEP") {
        payload.metaJson = {
          kind: sheepKind,
          sheepId: sheepId.trim(),
          ageMonths: parseIntSafe(ageMonths, 0),
          weightKg: parseNumSafe(weightKg, 0),
          whatsappNumber: whatsappNumber.trim() || null,
          videoCallAvailable,
        };
      }

      if (sheepKind === "MUTTON") {
        payload.metaJson = {
          kind: "MUTTON",
          services: MUTTON_SERVICES,
          extraCharges: Object.fromEntries(
            MUTTON_SERVICES.map((s) => [s, parseIntSafe(muttonServicePrices[s], 0)])
          ),
          prepMinutes: Object.fromEntries(
            MUTTON_SERVICES.map((s) => [s, parseIntSafe(muttonServicePrep[s], 0)])
          ),
          minOrderKg: Math.max(1, parseIntSafe(muttonMinOrderKg, 1)),
          whatsappNumber: whatsappNumber.trim() || null,
        };
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create product");
      }

      setMsg("✅ Product created successfully.");
      router.push("/admin/products");
    } catch (error: unknown) {
      setMsg(`❌ ${getErrorMessage(error, "Failed to create product")}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Add Fish, Sheep, Vegetables, or Rice inventory for customer ordering.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
        >
          Back to Inventory
        </Link>
      </div>

      {msg && <div className="mt-4 rounded-xl border px-4 py-3 text-sm">{msg}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-4 text-sm font-bold text-zinc-900">Basic product details</div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              >
                <option value="FISH">Fish</option>
                <option value="SHEEP">Sheep</option>
                <option value="VEGETABLES">Vegetables</option>
                <option value="RICE">Rice</option>
              </select>
            </label>

            {category === "FISH" && (
              <label className="block text-sm font-medium text-zinc-700">
                Fish tab
                <select
                  value={fishTab}
                  onChange={(e) => setFishTab(e.target.value as FishTab)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  <option value="TENDER_SEEDS">Tender Seeds</option>
                  <option value="BULK_LOTS">Bulk Lots</option>
                  <option value="FAMILY_PACKS">Family Packs</option>
                </select>
              </label>
            )}

            {category === "SHEEP" && (
              <label className="block text-sm font-medium text-zinc-700">
                Sheep kind
                <select
                  value={sheepKind}
                  onChange={(e) => setSheepKind(e.target.value as SheepKind)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  <option value="YOUNG_LAMB">Young Lamb</option>
                  <option value="ADULT_SHEEP">Adult Sheep</option>
                  <option value="MUTTON">Mutton</option>
                </select>
              </label>
            )}

            <label className="block text-sm font-medium text-zinc-700 md:col-span-2">
              Product name
              <input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={suggestedName || "Tomatoes - Fresh"}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Telugu name
              <input
                value={nameTe}
                onChange={(e) => setNameTe(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Hindi name
              <input
                value={nameHi}
                onChange={(e) => setNameHi(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Unit label
              <input
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Price (₹)
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700">
              Stock quantity
              <input
                type="number"
                min="0"
                value={stockQty}
                onChange={(e) => setStockQty(e.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 md:col-span-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              Publish this product on customer pages
            </label>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3 text-sm font-bold text-zinc-900">Image setup</div>
          <CloudImagePicker value={imageUrl} onUpload={setImageUrl} />

          {category === "VEGETABLES" && (
            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Suggested product photos
              </div>
              <div className="flex flex-wrap gap-2">
                {vegetableAssetOptions.map((option) => {
                  const active = imageUrl === option.value;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setImageUrl(option.value)}
                      className={
                        active
                          ? "rounded-full bg-green-800 px-3 py-1.5 text-xs font-bold text-white"
                          : "rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-700"
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <label className="block text-sm font-medium text-zinc-700">
            Image URL / local asset path
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={category === "VEGETABLES" ? "/products/vegetables/tomato.svg" : "https://example.com/image.jpg"}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </label>

          {imageUrl && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
              <Image
                src={imageUrl}
                alt="Product image preview"
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="text-xs text-zinc-600">
                This image will be used for the product card and product detail page.
              </div>
            </div>
          )}
        </div>

        {category === "FISH" && fishTab === "TENDER_SEEDS" && (
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 text-sm font-bold text-zinc-900">Tender seed details</div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-zinc-700">
                Fish type
                <select
                  value={fishType}
                  onChange={(e) => setFishType(e.target.value as FishType)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  {FISH_TYPES.map((t) => (
                    <option key={t} value={t}>{titleize(t)}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Size label
                <select
                  value={sizeLabel}
                  onChange={(e) => setSizeLabel(e.target.value as TenderSeedSize)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  {TENDER_SEED_SIZES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Count per pack
                <input
                  type="number"
                  min="1"
                  value={countPerPack}
                  onChange={(e) => setCountPerPack(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Per fish price (₹)
                <input
                  type="number"
                  min="0"
                  value={perFishPrice}
                  onChange={(e) => setPerFishPrice(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>
            </div>
          </div>
        )}

        {category === "FISH" && fishTab === "BULK_LOTS" && (
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 text-sm font-bold text-zinc-900">Bulk lot details</div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-zinc-700">
                Fish type
                <select
                  value={fishType}
                  onChange={(e) => setFishType(e.target.value as FishType)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  {FISH_TYPES.map((t) => (
                    <option key={t} value={t}>{titleize(t)}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Bulk type
                <select
                  value={bulkType}
                  onChange={(e) => setBulkType(e.target.value as BulkType)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                >
                  <option value="POND_STOCK">Pond Stock</option>
                  <option value="MARKET_BULK">Market Bulk</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Minimum order kg
                <input
                  type="number"
                  min="1"
                  value={minOrderKg}
                  onChange={(e) => setMinOrderKg(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700">
                Minimum fish kg
                <input
                  type="number"
                  min="0"
                  value={minFishKg}
                  onChange={(e) => setMinFishKg(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>

              <label className="block text-sm font-medium text-zinc-700 md:col-span-2">
                Maximum fish kg
                <input
                  type="number"
                  min="0"
                  value={maxFishKg}
                  onChange={(e) => setMaxFishKg(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>
            </div>
          </div>
        )}

        {category === "FISH" && fishTab === "FAMILY_PACKS" && (
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 text-sm font-bold text-zinc-900">Family pack services</div>
            <label className="mb-4 block text-sm font-medium text-zinc-700">
              Fish type
              <select
                value={fishType}
                onChange={(event) => setFishType(event.target.value as FishType)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              >
                {FISH_TYPES.map((type) => (
                  <option key={type} value={type}>{titleize(type)}</option>
                ))}
              </select>
            </label>
            <ServicePriceFields
              services={FAMILY_SERVICES}
              prices={familyServicePrices}
              prepMinutes={familyServicePrep}
              onPriceChange={updateFamilyPrice}
              onPrepChange={updateFamilyPrep}
            />
          </div>
        )}

        {category === "SHEEP" && (
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 text-sm font-bold text-zinc-900">Sheep details</div>
            <div className="grid gap-4 md:grid-cols-2">
              {sheepKind !== "MUTTON" && (
                <>
                  <label className="block text-sm font-medium text-zinc-700">
                    Sheep ID
                    <input
                      value={sheepId}
                      onChange={(e) => setSheepId(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                    />
                  </label>

                  <label className="block text-sm font-medium text-zinc-700">
                    Age (months)
                    <input
                      type="number"
                      min="0"
                      value={ageMonths}
                      onChange={(e) => setAgeMonths(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                    />
                  </label>

                  <label className="block text-sm font-medium text-zinc-700">
                    Weight (kg)
                    <input
                      type="number"
                      min="0"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                    />
                  </label>
                </>
              )}

              <label className="block text-sm font-medium text-zinc-700">
                WhatsApp number
                <input
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />
              </label>

              {sheepKind !== "MUTTON" && (
                <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={videoCallAvailable}
                    onChange={(e) => setVideoCallAvailable(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Video call available
                </label>
              )}
            </div>
          </div>
        )}

        {category === "SHEEP" && sheepKind === "MUTTON" && (
          <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3 text-sm font-bold text-zinc-900">Mutton services</div>
            <label className="mb-4 block text-sm font-medium text-zinc-700">
              Minimum order (kg)
              <input
                type="number"
                min="1"
                value={muttonMinOrderKg}
                onChange={(event) => setMuttonMinOrderKg(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </label>
            <ServicePriceFields
              services={MUTTON_SERVICES}
              prices={muttonServicePrices}
              prepMinutes={muttonServicePrep}
              onPriceChange={updateMuttonPrice}
              onPrepChange={updateMuttonPrep}
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-green-800 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {submitting ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}