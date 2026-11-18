import type { TypeStatsBlock } from "@/types/contentful";
import type { Locale } from "@/lib/i18n";

type Stat = { value: string; label: string };
type Props = { entry: TypeStatsBlock<"WITHOUT_UNRESOLVABLE_LINKS", string>; locale: Locale };

export function StatsBlock({ entry }: Props) {
  const { heading, stats } = entry.fields;
  const items = Array.isArray(stats) ? (stats as Stat[]) : [];
  return (
    <section className="bg-ocean-900 text-white">
      <div className="container-page py-14">
        {heading && <h2 className="font-display text-2xl text-white/90">{heading}</h2>}
        <dl className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-4xl md:text-5xl">{stat.value}</dd>
              <dd className="mt-1 text-white/70">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
