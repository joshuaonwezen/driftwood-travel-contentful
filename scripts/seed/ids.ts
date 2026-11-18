import { createHash } from "node:crypto";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Deterministic, Contentful-looking ID (22 base62 chars) for a readable seed key.
 * Re-running the seed maps the same key to the same entry, which makes it idempotent.
 */
export function cfId(key: string): string {
  let n = BigInt("0x" + createHash("sha256").update(`driftwood:${key}`).digest("hex"));
  let out = "";
  while (out.length < 22) {
    out += BASE62[Number(n % 62n)];
    n /= 62n;
  }
  return out;
}

export type EntryLink = { sys: { type: "Link"; linkType: "Entry"; id: string } };
export type AssetLink = { sys: { type: "Link"; linkType: "Asset"; id: string } };

export const entryLink = (key: string): EntryLink => ({ sys: { type: "Link", linkType: "Entry", id: cfId(key) } });
export const assetLink = (key: string): AssetLink => ({ sys: { type: "Link", linkType: "Asset", id: cfId(key) } });
