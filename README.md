# Driftwood Travel — Contentful website

Marketing website for **Driftwood Travel**, a fictional tour operator. All content is generated demo content.

- **CMS:** [Contentful](https://www.contentful.com) (free plan), 23 content types, English + Dutch
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Content:** 100 published pages (20 landing pages, 55 blog articles, 25 destinations) in two languages, plus navigation, blocks, authors, categories, redirects and 73 images

See [`docs/content-model.md`](docs/content-model.md) for the content model, the inventory and the editorial edge cases.

## Getting started

Requirements: Node.js 20.9+ and a Contentful space you can write to.

```bash
npm install
cp .env.example .env.local      # then fill in CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN
npm run cf:setup                # nl-NL locale, Delivery/Preview API keys, secrets -> .env.local
npm run cf:migrate              # create the content model
npm run seed                    # create + publish all content and images (takes a few minutes)
npm run dev
```

Open http://localhost:3000. You'll be redirected to `/en` or `/nl` based on your browser language.

The CMA token is a personal access token (Contentful → profile → Account settings → CMA tokens).
If your organization uses token access control, click **Authorize** next to the token first.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run cf:setup` | Idempotent space setup: adds the `nl-NL` locale, creates Delivery + Preview API keys and writes them (and the preview/webhook secrets) to `.env.local` |
| `npm run cf:migrate` | Applies `contentful/migrations/NN-*.cjs` in order; applied migrations are tracked on the `migrationLog` entry |
| `npm run seed` | Upserts all demo content and assets with deterministic IDs. Re-running only touches entries whose content changed. `-- --dry` validates the dataset without writing |
| `npm run seed:reset` | Deletes all entries and assets first, then seeds |
| `npm run cf:export` | Writes a full snapshot (model, editor interfaces, tags, locales, entries incl. drafts/archived, asset files) to `contentful/export/` |
| `npm run cf:types` | Generates TypeScript types in `src/types/contentful/` from the snapshot |
| `npm run verify` | Checks the live space: page counts per locale, translation coverage, edge cases, unresolved links |
| `npm run crawl -- <url>` | Crawls a running site: every sitemap URL and internal link must return 200, plus redirect, 404 and draft-mode checks |

## Routes

| URL | Source |
|---|---|
| `/{locale}` | `landingPage` with slug `home` |
| `/{locale}/{...path}` | other `landingPage` entries; the path comes from the `parentPage` chain |
| `/{locale}/blog`, `/blog/page/{n}` | articles, 12 per page |
| `/{locale}/blog/{slug}` | `article` |
| `/{locale}/blog/category/{slug}` | `category` + its articles |
| `/{locale}/destinations` | all destinations, filterable by region |
| `/{locale}/destinations/{slug}` | `destination` + articles that cover it |
| `/{locale}/authors/{slug}` | `author` + their articles |
| `/sitemap.xml`, `/robots.txt` | generated from Contentful |
| `/api/draft`, `/api/disable-draft` | draft mode (Content Preview API) |
| `/api/revalidate` | Contentful webhook target |

`{locale}` is `en` (`en-US`) or `nl` (`nl-NL`). Pages are statically generated at build time and revalidated hourly.

## Preview and webhooks

**Content preview.** In Contentful → Settings → Content preview, add a preview platform with URLs like:

```
https://<site>/api/draft?secret=<CONTENTFUL_PREVIEW_SECRET>&slug=/blog/{entry.fields.slug}
https://<site>/api/draft?secret=<CONTENTFUL_PREVIEW_SECRET>&slug=/destinations/{entry.fields.slug}
```

**Publish webhook.** In Contentful → Settings → Webhooks, call `POST https://<site>/api/revalidate` on entry and asset publish/unpublish, with the header `x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>`. Redirects are read at build time, so changes to `redirect` entries need a new deployment.

## Project structure

```
contentful/
  migrations/        content model as contentful-migration scripts
  export/            snapshot of the space (space.json + downloaded asset files)
scripts/
  setup-space.ts, run-migrations.ts, export-space.ts, verify.ts, crawl.ts
  seed/              demo content generator (data, bilingual phrase banks, upsert logic)
src/
  app/[locale]/      pages (the root layout lives here)
  app/api/           draft mode + revalidation
  components/        blocks (one per section content type), rich text, cards, layout
  lib/contentful.ts  Contentful clients and queries
  lib/links.ts       entry -> URL resolution
  lib/i18n.ts        locales and UI strings
  types/contentful/  generated content types
```

## Environment variables

See [`.env.example`](.env.example). Only `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`, `CONTENTFUL_PREVIEW_TOKEN`, the two secrets and `NEXT_PUBLIC_SITE_URL` are needed to run the site; `CONTENTFUL_MANAGEMENT_TOKEN` is only used by the scripts.

## Credits

Photos: [Unsplash](https://unsplash.com) via [Picsum](https://picsum.photos). Portraits: [Pravatar](https://pravatar.cc). Videos are placeholder Blender open movies.
