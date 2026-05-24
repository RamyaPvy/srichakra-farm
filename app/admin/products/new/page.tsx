"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

    const payload: any = {
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
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Failed to create product"}`);
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
        {/* Keep the remaining JSX exactly as your current form structure */}
      </form>
    </div>
  );
}