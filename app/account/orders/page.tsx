import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/auth";

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

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export default async function AccountOrdersPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account/orders");
  }

  const phoneVariants = [...new Set([customer.phone, normalizePhone(customer.phone)])];
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { customerId: customer.id },
        { phone: { in: phoneVariants } },
      ],
    },
    select: {
      id: true,
      orderNumber: true,
      deliveryType: true,
      totalAmount: true,
      status: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          qty: true,
          lineTotal: true,
          nameSnapshot: true,
          variantLabel: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/account" className="text-sm text-zinc-600 hover:underline">
            Back to My Account
          </Link>
        <h1 className="mt-2 text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-sm text-zinc-600">
            Your recent orders, delivery choices, and item details.
        </p>
        </div>
        <Link href="/" className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-zinc-50 p-6 text-sm text-zinc-700">
          <p>You have not placed an order yet.</p>
          <Link href="/" className="mt-3 inline-block font-semibold text-green-800 underline">
            Browse the farm shop
          </Link>
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