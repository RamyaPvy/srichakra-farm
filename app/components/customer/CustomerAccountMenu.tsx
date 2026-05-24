"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
};

export default function CustomerAccountMenu() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCustomer() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          if (!ignore) setCustomer(null);
          return;
        }

        const data = await res.json();

        if (!ignore) {
          setCustomer(data?.customer ?? null);
        }
      } catch {
        if (!ignore) setCustomer(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCustomer();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-24 rounded-xl border bg-zinc-100" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login?next=/account"
          className="rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-900 shadow-sm transition hover:border-green-300 hover:bg-green-50"
        >
          Login
        </Link>

        <Link
          href="/register?next=/account"
          className="hidden rounded-xl bg-green-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-800 sm:inline-flex"
        >
          Create Account
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/account"
        className="rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-900 shadow-sm transition hover:border-green-300 hover:bg-green-50"
      >
        My Account
      </Link>

      <Link
        href="/account/orders"
        className="hidden rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-900 shadow-sm transition hover:border-green-300 hover:bg-green-50 sm:inline-flex"
      >
        My Orders
      </Link>

      <form action="/api/auth/logout" method="post">
        <button
          type="submit"
          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-50"
        >
          Logout
        </button>
      </form>
    </div>
  );
}