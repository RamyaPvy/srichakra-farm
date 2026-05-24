import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{
  phone?: string;
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
  items: OrderItemView[];
};

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const phone = String(sp?.phone || "").trim();

  const rawOrders = phone
    ? await prisma.order.findMany({
        where: {
          phone: {
            contains: phone,
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const orders = rawOrders as unknown as OrderView[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-sm text-zinc-600 hover:underline">
          ← Back to My Account
        </Link>
        <h1 className="mt-2 text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Enter your phone number to view your order history.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-4">
        <form className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            name="phone"
            defaultValue={phone}
            placeholder="Enter your phone number"
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            View Orders
          </button>
        </form>
      </div>

      {!phone ? (
        <div className="rounded-2xl border bg-zinc-50 p-6 text-sm text-zinc-700">
          Enter your phone number above to see your orders.
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border bg-zinc-50 p-6 text-sm text-zinc-700">
          No orders found for this phone number.
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
                    Ordered on {formatDateTime(order.createdAt)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Delivery Type:{" "}
                    {order.deliveryType === "DELIVERY"
                      ? "Home Delivery"
                      : "Farm Pickup"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Total: {formatMoneyINR(order.totalAmount)}
                  </p>
                </div>

                <Link
                  href={`/order-success/${order.id}`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Open Order
                </Link>
              </div>

              <div className="mt-4 rounded-xl bg-zinc-50 p-4">
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