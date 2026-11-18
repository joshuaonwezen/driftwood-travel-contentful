import type { EntryProps, AssetProps } from "contentful-management";
import { cma, DEFAULT_LOCALE } from "../lib/env";
import { cfId } from "./ids";
import type { AssetSpec } from "./images";

export type Localized<T = unknown> = { "en-US": T; "nl-NL"?: T };
export type Fields = Record<string, Localized | undefined>;

/**
 * - published: live with `fields`
 * - draft: never published
 * - changed: published with `fields`, then edited to `draftFields` without republishing
 * - archived: published, unpublished, then archived
 */
export type EntryState = "published" | "draft" | "changed" | "archived";

export type EntrySpec = {
  key: string;
  contentType: string;
  fields: Fields;
  draftFields?: Fields;
  tags?: string[];
  state?: EntryState;
};

const isNotFound = (err: unknown) => (err as { name?: string }).name === "NotFound";

/** JSON with sorted keys, so field comparison ignores key order. */
function stable(value: unknown): string {
  return JSON.stringify(value, (_k, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
      : v,
  );
}

/** Drop undefined locale values / fields so they don't count as differences. */
export function clean(fields: Fields): Fields {
  const out: Fields = {};
  for (const [id, locales] of Object.entries(fields)) {
    if (!locales) continue;
    const kept = Object.fromEntries(Object.entries(locales).filter(([, v]) => v !== undefined && v !== null));
    if (Object.keys(kept).length) out[id] = kept as Localized;
  }
  return out;
}

const tagLinks = (tags: string[] = []) =>
  tags.map((id) => ({ sys: { type: "Link" as const, linkType: "Tag" as const, id } }));

const sameTags = (entry: { metadata?: { tags: { sys: { id: string } }[] } }, tags: string[] = []) =>
  stable((entry.metadata?.tags ?? []).map((t) => t.sys.id).sort()) === stable([...tags].sort());

const isPublishedAndCurrent = (sys: EntryProps["sys"] | AssetProps["sys"]) =>
  !!sys.publishedVersion && sys.version === sys.publishedVersion + 1;

export async function pool<T>(items: T[], limit: number, fn: (item: T, i: number) => Promise<void>) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
}

export type Stats = { created: number; updated: number; published: number; unchanged: number };
export const stats: Stats = { created: 0, updated: 0, published: 0, unchanged: 0 };

/* ------------------------------------------------------------------ entries */

async function getEntry(id: string): Promise<EntryProps | null> {
  try {
    return await cma.entry.get({ entryId: id });
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** Phase 1: make sure the entry exists with its base fields (does not publish). */
export async function writeEntry(spec: EntrySpec): Promise<EntryProps> {
  const id = cfId(spec.key);
  const fields = clean(spec.fields);
  const metadata = { tags: tagLinks(spec.tags) };
  const existing = await getEntry(id);

  if (!existing) {
    stats.created++;
    return cma.entry.createWithId({ entryId: id, contentTypeId: spec.contentType }, { fields, metadata });
  }
  // A "changed" entry that already sits in its final state is left alone.
  if (spec.state === "changed" && existing.sys.publishedVersion && stable(existing.fields) === stable(clean(spec.draftFields!))) {
    return existing;
  }
  if (spec.state === "archived" && existing.sys.archivedVersion) return existing;
  if (stable(existing.fields) === stable(fields) && sameTags(existing, spec.tags)) return existing;

  if (existing.sys.archivedVersion) await cma.entry.unarchive({ entryId: id });
  const current = existing.sys.archivedVersion ? await cma.entry.get({ entryId: id }) : existing;
  stats.updated++;
  return cma.entry.update({ entryId: id }, { ...current, fields, metadata });
}

/** Phase 2: move the entry into its target state. */
export async function settleEntry(spec: EntrySpec, entry: EntryProps): Promise<void> {
  const id = entry.sys.id;
  const state = spec.state ?? "published";

  switch (state) {
    case "published": {
      if (isPublishedAndCurrent(entry.sys)) {
        stats.unchanged++;
        return;
      }
      await cma.entry.publish({ entryId: id }, entry);
      stats.published++;
      return;
    }
    case "draft": {
      if (entry.sys.publishedVersion) await cma.entry.unpublish({ entryId: id });
      return;
    }
    case "changed": {
      const draft = clean(spec.draftFields!);
      if (entry.sys.publishedVersion && stable(entry.fields) === stable(draft)) {
        stats.unchanged++;
        return;
      }
      const published = isPublishedAndCurrent(entry.sys) ? entry : await cma.entry.publish({ entryId: id }, entry);
      await cma.entry.update({ entryId: id }, { ...published, fields: draft });
      return;
    }
    case "archived": {
      if (entry.sys.archivedVersion) return;
      const published = isPublishedAndCurrent(entry.sys) ? entry : await cma.entry.publish({ entryId: id }, entry);
      await cma.entry.unpublish({ entryId: id }, published);
      await cma.entry.archive({ entryId: id });
      return;
    }
  }
}

/* ------------------------------------------------------------------- assets */

export async function ensureAsset(spec: AssetSpec): Promise<void> {
  const id = cfId(spec.key);
  let existing: AssetProps | null = null;
  try {
    existing = await cma.asset.get({ assetId: id });
  } catch (err) {
    if (!isNotFound(err)) throw err;
  }

  const meta = { title: spec.title, description: spec.description };
  const hasFile = !!existing?.fields.file?.[DEFAULT_LOCALE]?.url;
  const metaSame = existing && stable({ title: existing.fields.title, description: existing.fields.description }) === stable(meta);

  if (existing && hasFile && metaSame) {
    if (!isPublishedAndCurrent(existing.sys)) await cma.asset.publish({ assetId: id }, existing);
    stats.unchanged++;
    return;
  }

  let asset: AssetProps;
  if (existing && hasFile) {
    asset = await cma.asset.update({ assetId: id }, { ...existing, fields: { ...existing.fields, ...meta } });
    stats.updated++;
  } else {
    const buf = await spec.load();
    const upload = await cma.upload.create({}, { file: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer });
    const file = {
      [DEFAULT_LOCALE]: {
        contentType: spec.contentType,
        fileName: spec.fileName,
        uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } },
      },
    };
    const fields = { ...meta, file } as unknown as AssetProps["fields"];
    asset = existing
      ? await cma.asset.update({ assetId: id }, { ...existing, fields })
      : await cma.asset.createWithId({ assetId: id }, { fields });
    asset = await cma.asset.processForAllLocales({}, asset);
    stats.created++;
  }
  await cma.asset.publish({ assetId: id }, asset);
  stats.published++;
}

/* -------------------------------------------------------------------- reset */

export async function deleteAllContent(keepEntryIds: string[]) {
  for (const kind of ["entry", "asset"] as const) {
    for (;;) {
      const api = kind === "entry" ? cma.entry : cma.asset;
      const page = await api.getMany({ query: { limit: 200 } });
      const items = page.items.filter((i) => !keepEntryIds.includes(i.sys.id));
      if (!items.length) break;
      await pool(items, 6, async (item) => {
        const params = kind === "entry" ? { entryId: item.sys.id } : { assetId: item.sys.id };
        if (item.sys.archivedVersion) await (api.unarchive as (p: typeof params) => Promise<unknown>)(params);
        else if (item.sys.publishedVersion) await (api.unpublish as (p: typeof params) => Promise<unknown>)(params);
        await (api.delete as (p: typeof params) => Promise<unknown>)(params);
      });
      console.log(`  deleted ${items.length} ${kind === "entry" ? "entries" : "assets"}`);
    }
  }
}
