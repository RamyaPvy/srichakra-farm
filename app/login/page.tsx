"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { getErrorMessage } from "../components/helpers";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next") || "/account";

  const [form, setForm] = useState({
    login: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!form.login.trim() || !form.password.trim()) {
      setMsg("Please enter your phone number or email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: form.login,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Login failed.");
      }

      router.push(next);
      router.refresh();
    } catch (error: unknown) {
      setMsg(getErrorMessage(error, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Welcome back. Sign in to continue shopping.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone Number or Email
            </label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={form.login}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, login: e.target.value }))
              }
              placeholder="Enter phone number or email"
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
              placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          New customer?{" "}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="font-medium text-black underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}