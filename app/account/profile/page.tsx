import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ProfilePageProps = {
  searchParams?: Promise<{ saved?: string; error?: string }>;
};

async function updateProfile(formData: FormData) {
  "use server";

  const customer = await getCurrentCustomer();
  if (!customer) redirect("/login?next=/account/profile");

  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const emailValue = String(formData.get("email") || "").trim().toLowerCase();
  const phoneDigits = phone.replace(/\D/g, "");
  const email = emailValue || null;

  if (!fullName || phoneDigits.length < 10 || phoneDigits.length > 15) {
    redirect("/account/profile?error=invalid");
  }

  const uniqueFields = email ? [{ phone }, { email }] : [{ phone }];
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id: { not: customer.id },
      OR: uniqueFields,
    },
    select: { id: true },
  });
  if (existingCustomer) redirect("/account/profile?error=duplicate");

  await prisma.order.updateMany({
    where: {
      customerId: null,
      phone: { in: [customer.phone, customer.phone.replace(/\D/g, "")] },
    },
    data: { customerId: customer.id },
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { fullName, phone, email },
  });

  revalidatePath("/account");
  revalidatePath("/account/profile");
  redirect("/account/profile?saved=1");
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AccountProfilePage({ searchParams }: ProfilePageProps) {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account/profile");
  }

  const params = searchParams ? await searchParams : {};

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/account" className="text-sm text-zinc-600 hover:underline">Back to My Account</Link>
          <h1 className="mt-2 text-2xl font-bold">My Profile</h1>
        </div>
        <Link href="/" className="rounded-lg bg-green-800 px-4 py-2 text-sm font-semibold text-white">Continue shopping</Link>
      </div>

      {params.saved ? <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">Profile updated.</p> : null}
      {params.error ? (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {params.error === "duplicate" ? "That phone number or email is already used by another account." : "Enter your name and a valid phone number."}
        </p>
      ) : null}

      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">Personal details</h2>
        <form action={updateProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-zinc-700">Full name
            <input name="fullName" required defaultValue={customer.fullName} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">Phone number
            <input name="phone" required defaultValue={customer.phone} inputMode="tel" className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <label className="text-sm font-medium text-zinc-700">Email
            <input name="email" type="email" defaultValue={customer.email || ""} className="mt-1.5 w-full rounded-lg border px-3 py-2.5" />
          </label>
          <div className="text-sm text-zinc-500 sm:self-end">Member since {formatDate(customer.createdAt)}</div>
          <button type="submit" className="rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2 sm:justify-self-start">Save profile</button>
        </form>
      </section>

      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <Link href="/account/addresses" className="font-semibold text-green-800 underline">Manage addresses</Link>
        <Link href="/account/orders" className="font-semibold text-green-800 underline">View orders</Link>
      </div>
    </div>
  );
}