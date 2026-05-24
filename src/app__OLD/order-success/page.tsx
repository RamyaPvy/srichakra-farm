import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const { orderNumber } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Order Placed ✅</h1>
      <p className="mt-3 text-gray-700">
        Your order has been placed successfully.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-6">
        <p className="text-sm text-gray-500">Order ID</p>
        <p className="mt-1 text-xl font-semibold">{orderNumber || "—"}</p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-xl border px-5 py-3">Home</Link>
        <Link href="/cart" className="rounded-xl bg-black px-5 py-3 text-white">Shop More</Link>
      </div>
    </div>
  );
}