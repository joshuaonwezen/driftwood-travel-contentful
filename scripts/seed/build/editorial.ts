import type { Faker } from "@faker-js/faker";
import type { Document } from "@contentful/rich-text-types";
import {
  doc, p, h2, ul, ol, quote, hr, link, table,
  entryLink as rtLink, embedEntry, embedAsset,
} from "../richtext";
import { DESTINATIONS, type DestinationData } from "../data/destinations";
import { POOLS, ARTICLE_TYPES, ARTICLE_TYPE_DEFS, MONTH_NAMES, type ArticleType, type Pair } from "../content/phrases";
import { PHOTO_IDS, photoKey, portraitKey } from "../images";
import type { EntrySpec, Fields } from "../upsert";
import { loc, one, entryLink, assetLink, fill, capitalize, slugify, picker, type Ctx } from "./helpers";

/* ---------------------------------------------------------------- taxonomy */

const CATEGORIES: { slug: string; name: Pair; description: Pair; color: string; icon: string }[] = [
  { slug: "guides", name: ["Guides", "Reisgidsen"], description: ["In-depth destination guides from our travel designers.", "Uitgebreide bestemmingsgidsen van onze reisontwerpers."], color: "#1f6f8b", icon: "compass" },
  { slug: "food-and-drink", name: ["Food & Drink", "Eten & drinken"], description: ["Where and what to eat, from street food to tasting menus.", "Waar en wat je eet, van straatvoedsel tot proeverijmenu's."], color: "#c0582c", icon: "utensils" },
  { slug: "adventure", name: ["Adventure", "Avontuur"], description: ["Hikes, mountains and the great outdoors.", "Wandelingen, bergen en de wijde natuur."], color: "#2f6b3a", icon: "mountain" },
  { slug: "city-breaks", name: ["City Breaks", "Stedentrips"], description: ["Short trips to cities worth the journey.", "Korte reizen naar steden die de reis waard zijn."], color: "#5b4b8a", icon: "train" },
  { slug: "beaches-and-islands", name: ["Beaches & Islands", "Stranden & eilanden"], description: ["Sun, sea and slow days.", "Zon, zee en trage dagen."], color: "#1d8fa3", icon: "sun" },
  { slug: "culture", name: ["Culture", "Cultuur"], description: ["History, art and local traditions.", "Geschiedenis, kunst en lokale tradities."], color: "#8a4b5b", icon: "camera" },
  { slug: "budget-travel", name: ["Budget Travel", "Budgetreizen"], description: ["Travel well without overspending.", "Goed reizen zonder te veel uit te geven."], color: "#7a6a2f", icon: "wallet" },
  { slug: "sustainable-travel", name: ["Sustainable Travel", "Duurzaam reizen"], description: ["How to travel with a lighter footprint.", "Reizen met een lichtere voetafdruk."], color: "#3d7a4f", icon: "leaf" },
  { slug: "family-travel", name: ["Family Travel", "Reizen met kinderen"], description: ["Trips that work for every age.", "Reizen die voor elke leeftijd werken."], color: "#b06a2c", icon: "users" },
  { slug: "travel-tips", name: ["Travel Tips", "Reistips"], description: ["Practical advice for planning and packing.", "Praktisch advies voor plannen en inpakken."], color: "#44546a", icon: "map" },
];

const KIND_CATEGORY: Record<string, string> = {
  lisbon: "city-breaks", porto: "city-breaks", seville: "city-breaks", barcelona: "city-breaks", amsterdam: "city-breaks",
  copenhagen: "city-breaks", marrakech: "city-breaks", kyoto: "culture", hanoi: "city-breaks", "new-york-city": "city-breaks",
  cusco: "adventure", dubrovnik: "beaches-and-islands", santorini: "beaches-and-islands", zanzibar: "beaches-and-islands",
  bali: "beaches-and-islands", "cape-town": "adventure", reykjavik: "adventure", "scottish-highlands": "adventure",
  "swiss-alps": "adventure", banff: "adventure", queenstown: "adventure", cappadocia: "adventure", "wadi-rum": "adventure",
  tuscany: "culture", "loire-valley": "culture",
};

