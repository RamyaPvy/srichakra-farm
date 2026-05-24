"use client";

import React from "react";

export default function ContactActions() {
  const phoneE164 = "+919603437551"; // REAL dialing/WhatsApp format
  const phoneDisplay = "+91 9603437551"; // What customer sees

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

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-zinc-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Contact</h2>
          <p className="text-sm text-zinc-600 mt-1">
            Call or WhatsApp us anytime.
          </p>
        </div>

        <div className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
          COD Available
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a
          href={telHref}
          className="rounded-xl bg-zinc-900 text-white text-sm font-medium py-3 text-center active:scale-[0.99]"
        >
          Call
          <div className="text-xs opacity-90 mt-0.5">{phoneDisplay}</div>
        </a>

        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-green-600 text-white text-sm font-medium py-3 text-center active:scale-[0.99]"
        >
          WhatsApp
          <div className="text-xs opacity-90 mt-0.5">{phoneDisplay}</div>
        </a>

        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="col-span-2 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 text-sm font-medium py-3 text-center active:scale-[0.99]"
        >
          Get Directions
        </a>
      </div>

      <div className="mt-4 rounded-xl bg-zinc-50 border border-zinc-200 p-3">
        <div className="text-xs text-zinc-500">Farm Address</div>
        <div className="text-sm text-zinc-900 mt-1">{address}</div>
        <div className="text-xs text-zinc-600 mt-2">
          Fast local delivery • Clean handling • Transparent pricing
        </div>
      </div>
    </section>
  );
}