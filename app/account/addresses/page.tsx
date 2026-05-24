import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/auth";

export default async function AccountAddressesPage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account/addresses");
  }

  const addresses = await prisma.customerAddress.findMany({
    where: {
      customerId: customer.id,
    },
    orderBy: [
      { isDefault: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Address management is now connected to customer account.
        </p>

        {addresses.length === 0 ? (
          <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
            No saved addresses yet.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-semibold">
                    {address.label || "Address"}
                  </h2>
                  {address.isDefault ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Default
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-zinc-700">{address.fullName}</p>
                <p className="text-sm text-zinc-700">{address.phone}</p>
                <p className="text-sm text-zinc-700">
                  {[
                    address.addressLine1,
                    address.addressLine2,
                    address.landmark,
                    address.city,
                    address.state,
                    address.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}