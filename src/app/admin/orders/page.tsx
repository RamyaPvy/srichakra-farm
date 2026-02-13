"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { ADMIN_PIN } from "../../../config/admin";

const STATUS_OPTIONS = ["NEW", "CONTACTED", "CONFIRMED", "DELIVERED", "CANCELLED"] as const;
type Status = (typeof STATUS_OPTIONS)[number];

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ UI state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // ✅ Load orders from API
  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data.orders) ? data.orders : []);
    setLoading(false);
  }

  // ✅ Update status
  async function updateStatus(id: string, status: Status) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    // Optimistic UI update
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  // ✅ Logout
  function logout() {
    localStorage.removeItem("scf_admin");
    router.push("/admin/login");
  }

  // ✅ Protect page with PIN
  useEffect(() => {
    const savedPin = localStorage.getItem("scf_admin");
    if (savedPin !== ADMIN_PIN) {
      router.push("/admin/login");
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Stats
  const stats = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of STATUS_OPTIONS) map[s] = 0;
    for (const o of orders) {
      const s = String(o.status || "").toUpperCase();
      if (map[s] !== undefined) map[s] += 1;
    }
    return map;
  }, [orders]);

  // ✅ Search + filter
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = [...orders];

    if (statusFilter !== "ALL") {
      list = list.filter((o) => String(o.status || "").toUpperCase() === statusFilter);
    }

    if (q) {
      list = list.filter((o) => {
        const name = String(o.name || "").toLowerCase();
        const phone = String(o.phone || "").toLowerCase();
        const item = String(o.item || "").toLowerCase();
        const location = String(o.location || "").toLowerCase();
        const notes = String(o.notes || "").toLowerCase();
        return (
          name.includes(q) ||
          phone.includes(q) ||
          item.includes(q) ||
          location.includes(q) ||
          notes.includes(q)
        );
      });
    }

    list.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === "newest" ? db - da : da - db;
    });

    return list;
  }, [orders, query, statusFilter, sortBy]);

  return (
    <main className="min-h-screen bg-emerald-50">
      <AppHeader
        title="Admin • Orders"
        backHref="/"
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-5 space-y-4">
        {/* Status Flow Info */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-700">
            Status flow:{" "}
            <span className="font-semibold">
              NEW → CONTACTED → CONFIRMED → DELIVERED
            </span>{" "}
            (or <span className="font-semibold">CANCELLED</span>)
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {STATUS_OPTIONS.map((s) => (
            <div
              key={s}
              className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-semibold text-gray-600">{s}</div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">
                {stats[s] || 0}
              </div>
              {s === "NEW" ? (
                <div className="mt-1 text-xs text-emerald-700 font-semibold">
                  Pending new orders
                </div>
              ) : (
                <div className="mt-1 text-xs text-gray-500">Orders</div>
              )}
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Search (name / phone / item / location)
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Ramya, 940..., Katla, Hyderabad..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">ALL</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-800">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
            result(s)
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
            No orders found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => {
              const safePhone = String(o.phone || "").replace(/\s+/g, "");
              const waPhone = safePhone.replace(/\D/g, "");

              const waText = encodeURIComponent(
                `Hi ${o.name || ""}, this is SriChakra Farm regarding your order.\n` +
                  `Item: ${o.item}\nQty: ${o.qty}\nLocation: ${o.location}\nStatus: ${o.status}`
              );

              const status = String(o.status || "NEW").toUpperCase() as Status;

              return (
                <div
                  key={o.id}
                  className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-base font-extrabold text-gray-900">
                        {o.item}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Buyer Type:{" "}
                        <span className="font-semibold text-gray-800">
                          {o.buyerType || "-"}
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                        <div>
                          <span className="font-semibold text-gray-900">Name:</span>{" "}
                          {o.name || "-"}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Phone:</span>{" "}
                          {o.phone || "-"}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Quantity:</span>{" "}
                          {o.qty || "-"}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Location:</span>{" "}
                          {o.location || "-"}
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Notes:</span>{" "}
                        {o.notes || "-"}
                      </div>

                      <div className="mt-3 flex gap-3 flex-wrap">
                        <a
                          href={`tel:${safePhone}`}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                        >
                          📞 Call
                        </a>

                        <a
                          href={`https://wa.me/${waPhone}?text=${waText}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Status
                      </div>
                      <select
                        value={status}
                        onChange={(e) => updateStatus(o.id, e.target.value as Status)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-200"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {o.createdAt ? (
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
