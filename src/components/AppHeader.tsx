"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  title?: string; // optional small subtitle line (if you pass it)
  backHref?: string;
  right?: React.ReactNode;
};

const LANG_LABEL = {
  te: "తెలుగు",
  hi: "हिंदी",
  en: "English",
} as const;

export default function AppHeader({ title, backHref, right }: Props) {
  const { lang, setLang } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-md px-4 py-3">
        {/* Top row */}
        <div className="relative flex items-center justify-between">
          {/* Left: Back button OR Left logo */}
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              aria-label="Back"
            >
              ←
            </Link>
          ) : (
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-100">
              <Image
                src="/logo.png"
                alt="SriChakra Farm"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Center: Brand name */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <div className="text-base font-bold tracking-wide text-gray-900">
              SriChakra Farm
            </div>
          </div>

          {/* Right: Right actions OR Right logo */}
          {right ? (
            <div>{right}</div>
          ) : (
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-gray-100">
              <Image
                src="/logo.png"
                alt="Organised by PVY Sisters"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* ✅ Language selector row (shows on all pages) */}
        <div className="mt-3 flex justify-center gap-2">
          {(["te", "hi", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                lang === l
                  ? "bg-emerald-700 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              aria-label={`Switch language to ${LANG_LABEL[l]}`}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>

        {/* Optional subtitle below header */}
        {title && (
          <div className="mt-2 text-center text-sm font-medium text-gray-600">
            {title}
          </div>
        )}
      </div>
    </header>
  );
}
