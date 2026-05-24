import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_OPTIONS = [
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

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

type OrderItemView = {
  id: string;
  qty: number;
  lineTotal: number;
  nameSnapshot: string;
  variantLabel?: string | null;
  unitSnapshot?: string | null;
  imageUrl?: string | null;
};

type OrderView = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  language?: string | null;
  deliveryType: "DELIVERY" | "PICKUP";
  paymentMethod?: string | null;
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  landmark?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  mapLink?: string | null;
  preferredSlot?: string | null;
  notes?: string | null;
  items: OrderItemView[];
};

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const rawOrder = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!rawOrder) {
    notFound();
  }

  const order = rawOrder as unknown as OrderView;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-zinc-600 hover:underline"
          >
            ← Back to Admin Orders
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Order {order.orderNumber}</h1>
          <p className="text-sm text-zinc-600">
            Created: {formatDateTime(order.createdAt)}
          </p>
        </div>

        <div className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium">
          {order.status}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Ordered Items</h2>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-xl border p-4"
                >
                  <div>
                    <p className="font-medium">{item.nameSnapshot}</p>
                    {item.variantLabel ? (
                      <p className="text-sm text-zinc-600">{item.variantLabel}</p>
                    ) : null}
                    {item.unitSnapshot ? (
                      <p className="text-sm text-zinc-600">
                        Unit: {item.unitSnapshot}
                      </p>
                    ) : null}
                    <p className="text-sm text-zinc-600">Qty: {item.qty}</p>
                  </div>

                  <div className="text-right text-sm font-medium">
                    {formatMoneyINR(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4 text-right">
              <p className="text-lg font-bold">
                Total Amount: {formatMoneyINR(order.totalAmount)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Delivery Details</h2>

            <div className="space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Delivery Type:</span>{" "}
                {order.deliveryType === "DELIVERY"
                  ? "Home Delivery"
                  : "Farm Pickup"}
              </p>

              {order.deliveryType === "DELIVERY" ? (
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {[
                    order.addressLine1,
                    order.addressLine2,
                    order.landmark,
                    order.city,
                    order.state,
                    order.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : (
                <p>Customer selected Farm Pickup</p>
              )}

              {order.preferredSlot ? (
                <p>
                  <span className="font-medium">Preferred Slot:</span>{" "}
                  {order.preferredSlot}
                </p>
              ) : null}

              {order.mapLink ? (
                <p>
                  <span className="font-medium">Map Link:</span>{" "}
                  <a
                    href={order.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open location
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          {order.notes ? (
            <div className="rounded-2xl border bg-yellow-50 p-6">
              <h2 className="mb-2 text-lg font-semibold">Customer Notes</h2>
              <p className="text-sm text-zinc-800">{order.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Customer Info</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
              {order.email ? (
                <p>
                  <span className="font-medium">Email:</span> {order.email}
                </p>
              ) : null}
              {order.language ? (
                <p>
                  <span className="font-medium">Language:</span> {order.language}
                </p>
              ) : null}
              {order.paymentMethod ? (
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Update Status</h2>

            <form action={updateOrderStatus} className="space-y-3">
              <input type="hidden" name="orderId" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                Save Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}