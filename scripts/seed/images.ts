import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "../lib/env";

/** Picsum photo id, photographer, alt text (en, nl). Picsum serves Unsplash photos. */
const PHOTOS: [number, string, string, string][] = [
  [10, "Paul Jarvis", "Forest above a mountain lake", "Bos boven een bergmeer"],
  [11, "Paul Jarvis", "Misty river valley", "Mistige riviervallei"],
  [12, "Paul Jarvis", "Rocky beach at low tide", "Rotsstrand bij eb"],
  [13, "Paul Jarvis", "Pebble beach lined with pine trees", "Kiezelstrand met dennenbomen"],
  [14, "Paul Jarvis", "Rocky shoreline under a pale sky", "Rotsachtige kust onder een bleke lucht"],
  [15, "Paul Jarvis", "Waterfall in a mossy gorge", "Waterval in een bemoste kloof"],
  [16, "Paul Jarvis", "Sea inlet with small islands", "Zeearm met kleine eilanden"],
  [17, "Paul Jarvis", "Gravel path through a meadow", "Grindpad door een weiland"],
  [27, "Yoni Kaplan-Nadel", "Walker on a sandy shore", "Wandelaar op een zandstrand"],
  [28, "Jerry Adney", "Green river canyon", "Groene rivierkloof"],
  [29, "Go Wild", "Snow-capped mountain range", "Besneeuwde bergketen"],
  [37, "Austin Neill", "Coastal cliff with wildflowers", "Kustklif met wilde bloemen"],
  [46, "Jeffrey Kam", "Layered desert hills", "Gelaagde woestijnheuvels"],
  [49, "Margaret Barley", "Whitewashed village with windmills", "Witgekalkt dorp met windmolens"],
  [54, "Nicholas Swanson", "Hilltop under a blue sky", "Heuveltop onder een blauwe lucht"],
  [62, "Daniel Genser", "Sunrise over forested hills", "Zonsopkomst boven beboste heuvels"],
  [66, "Nicholas Swanson", "Mountain meadow under clouds", "Bergweide onder de wolken"],
  [71, "Jon Eckert", "Lakeside meadow at sunset", "Weide aan het meer bij zonsondergang"],
  [74, "Isaak Dury", "Bay with a city skyline", "Baai met een stadssilhouet"],
  [76, "Alexander Shustov", "Wooden cabin with a bicycle", "Houten hut met een fiets"],
  [77, "May Pamintuan", "Wooden pier with a pavilion", "Houten pier met een paviljoen"],
  [85, "Gozha Net", "Hay bales in a harvested field", "Hooibalen op een geoogst veld"],
  [92, "Rafael Souza", "Shell-covered beach", "Strand vol schelpen"],
  [100, "Tina Rataj", "Busy beach in summer", "Druk strand in de zomer"],
  [103, "Ilham Rahmansyah", "Relaxing on the grass in a park", "Ontspannen op het gras in een park"],
  [108, "Florian Klauer", "Palm trees on a hazy beach", "Palmbomen op een heiig strand"],
  [110, "Kenneth Thewissen", "Sunset over the countryside", "Zonsondergang boven het platteland"],
  [116, "Anton Sulsky", "Cypress-lined farmhouse on a hill", "Boerderij met cipressen op een heuvel"],
  [118, "Rick Waalders", "Rolling hills with thistles", "Glooiende heuvels met distels"],
  [122, "Vadim Sherbakov", "City skyline at night", "Stadssilhouet bij nacht"],
  [124, "Anton Sulsky", "Red boat on turquoise water", "Rode boot op turquoise water"],
  [125, "Rick Waalders", "Lake between dry hills", "Meer tussen droge heuvels"],
  [128, "Matteo Minelli", "Alpine lake with reeds", "Bergmeer met riet"],
  [129, "Charlie Foster", "Couple on a bench by the sea", "Stel op een bankje aan zee"],
  [132, "Peter Besser", "Road at sunset after rain", "Weg bij zonsondergang na de regen"],
  [142, "Vadim Sherbakov", "Château at the end of an avenue", "Kasteel aan het eind van een laan"],
  [154, "Christopher Sardegna", "Misty beach with walkers", "Mistig strand met wandelaars"],
  [155, "Christopher Sardegna", "Railway along the coast", "Spoorlijn langs de kust"],
  [162, "Dillon McIntosh", "Aerial view of a coastline", "Luchtfoto van een kustlijn"],
  [163, "Linh Nguyen", "Café terrace with plants", "Caféterras met planten"],
  [164, "Linh Nguyen", "Canal with boats and old houses", "Gracht met boten en oude huizen"],
  [165, "Linh Nguyen", "Golden fields under a blue sky", "Gouden velden onder een blauwe lucht"],
  [174, "Linh Nguyen", "Hot air balloon over palm trees", "Luchtballon boven palmbomen"],
  [176, "Good Free Photos", "Harbour wall at dusk", "Havenmuur in de schemering"],
  [177, "Danka & Peter", "Hiker in a mountain valley", "Wandelaar in een bergdal"],
  [179, "Angelina Odemchuk", "Waves breaking on coastal rocks", "Golven op kustrotsen"],
  [182, "Andrea Boldizsar", "Road past wind turbines", "Weg langs windturbines"],
  [183, "müllermarc", "Vintage camper van", "Klassiek kampeerbusje"],
  [188, "Wojtek Witkowski", "City rooftops in winter", "Daken van de stad in de winter"],
  [191, "Alex Talmon", "Winding mountain road", "Kronkelende bergweg"],
  [193, "Vadim Sherbakov", "Historic college and lawn", "Historisch college met grasveld"],
  [196, "Dyaa Eldin Moustafa", "Desert dunes with footprints", "Woestijnduinen met voetafdrukken"],
  [197, "Kholodnitskiy Maksim", "Railway through a pine forest", "Spoorlijn door een dennenbos"],
  [199, "Beto Galetto", "Boardwalk to the beach", "Vlonderpad naar het strand"],
  [200, "Elias Carlsson", "Highland cow in the dunes", "Schotse hooglander in de duinen"],
  [203, "Diogo Tavares", "Cyclist resting by a lake", "Fietser rust uit bij een meer"],
  [204, "Tiago Gerken", "Railway bridge in the hills", "Spoorbrug in de heuvels"],
  [206, "Philipp Reiner", "Farm at sunrise", "Boerderij bij zonsopkomst"],
];

