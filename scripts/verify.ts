/**
 * Checks the live space against what the seed is supposed to produce:
 * published page counts per locale, translation coverage, editorial edge cases,
 * the scheduled publish, and that no published entry links to something unpublished.
 */
import { cma, requireEnv, SPACE_ID, ENVIRONMENT_ID } from "./lib/env";

const DELIVERY_TOKEN = requireEnv("CONTENTFUL_DELIVERY_TOKEN");
const CDA = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT_ID}`;

const EXPECTED_PAGES: Record<string, number> = { landingPage: 20, article: 55, destination: 25 };

let failures = 0;
const check = (ok: boolean, label: string, detail = "") => {
  console.log(`${ok ? "✓" : "✗"} ${label}${detail ? `  (${detail})` : ""}`);
  if (!ok) failures++;
};

type CdaResponse = {
  total: number;
  items: { sys: { id: string }; fields: Record<string, unknown> }[];
  errors?: { details: { id: string; linkType: string } }[];
};

async function cda(query: Record<string, string | number>): Promise<CdaResponse> {
  const params = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]));
  const res = await fetch(`${CDA}/entries?${params}`, { headers: { Authorization: `Bearer ${DELIVERY_TOKEN}` } });
  if (!res.ok) throw new Error(`CDA ${res.status}: ${await res.text()}`);
  return res.json() as Promise<CdaResponse>;
}

async function main() {
  console.log("Published pages (Content Delivery API)");
  for (const [type, expected] of Object.entries(EXPECTED_PAGES)) {
    for (const locale of ["en-US", "nl-NL"]) {
      const { total } = await cda({ content_type: type, locale, limit: 0 });
      check(total === expected, `${type} [${locale}]`, `${total}/${expected}`);
    }
  }

  console.log("\nTranslations (nl-NL falls back to en-US where a field is empty)");
  for (const [type, field] of [["article", "title"], ["destination", "name"], ["landingPage", "title"]] as const) {
    const en = await cda({ content_type: type, locale: "en-US", limit: 100, select: `sys.id,fields.${field}` });
    const nl = await cda({ content_type: type, locale: "nl-NL", limit: 100, select: `sys.id,fields.${field}` });
    const enById = new Map(en.items.map((i) => [i.sys.id, i.fields[field]]));
    const translated = nl.items.filter((i) => i.fields[field] !== enById.get(i.sys.id)).length;
    const ratio = translated / nl.items.length;
    // Some names are the same in both languages (e.g. "Bali"), so this is a lower bound.
    check(ratio > 0.4 && ratio < 1, `${type}: ${translated}/${nl.items.length} have a Dutch ${field}`, "the rest fall back to English");
  }

  console.log("\nLink integrity (published entries only)");
  for (const type of [...Object.keys(EXPECTED_PAGES), "siteSettings", "navigationMenu"]) {
    const { errors } = await cda({ content_type: type, include: 10, limit: 100 });
    const unresolved = (errors ?? []).map((e) => `${e.details.linkType} ${e.details.id}`);
    check(unresolved.length === 0, `${type}: no unresolvable links`, unresolved.slice(0, 5).join(", "));
  }

  console.log("\nEditorial edge cases (Content Management API)");
  const all = [];
  for (let skip = 0; ; skip += 1000) {
    const page = await cma.entry.getMany({ query: { limit: 1000, skip } });
    all.push(...page.items);
    if (all.length >= page.total) break;
  }
  const drafts = all.filter((e) => !e.sys.publishedVersion && !e.sys.archivedVersion && e.sys.contentType.sys.id !== "migrationLog");
  const changed = all.filter((e) => e.sys.publishedVersion && e.sys.version > e.sys.publishedVersion + 1);
  const archived = all.filter((e) => e.sys.archivedVersion);
  check(drafts.length === 3, "draft-only entries", `${drafts.length}`);
  check(changed.length === 2, "published entries with pending changes", `${changed.length}`);
  check(archived.length === 1, "archived entries", `${archived.length}`);

  const scheduled = await cma.scheduledActions.getMany({ query: { "environment.sys.id": ENVIRONMENT_ID, "sys.status[in]": "scheduled" } });
  check(scheduled.items.length >= 1, "scheduled publish action", `${scheduled.items.length}`);

  const assets = await cma.asset.getMany({ query: { limit: 0 } });
  const publishedAssets = await cma.asset.getPublished({ query: { limit: 0 } });
  check(assets.total === 73 && publishedAssets.total === 73, "assets uploaded and published", `${publishedAssets.total}/${assets.total}`);

  console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
  process.exit(failures ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