const AUTHORS: { slug: string; name: string; role: Pair; staff: boolean; focus: Pair; home: Pair }[] = [
  { slug: "maren-visser", name: "Maren Visser", role: ["Editor-in-chief", "Hoofdredacteur"], staff: true, focus: ["slow travel and European rail journeys", "langzaam reizen en Europese treinreizen"], home: ["Amsterdam", "Amsterdam"] },
  { slug: "tomas-herrera", name: "Tomás Herrera", role: ["Senior travel writer", "Senior reisjournalist"], staff: true, focus: ["Southern Europe and Latin America", "Zuid-Europa en Latijns-Amerika"], home: ["Seville", "Sevilla"] },
  { slug: "leilani-santos", name: "Leilani Santos", role: ["Food editor", "Food-redacteur"], staff: true, focus: ["markets, street food and family-run restaurants", "markten, straatvoedsel en familierestaurants"], home: ["Lisbon", "Lissabon"] },
  { slug: "omar-haddad", name: "Omar Haddad", role: ["Middle East specialist", "Specialist Midden-Oosten"], staff: false, focus: ["desert landscapes and ancient cities", "woestijnlandschappen en oude steden"], home: ["Amman", "Amman"] },
  { slug: "sofie-de-wit", name: "Sofie de Wit", role: ["Travel designer", "Reisontwerper"], staff: true, focus: ["family trips and island hopping", "gezinsreizen en eilandhoppen"], home: ["Utrecht", "Utrecht"] },
  { slug: "jonas-lindqvist", name: "Jonas Lindqvist", role: ["Photographer", "Fotograaf"], staff: false, focus: ["landscapes and the northern light", "landschappen en het noordelijke licht"], home: ["Stockholm", "Stockholm"] },
  { slug: "clara-moreau", name: "Clara Moreau", role: ["Sustainability lead", "Duurzaamheidsmanager"], staff: true, focus: ["responsible tourism and low-carbon itineraries", "verantwoord toerisme en reizen met weinig CO2"], home: ["Lyon", "Lyon"] },
  { slug: "mateo-rossi", name: "Mateo Rossi", role: ["Adventure guide", "Avonturengids"], staff: false, focus: ["mountains, multi-day hikes and wild camping", "bergen, meerdaagse tochten en wildkamperen"], home: ["Turin", "Turijn"] },
];

/** Destinations whose content has not been translated to Dutch yet. */
const EN_ONLY_DESTINATIONS = new Set(["wadi-rum", "hanoi", "cusco", "queenstown"]);

export type ArticleInfo = { key: string; slug: string; type: ArticleType; destination: string };

/* ------------------------------------------------------------- generation */

