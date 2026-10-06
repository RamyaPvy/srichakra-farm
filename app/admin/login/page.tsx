"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getErrorMessage } from "../../components/helpers";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/admin";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!form.email.trim() || !form.password.trim()) {
      setMsg("Please enter admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Admin login failed.");
      }

      router.push(next);
      router.refresh();
    } catch (error: unknown) {
      setMsg(getErrorMessage(error, "Admin login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Access inventory and order management.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="admin@srichakrafarm.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-xl border px-3 py-2"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="Enter admin password"
            />
          </div>

          {msg ? (
            <div className="rounded-xl border px-3 py-2 text-sm text-red-600">
              {msg}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login to Admin"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          Need customer login?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-medium text-black underline">
            Go to customer login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
