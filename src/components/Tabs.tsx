"use client";

type Tab = { label: string; value: string };

export default function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: Tab[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mx-auto max-w-md px-4 -mt-4">
      <div className="rounded-xl bg-white shadow-card p-2">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((t) => {
            const active = t.value === value;
            return (
              <button
                key={t.value}
                onClick={() => onChange(t.value)}
                className={[
                  "h-10 rounded-lg text-sm font-semibold",
                  active
                    ? "bg-brand-600 text-white"
                    : "bg-neutral-100 text-neutral-700",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
