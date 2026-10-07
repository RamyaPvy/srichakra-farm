import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);
}

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account");
  }

  const phoneVariants = [...new Set([customer.phone, normalizePhone(customer.phone)])];
  const [defaultAddress, recentOrders] = await Promise.all([
    prisma.customerAddress.findFirst({
      where: { customerId: customer.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
    prisma.order.findMany({
      where: {
        OR: [
          { customerId: customer.id },
          { phone: { in: phoneVariants } },
        ],
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="text-sm font-semibold text-green-800">Customer account</p>
          <h1 className="mt-1 text-3xl font-bold">Welcome, {customer.fullName}</h1>
          <p className="mt-2 text-sm text-zinc-600">Your profile, delivery addresses, and orders.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white">Continue shopping</Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="rounded-lg border px-4 py-2 text-sm font-semibold">Logout</button>
          </form>
        </div>
      </div>

      <div className="divide-y divide-zinc-200">
        <section className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <h2 className="text-lg font-semibold">Profile details</h2>
            <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
              <div><dt className="text-zinc-500">Full name</dt><dd className="font-medium">{customer.fullName}</dd></div>
              <div><dt className="text-zinc-500">Phone</dt><dd className="font-medium">{customer.phone}</dd></div>
              <div><dt className="text-zinc-500">Email</dt><dd className="font-medium">{customer.email || "Not added"}</dd></div>
            </dl>
          </div>
          <Link href="/account/profile" className="text-sm font-semibold text-green-800 underline">View profile</Link>
        </section>

        <section className="grid gap-4 py-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <h2 className="text-lg font-semibold">Delivery address</h2>
            {defaultAddress ? (
              <div className="mt-3 text-sm leading-6 text-zinc-700">
                <p className="font-medium">{defaultAddress.label || "Default address"} · {defaultAddress.fullName}</p>
                <p>{defaultAddress.addressLine1}{defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ""}</p>
                <p>{[defaultAddress.landmark, defaultAddress.city, defaultAddress.state, defaultAddress.pincode].filter(Boolean).join(", ")}</p>
                <p>{defaultAddress.phone}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-zinc-600">No address saved yet.</p>
            )}
          </div>
          <Link href="/account/addresses" className="text-sm font-semibold text-green-800 underline">Manage addresses</Link>
        </section>

        <section className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link href="/account/orders" className="text-sm font-semibold text-green-800 underline">View all orders</Link>
          </div>
          {recentOrders.length ? (
            <div className="mt-3 divide-y divide-zinc-100">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/order-success/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm hover:bg-zinc-50">
                  <span><span className="font-semibold">{order.orderNumber}</span><span className="ml-3 text-zinc-500">{formatDate(order.createdAt)}</span></span>
                  <span className="text-right"><span className="font-medium">{formatMoney(order.totalAmount)}</span><span className="ml-3 text-zinc-500">{order.status.replaceAll("_", " ")}</span></span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-600">No orders yet. <Link href="/" className="font-semibold text-green-800 underline">Browse the shop</Link></p>
          )}
        </section>
      </div>
    </div>
  );
}