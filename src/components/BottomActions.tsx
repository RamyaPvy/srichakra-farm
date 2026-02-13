"use client";

export default function BottomActions() {
  return (
    <div className="mx-auto max-w-md px-4 pb-6">
      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:+919999999999"
          className="h-12 rounded-xl bg-call-500 text-white font-semibold flex items-center justify-center"
        >
          📞 Call Now
        </a>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          className="h-12 rounded-xl bg-brand-600 text-white font-semibold flex items-center justify-center"
          rel="noreferrer"
        >
          💬 WhatsApp Order
        </a>
      </div>
    </div>
  );
}
