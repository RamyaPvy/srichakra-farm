"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

function formatMoneyINR(amt: number): string {
  if (!Number.isFinite(amt)) return "—";
  const hasDecimals = Math.abs(amt - Math.round(amt)) > 1e-9;
  return hasDecimals ? `Rs. ${amt.toFixed(2)}` : `Rs. ${Math.round(amt)}`;
}

export default function CartPage() {
  const { items, setQty, removeItem, subtotal, error, clearError, clearCart } = useCart();

  const sub = subtotal();
  const deliveryFee = 0;
  const total = sub + deliveryFee;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Cart</h1>
        <div className="flex items-center gap-3">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clearCart}
              className="text-sm text-red-600 underline"
            >
              Clear cart
            </button>
          ) : null}
          <Link className="text-sm underline" href="/">
            Continue shopping
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border bg-white p-4 text-sm">
          <div className="font-semibold text-red-600">{error}</div>
          <button
            type="button"
            onClick={clearError}
            className="mt-2 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-gray-600">Add items to continue to checkout.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((x) => (
              <div key={`${x.productId}::${x.variantKey}`} className="rounded-2xl border bg-white p-4">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {x.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={x.imageUrl} alt={x.nameSnapshot} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-600">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="break-words text-lg font-semibold">{x.nameSnapshot}</p>

                        {x.variantLabel ? (
                          <p className="mt-1 break-words text-xs font-semibold text-zinc-700">
                            {x.variantLabel}
                          </p>
                        ) : null}

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {formatMoneyINR(x.priceEach)} / {x.unitSnapshot}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Stock available: {x.stockQty}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(x.productId, x.variantKey)}
                        className="shrink-0 text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          className="h-9 w-9 rounded-xl border bg-white"
                          onClick={() => setQty(x.productId, x.qty - 1, x.variantKey)}
                        >
                          -
                        </button>

                        <input
                          value={x.qty}
                          onChange={(e) =>
                            setQty(x.productId, Number(e.target.value || 0), x.variantKey)
                          }
                          className="h-9 w-20 rounded-xl border px-3 text-center"
                        />

                        <button
                          className="h-9 w-9 rounded-xl border bg-white"
                          onClick={() => setQty(x.productId, x.qty + 1, x.variantKey)}
                        >
                          +
                        </button>
                      </div>

                      <p className="font-extrabold text-zinc-900">
                        {formatMoneyINR(x.lineTotal)}
                      </p>
                    </div>

                    <p className="mt-2 text-[11px] text-zinc-600">
                      Qty is in <b>{x.unitSnapshot}</b> (packs for seeds, kg for bulk/family, each for sheep).
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border bg-white p-5">
            <h2 className="text-lg font-semibold">Bill Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoneyINR(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>{formatMoneyINR(deliveryFee)}</span>
              </div>
              <div className="my-2 flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>{formatMoneyINR(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block w-full rounded-xl bg-black px-4 py-3 text-center font-semibold text-white"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-3 text-xs text-zinc-500">
              Next step: enter customer details and place order.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}