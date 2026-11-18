/**
 * One-time (idempotent) space setup:
 *  - checks the CMA token can reach the space
 *  - adds the nl-NL locale (falls back to en-US, optional so English-only entries can publish)
 *  - creates a Delivery/Preview API key pair and writes the tokens to .env.local
 *  - generates the draft-mode and revalidate secrets if they are missing
 */
import { randomBytes } from "node:crypto";
import { cma, SPACE_ID, ENVIRONMENT_ID, DEFAULT_LOCALE, SECONDARY_LOCALE, writeEnvValues } from "./lib/env";

const API_KEY_NAME = "Driftwood website";
// Every content type created by contentful/migrations.
const OUR_CONTENT_TYPES = new Set([
  "migrationLog", "category", "author", "seo", "videoEmbed", "heroBlock", "richTextBlock",
  "featureItem", "featureGrid", "ctaBanner", "testimonialBlock", "faqItem", "faqBlock",
  "imageWithText", "statsBlock", "contentGrid", "landingPage", "article", "destination",
  "navigationLink", "navigationMenu", "siteSettings", "redirect",
]);

async function main() {
  const space = await cma.space.get({});
  console.log(`Space: ${space.name} (${SPACE_ID}), environment: ${ENVIRONMENT_ID}`);

  // Refuse to run against a space that already holds an unrelated content model.
  const contentTypes = await cma.contentType.getMany({ query: { limit: 1000 } });
  const foreign = contentTypes.items.filter((ct) => !OUR_CONTENT_TYPES.has(ct.sys.id));
  if (foreign.length && !process.argv.includes("--allow-foreign")) {
    console.error(
      `This space already has content types not created by this repo: ${foreign.map((c) => c.sys.id).join(", ")}.\n` +
        `Use a blank space, or re-run with --allow-foreign if you know what you are doing.`,
    );
    process.exit(1);
  }

  // Locales
  const locales = await cma.locale.getMany({ query: {} });
  const codes = locales.items.map((l) => l.code);
  if (!codes.includes(DEFAULT_LOCALE)) {
    throw new Error(`Expected default locale ${DEFAULT_LOCALE}, found: ${codes.join(", ")}`);
  }
  if (codes.includes(SECONDARY_LOCALE)) {
    console.log(`Locale ${SECONDARY_LOCALE} already exists`);
  } else {
    await cma.locale.create(
      {},
      {
        name: "Dutch (Netherlands)",
        code: SECONDARY_LOCALE,
        fallbackCode: DEFAULT_LOCALE,
        optional: true,
        contentDeliveryApi: true,
        contentManagementApi: true,
      },
    );
    console.log(`Created locale ${SECONDARY_LOCALE} (fallback ${DEFAULT_LOCALE})`);
  }

  // Delivery + Preview API keys
  const keys = await cma.apiKey.getMany({ query: {} });
  let apiKey = keys.items.find((k) => k.name === API_KEY_NAME);
  if (!apiKey) {
    apiKey = await cma.apiKey.create(
      {},
      {
        name: API_KEY_NAME,
        description: "Used by the Next.js site (CDA) and draft mode (CPA).",
        environments: [{ sys: { type: "Link", linkType: "Environment", id: ENVIRONMENT_ID } }],
      },
    );
    console.log(`Created API key "${API_KEY_NAME}"`);
  } else {
    console.log(`API key "${API_KEY_NAME}" already exists`);
  }
  const previewKeyId = apiKey.preview_api_key?.sys.id;
  if (!previewKeyId) throw new Error("API key has no linked preview key");
  const previewKey = await cma.previewApiKey.get({ previewApiKeyId: previewKeyId });

  writeEnvValues({
    CONTENTFUL_DELIVERY_TOKEN: apiKey.accessToken,
    CONTENTFUL_PREVIEW_TOKEN: previewKey.accessToken,
    CONTENTFUL_PREVIEW_SECRET: process.env.CONTENTFUL_PREVIEW_SECRET || randomBytes(24).toString("hex"),
    CONTENTFUL_REVALIDATE_SECRET: process.env.CONTENTFUL_REVALIDATE_SECRET || randomBytes(24).toString("hex"),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  });
  console.log("Wrote CDA/CPA tokens and secrets to .env.local");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
