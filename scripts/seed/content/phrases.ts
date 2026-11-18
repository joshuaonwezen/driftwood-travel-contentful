/**
 * Bilingual phrase banks. Every entry is an [English, Dutch] pair so a picked
 * sentence and its translation stay in sync. Slots: {name} {country} {landmark1}
 * {landmark2} {food1} {food2} {act1} {act2} {act3} {month} {months} {days}.
 */
export type Pair = [en: string, nl: string];

export const POOLS: Record<string, Pair[]> = {
  intro: [
    ["{name} has a way of slowing you down in the best possible sense.", "{name} dwingt je op de beste manier om een tandje terug te schakelen."],
    ["Few places in {country} reward curious travellers quite like {name}.", "Weinig plekken in {country} belonen nieuwsgierige reizigers zoals {name} dat doet."],
    ["We have sent hundreds of guests to {name}, and most come back planning a second trip.", "We hebben honderden reizigers naar {name} gestuurd, en de meesten plannen meteen een tweede reis."],
    ["Whether it's your first visit or your fifth, {name} still has surprises up its sleeve.", "Of het nu je eerste of vijfde bezoek is, {name} heeft altijd nog verrassingen in petto."],
    ["Ask our travel designers for their favourite place in {country} and {name} comes up every time.", "Vraag onze reisontwerpers naar hun favoriete plek in {country} en {name} valt steevast."],
    ["The secret to {name} is to plan the big sights early and leave your afternoons open.", "Het geheim van {name}: plan de grote bezienswaardigheden vroeg en houd je middagen vrij."],
    ["{name} is at its best when you treat it as a place to live for a few days, not a checklist.", "{name} is op zijn best als je er een paar dagen woont, in plaats van een lijstje af te werken."],
    ["There is a reason {name} keeps topping our guests' wish lists year after year.", "Er is een reden dat {name} jaar na jaar bovenaan de verlanglijst van onze gasten staat."],
  ],
  landmark: [
    ["Start with {landmark1}, ideally before the tour groups arrive.", "Begin bij {landmark1}, het liefst voordat de groepen arriveren."],
    ["{landmark2} is busy for a reason, but a late visit feels like a different place entirely.", "{landmark2} is niet voor niets druk, maar 's avonds laat voelt het als een heel andere plek."],
    ["Give {landmark1} at least half a day; rushing it is the most common mistake we see.", "Trek minstens een halve dag uit voor {landmark1}; haasten is de meest gemaakte fout."],
    ["Our guides like to approach {landmark2} on foot, so you see how it fits into the landscape.", "Onze gidsen benaderen {landmark2} graag te voet, zodat je ziet hoe het in het landschap past."],
    ["Book tickets for {landmark1} online a few days ahead, especially in {month}.", "Boek tickets voor {landmark1} een paar dagen vooraf online, zeker in {month}."],
    ["From {landmark2} it's an easy walk to quieter streets where locals spend their evenings.", "Vanaf {landmark2} loop je zo naar rustigere straten waar de locals hun avonden doorbrengen."],
    ["Photos of {landmark1} never quite capture the scale; you have to stand there yourself.", "Foto's van {landmark1} laten nooit echt de schaal zien; je moet er zelf staan."],
  ],
  food: [
    ["Don't leave without trying {food1}; every family seems to have its own version.", "Vertrek niet zonder {food1} te proeven; elke familie heeft zijn eigen versie."],
    ["For something more filling, order {food2} at a place where the menu is handwritten.", "Wil je iets stevigers, bestel dan {food2} op een plek met een handgeschreven menu."],
    ["Markets are the best place to taste {food1} cheaply and in good company.", "Op markten proef je {food1} goedkoop en in goed gezelschap."],
    ["Lunch is the main meal for many locals, so that's when {food2} is at its freshest.", "Voor veel locals is de lunch de hoofdmaaltijd, dus dan is {food2} het verst."],
    ["Our guests rave about a cooking class where you make {food2} from scratch.", "Onze gasten zijn lyrisch over een kookworkshop waarin je zelf {food2} maakt."],
    ["Skip the restaurants with photo menus near the main square and follow the queues instead.", "Sla de restaurants met fotomenu's bij het hoofdplein over en volg de rijen."],
    ["Ask your host where they eat {food1}; the answer is rarely the place in the guidebook.", "Vraag je gastheer waar hij {food1} eet; het antwoord is zelden de plek uit de reisgids."],
  ],
  activity: [
    ["If you only do one thing, {act1}.", "Doe je maar één ding, ga dan {act1}."],
    ["On a slower day, {act2} and let the afternoon unfold.", "Op een rustige dag kun je {act2} en de middag op je af laten komen."],
    ["Many guests tell us the highlight of their trip was the chance to {act3}.", "Veel gasten vertellen ons dat {act3} het hoogtepunt van hun reis was."],
    ["It's easy to {act1} independently, but a local guide adds stories you won't find online.", "Je kunt prima zelfstandig {act1}, maar een lokale gids vertelt verhalen die je online niet vindt."],
    ["Set an early alarm at least once to {act2}; the light is worth it.", "Zet minstens één keer vroeg de wekker om {act2}; het licht is het waard."],
    ["Families and first-timers love to {act3}.", "Gezinnen en nieuwkomers vinden het geweldig om {act3}."],
    ["Leave one day completely unplanned; that's usually when you end up deciding to {act2}.", "Laat één dag helemaal ongepland; dan besluit je meestal om {act2}."],
  ],
  practical: [
    ["The best months to visit are {months}, when the weather is kind and the crowds are thinner.", "De beste maanden voor een bezoek zijn {months}, als het weer meezit en het minder druk is."],
    ["Plan on at least {days} days to see the highlights without rushing.", "Reken op minstens {days} dagen om de hoogtepunten zonder haast te zien."],
    ["Public transport is reliable, but walking is often the fastest way to get around the centre.", "Het openbaar vervoer is betrouwbaar, maar lopen is in het centrum vaak het snelst."],
    ["Card payments are widely accepted, though small cafés and markets may prefer cash.", "Pinnen kan bijna overal, al hebben kleine cafés en markten liever contant geld."],
    ["Pack layers: mornings and evenings can be surprisingly cool, even in summer.", "Neem laagjes mee: ochtenden en avonden kunnen zelfs in de zomer verrassend koel zijn."],
    ["Book accommodation early for {month}, which is peak season.", "Boek je accommodatie op tijd voor {month}, want dan is het hoogseizoen."],
    ["A refillable water bottle saves money and plastic along the way.", "Een navulbare waterfles bespaart onderweg geld en plastic."],
    ["Learn a few words of the local language; it opens more doors than any guidebook.", "Leer een paar woorden van de lokale taal; dat opent meer deuren dan welke reisgids ook."],
  ],
  closing: [
    ["However you plan it, {name} is a destination that rewards a slower pace.", "Hoe je het ook plant, {name} beloont wie het rustig aan doet."],
    ["Want help planning? Our travel designers know {name} inside out.", "Hulp nodig bij het plannen? Onze reisontwerpers kennen {name} als hun broekzak."],
    ["Pack light, stay curious and leave room in your schedule for {name} to surprise you.", "Reis licht, blijf nieuwsgierig en laat ruimte in je planning zodat {name} je kan verrassen."],
    ["We hope this guide helps you get more out of your time in {country}.", "We hopen dat deze gids je helpt meer uit je tijd in {country} te halen."],
    ["See you on the road, and send us your photos from {name}!", "Tot onderweg, en stuur ons je foto's uit {name}!"],
  ],
  quote: [
    ["The best trips are the ones where you come home with more questions than answers.", "De beste reizen zijn die waarvan je thuiskomt met meer vragen dan antwoorden."],
    ["Travel slowly enough that a place has time to introduce itself.", "Reis zo langzaam dat een plek de tijd heeft om zich voor te stellen."],
    ["In {name}, the detours are usually better than the destination.", "In {name} zijn de omwegen meestal mooier dan de bestemming."],
    ["Eat where the locals queue, and you'll rarely go wrong.", "Eet waar de locals in de rij staan, dan zit je zelden fout."],
    ["Every visit to {name} teaches me something new.", "Elk bezoek aan {name} leert me iets nieuws."],
  ],
};