function contexts(d: DestinationData, faker: Faker): [Ctx, Ctx] {
  const month = faker.helpers.arrayElement(d.months);
  const monthsEn = d.months.slice(0, 3).map((m) => MONTH_NAMES[m][0]);
  const monthsNl = d.months.slice(0, 3).map((m) => MONTH_NAMES[m][1]);
  const join = (xs: string[], and: string) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} ${and} ${xs[xs.length - 1]}` : xs[0]);
  const base = { days: d.days };
  return [
    { ...base, name: d.name[0], country: d.country[0], landmark1: d.landmarks[0][0], landmark2: d.landmarks[1][0], food1: d.foods[0][0], food2: d.foods[1][0], act1: d.activities[0][0], act2: d.activities[1][0], act3: d.activities[2][0], month: MONTH_NAMES[month][0], months: join(monthsEn, "and") },
    { ...base, name: d.name[1], country: d.country[1], landmark1: d.landmarks[0][1], landmark2: d.landmarks[1][1], food1: d.foods[0][1], food2: d.foods[1][1], act1: d.activities[0][1], act2: d.activities[1][1], act3: d.activities[2][1], month: MONTH_NAMES[month][1], months: join(monthsNl, "en") },
  ];
}

/** Picks sentence pairs and renders them per language, so en/nl stay translations of each other. */
function sentences(pick: ReturnType<typeof picker>, pool: Pair[], count: number, ctx: [Ctx, Ctx]): Pair {
  const chosen = pick(pool, count);
  // Slots can start a sentence ("{landmark2} is busy…" -> "the Alfama district…"), so capitalize.
  return [chosen.map((s) => capitalize(fill(s[0], ctx[0]))).join(" "), chosen.map((s) => capitalize(fill(s[1], ctx[1]))).join(" ")];
}

type Extras = { galleryPhoto: number; video?: string; cta?: string; withQuote: boolean; withRule: boolean };

function articleBody(faker: Faker, type: ArticleType, d: DestinationData, ctx: [Ctx, Ctx], extras: Extras): [Document, Document] {
  const pick = picker(faker);
  const def = ARTICLE_TYPE_DEFS[type];
  const intro = sentences(pick, POOLS.intro, 2, ctx);
  const sections = def.sections.map(([heading, pool]) => ({
    heading: [fill(heading[0], ctx[0]), fill(heading[1], ctx[1])] as Pair,
    paragraphs: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => sentences(pick, POOLS[pool], faker.number.int({ min: 2, max: 3 }), ctx)),
  }));
  const closing = sentences(pick, POOLS.closing, 1, ctx);
  const quoteText = sentences(pick, POOLS.quote, 1, ctx);
  const tableRows = d.months.slice(0, 4);

  const build = (l: 0 | 1): Document => {
    const t = (pair: Pair) => pair[l];
    const blocks: Record<string, unknown>[] = [
      p(t(intro), " ", t(["Read our ", "Lees onze "]), rtLink(`destination:${d.slug}`, t([`${d.name[0]} destination page`, `bestemmingspagina over ${d.name[1]}`])), t([" for trip ideas and prices.", " voor reisideeën en prijzen."])),
    ];
    sections.forEach((section, i) => {
      blocks.push(h2(t(section.heading)));
      section.paragraphs.forEach((para) => blocks.push(p(t(para))));

      if (i === 0) blocks.push(embedAsset(photoKey(extras.galleryPhoto)));
      if (i === 0 && type === "thingsToDo") blocks.push(ol(d.activities.map((a) => capitalize(t(a)))));
      if (i === 1 && type === "food") blocks.push(ul(d.foods.map((f) => [`**${capitalize(t(f))}**`, t([" – a must-try", " – een aanrader"])])));
      if (i === 0 && type === "budget") {
        blocks.push(table(
          [t(["Item", "Onderdeel"]), t(["Typical cost", "Gemiddelde prijs"])],
          [
            [t(["Coffee", "Koffie"]), d.currency === "EUR" ? "€ 2" : d.currency === "GBP" ? "£ 3" : "$ 3"],
            [t(["Lunch at a local restaurant", "Lunch in een lokaal restaurant"]), d.currency === "EUR" ? "€ 14" : d.currency === "GBP" ? "£ 15" : "$ 15"],
            [t(["Public transport day pass", "Dagkaart openbaar vervoer"]), d.currency === "EUR" ? "€ 7" : d.currency === "GBP" ? "£ 9" : "$ 8"],
            [t(["Mid-range double room", "Middenklasse tweepersoonskamer"]), d.currency === "EUR" ? "€ 120" : d.currency === "GBP" ? "£ 130" : "$ 140"],
          ],
        ));
      }
      if (i === 0 && type === "bestTime") {
        blocks.push(table(
          [t(["Month", "Maand"]), t(["Why go", "Waarom dan"])],
          tableRows.map((m, j) => [capitalize(MONTH_NAMES[m][l]), t([["Mild weather", "Pleasant evenings", "Quieter sights", "Local festivals"][j], ["Mild weer", "Aangename avonden", "Rustigere bezienswaardigheden", "Lokale feesten"][j]])]),
        ));
      }
      if (i === 1 && extras.withQuote) blocks.push(quote(t(quoteText)));
      if (i === 1 && extras.video) blocks.push(embedEntry(extras.video));
    });
    if (extras.cta) blocks.push(embedEntry(extras.cta));
    if (extras.withRule) blocks.push(hr());
    blocks.push(p(t(closing), " ", t(["Background reading: ", "Achtergrond: "]), link(`https://en.wikipedia.org/wiki/${d.wiki}`, t([`${d.name[0]} on Wikipedia`, `${d.name[1]} op Wikipedia`])), "."));
    return doc(...blocks);
  };
  return [build(0), build(1)];
}

