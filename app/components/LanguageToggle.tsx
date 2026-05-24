"use client";

import React from "react";
import { useLanguage, type Lang } from "../providers/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const btn = (code: Lang, label: string) => {
    const active = lang === code;
    return (
      <button
        type="button"
        onClick={() => setLang(code)}
        className={`rounded-xl px-3 py-2 text-sm font-semibold border transition ${
          active
            ? "bg-zinc-900 text-white border-zinc-900"
            : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {btn("en", "English")}
      {btn("te", "తెలుగు")}
      {btn("hi", "हिंदी")}
    </div>
  );
}