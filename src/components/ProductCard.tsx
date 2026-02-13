import Image from "next/image";
import Link from "next/link";

export default function ProductCard({
  image,
  title,
  subtitle,
  price,
  actionLabel = "View Details",
  href,
}: {
  image: string;
  title: string;
  subtitle?: string;
  price?: string;
  actionLabel?: string;
  href: string;
}) {
  return (
    <div className="rounded-xl bg-white shadow-card overflow-hidden">
      <div className="relative h-36 w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="p-4">
        <div className="text-base font-semibold">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-neutral-600">{subtitle}</div>
        ) : null}

        {price ? (
          <div className="mt-2 text-sm font-semibold">₹ {price}</div>
        ) : null}

        <Link
          href={href}
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-brand-600 text-white font-semibold"
        >
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
