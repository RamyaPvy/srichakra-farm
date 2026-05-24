import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function updateOrderStatus(formData: FormData) {
  "use server";

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "");

  if (!orderId || !status) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as
        | "PLACED"
        | "CONFIRMED"
        | "PACKING"
        | "OUT_FOR_DELIVERY"
        | "DELIVERED"
        | "CANCELLED",
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

function formatMoneyINR(amt: number): string {
  if (!Number.isFinite(amt)) return "—";
  const hasDecimals = Math.abs(amt - Math.round(amt)) > 1e-9;
  return hasDecimals ? `Rs. ${amt.toFixed(2)}` : `Rs. ${Math.round(amt)}`;
}

function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type SearchParams = Promise<{
  status?: string;
  q?: string;
}>;

const STATUS_OPTIONS = [
  "ALL",
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderItemView = {
  id: string;
  qty: number;
  lineTotal: number;
  nameSnapshot: string;
  variantLabel?: string | null;
};

type OrderView = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryType: "DELIVERY" | "PICKUP";
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  notes?: string | null;
  items: OrderItemView[];
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = String(sp?.q || "").trim();
  const selectedStatus = String(sp?.status || "ALL").toUpperCase();

  const whereClause: any = {};

  if (selectedStatus !== "ALL") {
    whereClause.status = selectedStatus;
  }

  if (q) {
    whereClause.OR = [
      { orderNumber: { contains: q } },
      { customerName: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const rawOrders = await prisma.order.findMany({
    where: whereClause,
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const orders = rawOrders as unknown as OrderView[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Orders</h1>
          <p className="text-sm text-zinc-600">
            View, search, and manage all customer orders
          </p>
        </div>

        <form className="flex flex-col gap-2 md:flex-row">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by order no / customer / phone"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <select
            name="status"
            defaultValue={selectedStatus}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Filter
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6">No orders available.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
                  <p className="text-sm text-zinc-600">
                    {order.customerName} • {order.phone}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {order.deliveryType === "DELIVERY"
                      ? "Home Delivery"
                      : "Farm Pickup"}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Total: {formatMoneyINR(order.totalAmount)}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Created: {formatDateTime(order.createdAt)}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                  >
                    View Details
                  </Link>

                  <form action={updateOrderStatus} className="flex flex-wrap gap-2">
                    <input type="hidden" name="orderId" value={order.id} />

                    <button
                      type="submit"
                      name="status"
                      value="CONFIRMED"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Confirm
                    </button>

                    <button
                      type="submit"
                      name="status"
                      value="PACKING"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Packing
                    </button>

                    <button
                      type="submit"
                      name="status"
                      value="OUT_FOR_DELIVERY"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Out for Delivery
                    </button>

                    <button
                      type="submit"
                      name="status"
                      value="DELIVERED"
                      className="rounded-lg border px-3 py-2 text-sm"
                    >
                      Delivered
                    </button>

                    <button
                      type="submit"
                      name="status"
                      value="CANCELLED"
                      className="rounded-lg border px-3 py-2 text-sm text-red-600"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <h3 className="mb-2 font-medium">Address</h3>
                  {order.deliveryType === "DELIVERY" ? (
                    <p className="text-sm text-zinc-700">
                      {order.addressLine1 ?? ""}
                      {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                      {order.landmark ? `, ${order.landmark}` : ""}
                      {order.city ? `, ${order.city}` : ""}
                      {order.state ? `, ${order.state}` : ""}
                      {order.pincode ? ` - ${order.pincode}` : ""}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-700">Farm Pickup</p>
                  )}
                </div>

                <div className="rounded-xl bg-zinc-50 p-4">
                  <h3 className="mb-2 font-medium">Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.nameSnapshot} × {item.qty}
                          {item.variantLabel ? ` (${item.variantLabel})` : ""}
                        </span>
                        <span>{formatMoneyINR(item.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {order.notes ? (
                <div className="mt-4 rounded-xl bg-yellow-50 p-4">
                  <h3 className="mb-1 font-medium">Customer Notes</h3>
                  <p className="text-sm">{order.notes}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}