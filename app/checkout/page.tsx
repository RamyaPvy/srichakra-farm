"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../store/cart";

type DeliveryType = "PICKUP" | "DELIVERY";

function formatMoneyINR(amt: number): string {
  if (!Number.isFinite(amt)) return "—";
  const hasDecimals = Math.abs(amt - Math.round(amt)) > 1e-9;
  return hasDecimals ? `Rs. ${amt.toFixed(2)}` : `Rs. ${Math.round(amt)}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function isValidPhone(phone: string) {
  const normalized = normalizePhone(phone);
  return normalized.length >= 10 && normalized.length <= 15;
}

function isValidPincode(pincode: string) {
  return /^\d{6}$/.test(pincode.trim());
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("DELIVERY");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [preferredSlot, setPreferredSlot] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sub = useMemo(() => subtotal(), [subtotal]);
  const deliveryFee = 0;
  const totalAmount = sub + deliveryFee;

  async function placeOrder() {
    setErr(null);

    if (!items.length) {
      setErr("Cart is empty.");
      return;
    }

    if (!customerName.trim()) {
      setErr("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      setErr("Phone number is required.");
      return;
    }

    if (!isValidPhone(phone)) {
      setErr("Please enter a valid phone number.");
      return;
    }

    if (deliveryType === "DELIVERY") {
      if (!addressLine1.trim()) {
        setErr("Delivery address is required.");
        return;
      }
      if (!city.trim()) {
        setErr("City is required for delivery.");
        return;
      }
      if (!pincode.trim()) {
        setErr("Pincode is required for delivery.");
        return;
      }
      if (!isValidPincode(pincode)) {
        setErr("Please enter a valid 6-digit pincode.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email: email || null,
          language,
          deliveryType,
          addressLine1: deliveryType === "DELIVERY" ? addressLine1 : null,
          addressLine2: deliveryType === "DELIVERY" ? addressLine2 : null,
          landmark: deliveryType === "DELIVERY" ? landmark : null,
          city: deliveryType === "DELIVERY" ? city : null,
          state: deliveryType === "DELIVERY" ? stateName : null,
          pincode: deliveryType === "DELIVERY" ? pincode : null,
          mapLink: deliveryType === "DELIVERY" ? mapLink : null,
          preferredSlot: preferredSlot || null,
          notes: notes || null,
          paymentMethod: "COD",
          items: items.map((x) => ({
            productId: x.productId,
            qty: x.qty,
            variantKey: x.variantKey,
            variantLabel: x.variantLabel ?? "",
            priceEach: x.priceEach,
            nameSnapshot: x.nameSnapshot,
            unitSnapshot: x.unitSnapshot,
            imageUrl: x.imageUrl ?? null,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to place order");
      }

      clear();
      router.push(`/order-success/${data.order.id}`);
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="grid max-w-xl gap-4">
          <input
            className="h-11 rounded-xl border px-3"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="h-11 rounded-xl border px-3"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="h-11 rounded-xl border px-3"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="h-11 rounded-xl border px-3"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="hi">Hindi</option>
          </select>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType("DELIVERY")}
              className={`rounded-xl border px-4 py-2 ${
                deliveryType === "DELIVERY" ? "bg-black text-white" : ""
              }`}
            >
              Home Delivery
            </button>

            <button
              type="button"
              onClick={() => setDeliveryType("PICKUP")}
              className={`rounded-xl border px-4 py-2 ${
                deliveryType === "PICKUP" ? "bg-black text-white" : ""
              }`}
            >
              Pickup
            </button>
          </div>

          {deliveryType === "DELIVERY" && (
            <>
              <input
                className="h-11 rounded-xl border px-3"
                placeholder="Delivery Address *"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />

              <input
                className="h-11 rounded-xl border px-3"
                placeholder="Address Line 2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />

              <input
                className="h-11 rounded-xl border px-3"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />

              <div className="grid gap-3 md:grid-cols-3">
                <input
                  className="h-11 rounded-xl border px-3"
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <input
                  className="h-11 rounded-xl border px-3"
                  placeholder="State"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />

                <input
                  className="h-11 rounded-xl border px-3"
                  placeholder="Pincode *"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </div>

              <input
                className="h-11 rounded-xl border px-3"
                placeholder="Google Maps Link (optional)"
                value={mapLink}
                onChange={(e) => setMapLink(e.target.value)}
              />
            </>
          )}

          <input
            className="h-11 rounded-xl border px-3"
            placeholder="Preferred Slot (optional)"
            value={preferredSlot}
            onChange={(e) => setPreferredSlot(e.target.value)}
          />

          <textarea
            className="min-h-24 rounded-xl border p-3"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            disabled={loading}
            onClick={placeOrder}
            className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Placing Order..." : `Place Order (${formatMoneyINR(totalAmount)})`}
          </button>
        </div>

        <div className="h-fit rounded-2xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}::${item.variantKey}`}
                className="flex items-start justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">{item.nameSnapshot}</p>
                  {item.variantLabel ? (
                    <p className="text-xs text-zinc-600">{item.variantLabel}</p>
                  ) : null}
                  <p className="text-sm text-zinc-600">
                    Qty: {item.qty} {item.unitSnapshot}
                  </p>
                </div>
                <p className="font-medium">{formatMoneyINR(item.lineTotal)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoneyINR(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatMoneyINR(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatMoneyINR(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}