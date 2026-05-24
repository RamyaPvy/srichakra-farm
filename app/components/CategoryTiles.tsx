"use client";

import Link from "next/link";

type CategoryKey = "FISH" | "SHEEP" | "VEGETABLES" | "RICE";

type CategoryTile = {
  key: CategoryKey;
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

const categories: CategoryTile[] = [
  {
    key: "FISH",
    title: "Fish",
    subtitle: "Seeds • Bulk • Family Pack",
    href: "/category/fish/tender-seeds",
    image: "/categories/fish.jpg",
  },
  {
    key: "SHEEP",
    title: "Sheep / Mutton",
    subtitle: "Young Lambs • Adult Sheep • Mutton",
    href: "/category/sheep",
    image: "/categories/sheep.jpg",
  },
  {
    key: "VEGETABLES",
    title: "Vegetables",
    subtitle: "Fresh daily harvest",
    href: "/category/vegetables",
    image: "/categories/vegetables.jpg",
  },
  {
    key: "RICE",
    title: "Rice",
    subtitle: "Direct from farm",
    href: "/category/rice",
    image: "/categories/rice.jpg",
  },
];

type Props = {
  onPick?: (category: CategoryKey | null) => void;
};

export default function CategoryTiles({ onPick }: Props) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Explore fresh products from SriChakra Farm
          </p>
        </div>

        {onPick && (
          <button
            type="button"
            onClick={() => onPick(null)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            View All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((c) => {
          const card = (
            <>
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm">
                  Fresh Stock
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-zinc-900">{c.title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{c.subtitle}</p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-green-800">
                  Explore Category →
                </div>
              </div>
            </>
          );

          return onPick ? (
            <button
              key={c.key}
              type="button"
              onClick={() => onPick(c.key)}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {card}
            </button>
          ) : (
            <Link
              key={c.key}
              href={c.href}
              className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}