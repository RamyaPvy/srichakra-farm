"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { ADMIN_PIN } from "../../../../config/admin";

type VegStatus = "Available" | "Out of Stock";
type VegUnit = "kg" | "bunch" | "piece";
type VegCategory = "Leafy" | "Roots" | "Seasonal" | "Fruits";

type VegetableItem = {
  id: string;
  category: VegCategory | string;
  name: string;
  unit: VegUnit | string;
  price: string;
  availableQty: string;
  status: VegStatus | string;
  notes: string;
  createdAt?: string;
};

const CATEGORY_OPTIONS: VegCategory[] = ["Leafy", "Roots", "Seasonal", "Fruits"];
const UNIT_OPTIONS: VegUnit[] = ["kg", "bunch", "piece"];

export default function AdminVegetablesInventoryPage() {
  const router = useRouter();

  const [items, setItems] = useState<VegetableItem[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<VegCategory | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<VegStatus | "ALL">("ALL");
  const [unitFilter, setUnitFilter] = useState<VegUnit | "ALL">("ALL");

  // form
  const [category, setCategory] = useState<VegCategory>("Seasonal");
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<VegUnit>("kg");
  const [price, setPrice] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [status, setStatus] = useState<VegStatus>("Available");
  const [notes, setNotes] = useState("");

  const loadItems = async () => {
    const res = await fetch("/api/inventory/vegetables", { cache: "no-store" });
    const data = await res.json();
    setItems(Array.isArray(data?.items) ? data.items : []);
  };

  // ✅ Protect with PIN
  useEffect(() => {
    const savedPin = localStorage.getItem("scf_admin");
    if (savedPin !== ADMIN_PIN) {
      router.push("/admin/login");
      return;
    }
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = async () => {
    if (!name.trim() || !price.trim()) {
      alert("Please enter Name and Price");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inventory/vegetables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          name: name.trim(),
          unit,
          price: price.trim(),
          availableQty: availableQty.trim(),
          status,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Failed to add vegetable.\n\n" + err);
        return;
      }

      setName("");
      setPrice("");
      setAvailableQty("");
      setStatus("Available");
      setNotes("");

      await loadItems();
    } catch (e: any) {
      alert("Network error: " + e?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Delete this vegetable item?")) return;
    await fetch(`/api/inventory/vegetables?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    loadItems();
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((it) => {
      if (categoryFilter !== "ALL" && it.category !== categoryFilter) return false;
      if (statusFilter !== "ALL" && it.status !== statusFilter) return false;
      if (unitFilter !== "ALL" && it.unit !== unitFilter) return false;

      if (!query) return true;

      const hay = `${it.category} ${it.name} ${it.unit} ${it.price} ${it.availableQty} ${it.status} ${it.notes}`.toLowerCase();
      return hay.includes(query);
    });
  }, [items, q, categoryFilter, statusFilter, unitFilter]);

  const categoryChip = (c: string) => (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
      {c}
    </span>
  );

  const statusChip = (s: string) => (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${
        s === "Available"
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-rose-50 text-rose-700 border-rose-100"
      }`}
    >
      {s}
    </span>
  );

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader
        title="Vegetables Inventory (Admin)"
        backHref="/admin/orders"
        right={
          <button
            onClick={loadItems}
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition"
          >
            Refresh
          </button>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-5 space-y-4">
        {/* Add form */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-gray-900">
              Add New Vegetable
            </h2>
            <span className="text-xs text-gray-500">
              Name + Price are required
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={category}
                onChange={(e) => setCategory(e.target.value as VegCategory)}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={status}
                onChange={(e) => setStatus(e.target.value as VegStatus)}
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Unit</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={unit}
                onChange={(e) => setUnit(e.target.value as VegUnit)}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Name <span className="text-rose-600">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., Tomato"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Price <span className="text-rose-600">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., ₹40/kg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Available Qty (optional)
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., 30 kg"
                value={availableQty}
                onChange={(e) => setAvailableQty(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-semibold text-gray-800">Notes (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., Fresh today, organic, delivery time..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={addItem}
            disabled={loading}
            className="mt-4 w-full md:w-auto rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Vegetable"}
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Search
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, notes, price, qty..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">ALL</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">ALL</option>
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Unit
              </label>
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">ALL</option>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
            / <span className="font-semibold text-gray-800">{items.length}</span>{" "}
            items
          </div>
        </div>

        {/* List */}
        <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">
              Current Vegetables
            </h2>
            <span className="text-xs text-gray-500">Manage items (delete only)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-50">
                <tr className="text-sm text-gray-700">
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Unit</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Available</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Notes</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{categoryChip(it.category)}</td>
                    <td className="p-3 font-semibold text-gray-900">{it.name}</td>
                    <td className="p-3">{it.unit}</td>
                    <td className="p-3 font-semibold text-emerald-700">{it.price}</td>
                    <td className="p-3">{it.availableQty || "-"}</td>
                    <td className="p-3">{statusChip(it.status)}</td>
                    <td className="p-3 text-sm text-gray-700">{it.notes || "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteItem(it.id)}
                        className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 border border-rose-100 hover:bg-rose-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      No vegetables found. Try clearing filters or add a new item.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back */}
        <div className="text-sm">
          <button
            onClick={() => router.push("/admin/orders")}
            className="font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Admin Orders
          </button>
        </div>
      </div>
    </main>
  );
}
