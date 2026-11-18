/**
 * Applies contentful/migrations/NN-*.cjs in order. Applied scripts are recorded on the
 * `migrationLog` entry (created by 00-migration-log.cjs), so re-running is a no-op.
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { runMigration } from "contentful-migration";
import { cma, ROOT, SPACE_ID, ENVIRONMENT_ID, MANAGEMENT_TOKEN, DEFAULT_LOCALE } from "./lib/env";

const MIGRATIONS_DIR = resolve(ROOT, "contentful/migrations");
const LOG_ENTRY_ID = "migration-log";

async function readApplied(): Promise<string[]> {
  try {
    const entry = await cma.entry.get({ entryId: LOG_ENTRY_ID });
    return entry.fields.applied?.[DEFAULT_LOCALE] ?? [];
  } catch (err) {
    if ((err as { name?: string }).name === "NotFound") return [];
    throw err;
  }
}

async function writeApplied(applied: string[]) {
  const fields = {
    name: { [DEFAULT_LOCALE]: "Applied content model migrations" },
    applied: { [DEFAULT_LOCALE]: applied },
  };
  try {
    const entry = await cma.entry.get({ entryId: LOG_ENTRY_ID });
    await cma.entry.update({ entryId: LOG_ENTRY_ID }, { ...entry, fields });
  } catch (err) {
    if ((err as { name?: string }).name !== "NotFound") throw err;
    await cma.entry.createWithId({ entryId: LOG_ENTRY_ID, contentTypeId: "migrationLog" }, { fields });
  }
}

async function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => /^\d{2}-.*\.cjs$/.test(f))
    .sort();
  const applied = await readApplied();
  const pending = files.filter((f) => !applied.includes(f));

  if (!pending.length) {
    console.log(`Content model is up to date (${applied.length} migrations applied).`);
    return;
  }

  for (const file of pending) {
    console.log(`\n▶ Applying ${file}`);
    await runMigration({
      filePath: resolve(MIGRATIONS_DIR, file),
      spaceId: SPACE_ID,
      environmentId: ENVIRONMENT_ID,
      accessToken: MANAGEMENT_TOKEN,
      yes: true,
    });
    applied.push(file);
    await writeApplied(applied);
  }
  console.log(`\nDone. Applied ${pending.length} migration(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
