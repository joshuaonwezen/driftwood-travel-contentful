/**
 * Seeds the Contentful space with the Driftwood Travel demo content:
 * 20 landing pages + 55 articles + 25 destinations (100 routable pages), plus
 * blocks, navigation, settings, redirects, assets and a few editorial edge cases.
 *
 *   npm run seed            upsert everything (idempotent; unchanged entries are skipped)
 *   npm run seed -- --dry   build and validate the dataset without writing
 *   npm run seed:reset      delete all entries + assets first, then seed
 */
import { Faker, en } from "@faker-js/faker";
import type { EntryProps } from "contentful-management";
import { cma, ENVIRONMENT_ID } from "../lib/env";
import { cfId } from "./ids";
import { assetSpecs } from "./images";
import { buildEditorial, planArticles } from "./build/editorial";
import { buildSite } from "./build/site";
import { pool, writeEntry, settleEntry, ensureAsset, deleteAllContent, stats, type EntrySpec } from "./upsert";

const SEED = 20261118;
const args = new Set(process.argv.slice(2));

function buildDataset(): EntrySpec[] {
  const faker = new Faker({ locale: [en] });
  faker.seed(SEED);

  const articles = planArticles();
  const editorial = buildEditorial(faker, articles);
  const site = buildSite({
    pickArticleKeys: [articles.find((a) => a.type === "itinerary")!.key],
    lisbonGuideSlug: articles[0].slug,
  });
  return [...editorial, ...site];
}

/** Fail fast on duplicate keys and links to entries/assets that the dataset doesn't define. */
function validate(specs: EntrySpec[]) {
  const keys = new Set<string>();
  for (const s of specs) {
    if (keys.has(s.key)) throw new Error(`Duplicate seed key: ${s.key}`);
    keys.add(s.key);
  }
  const entryIds = new Set(specs.map((s) => cfId(s.key)));
  const assetIds = new Set(assetSpecs().map((a) => cfId(a.key)));
  const missing: string[] = [];
  const walk = (value: unknown, where: string) => {
    if (!value || typeof value !== "object") return;
    const sys = (value as { sys?: { type?: string; linkType?: string; id?: string } }).sys;
    if (sys?.type === "Link" && sys.id) {
      const known = sys.linkType === "Asset" ? assetIds : sys.linkType === "Entry" ? entryIds : null;
      if (known && !known.has(sys.id)) missing.push(`${where} -> ${sys.linkType} ${sys.id}`);
      return;
    }
    for (const v of Object.values(value)) walk(v, where);
  };
  for (const s of [...specs]) walk([s.fields, s.draftFields], s.key);
  if (missing.length) throw new Error(`Unresolved links:\n  ${missing.join("\n  ")}`);
}

function summarize(specs: EntrySpec[]) {
  const byType = new Map<string, number>();
  for (const s of specs) byType.set(s.contentType, (byType.get(s.contentType) ?? 0) + 1);
  const routable = specs.filter((s) => ["landingPage", "article", "destination"].includes(s.contentType) && (s.state ?? "published") !== "draft" && s.state !== "archived");
  console.log(`Dataset: ${specs.length} entries, ${assetSpecs().length} assets, ${routable.length} routable published pages`);
  console.log("  " + [...byType].map(([t, n]) => `${t}=${n}`).join("  "));
}

async function scheduleFuturePublish() {
  const entryId = cfId("article:draft-winter-in-lisbon");
  const existing = await cma.scheduledActions.getMany({
    query: { "environment.sys.id": ENVIRONMENT_ID, "entity.sys.id": entryId, "sys.status[in]": "scheduled" },
  });
  if (existing.items.length) return;
  await cma.scheduledActions.create({}, {
    action: "publish",
    entity: { sys: { type: "Link", linkType: "Entry", id: entryId } },
    environment: { sys: { type: "Link", linkType: "Environment", id: ENVIRONMENT_ID } },
    scheduledFor: { datetime: "2027-01-15T09:00:00.000+01:00", timezone: "Europe/Amsterdam" },
  });
  console.log("Scheduled publish for the 'Winter in Lisbon' draft on 2027-01-15");
}

async function main() {
  const specs = buildDataset();
  validate(specs);
  summarize(specs);
  if (args.has("--dry")) return;

  if (args.has("--reset")) {
    console.log("Deleting existing entries and assets…");
    await deleteAllContent(["migration-log"]);
  }

  const assets = assetSpecs();
  console.log(`\nAssets (${assets.length})…`);
  await pool(assets, 4, async (spec, i) => {
    await ensureAsset(spec);
    if ((i + 1) % 20 === 0) console.log(`  ${i + 1}/${assets.length}`);
  });

  console.log(`\nEntries: writing ${specs.length}…`);
  const written = new Map<string, EntryProps>();
  await pool(specs, 6, async (spec, i) => {
    written.set(spec.key, await writeEntry(spec));
    if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${specs.length}`);
  });

  console.log("Entries: publishing / settling state…");
  await pool(specs, 6, async (spec, i) => {
    await settleEntry(spec, written.get(spec.key)!);
    if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${specs.length}`);
  });

  await scheduleFuturePublish();
  console.log(`\nDone. created=${stats.created} updated=${stats.updated} published=${stats.published} unchanged=${stats.unchanged}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
