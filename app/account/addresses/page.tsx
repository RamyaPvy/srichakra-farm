import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/auth";

type AddressPageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

async function saveAddress(formData: FormData) {
  "use server";

  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login?next=/account/addresses");

  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const addressLine1 = String(formData.get("addressLine1") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const pincode = String(formData.get("pincode") || "").trim();
  const phoneDigits = phone.replace(/\D/g, "");

  if (
    !fullName ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15 ||
    !addressLine1 ||
    !city ||
    !state ||
    !/^\d{6}$/.test(pincode)
  ) {
    redirect("/account/addresses?error=invalid");
  }

  const addressCount = await prisma.customerAddress.count({
    where: { customerId: customer.id },
  });

  await prisma.customerAddress.create({
    data: {
      customerId: customer.id,
      label: String(formData.get("label") || "").trim() || "Home",
      fullName,
      phone,
      addressLine1,
      addressLine2: String(formData.get("addressLine2") || "").trim() || null,
      landmark: String(formData.get("landmark") || "").trim() || null,
      city,
      state,
      pincode,
      isDefault: addressCount === 0,
    },
  });

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  redirect("/account/addresses?saved=1");
}

async function setDefaultAddress(formData: FormData) {
  "use server";

  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login?next=/account/addresses");

  const addressId = String(formData.get("addressId") || "");
  const address = await prisma.customerAddress.findFirst({
    where: { id: addressId, customerId: customer.id },
    select: { id: true },
  });
  if (!address) redirect("/account/addresses?error=not-found");

  await prisma.$transaction([
    prisma.customerAddress.updateMany({
      where: { customerId: customer.id },
      data: { isDefault: false },
    }),
    prisma.customerAddress.update({
      where: { id: address.id },
      data: { isDefault: true },
    }),
  ]);

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  redirect("/account/addresses?saved=default");
}

async function deleteAddress(formData: FormData) {
  "use server";

  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login?next=/account/addresses");

  const addressId = String(formData.get("addressId") || "");
  await prisma.customerAddress.deleteMany({
    where: { id: addressId, customerId: customer.id },
  });

  const hasDefault = await prisma.customerAddress.findFirst({
    where: { customerId: customer.id, isDefault: true },
    select: { id: true },
  });
  if (!hasDefault) {
    const nextDefault = await prisma.customerAddress.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (nextDefault) {
      await prisma.customerAddress.update({
        where: { id: nextDefault.id },
        data: { isDefault: true },
      });
    }
  }

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  redirect("/account/addresses?saved=removed");
}

export default async function AccountAddressesPage({ searchParams }: AddressPageProps) {
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
  const params = searchParams ? await searchParams : {};

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/account" className="text-sm text-zinc-600 hover:underline">Back to My Account</Link>
          <h1 className="mt-2 text-2xl font-bold">Saved Addresses</h1>
          <p className="mt-1 text-sm text-zinc-600">Manage delivery details saved to your account.</p>
        </div>
        <Link href="/" className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white">Continue shopping</Link>
      </div>

      {params.saved ? (
        <p role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {params.saved === "removed" ? "Address removed." : params.saved === "default" ? "Default address updated." : "Address saved."}
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {params.error === "invalid" ? "Enter a valid name, phone, address, city, state, and 6-digit PIN code." : "That address could not be found."}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Add an address</h2>
        <form action={saveAddress} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700">Label
            <input name="label" placeholder="Home, Work" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">Recipient name *
            <input name="fullName" required defaultValue={customer.fullName} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">Phone *
            <input name="phone" required defaultValue={customer.phone} inputMode="tel" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700 sm:col-span-2">Address line 1 *
            <input name="addressLine1" required className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700 sm:col-span-2">Address line 2
            <input name="addressLine2" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">Landmark
            <input name="landmark" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">City / town *
            <input name="city" required className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">State *
            <input name="state" required defaultValue="Telangana" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">PIN code *
            <input name="pincode" required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <button type="submit" className="rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2">Save address</button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Your saved addresses</h2>
        {addresses.length === 0 ? (
          <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">No saved addresses yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {addresses.map((address) => (
              <article key={address.id} className="rounded-lg border p-4">
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {!address.isDefault ? (
                    <form action={setDefaultAddress}>
                      <input type="hidden" name="addressId" value={address.id} />
                      <button type="submit" className="rounded-md border px-3 py-1.5 text-xs font-semibold">Make default</button>
                    </form>
                  ) : null}
                  <form action={deleteAddress}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <button type="submit" className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700">Remove</button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
}