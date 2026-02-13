"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { ADMIN_PIN } from "../../../../config/admin";

type SheepType = "live" | "mutton";
type SheepStatus = "Available" | "Reserved" | "Sold";

type SheepItem = {
  id: string;
  type: SheepType;
  tagId: string;
  weightKg: string;
  ageMonths: string;
  price: string;
  status: SheepStatus;
  notes: string;
  createdAt?: string;
};

const TYPE_LABEL: Record<SheepType, string> = {
  live: "Live Sheep",
  mutton: "Mutton (kg)",
};

export default function AdminSheepInventoryPage() {
  const router = useRouter();

  const [items, setItems] = useState<SheepItem[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<SheepType | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<SheepStatus | "ALL">("ALL");

  // form fields
  const [type, setType] = useState<SheepType>("live");
  const [tagId, setTagId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<SheepStatus>("Available");
  const [notes, setNotes] = useState("");

  const loadItems = async () => {
    const res = await fetch("/api/inventory/sheep", { cache: "no-store" });
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
    if (!tagId.trim() || !price.trim()) {
      alert("Please enter Tag ID and Price");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/inventory/sheep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          tagId: tagId.trim(),
          weightKg: weightKg.trim(),
          ageMonths: ageMonths.trim(),
          price: price.trim(),
          status,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Failed to add sheep.\n\n" + err);
        return;
      }

      setTagId("");
      setWeightKg("");
      setAgeMonths("");
      setPrice("");
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
    if (!confirm("Delete this sheep item?")) return;
    await fetch(`/api/inventory/sheep?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    loadItems();
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((it) => {
      if (typeFilter !== "ALL" && it.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && it.status !== statusFilter) return false;

      if (!query) return true;

      const hay = `${it.tagId} ${it.weightKg} ${it.ageMonths} ${it.price} ${it.status} ${it.type} ${it.notes}`.toLowerCase();
      return hay.includes(query);
    });
  }, [items, q, typeFilter, statusFilter]);

  const typeChip = (t: SheepType) => (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
      {TYPE_LABEL[t]}
    </span>
  );

  const statusChip = (s: SheepStatus) => {
    const cls =
      s === "Available"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : s === "Reserved"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-rose-50 text-rose-700 border-rose-100";

    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${cls}`}>
        {s}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader
        title="Sheep Inventory (Admin)"
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
              Add New Sheep
            </h2>
            <span className="text-xs text-gray-500">
              Tag ID + Price are required
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-semibold text-gray-800">Type</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={type}
                onChange={(e) => setType(e.target.value as SheepType)}
              >
                <option value="live">Live Sheep</option>
                <option value="mutton">Mutton (kg)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                value={status}
                onChange={(e) => setStatus(e.target.value as SheepStatus)}
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Sheep Tag ID <span className="text-rose-600">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., SCF-101"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Weight (kg)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., 32"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">Age (months)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., 10"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-800">
                Price <span className="text-rose-600">*</span>
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., ₹12000 or ₹450/kg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-semibold text-gray-800">Notes (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="e.g., Healthy, white color, ready in 2 days..."
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
            {loading ? "Saving..." : "Add Sheep"}
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Search
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by tag, notes, price, weight..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">ALL</option>
                <option value="live">Live Sheep</option>
                <option value="mutton">Mutton (kg)</option>
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
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
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
              Current Sheep Items
            </h2>
            <span className="text-xs text-gray-500">Manage items (delete only)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-50">
                <tr className="text-sm text-gray-700">
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Tag ID</th>
                  <th className="p-3 font-semibold">Weight</th>
                  <th className="p-3 font-semibold">Age</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Notes</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{typeChip(it.type)}</td>
                    <td className="p-3 font-semibold text-gray-900">{it.tagId}</td>
                    <td className="p-3">{it.weightKg || "-"}</td>
                    <td className="p-3">{it.ageMonths || "-"}</td>
                    <td className="p-3 font-semibold text-emerald-700">{it.price}</td>
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
                      No sheep items found. Try clearing filters or add a new item.
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
