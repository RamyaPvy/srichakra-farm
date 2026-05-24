import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderStatusTimeline from "../../components/order/OrderStatusTimeline";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

function getStatusMessage(status: string) {
  switch ((status || "").toUpperCase()) {
    case "PLACED":
      return "Your order has been placed successfully.";
    case "CONFIRMED":
      return "Your order has been confirmed by the admin team.";
    case "PACKING":
      return "Your order is currently being packed.";
    case "OUT_FOR_DELIVERY":
      return "Your order is on the way.";
    case "DELIVERED":
      return "Your order has been delivered successfully.";
    case "CANCELLED":
      return "This order has been cancelled.";
    default:
      return "Your order is being processed.";
  }
}

type OrderItemView = {
  id: string;
  qty: number;
  lineTotal: number;
  nameSnapshot: string;
  variantLabel?: string | null;
  unitSnapshot?: string | null;
};

type OrderView = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
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
  preferredSlot?: string | null;
  notes?: string | null;
  items: OrderItemView[];
};

export default async function OrderSuccessPage({ params }: PageProps) {
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Order Received
          </div>

          <h1 className="text-3xl font-bold">Thank you for your order</h1>
          <p className="mt-2 text-sm text-zinc-600">
            {getStatusMessage(order.status)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Order Info</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Order Number:</span>{" "}
                {order.orderNumber}
              </p>
              <p>
                <span className="font-medium">Customer Name:</span>{" "}
                {order.customerName}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-medium">Ordered On:</span>{" "}
                {formatDateTime(order.createdAt)}
              </p>
              <p>
                <span className="font-medium">Status:</span> {order.status}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span>{" "}
                {formatMoneyINR(order.totalAmount)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Delivery Details</h2>
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
                <p>Pickup from farm location</p>
              )}

              {order.preferredSlot ? (
                <p>
                  <span className="font-medium">Preferred Slot:</span>{" "}
                  {order.preferredSlot}
                </p>
              ) : null}

              {order.notes ? (
                <p>
                  <span className="font-medium">Customer Notes:</span>{" "}
                  {order.notes}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <OrderStatusTimeline status={order.status} />
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
          <h2 className="mb-3 text-lg font-semibold">Ordered Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-xl border bg-white p-3"
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
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/orders"
            className="rounded-lg border px-4 py-2 text-sm font-medium"
          >
            Track Orders
          </Link>

          <Link
            href="/account/orders"
            className="rounded-lg border px-4 py-2 text-sm font-medium"
          >
            My Orders
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}