"use client";

import { useMemo, useState } from "react";

type Props = {
  aboutText: string;
  organizedBy?: string;
  addressLine: string;
  phoneDisplay: string;
  deliveryPromise: string;
  codText: string;
};

type TabKey = "about" | "contact" | "delivery" | "whatsapp";

export default function InfoTabs({
  aboutText,
  organizedBy = "Organized by SriChakra Foundations",
  addressLine,
  phoneDisplay,
  deliveryPromise,
  codText,
}: Props) {
  const phoneE164 = "+919603437551";

  const whatsappText = encodeURIComponent(
    "Hi SriChakra Farm, I want to know today’s availability and pricing."
  );

  const waHref = `https://wa.me/${phoneE164.replace("+", "")}?text=${whatsappText}`;
  const telHref = `tel:${phoneE164}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressLine
  )}`;

  const [activeTab, setActiveTab] = useState<TabKey>("about");

  const panel = useMemo(() => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">About SriChakra Farm</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{aboutText}</p>
            </div>

            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {organizedBy}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={telHref}
              className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm transition hover:border-green-300 hover:bg-green-50"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Call
              </div>
              <div className="mt-1 text-sm font-bold text-zinc-900">{phoneDisplay}</div>
            </a>

            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 shadow-sm transition hover:bg-green-100"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-green-700">
                WhatsApp
              </div>
              <div className="mt-1 text-sm font-bold text-green-900">{phoneDisplay}</div>
            </a>

            <a
              href={mapsHref}
              target="_blank"
              rel="noreferrer"
              className="sm:col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 shadow-sm transition hover:bg-zinc-100"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Farm Address
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{addressLine}</div>
            </a>
          </div>
        );

      case "delivery":
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Delivery
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-900">
                {deliveryPromise}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Payment
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{codText}</div>
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
              Clean handling • Transparent pricing • Pickup also available
            </div>
          </div>
        );

      case "whatsapp":
        return (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-5">
            <h3 className="text-sm font-bold text-green-900">Order on WhatsApp</h3>
            <p className="mt-2 text-sm leading-6 text-green-800">
              Need today’s availability, price, or delivery details? Message us directly on WhatsApp.
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
        );

      default:
        return null;
    }
  }, [activeTab, aboutText, organizedBy, phoneDisplay, addressLine, deliveryPromise, codText, waHref, telHref, mapsHref]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "🌿 About Farm" },
    { key: "contact", label: "📞 Contact" },
    { key: "delivery", label: "🚚 Delivery" },
    { key: "whatsapp", label: "💬 WhatsApp" },
  ];

  return (
    <section className="rounded-[28px] border border-zinc-200 bg-white/90 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-green-800 text-white shadow-sm"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-green-300 hover:bg-green-50 hover:text-green-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] border border-zinc-100 bg-zinc-50/70 p-4 sm:p-5">
        {panel}
      </div>
    </section>
  );
}