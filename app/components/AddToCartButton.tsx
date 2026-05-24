"use client";

import { useEffect, useState } from "react";
import { useCart } from "../store/cart";

type Props = {
  product: {
    id: string;
    name_en: string;
    unitLabel: string;
    price: number;
    stockQty: number;
    imageUrl?: string | null;
  };
  qty?: number;
  variant?: {
    variantKey: string;
    variantLabel?: string;
    activeFishTab?: "TENDER_SEEDS" | "BULK_LOTS" | "FAMILY_PACKS";
    requireSelection?: boolean;
  };
};

export default function AddToCartButton({
  product,
  qty = 1,
  variant,
}: Props) {
  const { addItem, error, clearError } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(t);
  }, [added]);

  const disabled =
    !!variant?.requireSelection || Number(product.stockQty) <= 0 || Number(qty) <= 0;

  function handleAdd() {
    if (disabled) return;

    clearError();

    addItem(
      {
        productId: product.id,
        variantKey: variant?.variantKey ?? "base",
        variantLabel: variant?.variantLabel ?? "",
        nameSnapshot: product.name_en,
        unitSnapshot: product.unitLabel,
        priceEach: Number(product.price),
        stockQty: Number(product.stockQty),
        imageUrl: product.imageUrl ?? null,
      },
      Math.max(1, Number(qty) || 1)
    );

    setAdded(true);
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={handleAdd}
        className={
          disabled
            ? "flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-zinc-300 px-4 py-3 text-sm font-bold text-white shadow-sm"
            : "flex w-full items-center justify-center rounded-2xl bg-green-800 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-900 active:scale-[0.99]"
        }
      >
        <span className="inline-flex items-center gap-2">
          <span>{disabled ? "⚠️" : "🛒"}</span>
          <span>{disabled ? "Select option first" : "Add to Cart"}</span>
        </span>
      </button>

      {added && (
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md">
          Added to cart ✓
        </div>
      )}

      {!!error && (
        <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}