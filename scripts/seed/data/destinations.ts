type T = [en: string, nl: string];

export type DestinationData = {
  slug: string;
  name: T;
  country: T;
  region: "Europe" | "Asia" | "Africa" | "North America" | "South America" | "Oceania" | "Middle East";
  lat: number;
  lon: number;
  currency: "EUR" | "USD" | "GBP";
  priceFrom: number;
  days: number;
  months: string[];
  rating: number;
  hero: number; // picsum id
  tagline: T;
  landmarks: [T, T];
  foods: [T, T];
  activities: [T, T, T];
  wiki: string;
  featured?: boolean;
};

export const DESTINATIONS: DestinationData[] = [
  {
    slug: "lisbon", name: ["Lisbon", "Lissabon"], country: ["Portugal", "Portugal"], region: "Europe",
    lat: 38.7223, lon: -9.1393, currency: "EUR", priceFrom: 649, days: 5, months: ["mar", "apr", "may", "sep", "oct"], rating: 4.7, hero: 74,
    tagline: ["Hills, trams and golden light", "Heuvels, trams en gouden licht"],
    landmarks: [["the Belém Tower", "de Toren van Belém"], ["the Alfama district", "de wijk Alfama"]],
    foods: [["pastéis de nata", "pastéis de nata"], ["grilled sardines", "gegrilde sardines"]],
    activities: [["ride the historic Tram 28", "met de historische tram 28 rijden"], ["watch the sunset from a miradouro", "de zonsondergang zien vanaf een miradouro"], ["take a day trip to Sintra", "een dagtocht naar Sintra maken"]],
    wiki: "Lisbon", featured: true,
  },
  {
    slug: "porto", name: ["Porto", "Porto"], country: ["Portugal", "Portugal"], region: "Europe",
    lat: 41.1579, lon: -8.6291, currency: "EUR", priceFrom: 579, days: 4, months: ["apr", "may", "jun", "sep"], rating: 4.6, hero: 176,
    tagline: ["Port wine and riverside tiles", "Portwijn en tegels aan de rivier"],
    landmarks: [["the Dom Luís I Bridge", "de Dom Luís I-brug"], ["the Ribeira waterfront", "de kade van Ribeira"]],
    foods: [["francesinha", "francesinha"], ["port wine", "portwijn"]],
    activities: [["tour the port lodges of Gaia", "de portwijnkelders in Gaia bezoeken"], ["cruise the Douro River", "een boottocht over de Douro maken"], ["browse the Livraria Lello", "rondneuzen in de Livraria Lello"]],
    wiki: "Porto",
  },
  {
    slug: "seville", name: ["Seville", "Sevilla"], country: ["Spain", "Spanje"], region: "Europe",
    lat: 37.3891, lon: -5.9845, currency: "EUR", priceFrom: 619, days: 4, months: ["mar", "apr", "may", "oct", "nov"], rating: 4.6, hero: 163,
    tagline: ["Orange trees and flamenco nights", "Sinaasappelbomen en flamenconachten"],
    landmarks: [["the Real Alcázar", "het Real Alcázar"], ["the Plaza de España", "het Plaza de España"]],
    foods: [["salmorejo", "salmorejo"], ["jamón ibérico", "jamón ibérico"]],
    activities: [["see a flamenco show in Triana", "een flamencovoorstelling in Triana zien"], ["climb the Giralda", "de Giralda beklimmen"], ["go on a tapas crawl", "een tapasroute lopen"]],
    wiki: "Seville",
  },
  {
    slug: "barcelona", name: ["Barcelona", "Barcelona"], country: ["Spain", "Spanje"], region: "Europe",
    lat: 41.3874, lon: 2.1686, currency: "EUR", priceFrom: 699, days: 4, months: ["may", "jun", "sep", "oct"], rating: 4.5, hero: 162,
    tagline: ["Gaudí, beaches and late dinners", "Gaudí, stranden en late diners"],
    landmarks: [["the Sagrada Família", "de Sagrada Família"], ["Park Güell", "Park Güell"]],
    foods: [["pan con tomate", "pan con tomate"], ["seafood paella", "paella met zeevruchten"]],
    activities: [["wander the Gothic Quarter", "door de Gotische wijk dwalen"], ["swim at Barceloneta beach", "zwemmen bij het strand van Barceloneta"], ["hike up Montjuïc", "Montjuïc op wandelen"]],
    wiki: "Barcelona", featured: true,
  },
  {
    slug: "amsterdam", name: ["Amsterdam", "Amsterdam"], country: ["Netherlands", "Nederland"], region: "Europe",
    lat: 52.3676, lon: 4.9041, currency: "EUR", priceFrom: 549, days: 3, months: ["apr", "may", "jun", "sep"], rating: 4.5, hero: 164,
    tagline: ["Canals, bikes and world-class museums", "Grachten, fietsen en musea van wereldklasse"],
    landmarks: [["the Rijksmuseum", "het Rijksmuseum"], ["the Jordaan", "de Jordaan"]],
    foods: [["stroopwafels", "stroopwafels"], ["bitterballen", "bitterballen"]],
    activities: [["cycle along the canals", "langs de grachten fietsen"], ["take a canal boat at dusk", "in de schemering een rondvaart maken"], ["explore the NDSM wharf", "de NDSM-werf ontdekken"]],
    wiki: "Amsterdam",
  },
  {
    slug: "copenhagen", name: ["Copenhagen", "Kopenhagen"], country: ["Denmark", "Denemarken"], region: "Europe",
    lat: 55.6761, lon: 12.5683, currency: "EUR", priceFrom: 729, days: 4, months: ["may", "jun", "jul", "aug"], rating: 4.6, hero: 77,
    tagline: ["Design, harbour baths and hygge", "Design, havenbaden en hygge"],
    landmarks: [["Nyhavn", "Nyhavn"], ["Tivoli Gardens", "Tivoli"]],
    foods: [["smørrebrød", "smørrebrød"], ["cinnamon swirls", "kaneelbroodjes"]],
    activities: [["swim at the Islands Brygge harbour bath", "zwemmen in het havenbad van Islands Brygge"], ["bike to Refshaleøen", "naar Refshaleøen fietsen"], ["visit Louisiana Museum of Modern Art", "het Louisiana Museum bezoeken"]],
    wiki: "Copenhagen",
  },
  {
    slug: "reykjavik", name: ["Reykjavik", "Reykjavik"], country: ["Iceland", "IJsland"], region: "Europe",
    lat: 64.1466, lon: -21.9426, currency: "EUR", priceFrom: 1149, days: 7, months: ["feb", "mar", "jun", "jul", "aug", "sep"], rating: 4.8, hero: 66,
    tagline: ["Gateway to fire and ice", "Toegangspoort tot vuur en ijs"],
    landmarks: [["Hallgrímskirkja", "de Hallgrímskirkja"], ["the Golden Circle", "de Gouden Cirkel"]],
    foods: [["lamb soup", "lamssoep"], ["skyr", "skyr"]],
    activities: [["hunt for the northern lights", "op jacht gaan naar het noorderlicht"], ["soak in a geothermal lagoon", "baden in een geothermische lagune"], ["hike to a glacier tongue", "naar een gletsjertong wandelen"]],
    wiki: "Reykjavík", featured: true,
  },
  {
    slug: "scottish-highlands", name: ["Scottish Highlands", "Schotse Hooglanden"], country: ["United Kingdom", "Verenigd Koninkrijk"], region: "Europe",
    lat: 57.12, lon: -4.71, currency: "GBP", priceFrom: 899, days: 7, months: ["may", "jun", "jul", "aug", "sep"], rating: 4.7, hero: 200,
    tagline: ["Lochs, glens and single malts", "Lochs, dalen en single malts"],
    landmarks: [["Loch Ness", "Loch Ness"], ["Glencoe", "Glencoe"]],
    foods: [["cullen skink", "cullen skink"], ["cranachan", "cranachan"]],
    activities: [["drive the North Coast 500", "de North Coast 500 rijden"], ["take the Jacobite steam train", "de Jacobite-stoomtrein nemen"], ["visit a Speyside distillery", "een distilleerderij in Speyside bezoeken"]],
    wiki: "Scottish_Highlands",
  },
  {
    slug: "dubrovnik", name: ["Dubrovnik", "Dubrovnik"], country: ["Croatia", "Kroatië"], region: "Europe",
    lat: 42.6507, lon: 18.0944, currency: "EUR", priceFrom: 759, days: 5, months: ["may", "jun", "sep", "oct"], rating: 4.5, hero: 37,
    tagline: ["Walled city on the Adriatic", "Ommuurde stad aan de Adriatische Zee"],
    landmarks: [["the city walls", "de stadsmuren"], ["Lokrum Island", "het eiland Lokrum"]],
    foods: [["black risotto", "zwarte risotto"], ["Ston oysters", "oesters uit Ston"]],
    activities: [["walk the full circuit of the walls", "de volledige stadsmuur rondlopen"], ["kayak to hidden coves", "naar verborgen baaien kajakken"], ["ride the cable car up Mount Srđ", "met de kabelbaan de berg Srđ op gaan"]],
    wiki: "Dubrovnik",
  },
  {
    slug: "santorini", name: ["Santorini", "Santorini"], country: ["Greece", "Griekenland"], region: "Europe",
    lat: 36.3932, lon: 25.4615, currency: "EUR", priceFrom: 899, days: 5, months: ["may", "jun", "sep", "oct"], rating: 4.7, hero: 49,
    tagline: ["Whitewashed villages above the caldera", "Witte dorpjes boven de caldera"],
    landmarks: [["Oia", "Oia"], ["the caldera rim", "de rand van de caldera"]],
    foods: [["tomato fritters", "tomatenbeignets"], ["fava dip", "fava-dip"]],
    activities: [["hike from Fira to Oia", "van Fira naar Oia wandelen"], ["sail around the caldera", "rond de caldera zeilen"], ["taste Assyrtiko at a volcanic winery", "Assyrtiko proeven bij een vulkanische wijngaard"]],
    wiki: "Santorini", featured: true,
  },
  {
    slug: "tuscany", name: ["Tuscany", "Toscane"], country: ["Italy", "Italië"], region: "Europe",
    lat: 43.7711, lon: 11.2486, currency: "EUR", priceFrom: 849, days: 7, months: ["apr", "may", "jun", "sep", "oct"], rating: 4.8, hero: 116,
    tagline: ["Cypress roads and hilltop towns", "Cipressenwegen en heuveldorpjes"],
    landmarks: [["the Val d'Orcia", "de Val d'Orcia"], ["Florence's Duomo", "de Dom van Florence"]],
    foods: [["pici cacio e pepe", "pici cacio e pepe"], ["bistecca alla fiorentina", "bistecca alla fiorentina"]],
    activities: [["cycle between Chianti vineyards", "tussen de wijngaarden van Chianti fietsen"], ["soak in the hot springs of Saturnia", "baden in de warmwaterbronnen van Saturnia"], ["take a pasta-making class", "een kookles pasta maken volgen"]],
    wiki: "Tuscany", featured: true,
  },
  {
    slug: "loire-valley", name: ["Loire Valley", "Loirevallei"], country: ["France", "Frankrijk"], region: "Europe",
    lat: 47.39, lon: 0.69, currency: "EUR", priceFrom: 689, days: 5, months: ["may", "jun", "sep"], rating: 4.4, hero: 142,
    tagline: ["Châteaux, gardens and Chenin Blanc", "Kastelen, tuinen en Chenin Blanc"],
    landmarks: [["Château de Chambord", "het Château de Chambord"], ["Château de Chenonceau", "het Château de Chenonceau"]],
    foods: [["goat's cheese from Sainte-Maure", "geitenkaas uit Sainte-Maure"], ["tarte Tatin", "tarte Tatin"]],
    activities: [["cycle the Loire à Vélo route", "de Loire à Vélo-route fietsen"], ["picnic in château gardens", "picknicken in kasteeltuinen"], ["tour a troglodyte wine cellar", "een wijnkelder in de rotsen bezoeken"]],
    wiki: "Loire_Valley",
  },
  {
    slug: "swiss-alps", name: ["Swiss Alps", "Zwitserse Alpen"], country: ["Switzerland", "Zwitserland"], region: "Europe",
    lat: 46.6863, lon: 7.8632, currency: "EUR", priceFrom: 1249, days: 6, months: ["jan", "feb", "jul", "aug", "sep"], rating: 4.8, hero: 128,
    tagline: ["Lakes, peaks and panoramic trains", "Meren, toppen en panoramatreinen"],
    landmarks: [["the Jungfraujoch", "de Jungfraujoch"], ["Lake Brienz", "het Meer van Brienz"]],
    foods: [["cheese fondue", "kaasfondue"], ["rösti", "rösti"]],
    activities: [["ride the GoldenPass Express", "met de GoldenPass Express reizen"], ["hike to a mountain hut", "naar een berghut wandelen"], ["paraglide over Interlaken", "paragliden boven Interlaken"]],
    wiki: "Swiss_Alps",
  },
  {
    slug: "cappadocia", name: ["Cappadocia", "Cappadocië"], country: ["Türkiye", "Turkije"], region: "Middle East",
    lat: 38.6431, lon: 34.8289, currency: "EUR", priceFrom: 799, days: 5, months: ["apr", "may", "sep", "oct"], rating: 4.7, hero: 174,
    tagline: ["Balloons over fairy chimneys", "Ballonnen boven feeënschoorstenen"],
    landmarks: [["Göreme Open-Air Museum", "het openluchtmuseum van Göreme"], ["the Rose Valley", "de Rozenvallei"]],
    foods: [["testi kebab", "testi kebab"], ["dried apricots", "gedroogde abrikozen"]],
    activities: [["fly in a hot air balloon at dawn", "bij zonsopkomst met een luchtballon varen"], ["explore an underground city", "een ondergrondse stad verkennen"], ["sleep in a cave hotel", "in een grothotel slapen"]],
    wiki: "Cappadocia",
  },
  {
    slug: "wadi-rum", name: ["Wadi Rum", "Wadi Rum"], country: ["Jordan", "Jordanië"], region: "Middle East",
    lat: 29.5321, lon: 35.4206, currency: "USD", priceFrom: 1099, days: 6, months: ["mar", "apr", "oct", "nov"], rating: 4.8, hero: 46,
    tagline: ["Red sands and Bedouin camps", "Rood zand en bedoeïenenkampen"],
    landmarks: [["Petra", "Petra"], ["the Khazali Canyon", "de Khazali-kloof"]],
    foods: [["zarb", "zarb"], ["mansaf", "mansaf"]],
    activities: [["sleep under the stars in a desert camp", "onder de sterren slapen in een woestijnkamp"], ["take a jeep safari", "een jeepsafari maken"], ["walk the Siq into Petra", "door de Siq naar Petra lopen"]],
    wiki: "Wadi_Rum",
  },
  {
    slug: "marrakech", name: ["Marrakech", "Marrakesh"], country: ["Morocco", "Marokko"], region: "Africa",
    lat: 31.6295, lon: -7.9811, currency: "EUR", priceFrom: 599, days: 5, months: ["mar", "apr", "may", "oct", "nov"], rating: 4.5, hero: 196,
    tagline: ["Souks, riads and Atlas views", "Soeks, riads en uitzicht op de Atlas"],
    landmarks: [["Jemaa el-Fnaa", "het Djemaa el Fna-plein"], ["the Jardin Majorelle", "de Jardin Majorelle"]],
    foods: [["lamb tagine", "lamstajine"], ["mint tea", "muntthee"]],
    activities: [["get lost in the medina souks", "verdwalen in de soeks van de medina"], ["take a day trip to the Atlas Mountains", "een dagtocht naar het Atlasgebergte maken"], ["relax in a traditional hammam", "ontspannen in een traditionele hamam"]],
    wiki: "Marrakesh",
  },
  {
    slug: "cape-town", name: ["Cape Town", "Kaapstad"], country: ["South Africa", "Zuid-Afrika"], region: "Africa",
    lat: -33.9249, lon: 18.4241, currency: "USD", priceFrom: 1299, days: 8, months: ["jan", "feb", "mar", "nov", "dec"], rating: 4.7, hero: 179,
    tagline: ["Mountain, ocean and winelands", "Berg, oceaan en wijnland"],
    landmarks: [["Table Mountain", "de Tafelberg"], ["the Cape of Good Hope", "Kaap de Goede Hoop"]],
    foods: [["bobotie", "bobotie"], ["Cape Malay curry", "Kaaps-Maleisische curry"]],
    activities: [["hike up Lion's Head for sunrise", "Lion's Head op lopen voor zonsopkomst"], ["meet the penguins at Boulders Beach", "de pinguïns bij Boulders Beach bezoeken"], ["tour the Stellenbosch winelands", "door de wijnlanden van Stellenbosch toeren"]],
    wiki: "Cape_Town", featured: true,
  },
  {
    slug: "zanzibar", name: ["Zanzibar", "Zanzibar"], country: ["Tanzania", "Tanzania"], region: "Africa",
    lat: -6.1659, lon: 39.2026, currency: "USD", priceFrom: 1199, days: 8, months: ["jun", "jul", "aug", "sep", "dec", "jan"], rating: 4.6, hero: 124,
    tagline: ["Spice island with turquoise water", "Specerijeneiland met turquoise water"],
    landmarks: [["Stone Town", "Stone Town"], ["Nungwi beach", "het strand van Nungwi"]],
    foods: [["Zanzibar pizza", "Zanzibar-pizza"], ["octopus curry", "inktviscurry"]],
    activities: [["sail a dhow at sunset", "bij zonsondergang met een dhow zeilen"], ["tour a spice farm", "een specerijenplantage bezoeken"], ["snorkel at Mnemba Atoll", "snorkelen bij het Mnemba-atol"]],
    wiki: "Zanzibar",
  },
  {
    slug: "kyoto", name: ["Kyoto", "Kyoto"], country: ["Japan", "Japan"], region: "Asia",
    lat: 35.0116, lon: 135.7681, currency: "EUR", priceFrom: 1499, days: 7, months: ["mar", "apr", "oct", "nov"], rating: 4.9, hero: 62,
    tagline: ["Temples, gardens and tea houses", "Tempels, tuinen en theehuizen"],
    landmarks: [["Fushimi Inari", "Fushimi Inari"], ["the Arashiyama bamboo grove", "het bamboebos van Arashiyama"]],
    foods: [["kaiseki", "kaiseki"], ["matcha sweets", "matcha-zoetigheden"]],
    activities: [["walk through the torii gates at dawn", "bij zonsopkomst door de torii-poorten lopen"], ["join a tea ceremony", "een theeceremonie bijwonen"], ["stay in a ryokan", "in een ryokan overnachten"]],
    wiki: "Kyoto", featured: true,
  },
  {
    slug: "bali", name: ["Bali", "Bali"], country: ["Indonesia", "Indonesië"], region: "Asia",
    lat: -8.3405, lon: 115.092, currency: "USD", priceFrom: 1249, days: 10, months: ["apr", "may", "jun", "sep"], rating: 4.6, hero: 108,
    tagline: ["Rice terraces and temple ceremonies", "Rijstterrassen en tempelceremonies"],
    landmarks: [["the Tegallalang rice terraces", "de rijstterrassen van Tegallalang"], ["Uluwatu Temple", "de Uluwatu-tempel"]],
    foods: [["nasi campur", "nasi campur"], ["babi guling", "babi guling"]],
    activities: [["hike Mount Batur for sunrise", "de Batur beklimmen voor zonsopkomst"], ["learn to surf in Canggu", "leren surfen in Canggu"], ["take a cooking class in Ubud", "een kookcursus volgen in Ubud"]],
    wiki: "Bali",
  },
  {
    slug: "hanoi", name: ["Hanoi", "Hanoi"], country: ["Vietnam", "Vietnam"], region: "Asia",
    lat: 21.0278, lon: 105.8342, currency: "USD", priceFrom: 1099, days: 9, months: ["oct", "nov", "dec", "mar", "apr"], rating: 4.5, hero: 11,
    tagline: ["Street food capital of the north", "Hoofdstad van het straatvoedsel"],
    landmarks: [["Hoan Kiem Lake", "het Hoan Kiem-meer"], ["Ha Long Bay", "de Halong-baai"]],
    foods: [["pho bo", "pho bo"], ["bun cha", "bun cha"]],
    activities: [["join a street food walk in the Old Quarter", "een streetfoodtour door de oude wijk lopen"], ["cruise Ha Long Bay overnight", "een nacht over de Halong-baai varen"], ["drink egg coffee at a hidden café", "eierkoffie drinken in een verborgen café"]],
    wiki: "Hanoi",
  },
  {
    slug: "banff", name: ["Banff", "Banff"], country: ["Canada", "Canada"], region: "North America",
    lat: 51.1784, lon: -115.5708, currency: "USD", priceFrom: 1399, days: 8, months: ["jun", "jul", "aug", "sep", "jan"], rating: 4.8, hero: 191,
    tagline: ["Turquoise lakes in the Rockies", "Turquoise meren in de Rockies"],
    landmarks: [["Lake Louise", "Lake Louise"], ["the Icefields Parkway", "de Icefields Parkway"]],
    foods: [["bison burgers", "bizonburgers"], ["butter tarts", "butter tarts"]],
    activities: [["canoe on Moraine Lake", "kanoën op Moraine Lake"], ["spot elk and bears from the road", "wapiti's en beren spotten vanaf de weg"], ["soak in the Banff Upper Hot Springs", "baden in de Banff Upper Hot Springs"]],
    wiki: "Banff,_Alberta",
  },
  {
    slug: "new-york-city", name: ["New York City", "New York"], country: ["United States", "Verenigde Staten"], region: "North America",
    lat: 40.7128, lon: -74.006, currency: "USD", priceFrom: 999, days: 5, months: ["apr", "may", "sep", "oct", "dec"], rating: 4.5, hero: 188,
    tagline: ["Five boroughs, endless neighbourhoods", "Vijf stadsdelen, eindeloze buurten"],
    landmarks: [["Central Park", "Central Park"], ["the Brooklyn Bridge", "de Brooklyn Bridge"]],
    foods: [["bagels with lox", "bagels met zalm"], ["a slice of New York pizza", "een punt New Yorkse pizza"]],
    activities: [["walk the High Line", "over de High Line wandelen"], ["catch a Broadway show", "een Broadwayvoorstelling zien"], ["ride the Staten Island Ferry", "met de Staten Island Ferry varen"]],
    wiki: "New_York_City",
  },
  {
    slug: "cusco", name: ["Cusco", "Cusco"], country: ["Peru", "Peru"], region: "South America",
    lat: -13.532, lon: -71.9675, currency: "USD", priceFrom: 1599, days: 10, months: ["may", "jun", "jul", "aug", "sep"], rating: 4.8, hero: 29,
    tagline: ["Inca stones and Andean markets", "Incastenen en Andesmarkten"],
    landmarks: [["Machu Picchu", "Machu Picchu"], ["the Sacred Valley", "de Heilige Vallei"]],
    foods: [["lomo saltado", "lomo saltado"], ["ceviche", "ceviche"]],
    activities: [["hike the Inca Trail", "de Incatrail lopen"], ["visit the San Pedro market", "de markt van San Pedro bezoeken"], ["see the salt pans of Maras", "de zoutpannen van Maras bekijken"]],
    wiki: "Cusco",
  },
  {
    slug: "queenstown", name: ["Queenstown", "Queenstown"], country: ["New Zealand", "Nieuw-Zeeland"], region: "Oceania",
    lat: -45.0312, lon: 168.6626, currency: "USD", priceFrom: 1899, days: 12, months: ["jan", "feb", "mar", "dec", "jul"], rating: 4.7, hero: 125,
    tagline: ["Adventure capital on a glacial lake", "Avonturenhoofdstad aan een gletsjermeer"],
    landmarks: [["Milford Sound", "Milford Sound"], ["Lake Wakatipu", "het Wakatipumeer"]],
    foods: [["Fergburger", "Fergburger"], ["Central Otago pinot noir", "pinot noir uit Central Otago"]],
    activities: [["bungee jump from the Kawarau Bridge", "bungeejumpen vanaf de Kawarau-brug"], ["cruise Milford Sound", "over Milford Sound varen"], ["hike the Routeburn Track", "de Routeburn Track lopen"]],
    wiki: "Queenstown,_New_Zealand",
  },
];
