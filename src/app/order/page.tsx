"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

function suggestBuyerType(category: string, type: string) {
  const t = (type || "").toLowerCase();
  const c = (category || "").toLowerCase();

  if (c === "fish") {
    if (t === "seed") return "Tender (Seed Buyer / Tender)";
    if (t === "bulk") return "Wholesale (Bulk Buyer)";
    if (t === "fresh" || t === "family") return "Family (Home Cooking)";
    return "Fish Buyer";
  }

  if (c === "sheep") {
    if (t === "live") return "Live Sheep Buyer";
    if (t === "mutton") return "Mutton (kg) Buyer";
    return "Sheep Buyer";
  }

  if (c === "vegetables") return "Vegetable Buyer";
  return "Buyer";
}

// extract first number from strings like "₹320/kg" or "500/kg" or "₹280"
function parsePriceNumber(text: string) {
  const m = (text || "").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function formatMoney(n: number) {
  if (Number.isNaN(n)) return "";
  const val = Math.round(n * 100) / 100;
  return `₹${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}`;
}

export default function OrderPage() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const itemFromUrl = searchParams.get("item") || "";

  // coming from Family Packs Tab
  const unitPriceFromUrl = searchParams.get("unitPrice") || ""; // e.g. ₹320/kg
  const qtyFromUrl = searchParams.get("qty") || ""; // e.g. "1" or "1.5"
  const totalFromUrl = searchParams.get("total") || ""; // e.g. "₹640"

  // form states
  const [item, setItem] = useState(itemFromUrl);
  const [buyerType, setBuyerType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // qty as string (to store in DB easily)
  const [qty, setQty] = useState(qtyFromUrl || "");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // new fields
  const [unitPrice, setUnitPrice] = useState(unitPriceFromUrl || "");
  const [total, setTotal] = useState(totalFromUrl || "");

  const buyerTypeSuggestion = useMemo(
    () => suggestBuyerType(category, type),
    [category, type]
  );

  // init from url
  useEffect(() => {
    setItem(itemFromUrl);
    setBuyerType((prev) => (prev?.trim() ? prev : buyerTypeSuggestion));

    if (unitPriceFromUrl) setUnitPrice(unitPriceFromUrl);
    if (qtyFromUrl) setQty(qtyFromUrl);
    if (totalFromUrl) setTotal(totalFromUrl);

    setNotes((prev) => {
      if (prev?.trim()) return prev;
      const typeLine = type ? `Selected Type: ${type}` : "";
      const catLine = category ? `Category: ${category}` : "";
      const base = [catLine, typeLine].filter(Boolean).join(" | ");
      return base ? base + "\n" : "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemFromUrl, buyerTypeSuggestion, category, type]);

  // auto-recalculate total when qty/unitPrice change (especially for family packs)
  useEffect(() => {
    const qNum = Number(qty);
    const pNum = parsePriceNumber(unitPrice);

    if (!qty || Number.isNaN(qNum) || qNum <= 0 || !unitPrice || pNum <= 0) {
      // keep whatever user typed if no valid calc
      return;
    }
    setTotal(formatMoney(qNum * pNum));
  }, [qty, unitPrice]);

  async function saveOrder() {
    if (!phone || !qty || !location) {
      alert("Please fill required fields: Phone, Quantity, Location");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item,
        buyerType,
        name,
        phone,
        qty,
        location,
        notes,
        unitPrice,
        total,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert("Failed to save order.\n\n" + err);
      return;
    }

    alert("✅ Order saved successfully!");
  }

  function whatsappOrder() {
    const FARM_WHATSAPP = "919999999999"; // TODO: replace

    const message = `SriChakra Farm Order Request
Category: ${category || "-"}
Type: ${type || "-"}
Item: ${item || "-"}
Buyer Type: ${buyerType || "-"}
Name: ${name || "-"}
Phone: ${phone || "-"}
Quantity: ${qty || "-"}
Unit Price: ${unitPrice || "-"}
Total: ${total || "-"}
Location: ${location || "-"}
Notes: ${notes || "-"}`;

    window.open(
      `https://wa.me/${FARM_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function callNow() {
    window.location.href = "tel:+919999999999"; // TODO: replace
  }

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader title="Place Order" backHref="/" />

      <div className="mx-auto max-w-md px-4 py-5 space-y-4">
        {/* Selected Item Summary */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold text-gray-900">Selected Item</div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              {category || "Order"}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-700">
            <div>
              <span className="font-semibold text-gray-900">Category:</span>{" "}
              {category || "-"}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Type:</span>{" "}
              {type || "-"}
            </div>
            <div>
              <span className="font-semibold text-gray-900">Item:</span>{" "}
              {item || "-"}
            </div>

            {(unitPrice || total) && (
              <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-900">Unit Price:</span>{" "}
                    {unitPrice || "-"}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold text-gray-900">Total:</span>{" "}
                    <span className="font-extrabold text-emerald-800">{total || "-"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-3">
          <Field label="Item">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </Field>

          <Field label="Buyer Type">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Buyer Type"
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value)}
            />
            <div className="mt-1 text-xs text-gray-500">
              Suggested: <span className="font-semibold">{buyerTypeSuggestion}</span>
            </div>
          </Field>

          <Field label="Your Name">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label="Phone Number *">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Phone Number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          {/* Quantity */}
          <Field label="Quantity * (kg / pack count)">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Quantity * (kg / pack count)"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </Field>

          {/* Unit price */}
          <Field label="Unit Price (optional)">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="e.g., ₹320/kg"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </Field>

          {/* Total */}
          <Field label="Total (auto for family packs)">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="e.g., ₹640"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
            <div className="mt-1 text-xs text-gray-500">
              Tip: If you change Quantity or Unit Price, Total will auto update.
            </div>
          </Field>

          <Field label="Village / City *">
            <input
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Village / City *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              className="w-full min-h-[90px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="Notes (delivery time, size preference, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          {/* Actions */}
          <button
            onClick={saveOrder}
            className="w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition"
          >
            💾 Save Order
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={callNow}
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition"
            >
              📞 Call Now
            </button>

            <button
              onClick={whatsappOrder}
              className="w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition"
            >
              💬 WhatsApp
            </button>
          </div>

          <div className="pt-2 text-xs text-gray-500">
            Tip: For rural users, “Call Now” is easiest. For online users,
            WhatsApp helps with details and confirmation.
          </div>
        </div>

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-sm font-semibold text-gray-800">{label}</div>
      {children}
    </div>
  );
}
