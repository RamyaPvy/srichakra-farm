import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/auth";

function formatDate(value: Date | string) {
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AccountProfilePage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    redirect("/login?next=/account/profile");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">My Profile</h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Full Name</p>
            <p className="mt-1 font-medium">{customer.fullName}</p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Phone Number</p>
            <p className="mt-1 font-medium">{customer.phone}</p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Email</p>
            <p className="mt-1 font-medium">{customer.email || "Not added"}</p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-500">Account Created</p>
            <p className="mt-1 font-medium">{formatDate(customer.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}