export type ArticleType =
  | "guide" | "thingsToDo" | "food" | "itinerary" | "budget"
  | "bestTime" | "hiddenGems" | "family" | "sustainable" | "photo";

export const ARTICLE_TYPES: ArticleType[] = [
  "guide", "thingsToDo", "food", "itinerary", "budget", "bestTime", "hiddenGems", "family", "sustainable", "photo",
];

type TypeDef = {
  title: Pair;
  excerpt: Pair;
  category: string;
  /** Section heading + the pool its paragraphs draw from. */
  sections: [heading: Pair, pool: keyof typeof POOLS][];
};

export const ARTICLE_TYPE_DEFS: Record<ArticleType, TypeDef> = {
  guide: {
    title: ["A first-timer's guide to {name}", "{name} voor beginners: alles wat je moet weten"],
    excerpt: ["Everything you need for a first visit to {name}: what to see, what to eat and how to get around.", "Alles voor je eerste bezoek aan {name}: wat je moet zien, wat je moet eten en hoe je je verplaatst."],
    category: "guides",
    sections: [
      [["Why go to {name}", "Waarom naar {name}"], "landmark"],
      [["Getting your bearings", "Wegwijs worden"], "activity"],
      [["What to eat", "Wat je moet eten"], "food"],
      [["Practical tips", "Praktische tips"], "practical"],
    ],
  },
  thingsToDo: {
    title: ["{n} unforgettable things to do in {name}", "{n} onvergetelijke dingen om te doen in {name}"],
    excerpt: ["From {landmark1} to {food1}, these are the experiences our guests rave about in {name}.", "Van {landmark1} tot {food1}: dit zijn de ervaringen waar onze gasten in {name} over blijven praten."],
    category: "guides",
    sections: [
      [["The classics", "De klassiekers"], "landmark"],
      [["Off the beaten path", "Abseits van de gebaande paden"], "activity"],
      [["Eat and drink", "Eten en drinken"], "food"],
    ],
  },
  food: {
    title: ["Where to eat in {name}: a local's guide", "Eten in {name}: tips van een local"],
    excerpt: ["Our favourite dishes, markets and tables in {name}, from {food1} to {food2}.", "Onze favoriete gerechten, markten en adressen in {name}, van {food1} tot {food2}."],
    category: "food-and-drink",
    sections: [
      [["Breakfast like a local", "Ontbijten als een local"], "food"],
      [["The dishes to try", "Gerechten die je moet proeven"], "food"],
      [["Markets and street food", "Markten en straatvoedsel"], "activity"],
    ],
  },
  itinerary: {
    title: ["How to spend {days} days in {name}", "Zo breng je {days} dagen door in {name}"],
    excerpt: ["A relaxed {days}-day plan for {name} that balances the big sights with time to wander.", "Een ontspannen plan van {days} dagen voor {name}, met de grote trekpleisters én tijd om te dwalen."],
    category: "guides",
    sections: [
      [["Day 1: the essentials", "Dag 1: de hoogtepunten"], "landmark"],
      [["Day 2: slow down", "Dag 2: rustig aan"], "activity"],
      [["Day 3 and beyond", "Dag 3 en verder"], "food"],
      [["Where to stay", "Waar je verblijft"], "practical"],
    ],
  },
  budget: {
    title: ["{name} on a budget: how to travel well for less", "{name} met een klein budget: goed reizen voor minder"],
    excerpt: ["Yes, you can enjoy {name} without overspending. Here's how.", "Ja, je kunt genieten van {name} zonder veel uit te geven. Zo doe je dat."],
    category: "budget-travel",
    sections: [
      [["What things cost", "Wat dingen kosten"], "practical"],
      [["Free things to do", "Gratis activiteiten"], "activity"],
      [["Saving on food", "Besparen op eten"], "food"],
    ],
  },
  bestTime: {
    title: ["The best time to visit {name}", "De beste reistijd voor {name}"],
    excerpt: ["When to go to {name} for good weather, fewer crowds and better prices.", "Wanneer je naar {name} gaat voor goed weer, minder drukte en betere prijzen."],
    category: "travel-tips",
    sections: [
      [["Month by month", "Per maand"], "practical"],
      [["Peak season", "Hoogseizoen"], "landmark"],
      [["Shoulder season", "Tussenseizoen"], "activity"],
    ],
  },
  hiddenGems: {
    title: ["Hidden gems of {name} that most visitors miss", "Verborgen parels van {name} die de meeste bezoekers missen"],
    excerpt: ["Skip the queues and discover the {name} that locals love.", "Sla de rijen over en ontdek het {name} waar locals van houden."],
    category: "culture",
    sections: [
      [["Beyond the obvious", "Voorbij de bekende plekken"], "landmark"],
      [["Neighbourhoods worth the detour", "Wijken die de omweg waard zijn"], "activity"],
      [["Local favourites", "Favorieten van locals"], "food"],
    ],
  },
  family: {
    title: ["{name} with kids: a family travel guide", "{name} met kinderen: tips voor gezinnen"],
    excerpt: ["Kid-friendly activities, food and practical tips for a family trip to {name}.", "Kindvriendelijke activiteiten, eten en praktische tips voor een gezinsreis naar {name}."],
    category: "family-travel",
    sections: [
      [["Why {name} works for families", "Waarom {name} geschikt is voor gezinnen"], "intro"],
      [["Kid-approved activities", "Activiteiten die kinderen leuk vinden"], "activity"],
      [["Practical tips for parents", "Praktische tips voor ouders"], "practical"],
    ],
  },
  sustainable: {
    title: ["How to visit {name} responsibly", "Duurzaam en bewust reizen naar {name}"],
    excerpt: ["Simple ways to make your trip to {name} better for the people and places you visit.", "Eenvoudige manieren om je reis naar {name} beter te maken voor de mensen en plekken die je bezoekt."],
    category: "sustainable-travel",
    sections: [
      [["Getting there with a lighter footprint", "Er komen met een kleinere voetafdruk"], "practical"],
      [["Support local businesses", "Steun lokale ondernemers"], "food"],
      [["Respect the places you visit", "Respecteer de plekken die je bezoekt"], "landmark"],
    ],
  },
  photo: {
    title: ["The most photogenic spots in {name}", "De mooiste fotoplekken in {name}"],
    excerpt: ["Where to point your camera in {name}, and when to be there for the best light.", "Waar je je camera op richt in {name}, en wanneer je er moet zijn voor het mooiste licht."],
    category: "culture",
    sections: [
      [["Golden hour favourites", "Favorieten voor het gouden uur"], "landmark"],
      [["Street life", "Straatleven"], "activity"],
      [["Gear and etiquette", "Uitrusting en etiquette"], "practical"],
    ],
  },
};

