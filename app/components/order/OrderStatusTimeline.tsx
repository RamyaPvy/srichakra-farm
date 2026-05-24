type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

type Props = {
  status: string;
};

const STEPS: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "PACKING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function labelize(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrderStatusTimeline({ status }: Props) {
  const normalized = (status || "PLACED").toUpperCase() as OrderStatus;

  if (normalized === "CANCELLED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <h3 className="text-base font-semibold text-red-700">Order Cancelled</h3>
        <p className="mt-1 text-sm text-red-600">
          This order has been cancelled. Please contact support if you need help.
        </p>
      </div>
    );
  }

  const activeIndex = STEPS.indexOf(normalized);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <h3 className="mb-4 text-base font-semibold">Order Progress</h3>

      <div className="grid gap-3 md:grid-cols-5">
        {STEPS.map((step, index) => {
          const completed = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={step}
              className={`rounded-xl border p-3 text-center ${
                completed
                  ? "border-green-200 bg-green-50"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <div
                className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  completed
                    ? "bg-green-600 text-white"
                    : "bg-zinc-200 text-zinc-700"
                }`}
              >
                {index + 1}
              </div>

              <p
                className={`text-xs font-medium ${
                  isCurrent ? "text-green-700" : "text-zinc-700"
                }`}
              >
                {labelize(step)}
              </p>

              {isCurrent ? (
                <p className="mt-1 text-[11px] text-green-700">Current</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}