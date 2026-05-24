import React from "react";

type Props = {
  aboutText: string;
  organizedBy?: string;
  addressLine: string;
  phoneDisplay: string; // example: +1 (xxx) xxx-xxxx
  deliveryPromise: string; // example: "Same-day delivery in nearby areas"
  codText: string; // example: "Cash on Delivery available"
};

export default function AboutTrust({
  aboutText,
  organizedBy = "Organized by SriChakra Foundations",
  addressLine,
  phoneDisplay,
  deliveryPromise,
  codText,
}: Props) {
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-zinc-200 p-4">
      <h2 className="text-base font-semibold text-zinc-900">About</h2>
      <p className="text-sm text-zinc-700 mt-2 leading-relaxed">{aboutText}</p>

      <div className="mt-3 text-sm text-zinc-600">{organizedBy}</div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
          <div className="text-xs text-zinc-500">Address</div>
          <div className="mt-1 text-sm font-medium text-zinc-900">{addressLine}</div>
        </div>

        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
          <div className="text-xs text-zinc-500">Phone</div>
          <div className="mt-1 text-sm font-medium text-zinc-900">{phoneDisplay}</div>
        </div>

        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3 col-span-2">
          <div className="text-xs text-zinc-500">Trust Info</div>
          <ul className="mt-2 text-sm text-zinc-800 list-disc pl-5 space-y-1">
            <li>{deliveryPromise}</li>
            <li>{codText}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}