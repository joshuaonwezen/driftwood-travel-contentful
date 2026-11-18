/**
 * Crawls a running site (default http://localhost:3000, or pass a base URL):
 * every sitemap URL and every internal link found on those pages must return 200,
 * plus a few redirect / 404 / draft-mode checks.
 *
 *   npm run build && npm start      (in another terminal)
 *   npm run crawl -- http://localhost:3000
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(import.meta.dirname, "../.env.local"), quiet: true });

const BASE = (process.argv[2] || process.env.CRAWL_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const CONCURRENCY = 8;

const failures: string[] = [];
const fail = (msg: string) => {
  failures.push(msg);
  console.log(`✗ ${msg}`);
};

async function get(path: string, init: RequestInit = {}) {
  return fetch(`${BASE}${path}`, { redirect: "manual", ...init });
}

async function pool<T>(items: T[], fn: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

function internalLinks(html: string): string[] {
  return [...html.matchAll(/href="(\/(?:en|nl)(?:\/[^"#?]*)?)/g)].map((m) => m[1]);
}

async function main() {
  console.log(`Crawling ${BASE}`);

  // 1. Every sitemap URL returns 200 and its internal links are collected.
  const sitemap = await (await get("/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  console.log(`Sitemap: ${paths.length} URLs`);

  const links = new Set<string>();
  await pool(paths, async (path) => {
    const res = await get(path);
    if (res.status !== 200) return fail(`${path} -> ${res.status}`);
    for (const link of internalLinks(await res.text())) links.add(link.replace(/\/$/, "") || "/");
  });

  // 2. Every internal link found on those pages resolves directly (no 404, no redirect hop).
  const unchecked = [...links].filter((l) => !paths.includes(l));
  console.log(`Internal links: ${links.size} unique, ${unchecked.length} not in the sitemap`);
  await pool(unchecked, async (path) => {
    const res = await get(path);
    if (res.status !== 200) fail(`link ${path} -> ${res.status}`);
  });

  // 3. Redirects, locale detection and 404s.
  const expectRedirect = async (path: string, to: string, headers: Record<string, string> = {}) => {
    const res = await get(path, { headers });
    const location = res.headers.get("location") ?? "";
    if (![301, 302, 307, 308].includes(res.status) || !location.endsWith(to)) fail(`redirect ${path} -> ${res.status} ${location} (expected ${to})`);
  };
  await expectRedirect("/", "/en", { "accept-language": "en-GB,en;q=0.9" });
  await expectRedirect("/", "/nl", { "accept-language": "nl-NL,nl;q=0.9,en;q=0.8" });
  await expectRedirect("/about-us", "/en/about");
  await expectRedirect("/nl/jobs", "/nl/about/careers");
  await expectRedirect("/en/destinations/iceland", "/en/destinations/reykjavik");

  for (const path of ["/en/does-not-exist", "/en/blog/winter-in-lisbon", "/en/blog/flash-sale-city-breaks-2019", "/en/home"]) {
    const res = await get(path);
    if (res.status !== 404) fail(`${path} -> ${res.status} (expected 404)`);
  }

  // 4. Draft mode: a draft-only article becomes visible through /api/draft.
  const secret = process.env.CONTENTFUL_PREVIEW_SECRET;
  if (secret) {
    const enable = await get(`/api/draft?secret=${secret}&slug=/en/blog/winter-in-lisbon`);
    const cookie = (enable.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
    const preview = await get("/en/blog/winter-in-lisbon", { headers: { cookie } });
    const html = await preview.text();
    if (preview.status !== 200 || !html.includes("Winter in Lisbon")) fail(`draft preview of winter-in-lisbon -> ${preview.status}`);
    const wrongSecret = await get("/api/draft?secret=nope&slug=/en");
    if (wrongSecret.status !== 401) fail(`/api/draft with a wrong secret -> ${wrongSecret.status}`);
  } else {
    console.log("(skipping draft-mode check: CONTENTFUL_PREVIEW_SECRET not set)");
  }

  console.log(failures.length ? `\n${failures.length} failure(s)` : "\nAll URLs OK");
  process.exit(failures.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
