import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderStatusTimeline from "../components/order/OrderStatusTimeline";
import { getCurrentCustomer } from "@/lib/auth";

type SearchParams = Promise<{
  orderNumber?: string;
}>;

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login?next=/orders");

  const orderNumber = String(sp?.orderNumber || "").trim();
  const phoneVariants = [...new Set([customer.phone, customer.phone.replace(/\D/g, "")])];

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { customerId: customer.id },
        { phone: { in: phoneVariants } },
      ],
      ...(orderNumber ? { orderNumber: { contains: orderNumber } } : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Track Your Orders</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your recent orders and delivery updates.
        </p>
        <Link href="/" className="mt-3 inline-block text-sm font-semibold text-green-800 underline">Continue shopping</Link>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            name="orderNumber"
            defaultValue={orderNumber}
            placeholder="Enter order number"
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Search Orders
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-zinc-50 p-6 text-sm text-zinc-700">
          No orders found. <Link href="/" className="font-semibold text-green-800 underline">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
                  <p className="text-sm text-zinc-600">
                    Customer: {order.customerName}
                  </p>
                  <p className="text-sm text-zinc-600">
                    Ordered on: {formatDateTime(order.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Delivery Type:{" "}
                    {order.deliveryType === "DELIVERY"
                      ? "Home Delivery"
                      : "Farm Pickup"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Total: {formatMoneyINR(order.totalAmount)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                </div>

                <Link
                  href={`/order-success/${order.id}`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  View Full Order
                </Link>
              </div>

              <div className="mt-5">
                <OrderStatusTimeline status={order.status} />
              </div>

              <div className="mt-5 rounded-xl bg-zinc-50 p-4">
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
          ))}
        </div>
      )}
    </div>
  );
}