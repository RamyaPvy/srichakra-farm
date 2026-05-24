"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../store/cart";
import { useLanguage } from "../providers/LanguageProvider";
import { translations } from "../i18n/translations";
import CustomerAccountMenu from "./customer/CustomerAccountMenu";

export default function Header() {
  const { items } = useCart();

  const totalQty = Array.isArray(items)
    ? items.reduce((sum: number, item: any) => sum + Number(item.qty || 0), 0)
    : 0;

  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-white p-1 shadow-sm sm:h-12 sm:w-12">
              <Image
                src="/srichakra_logo_circle.png"
                alt="SriChakra Farm Logo"
                width={44}
                height={44}
                className="h-full w-full rounded-full object-cover"
                priority
              />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="truncate text-base font-extrabold tracking-tight text-green-900 sm:text-lg">
                {t.brandName}
              </div>
              <div className="truncate text-[11px] text-zinc-500 sm:text-xs">
                {t.brandTagline}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CustomerAccountMenu />

          <Link
            href="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-green-200 bg-white text-lg text-green-900 shadow-sm transition hover:border-green-300 hover:bg-green-50 sm:h-12 sm:w-12"
            aria-label="Cart"
            title={t.cart}
          >
            <span>🛒</span>

            {totalQty > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white shadow">
                {totalQty}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}