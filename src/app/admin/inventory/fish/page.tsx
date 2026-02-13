"use client";

import { useEffect, useState } from "react";

type FishType = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

type FishVariant = {
  id: string;
  fishTypeId: string;
  serviceType: "RAW" | "CUT" | "COOKED" | "PICKLE";
  sizeLabel: string;
  price: string;
  isAvailable: boolean;
  prepTimeMins: string;
  notes: string;
};

export default function AdminFishPage() {
  const [fishTypes, setFishTypes] = useState<FishType[]>([]);
  const [variants, setVariants] = useState<FishVariant[]>([]);
  const [selectedFishTypeId, setSelectedFishTypeId] = useState<string>("");

  // add fish type form
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // add variant form
  const [serviceType, setServiceType] = useState<FishVariant["serviceType"]>("RAW");
  const [sizeLabel, setSizeLabel] = useState("1 kg");
  const [price, setPrice] = useState("₹0");
  const [notes, setNotes] = useState("");
  const [prepTimeMins, setPrepTimeMins] = useState("");

  async function loadFishTypes() {
    const res = await fetch("/api/admin/fish-types", { cache: "no-store" });
    const data = await res.json();
    const list: FishType[] = data?.fishTypes ?? [];
    setFishTypes(list);
    if (!selectedFishTypeId && list.length) setSelectedFishTypeId(list[0].id);
  }

  async function loadVariants(fishTypeId: string) {
    const res = await fetch(`/api/admin/fish-variants?fishTypeId=${fishTypeId}`, { cache: "no-store" });
    const data = await res.json();
    setVariants(data?.variants ?? []);
  }

  useEffect(() => {
    loadFishTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedFishTypeId) loadVariants(selectedFishTypeId);
  }, [selectedFishTypeId]);

  async function addFishType() {
    if (!name.trim()) return alert("Enter Fish Type name");
    await fetch("/api/admin/fish-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, isActive: true }),
    });
    setName("");
    setDesc("");
    await loadFishTypes();
  }

  async function addVariant() {
    if (!selectedFishTypeId) return alert("Select Fish Type");
    if (!price.trim()) return alert("Enter price");

    await fetch("/api/admin/fish-variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fishTypeId: selectedFishTypeId,
        serviceType,
        sizeLabel,
        price,
        notes,
        prepTimeMins,
        isAvailable: true,
      }),
    });

    setNotes("");
    setPrepTimeMins("");
    await loadVariants(selectedFishTypeId);
  }

  async function toggleAvailability(v: FishVariant) {
    await fetch(`/api/admin/fish-variants/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !v.isAvailable }),
    });
    await loadVariants(selectedFishTypeId);
  }

  async function deleteVariant(id: string) {
    await fetch(`/api/admin/fish-variants/${id}`, { method: "DELETE" });
    await loadVariants(selectedFishTypeId);
  }

  return (
    <main className="min-h-screen bg-emerald-50 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-xl font-extrabold text-gray-900">Admin • Fish Family Packs</h1>

        {/* Add FishType */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-3">
          <div className="font-bold text-gray-900">Add Fish Type</div>
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
            placeholder="Fish Type Name (Golden Fish / Ravva / Bocha)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            onClick={addFishType}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Save Fish Type
          </button>
        </section>

        {/* Select FishType */}
        <section className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm space-y-3">
          <div className="font-bold text-gray-900">Manage Variants</div>
          <select
            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
            value={selectedFishTypeId}
            onChange={(e) => setSelectedFishTypeId(e.target.value)}
          >
            {fishTypes.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} {f.isActive ? "" : "(Inactive)"}
              </option>
            ))}
          </select>

          {/* Add Variant */}
          <div className="grid grid-cols-2 gap-2">
            <select
              className="rounded-lg border border-gray-200 p-2 text-sm"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value as any)}
            >
              <option value="RAW">RAW</option>
              <option value="CUT">CUT</option>
              <option value="COOKED">COOKED</option>
              <option value="PICKLE">PICKLE</option>
            </select>

            <input
              className="rounded-lg border border-gray-200 p-2 text-sm"
              value={sizeLabel}
              onChange={(e) => setSizeLabel(e.target.value)}
              placeholder="Size (1 kg / 2 kg / 500 g)"
            />

            <input
              className="rounded-lg border border-gray-200 p-2 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (₹320/kg)"
            />

            <input
              className="rounded-lg border border-gray-200 p-2 text-sm"
              value={prepTimeMins}
              onChange={(e) => setPrepTimeMins(e.target.value)}
              placeholder="Prep time mins (only COOKED)"
            />
          </div>

          <textarea
            className="w-full rounded-lg border border-gray-200 p-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (Cleaned + cut pieces / Pickle type / etc.)"
          />

          <button
            onClick={addVariant}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Add Variant
          </button>

          {/* Variants list */}
          <div className="space-y-2">
            {variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2"
              >
                <div className="text-sm">
                  <div className="font-bold text-gray-900">
                    {v.serviceType} • {v.sizeLabel} • {v.price}
                  </div>
                  {v.notes ? <div className="text-xs text-gray-600">{v.notes}</div> : null}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAvailability(v)}
                    className={`rounded-md px-3 py-2 text-xs font-bold ${
                      v.isAvailable ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {v.isAvailable ? "Available" : "Hidden"}
                  </button>

                  <button
                    onClick={() => deleteVariant(v.id)}
                    className="rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {variants.length === 0 ? (
              <div className="text-sm text-gray-600">No variants yet for this fish type.</div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