function destinationDescription(faker: Faker, d: DestinationData, ctx: [Ctx, Ctx], articleKeys: string[]): [Document, Document] {
  const pick = picker(faker);
  const intro = sentences(pick, POOLS.intro, 2, ctx);
  const landmarks = sentences(pick, POOLS.landmark, 2, ctx);
  const food = sentences(pick, POOLS.food, 2, ctx);
  const build = (l: 0 | 1): Document => {
    const t = (pair: Pair) => pair[l];
    const blocks: Record<string, unknown>[] = [
      p(t(intro)),
      h2(t(["Highlights", "Hoogtepunten"])),
      p(t(landmarks)),
      ul(d.activities.map((a) => capitalize(t(a)))),
      h2(t(["Food and drink", "Eten en drinken"])),
      p(t(food)),
    ];
    if (articleKeys.length) {
      blocks.push(p(t(["Planning a visit? Start with our ", "Plan je een bezoek? Begin met onze "]), rtLink(articleKeys[0], t(["latest guide", "nieuwste gids"])), "."));
    }
    return doc(...blocks);
  };
  return [build(0), build(1)];
}

/* ------------------------------------------------------------------ build */

export function planArticles(): ArticleInfo[] {
  return Array.from({ length: 55 }, (_, i) => {
    const d = DESTINATIONS[i % DESTINATIONS.length];
    const round = Math.floor(i / DESTINATIONS.length);
    const type = ARTICLE_TYPES[(i + [0, 8, 6][round]) % ARTICLE_TYPES.length];
    const days = d.days;
    const title = fill(ARTICLE_TYPE_DEFS[type].title[0], { name: d.name[0], days, n: 7 + (i % 5) });
    const slug = slugify(title);
    return { key: `article:${slug}`, slug, type, destination: d.slug };
  });
}

