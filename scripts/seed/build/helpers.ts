import type { Faker } from "@faker-js/faker";
import { entryLink, assetLink } from "../ids";
import type { Localized } from "../upsert";
import type { Pair } from "../content/phrases";

export { entryLink, assetLink };

/** Localized value from an [en, nl] pair. `translated: false` leaves nl-NL empty (falls back to en-US). */
export const loc = <T>([en, nl]: readonly [T, T], translated = true): Localized<T> =>
  translated ? { "en-US": en, "nl-NL": nl } : { "en-US": en };

/** Non-localized field value. */
export const one = <T>(value: T): Localized<T> => ({ "en-US": value });

export type Ctx = Record<string, string | number>;

export const fill = (template: string, ctx: Ctx) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => (key in ctx ? String(ctx[key]) : `{${key}}`));

export const fillPair = (pair: Pair, en: Ctx, nl: Ctx): Pair => [fill(pair[0], en), fill(pair[1], nl)];

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Pick `count` distinct items, skipping ones already used by this document when possible. */
export function picker(faker: Faker) {
  const used = new Map<unknown[], Set<number>>();
  return <T>(pool: T[], count: number): T[] => {
    const seen = used.get(pool) ?? new Set<number>();
    used.set(pool, seen);
    let free = pool.map((_, i) => i).filter((i) => !seen.has(i));
    if (free.length < count) {
      seen.clear();
      free = pool.map((_, i) => i);
    }
    const chosen = faker.helpers.arrayElements(free, count);
    chosen.forEach((i) => seen.add(i));
    return chosen.map((i) => pool[i]);
  };
}