export const PHOTO_IDS = PHOTOS.map(([id]) => id);
export const photoKey = (picsumId: number) => `asset:photo-${picsumId}`;

/** Pravatar portraits used for authors and testimonials. */
export const PORTRAITS: Record<string, number> = {
  "author:maren-visser": 26,
  "author:tomas-herrera": 12,
  "author:leilani-santos": 35,
  "author:omar-haddad": 59,
  "author:sofie-de-wit": 31,
  "author:jonas-lindqvist": 53,
  "author:clara-moreau": 44,
  "author:mateo-rossi": 60,
  "testimonial:hannah": 47,
  "testimonial:amara": 49,
  "testimonial:peter": 13,
  "testimonial:lotte": 24,
  "testimonial:ravi": 67,
  "testimonial:henk": 69,
};
export const portraitKey = (personKey: string) => `asset:portrait-${personKey.split(":")[1]}`;

export const LOGO_KEY = "asset:logo";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="48" viewBox="0 0 240 48">
<path d="M6 34c8-10 16-10 24 0s16 10 24 0" fill="none" stroke="#1f6f8b" stroke-width="4" stroke-linecap="round"/>
<path d="M10 22c6-7 12-7 18 0" fill="none" stroke="#c98b4a" stroke-width="4" stroke-linecap="round"/>
<text x="64" y="32" font-family="Georgia, serif" font-size="22" fill="#1d2a33">Driftwood Travel</text>
</svg>`;

export type AssetSpec = {
  key: string;
  fileName: string;
  contentType: string;
  title: { "en-US": string; "nl-NL"?: string };
  description: { "en-US": string; "nl-NL"?: string };
  load: () => Promise<Buffer>;
};

const CACHE = resolve(ROOT, ".cache/images");

async function cached(name: string, url: string): Promise<Buffer> {
  mkdirSync(CACHE, { recursive: true });
  const file = resolve(CACHE, name);
  if (existsSync(file)) return readFileSync(file);
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(file, buf);
      return buf;
    }
    if (attempt >= 4) throw new Error(`Download failed (${res.status}): ${url}`);
    await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
}

export function assetSpecs(): AssetSpec[] {
  const photos: AssetSpec[] = PHOTOS.map(([id, author, en, nl]) => ({
    key: photoKey(id),
    fileName: `photo-${id}.jpg`,
    contentType: "image/jpeg",
    title: { "en-US": en, "nl-NL": nl },
    description: { "en-US": `${en}. Photo: ${author} / Unsplash`, "nl-NL": `${nl}. Foto: ${author} / Unsplash` },
    load: () => cached(`photo-${id}.jpg`, `https://picsum.photos/id/${id}/1600/1000.jpg`),
  }));

  const portraits: AssetSpec[] = Object.entries(PORTRAITS).map(([personKey, img]) => {
    const slug = personKey.split(":")[1];
    return {
      key: portraitKey(personKey),
      fileName: `portrait-${slug}.jpg`,
      contentType: "image/jpeg",
      title: { "en-US": `Portrait: ${slug}` },
      description: { "en-US": "Portrait photo", "nl-NL": "Portretfoto" },
      load: () => cached(`portrait-${img}.jpg`, `https://i.pravatar.cc/400?img=${img}`),
    };
  });

  const logo: AssetSpec = {
    key: LOGO_KEY,
    fileName: "driftwood-logo.svg",
    contentType: "image/svg+xml",
    title: { "en-US": "Driftwood Travel logo" },
    description: { "en-US": "Driftwood Travel" },
    load: async () => Buffer.from(LOGO_SVG),
  };

  return [logo, ...photos, ...portraits];
}
