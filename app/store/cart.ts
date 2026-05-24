import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;

  // Variant support
  variantKey: string;
  variantLabel?: string;

  // Snapshots
  nameSnapshot: string;
  unitSnapshot: string;
  priceEach: number;

  // Inventory reference
  stockQty: number;

  qty: number;
  lineTotal: number;

  imageUrl?: string | null;
};

type CartState = {
  items: CartItem[];
  error: string | null;

  clearError: () => void;

  addItem: (item: Omit<CartItem, "qty" | "lineTotal">, qty?: number) => void;
  removeItem: (productId: string, variantKey?: string) => void;
  setQty: (productId: string, qty: number, variantKey?: string) => void;

  clear: () => void;
  clearCart: () => void;

  subtotal: () => number;
};

const toInt = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.floor(n);
};

const toMoney = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const keyOf = (productId: string, variantKey?: string) =>
  `${productId}::${variantKey ?? "base"}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      error: null,

      clearError: () => set({ error: null }),

      addItem: (incomingRaw, qtyRaw = 1) =>
        set((state) => {
          const incoming = {
            ...incomingRaw,
            variantKey: incomingRaw.variantKey ?? "base",
            priceEach: toMoney(incomingRaw.priceEach, 0),
            stockQty: toInt(incomingRaw.stockQty, 0),
          };

          const qty = Math.max(1, toInt(qtyRaw, 1));

          if (incoming.stockQty <= 0) {
            return { ...state, error: "Out of stock" };
          }

          const k = keyOf(incoming.productId, incoming.variantKey);

          const existing = state.items.find(
            (i) => keyOf(i.productId, i.variantKey) === k
          );

          if (existing) {
            const desiredQty = toInt(existing.qty, 1) + qty;
            const cappedQty = Math.min(desiredQty, incoming.stockQty);

            if (cappedQty === existing.qty) {
              return { ...state, error: `Only ${incoming.stockQty} available` };
            }

            return {
              items: state.items.map((i) =>
                keyOf(i.productId, i.variantKey) === k
                  ? {
                      ...i,
                      stockQty: incoming.stockQty,
                      priceEach: incoming.priceEach,
                      qty: cappedQty,
                      lineTotal: cappedQty * incoming.priceEach,
                      variantLabel: incoming.variantLabel ?? i.variantLabel,
                    }
                  : i
              ),
              error: null,
            };
          }

          const firstQty = Math.min(qty, incoming.stockQty);

          return {
            items: [
              ...state.items,
              {
                ...incoming,
                qty: firstQty,
                lineTotal: firstQty * incoming.priceEach,
              },
            ],
            error: null,
          };
        }),

      removeItem: (productId, variantKey = "base") =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              keyOf(i.productId, i.variantKey) !== keyOf(productId, variantKey)
          ),
        })),

      setQty: (productId, qtyRaw, variantKey = "base") =>
        set((state) => {
          const k = keyOf(productId, variantKey);
          const item = state.items.find((i) => keyOf(i.productId, i.variantKey) === k);
          if (!item) return state;

          const qty = toInt(qtyRaw, item.qty);

          // zero or less => remove item
          if (qty <= 0) {
            return {
              items: state.items.filter(
                (i) => keyOf(i.productId, i.variantKey) !== k
              ),
              error: null,
            };
          }

          const capped = Math.min(qty, toInt(item.stockQty, 0));

          return {
            items: state.items.map((i) =>
              keyOf(i.productId, i.variantKey) === k
                ? { ...i, qty: capped, lineTotal: capped * toMoney(i.priceEach, 0) }
                : i
            ),
            error: qty > item.stockQty ? `Only ${item.stockQty} available` : null,
          };
        }),

      clear: () => set({ items: [], error: null }),
      clearCart: () => set({ items: [], error: null }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + toMoney(i.lineTotal, 0), 0),
    }),
    { name: "scf_cart_v3" }
  )
);