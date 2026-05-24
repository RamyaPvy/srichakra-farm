"use client";

import { useState } from "react";

type TabKey = "about" | "contact" | "delivery" | "whatsapp";

export default function SupportStrip() {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);

  const phoneE164 = "+919603437551";
  const phoneDisplay = "+91 9603437551";
  const address =
    "Kottala Village, Haliya Town, Anumula Mandal, Nalgonda District, Telangana, India - 508278";

  const whatsappText = encodeURIComponent(
    "Hi SriChakra Farm, I want to know today’s availability and pricing."
  );

  const waHref = `https://wa.me/${phoneE164.replace("+", "")}?text=${whatsappText}`;
  const telHref = `tel:${phoneE164}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "about", label: "About", icon: "🌿" },
    { key: "contact", label: "Contact", icon: "📞" },
    { key: "delivery", label: "Delivery", icon: "🚚" },
    { key: "whatsapp", label: "WhatsApp", icon: "💬" },
  ];

  return (
    <section className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h2 className="text-base font-bold text-zinc-900">Need help?</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Quick access to farm info, contact, delivery, and WhatsApp support.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab((prev) => (prev === tab.key ? null : tab.key))}
              className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-green-800 bg-green-800 text-white shadow-sm"
                  : "border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-green-300 hover:bg-green-50 hover:text-green-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          {activeTab === "about" && (
            <div>
              <h3 className="text-sm font-bold text-zinc-900">About SriChakra Farm</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                We deliver fresh fish, mutton, vegetables, and raw rice directly from our farm
                with clean handling and transparent pricing.
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Organized by SriChakra Foundations
              </p>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={telHref}
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:bg-zinc-100"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Call
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-900">{phoneDisplay}</div>
              </a>

              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:bg-zinc-100"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Address
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-900">Open in Maps</div>
              </a>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Delivery
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-900">
                  Fast local delivery and pickup available
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Payment
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-900">
                  Cash on Delivery (COD) available
                </div>
              </div>
            </div>
          )}

          {activeTab === "whatsapp" && (
            <div>
              <h3 className="text-sm font-bold text-zinc-900">WhatsApp Support</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Message us for availability, price, delivery timing, or bulk ordering support.
              </p>

              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Open WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}