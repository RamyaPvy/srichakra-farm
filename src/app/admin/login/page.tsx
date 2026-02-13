"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";

export default function AdminLogin() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  function login() {
    if (!pin.trim()) {
      alert("Please enter admin PIN");
      return;
    }

    // simple local auth
    localStorage.setItem("scf_admin", pin);
    router.push("/admin/orders");
  }

  return (
    <main className="min-h-screen bg-emerald-50">
      {/* Header consistent with app */}
      <AppHeader title="Admin Login" backHref="/" />

      <div className="mx-auto max-w-md px-4 py-10">
        {/* Card */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="text-3xl">🔐</div>
            <h1 className="mt-2 text-xl font-extrabold text-gray-900">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Enter PIN to access admin pages
            </p>
          </div>

          {/* Input */}
          <div className="mt-6">
            <label className="mb-1 block text-sm font-semibold text-gray-800">
              Admin PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Button */}
          <button
            onClick={login}
            className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 transition"
          >
            Login
          </button>

          {/* Helper */}
          <div className="mt-4 text-center text-xs text-gray-500">
            This area is restricted to farm administrators only.
          </div>
        </div>
      </div>
    </main>
  );
}
