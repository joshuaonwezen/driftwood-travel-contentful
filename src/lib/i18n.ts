export const LOCALES = ["en", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** URL prefix -> Contentful locale code. */
export const CONTENTFUL_LOCALE: Record<Locale, string> = { en: "en-US", nl: "nl-NL" };

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** UI strings that are part of the code, not the CMS. */
const dictionaries = {
  en: {
    readMore: "Read more",
    minRead: "min read",
    by: "By",
    journal: "Journal",
    journalIntro: "Destination guides, food tips and stories from the road, written by our team.",
    allStories: "All stories",
    categories: "Categories",
    relatedArticles: "Keep reading",
    storiesFrom: "Stories from",
    destinations: "Destinations",
    destinationsIntro: "25 places we know inside out. Filter by region to find your next trip.",
    allRegions: "All regions",
    from: "From",
    perPerson: "per person",
    days: "days",
    bestMonths: "Best months",
    rating: "Guest rating",
    highlights: "Experiences we love",
    travelTips: "Travel tips",
    gallery: "Gallery",
    location: "Location",
    articlesBy: "Articles by",
    sponsored: "Sponsored",
    page: "Page",
    previous: "Previous",
    next: "Next",
    previewMode: "Preview mode: you are seeing draft content.",
    exitPreview: "Exit preview",
    notFoundTitle: "Page not found",
    notFoundText: "We couldn't find that page. It may have moved, or it never existed.",
    backHome: "Back to the homepage",
    language: "Language",
    menu: "Menu",
    publishedOn: "Published",
  },
  nl: {
    readMore: "Lees verder",
    minRead: "min lezen",
    by: "Door",
    journal: "Magazine",
    journalIntro: "Bestemmingsgidsen, eettips en verhalen van onderweg, geschreven door ons team.",
    allStories: "Alle verhalen",
    categories: "Categorieën",
    relatedArticles: "Lees ook",
    storiesFrom: "Verhalen uit",
    destinations: "Bestemmingen",
    destinationsIntro: "25 plekken die we als onze broekzak kennen. Filter op regio en vind je volgende reis.",
    allRegions: "Alle regio's",
    from: "Vanaf",
    perPerson: "per persoon",
    days: "dagen",
    bestMonths: "Beste maanden",
    rating: "Beoordeling",
    highlights: "Ervaringen die we aanraden",
    travelTips: "Reistips",
    gallery: "Foto's",
    location: "Locatie",
    articlesBy: "Artikelen van",
    sponsored: "Gesponsord",
    page: "Pagina",
    previous: "Vorige",
    next: "Volgende",
    previewMode: "Previewmodus: je ziet conceptinhoud.",
    exitPreview: "Preview sluiten",
    notFoundTitle: "Pagina niet gevonden",
    notFoundText: "We konden deze pagina niet vinden. Misschien is hij verplaatst, of heeft hij nooit bestaan.",
    backHome: "Terug naar de homepage",
    language: "Taal",
    menu: "Menu",
    publishedOn: "Gepubliceerd",
  },
} satisfies Record<Locale, Record<string, string>>;

export type Dictionary = (typeof dictionaries)["en"];
export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

const REGION_NL: Record<string, string> = {
  Europe: "Europa",
  Asia: "Azië",
  Africa: "Afrika",
  "North America": "Noord-Amerika",
  "South America": "Zuid-Amerika",
  Oceania: "Oceanië",
  "Middle East": "Midden-Oosten",
};
/** Region is a non-localized enum in Contentful, so its labels are translated in code. */
export const regionLabel = (region: string, locale: Locale) => (locale === "nl" ? (REGION_NL[region] ?? region) : region);

export const monthLabel = (month: string, locale: Locale) =>
  new Date(`2001-${String(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month) + 1).padStart(2, "0")}-15`).toLocaleDateString(
    CONTENTFUL_LOCALE[locale],
    { month: "long" },
  );

export const formatDate = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(CONTENTFUL_LOCALE[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export const formatPrice = (amount: number, currency: string, locale: Locale) =>
  new Intl.NumberFormat(CONTENTFUL_LOCALE[locale], { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
