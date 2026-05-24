import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "../../components/AddToCartButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatMoneyINR(amt: number): string {
  if (!Number.isFinite(amt)) return "—";
  const hasDecimals = Math.abs(amt - Math.round(amt)) > 1e-9;
  return hasDecimals ? `Rs. ${amt.toFixed(2)}` : `Rs. ${Math.round(amt)}`;
}

function prettyText(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const rawProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!rawProduct) {
    notFound();
  }

  const product = rawProduct as any;

  if (product.isActive === false) {
    notFound();
  }

  const category = prettyText(String(product.category || ""));
  const fishTab = prettyText(product.fishTab || "");
  const fishType = prettyText(product.fishType || "");
  const sheepType = prettyText(product.sheepType || "");
  const vegetableType = prettyText(product.vegetableType || "");
  const riceType = prettyText(product.riceType || "");

  const unit = product.unit || "unit";
  const stock = Number(product.stockQty ?? 0);
  const price = Number(product.price ?? 0);
  const imageUrl = product.imageUrl || "/categories/placeholder-product.png";

  const title =
    fishType ||
    sheepType ||
    vegetableType ||
    riceType ||
    prettyText(product.category || "") ||
    "Product";

  const variantBits = [
    product.sizeLabel,
    product.variantLabel,
    product.serviceType,
    product.weightRange,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-zinc-600 hover:underline">
          Home
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <Link
          href={`/category/${String(product.category || "").toLowerCase()}`}
          className="text-sm text-zinc-600 hover:underline"
        >
          {category}
        </Link>
        <span className="mx-2 text-zinc-400">/</span>
        <span className="text-sm text-zinc-900">{title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-green-700">
              SriChakra Farm Fresh
            </p>
            <h1 className="text-3xl font-bold">{title}</h1>

            {variantBits.length > 0 ? (
              <p className="mt-2 text-sm text-zinc-600">
                {variantBits.join(" • ")}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-zinc-50 p-5">
            <p className="text-3xl font-bold">{formatMoneyINR(price)}</p>
            <p className="mt-1 text-sm text-zinc-600">Per {unit}</p>

            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Category:</span> {category}
              </p>

              {fishTab ? (
                <p>
                  <span className="font-medium">Fish Tab:</span> {fishTab}
                </p>
              ) : null}

              {fishType ? (
                <p>
                  <span className="font-medium">Fish Type:</span> {fishType}
                </p>
              ) : null}

              {sheepType ? (
                <p>
                  <span className="font-medium">Sheep Type:</span> {sheepType}
                </p>
              ) : null}

              {vegetableType ? (
                <p>
                  <span className="font-medium">Vegetable Type:</span>{" "}
                  {vegetableType}
                </p>
              ) : null}

              {riceType ? (
                <p>
                  <span className="font-medium">Rice Type:</span> {riceType}
                </p>
              ) : null}

              <p>
                <span className="font-medium">Stock:</span>{" "}
                {stock > 0 ? `${stock} available` : "Out of stock"}
              </p>
            </div>

            <div className="mt-5">
              <AddToCartButton product={product} />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Why customers can trust this</h2>
            <ul className="space-y-2 text-sm text-zinc-700">
              <li>• Direct farm-based supply</li>
              <li>• Fresh stock managed through admin inventory</li>
              <li>• Clear pricing and category details</li>
              <li>• Pickup or delivery based on availability</li>
            </ul>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">Product Details</h2>
            <div className="space-y-2 text-sm text-zinc-700">
              <p>
                This product is listed under <span className="font-medium">{category}</span>.
              </p>
              {variantBits.length > 0 ? (
                <p>
                  Variant: <span className="font-medium">{variantBits.join(" • ")}</span>
                </p>
              ) : null}
              <p>
                Unit of sale: <span className="font-medium">{unit}</span>
              </p>
              <p>
                Availability:{" "}
                <span className="font-medium">
                  {stock > 0 ? "In Stock" : "Currently Unavailable"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}