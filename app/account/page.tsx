import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Welcome, {customer.fullName}
        </p>
        <p className="mt-1 text-sm text-zinc-600">
          Phone: {customer.phone}
        </p>
        {customer.email ? (
          <p className="mt-1 text-sm text-zinc-600">Email: {customer.email}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/account/profile"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="mt-2 text-sm text-zinc-600">
            View your personal details.
          </p>
        </Link>

        <Link
          href="/account/addresses"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">Saved Addresses</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Manage your saved delivery addresses.
          </p>
        </Link>

        <Link
          href="/account/orders"
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold">My Orders</h2>
          <p className="mt-2 text-sm text-zinc-600">
            View your order history and current order status.
          </p>
        </Link>

        <form
          action="/api/auth/logout"
          method="post"
          className="rounded-2xl border bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Logout</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Logout from your account safely.
          </p>
          <button
            type="submit"
            className="mt-4 rounded-xl border px-4 py-2 text-sm font-medium"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}