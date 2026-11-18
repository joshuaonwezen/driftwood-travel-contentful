import { config } from "dotenv";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "contentful-management";

export const ROOT = resolve(import.meta.dirname, "../..");
export const ENV_FILE = resolve(ROOT, ".env.local");

config({ path: ENV_FILE, quiet: true });

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Add it to .env.local (see .env.example).`);
    process.exit(1);
  }
  return value;
}

export const SPACE_ID = requireEnv("CONTENTFUL_SPACE_ID");
export const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";
export const MANAGEMENT_TOKEN = requireEnv("CONTENTFUL_MANAGEMENT_TOKEN");

export const DEFAULT_LOCALE = "en-US";
export const SECONDARY_LOCALE = "nl-NL";

/** Plain CMA client scoped to this space + environment. */
export const cma = createClient(
  { accessToken: MANAGEMENT_TOKEN },
  { defaults: { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } },
);

/** Set (or replace) KEY=value lines in .env.local without touching other lines. */
export function writeEnvValues(values: Record<string, string>) {
  let text = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    text = pattern.test(text) ? text.replace(pattern, line) : `${text.replace(/\n?$/, "\n")}${line}\n`;
    process.env[key] = value;
  }
  writeFileSync(ENV_FILE, text);
}
