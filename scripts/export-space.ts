/**
 * Exports the whole space (content model, editor interfaces, tags, locales, entries
 * incl. drafts and archived entries, and asset binaries) to contentful/export/.
 * The snapshot is committed so the content can be inspected without Contentful access.
 */
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import contentfulExport from "contentful-export";
import { ROOT, SPACE_ID, ENVIRONMENT_ID, MANAGEMENT_TOKEN } from "./lib/env";

const EXPORT_DIR = resolve(ROOT, "contentful/export");

async function main() {
  rmSync(EXPORT_DIR, { recursive: true, force: true });
  await contentfulExport({
    spaceId: SPACE_ID,
    environmentId: ENVIRONMENT_ID,
    managementToken: MANAGEMENT_TOKEN,
    exportDir: EXPORT_DIR,
    contentFile: "space.json",
    includeDrafts: true,
    includeArchived: true,
    downloadAssets: true,
    skipRoles: true,
    skipWebhooks: true,
    useVerboseRenderer: true,
    includeExperienceOrchestration: false,
  });
  console.log(`Exported to ${EXPORT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