export function buildEditorial(faker: Faker, articles: ArticleInfo[]): EntrySpec[] {
  const specs: EntrySpec[] = [];
  const add = (key: string, contentType: string, fields: Fields, extra: Partial<EntrySpec> = {}) => {
    specs.push({ key, contentType, fields, ...extra });
    return key;
  };

  for (const c of CATEGORIES) {
    add(`category:${c.slug}`, "category", {
      name: loc(c.name), slug: one(c.slug), description: loc(c.description), color: one(c.color), icon: one(c.icon),
    });
  }

  for (const a of AUTHORS) {
    const first = a.name.split(" ")[0];
    const bio: Pair = [
      `**${a.name}** is our ${a.role[0].toLowerCase()}, based in ${a.home[0]}. ${first} writes about ${a.focus[0]}.\n\nBefore joining Driftwood, ${first} spent years on the road. Favourite travel tip: _always pack one more pair of socks than you think you need._`,
      `**${a.name}** is onze ${a.role[1].toLowerCase()} en woont in ${a.home[1]}. ${first} schrijft over ${a.focus[1]}.\n\nVoordat ${first} bij Driftwood kwam, was ${first} jarenlang onderweg. Beste reistip: _neem altijd één paar sokken meer mee dan je denkt nodig te hebben._`,
    ];
    add(`author:${a.slug}`, "author", {
      name: one(a.name),
      slug: one(a.slug),
      role: loc(a.role),
      bio: loc(bio),
      avatar: one(assetLink(portraitKey(`author:${a.slug}`))),
      email: one(`${slugify(first)}@driftwood.example`),
      socialLinks: one({ instagram: `https://www.instagram.com/${a.slug.replace(/-/g, "")}`, website: `https://${a.slug}.example.com` }),
      isStaff: one(a.staff),
    });
  }

  const articlesByDestination = new Map<string, ArticleInfo[]>();
  for (const a of articles) articlesByDestination.set(a.destination, [...(articlesByDestination.get(a.destination) ?? []), a]);

  /* destinations */
  for (const d of DESTINATIONS) {
    const tr = !EN_ONLY_DESTINATIONS.has(d.slug);
    const ctx = contexts(d, faker);
    const gallery = [d.hero, ...faker.helpers.arrayElements(PHOTO_IDS.filter((id) => id !== d.hero), faker.number.int({ min: 3, max: 5 }))];
    const introPair = faker.helpers.arrayElement(POOLS.intro);
    const summary: Pair = [`${d.tagline[0]}. ${fill(introPair[0], ctx[0])}`, `${d.tagline[1]}. ${fill(introPair[1], ctx[1])}`];
    const highlights = (l: 0 | 1) => d.activities.map((a) => ({
      title: capitalize(a[l]),
      description: l === 0 ? `One of the experiences our guests love most in ${d.name[0]}.` : `Een van de ervaringen waar onze gasten in ${d.name[1]} het meest van genieten.`,
    }));
    const months = (l: 0 | 1) => d.months.map((m) => MONTH_NAMES[m][l]).join(", ");
    const travelTips: Pair = [
      `### Good to know\n\n- **Best months:** ${months(0)}\n- **Typical trip length:** ${d.days} days\n- **Currency for prices:** ${d.currency}\n\n### Getting around\n\n${fill(POOLS.practical[2][0], ctx[0])} ${fill(POOLS.practical[3][0], ctx[0])}`,
      `### Goed om te weten\n\n- **Beste maanden:** ${months(1)}\n- **Gemiddelde reisduur:** ${d.days} dagen\n- **Valuta van de prijzen:** ${d.currency}\n\n### Vervoer ter plaatse\n\n${fill(POOLS.practical[2][1], ctx[1])} ${fill(POOLS.practical[3][1], ctx[1])}`,
    ];
    const seoKey = add(`seo:destination:${d.slug}`, "seo", {
      internalName: one(`SEO – destination ${d.slug}`),
      metaTitle: loc([`${d.name[0]} trips | Driftwood Travel`, `Reizen naar ${d.name[1]} | Driftwood Travel`], tr),
      metaDescription: loc([`${d.tagline[0]}. Small-group tours and private journeys to ${d.name[0]}, ${d.country[0]}.`, `${d.tagline[1]}. Groepsreizen en privéreizen naar ${d.name[1]}, ${d.country[1]}.`], tr),
      ogImage: one(assetLink(photoKey(d.hero))),
    });
    const relatedKeys = (articlesByDestination.get(d.slug) ?? []).map((a) => a.key);
    const fields: Fields = {
      name: loc(d.name, tr),
      slug: one(d.slug),
      tagline: loc(d.tagline, tr),
      summary: loc(summary, tr),
      heroImage: one(assetLink(photoKey(d.hero))),
      gallery: one(gallery.map((id) => assetLink(photoKey(id)))),
      country: loc(d.country, tr),
      region: one(d.region),
      location: one({ lat: d.lat, lon: d.lon }),
      priceFrom: one(d.priceFrom),
      currency: one(d.currency),
      tripLengthDays: one(d.days),
      bestMonths: one(d.months),
      rating: one(d.rating),
      highlights: loc([highlights(0), highlights(1)], tr),
      travelTips: loc(travelTips, tr),
      description: loc(destinationDescription(faker, d, ctx, relatedKeys), tr),
      featured: one(!!d.featured),
      seo: one(entryLink(seoKey)),
    };
    // Edge case: one destination has unpublished edits on top of its published version.
    const changed = d.slug === "porto";
    add(`destination:${d.slug}`, "destination", fields, changed
      ? { state: "changed", draftFields: { ...fields, summary: loc([`${summary[0]} New for 2027: a two-day Douro Valley extension.`, `${summary[1]} Nieuw in 2027: een tweedaagse verlenging naar de Dourovallei.`], tr) } }
      : {});
  }

  /* articles */
  const authorFor = (type: ArticleType, d: DestinationData) => {
    if (type === "food") return "leilani-santos";
    if (type === "sustainable") return "clara-moreau";
    if (type === "photo") return "jonas-lindqvist";
    if (d.region === "Middle East") return "omar-haddad";
    if (type === "family") return "sofie-de-wit";
    if (KIND_CATEGORY[d.slug] === "adventure" && faker.datatype.boolean()) return "mateo-rossi";
    return faker.helpers.arrayElement(["maren-visser", "tomas-herrera", "sofie-de-wit"]);
  };

  articles.forEach((info, i) => {
    const d = DESTINATIONS.find((x) => x.slug === info.destination)!;
    const def = ARTICLE_TYPE_DEFS[info.type];
    const ctx = contexts(d, faker);
    const n = 7 + (i % 5);
    const title: Pair = [fill(def.title[0], { ...ctx[0], n }), fill(def.title[1], { ...ctx[1], n })];
    const excerpt: Pair = [fill(def.excerpt[0], ctx[0]), fill(def.excerpt[1], ctx[1])];
    const translated = i % 5 !== 4; // every fifth article is English-only
    const body = articleBody(faker, info.type, d, ctx, {
      galleryPhoto: faker.helpers.arrayElement(PHOTO_IDS),
      video: d.slug === "reykjavik" ? "video:iceland" : i % 9 === 3 ? "video:guides" : undefined,
      cta: i % 6 === 2 ? "cta:summer-2026" : i % 6 === 5 ? "cta:newsletter" : undefined,
      withQuote: faker.datatype.boolean(),
      withRule: faker.number.int(9) < 3,
    });
    const categories = [...new Set([def.category, KIND_CATEGORY[d.slug]])];
    const sameDestination = articles.filter((a) => a.destination === info.destination && a.key !== info.key).map((a) => a.key);
    const others = faker.helpers.arrayElements(articles.filter((a) => a.key !== info.key && !sameDestination.includes(a.key)).map((a) => a.key), 3 - Math.min(sameDestination.length, 2));
    const related = [...sameDestination.slice(0, 2), ...others].slice(0, faker.number.int({ min: 2, max: 3 }));
    const publishDate = faker.date.between({ from: "2024-01-08T00:00:00Z", to: "2026-11-10T00:00:00Z" }).toISOString().slice(0, 10);

    const tags: string[] = [];
    if (i % 13 === 7) tags.push("sponsored");
    if (i % 6 === 2) tags.push("campaignSummer2026");
    if (info.type === "guide" || info.type === "bestTime") tags.push("evergreen");
    if (i === 31 || i === 44) tags.push("needsReview");

    const hasSeo = i % 10 !== 9;
    const seoKey = hasSeo
      ? add(`seo:article:${info.slug}`, "seo", {
          internalName: one(`SEO – article ${info.slug}`),
          metaTitle: loc([title[0].length > 52 ? title[0] : `${title[0]} | Driftwood`, title[1].length > 52 ? title[1] : `${title[1]} | Driftwood`], translated),
          metaDescription: loc(excerpt, translated),
          noIndex: i === 12 ? one(true) : undefined,
        })
      : undefined;

    const fields: Fields = {
      title: loc(title, translated),
      slug: one(info.slug),
      excerpt: loc(excerpt, translated),
      heroImage: one(assetLink(photoKey(i < 25 && i % 2 === 0 ? d.hero : faker.helpers.arrayElement(PHOTO_IDS)))),
      body: loc(body, translated),
      author: one(entryLink(`author:${authorFor(info.type, d)}`)),
      categories: one(categories.map((c) => entryLink(`category:${c}`))),
      destinations: one([entryLink(`destination:${d.slug}`)]),
      tags: one([d.name[0].toLowerCase(), d.country[0].toLowerCase(), info.type.replace(/([A-Z])/g, " $1").toLowerCase()]),
      publishDate: one(publishDate),
      readingTimeMinutes: i % 5 < 3 ? one(faker.number.int({ min: 4, max: 9 })) : undefined,
      featured: one(i % 9 === 0),
      relatedArticles: one(related.map((k) => entryLink(k))),
      seo: seoKey ? one(entryLink(seoKey)) : undefined,
    };

    // Edge case: one article has unpublished edits on top of its published version.
    const changed = i === 20;
    add(info.key, "article", fields, {
      tags,
      ...(changed
        ? { state: "changed" as const, draftFields: { ...fields, title: loc([`${title[0]} (2027 update)`, `${title[1]} (update 2027)`], translated) } }
        : {}),
    });
  });

  /* edge cases outside the 100 published pages */
  const lisbon = DESTINATIONS[0];
  const lisbonCtx = contexts(lisbon, faker);
  const draftBody = articleBody(faker, "hiddenGems", lisbon, lisbonCtx, { galleryPhoto: 74, withQuote: false, withRule: false });

  // 1. Complete draft, scheduled to be published in the future (see scheduled action in index.ts).
  add("article:draft-winter-in-lisbon", "article", {
    title: loc(["Winter in Lisbon: why the off-season is the best season", "Winter in Lissabon: waarom het laagseizoen het beste seizoen is"]),
    slug: one("winter-in-lisbon"),
    excerpt: loc(["Quiet miradouros, roasted chestnuts and the softest light of the year.", "Rustige miradouros, gepofte kastanjes en het zachtste licht van het jaar."]),
    heroImage: one(assetLink(photoKey(74))),
    body: loc(draftBody),
    author: one(entryLink("author:tomas-herrera")),
    categories: one([entryLink("category:city-breaks")]),
    destinations: one([entryLink("destination:lisbon")]),
    publishDate: one("2027-01-15"),
  }, { state: "draft" });

  // 2. Incomplete draft: required fields (heroImage, body, author) are missing, so it can't be published as-is.
  add("article:draft-northern-lights", "article", {
    title: loc(["Chasing the northern lights: a beginner's guide", "Op jacht naar het noorderlicht: een gids voor beginners"]),
    slug: one("chasing-the-northern-lights"),
    excerpt: loc(["TODO: write intro", "TODO: intro schrijven"]),
    categories: one([entryLink("category:adventure")]),
    tags: one(["iceland", "aurora"]),
  }, { state: "draft", tags: ["needsReview"] });

  // 3. English-only draft with a body but no translation.
  add("article:draft-packing-list", "article", {
    title: one("The only packing list you'll ever need"),
    slug: one("the-only-packing-list-youll-ever-need"),
    excerpt: one("Our travel designers share what's always in their bags."),
    heroImage: one(assetLink(photoKey(183))),
    body: one(doc(p("Draft – our travel designers are still arguing about whether a travel pillow is essential."), ul(["Passport and copies", "Universal adapter", "Reusable water bottle", "One more pair of socks than you think"]))),
    author: one(entryLink("author:maren-visser")),
    categories: one([entryLink("category:travel-tips")]),
    publishDate: one("2026-12-01"),
  }, { state: "draft" });

  // 4. Archived article from an old campaign.
  add("article:archived-flash-sale-2019", "article", {
    title: loc(["Flash sale: 25% off city breaks this summer", "Flash sale: 25% korting op stedentrips deze zomer"]),
    slug: one("flash-sale-city-breaks-2019"),
    excerpt: loc(["Only this week: save on city breaks to Lisbon, Porto and Seville.", "Alleen deze week: korting op stedentrips naar Lissabon, Porto en Sevilla."]),
    heroImage: one(assetLink(photoKey(163))),
    body: loc([doc(p("This offer has expired.")), doc(p("Deze aanbieding is verlopen."))]),
    author: one(entryLink("author:maren-visser")),
    categories: one([entryLink("category:city-breaks"), entryLink("category:budget-travel")]),
    publishDate: one("2019-06-03"),
  }, { state: "archived" });

  return specs;
}