export const MONTH_NAMES: Record<string, Pair> = {
  jan: ["January", "januari"], feb: ["February", "februari"], mar: ["March", "maart"], apr: ["April", "april"],
  may: ["May", "mei"], jun: ["June", "juni"], jul: ["July", "juli"], aug: ["August", "augustus"],
  sep: ["September", "september"], oct: ["October", "oktober"], nov: ["November", "november"], dec: ["December", "december"],
};

/** Generic legal / policy sentences for the legal pages. */
export const LEGAL: Pair[] = [
  ["Driftwood Travel processes personal data only for the purposes described in this document.", "Driftwood Travel verwerkt persoonsgegevens uitsluitend voor de doeleinden die in dit document worden beschreven."],
  ["We keep booking records for seven years to comply with tax legislation.", "We bewaren boekingsgegevens zeven jaar om te voldoen aan de belastingwetgeving."],
  ["You can request a copy of your data, or ask us to delete it, at any time.", "Je kunt op elk moment een kopie van je gegevens opvragen of ons vragen deze te verwijderen."],
  ["We share traveller details with hotels and local partners only when this is needed to deliver your trip.", "We delen reizigersgegevens alleen met hotels en lokale partners als dat nodig is om je reis uit te voeren."],
  ["Payments are processed by an external payment provider; we never store full card numbers.", "Betalingen worden verwerkt door een externe betaalprovider; we slaan nooit volledige kaartnummers op."],
  ["Analytics cookies are only placed after you give consent.", "Analytische cookies worden alleen geplaatst nadat je toestemming hebt gegeven."],
  ["These terms apply to every booking made through our website, by phone or by email.", "Deze voorwaarden gelden voor elke boeking via onze website, telefonisch of per e-mail."],
  ["A booking is confirmed once you receive a written confirmation and the deposit has been paid.", "Een boeking is bevestigd zodra je een schriftelijke bevestiging hebt ontvangen en de aanbetaling is voldaan."],
  ["Prices are per person, based on two people sharing, unless stated otherwise.", "Prijzen zijn per persoon, op basis van twee personen per kamer, tenzij anders vermeld."],
  ["We may change an itinerary if local circumstances make this necessary for your safety.", "We kunnen een reisschema aanpassen als lokale omstandigheden dat voor je veiligheid noodzakelijk maken."],
];
