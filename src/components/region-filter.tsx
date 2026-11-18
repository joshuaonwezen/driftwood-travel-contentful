"use client";

import { useState, type ReactNode } from "react";

type Item = { id: string; region: string; card: ReactNode };

/** Client-side region filter over server-rendered destination cards. */
export function RegionFilter({ items, regions, allLabel }: { items: Item[]; regions: { value: string; label: string }[]; allLabel: string }) {
  const [active, setActive] = useState<string | null>(null);
  const visible = active ? items.filter((i) => i.region === active) : items;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group">
        {[{ value: null, label: allLabel }, ...regions].map((r) => (
          <button
            key={r.label}
            type="button"
            onClick={() => setActive(r.value)}
            aria-pressed={active === r.value}
            className={`rounded-full border px-4 py-1.5 text-sm ${active === r.value ? "border-ink bg-ink text-white" : "border-sand-200 bg-white hover:border-ocean-600"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <div key={item.id}>{item.card}</div>
        ))}
      </div>
    </>
  );
}
