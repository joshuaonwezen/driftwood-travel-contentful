import type { Document } from "@contentful/rich-text-types";
import {
  doc, p, h2, h3, ul, ol, quote, hr, link, table,
  entryLink as rtLink, embedEntry,
} from "../richtext";
import { LEGAL, type Pair } from "../content/phrases";
import { photoKey, portraitKey, LOGO_KEY } from "../images";
import type { EntrySpec, Fields } from "../upsert";
import { loc, one, entryLink, assetLink } from "./helpers";

/** Build an [en, nl] pair of rich text documents from one template. */
const bi = (f: (t: (pair: Pair) => string) => Document): [Document, Document] => [f((x) => x[0]), f((x) => x[1])];

type SiteOptions = {
  /** Seed keys of a few published articles, for manual content grids. */
  pickArticleKeys: string[];
  /** Slug of the Lisbon first-timer guide, target of a legacy redirect. */
  lisbonGuideSlug: string;
};

export function buildSite(opts: SiteOptions): EntrySpec[] {
  const specs: EntrySpec[] = [];
  const add = (key: string, contentType: string, fields: Fields, extra: Partial<EntrySpec> = {}) => {
    specs.push({ key, contentType, fields, ...extra });
    return key;
  };
  const page = (slug: string) => `landingPage:${slug}`;

  /* ----------------------------------------------------------- shared blocks */

  const cta = (
    id: string,
    o: { heading: Pair; body: Pair; button: Pair; link?: string; url?: string; theme: string; tags?: string[] },
    tr = true,
  ) =>
    add(`cta:${id}`, "ctaBanner", {
      internalName: one(`CTA – ${id}`),
      heading: loc(o.heading, tr),
      body: loc(o.body, tr),
      buttonLabel: loc(o.button, tr),
      buttonLink: o.link ? one(entryLink(o.link)) : undefined,
      buttonUrl: o.url ? one(o.url) : undefined,
      theme: one(o.theme),
    }, { tags: o.tags });

  cta("newsletter", {
    heading: ["Get trip ideas in your inbox", "Reisinspiratie in je inbox"],
    body: ["One email a month with new departures, guides and the occasional early-bird deal. No spam, ever.", "Eén e-mail per maand met nieuwe vertrekdata, reisgidsen en af en toe een vroegboekdeal. Nooit spam."],
    button: ["Subscribe", "Aanmelden"], link: page("newsletter"), theme: "sand",
  });
  cta("contact", {
    heading: ["Ready to start planning?", "Klaar om te gaan plannen?"],
    body: ["Tell us where you'd like to go and a travel designer will get back to you within one working day.", "Vertel ons waar je naartoe wilt en een reisontwerper neemt binnen één werkdag contact met je op."],
    button: ["Talk to us", "Neem contact op"], link: page("contact"), theme: "ocean",
  });
  cta("careers", {
    heading: ["Join the team", "Kom bij ons team"],
    body: ["We're always looking for curious people who love travel as much as we do.", "We zoeken altijd nieuwsgierige mensen die net zoveel van reizen houden als wij."],
    button: ["See open roles", "Bekijk vacatures"], link: page("careers"), theme: "forest",
  });
  cta("apply", {
    heading: ["Don't see your role?", "Staat jouw functie er niet bij?"],
    body: ["Send an open application to our people team. We read every one.", "Stuur een open sollicitatie naar ons people-team. We lezen ze allemaal."],
    button: ["Apply now", "Solliciteer nu"], url: "https://jobs.driftwood.example/open-application", theme: "dark",
  });
  cta("gift-cards", {
    heading: ["Give the gift of travel", "Geef een reis cadeau"],
    body: ["A Driftwood gift card can be used for any trip, any date, any destination.", "Een Driftwood-cadeaukaart is te gebruiken voor elke reis, elke datum en elke bestemming."],
    button: ["Buy a gift card", "Koop een cadeaukaart"], url: "https://shop.driftwood.example/gift-cards", theme: "dark",
  });
  cta("summer-2026", {
    heading: ["Summer 2026: 10% off group tours", "Zomer 2026: 10% korting op groepsreizen"],
    body: ["Book any group departure between June and August before 31 January and save 10%.", "Boek vóór 31 januari een groepsreis met vertrek tussen juni en augustus en krijg 10% korting."],
    button: ["Browse destinations", "Bekijk bestemmingen"], url: "/destinations", theme: "ocean", tags: ["campaignSummer2026"],
  });
  cta("insurance", {
    heading: ["Protect your trip", "Bescherm je reis"],
    body: ["Add travel insurance to any booking in two minutes.", "Voeg in twee minuten een reisverzekering toe aan elke boeking."],
    button: ["About our insurance", "Over onze verzekering"], link: page("travel-insurance"), theme: "sand",
  });

  const video = (id: string, provider: string, videoId: string, title: Pair, caption: Pair | null, tr = true) =>
    add(`video:${id}`, "videoEmbed", {
      internalName: one(`Video – ${id} (placeholder footage)`),
      title: loc(title, tr),
      provider: one(provider),
      videoId: one(videoId),
      caption: caption ? loc(caption, tr) : undefined,
    });

  video("our-story", "youtube", "aqz-KE-bpKQ", ["Driftwood in two minutes", "Driftwood in twee minuten"], ["Placeholder footage", "Voorbeeldbeelden"]);
  video("iceland", "youtube", "eRsGyueVLvQ", ["Winter light in Iceland", "Winterlicht in IJsland"], null);
  video("guides", "youtube", "R6MlUcmOul8", ["Behind the scenes with our guides", "Achter de schermen met onze gidsen"], ["Placeholder footage", "Voorbeeldbeelden"]);
  video("press-reel", "vimeo", "76979871", ["Press reel 2026", "Persreel 2026"], null, false);

  const testimonial = (id: string, name: string, quoteText: Pair, title: Pair, rating: number) =>
    add(`testimonial:${id}`, "testimonialBlock", {
      internalName: one(`Testimonial – ${name}`),
      quote: loc(quoteText),
      personName: one(name),
      personTitle: loc(title),
      avatar: one(assetLink(portraitKey(`testimonial:${id}`))),
      rating: one(rating),
    });

  testimonial("hannah", "Hannah Brooks", ["Every detail was taken care of, but it never felt like a package tour. Our guide in Kyoto still sends us restaurant tips.", "Alles was tot in de puntjes geregeld, maar het voelde nooit als een pakketreis. Onze gids in Kyoto stuurt ons nog steeds restauranttips."], ["Kyoto, April 2026", "Kyoto, april 2026"], 5);
  testimonial("amara", "Amara Kariuki", ["We told them we wanted wild places and good food. They delivered both, plus a sunrise I'll never forget.", "We zeiden dat we ruige natuur en goed eten wilden. Ze leverden allebei, plus een zonsopkomst die ik nooit vergeet."], ["Wadi Rum & Petra, October 2025", "Wadi Rum & Petra, oktober 2025"], 5);
  testimonial("peter", "Peter Vos", ["Our private journey through Tuscany was perfectly paced. Not a single wasted hour, and not a single rushed one.", "Onze privéreis door Toscane had precies het juiste tempo. Geen uur verspild, en geen uur gehaast."], ["Tuscany, September 2025", "Toscane, september 2025"], 5);
  testimonial("lotte", "Lotte Jansen", ["The honeymoon of our dreams. The little surprises along the way made it feel completely ours.", "De huwelijksreis van onze dromen. De kleine verrassingen onderweg maakten het helemaal van ons."], ["Santorini & Zanzibar, June 2026", "Santorini & Zanzibar, juni 2026"], 5);
  testimonial("ravi", "Ravi Patel", ["As a photographer I'm picky about timing. Our guide knew exactly where to be and when.", "Als fotograaf ben ik kritisch op timing. Onze gids wist precies waar we moesten zijn en wanneer."], ["Cappadocia, May 2026", "Cappadocië, mei 2026"], 4);
  testimonial("henk", "Henk de Graaf", ["Third trip with Driftwood, and they still manage to surprise us.", "Onze derde reis met Driftwood, en ze weten ons nog steeds te verrassen."], ["Scottish Highlands, August 2025", "Schotse Hooglanden, augustus 2025"], 5);

  /* -------------------------------------------------------------------- FAQ */

  const faq = (id: string, question: Pair, answer: [Document, Document]) =>
    add(`faq:${id}`, "faqItem", { question: loc(question), answer: loc(answer) });

  faq("how-to-book", ["How do I book a trip?", "Hoe boek ik een reis?"], bi((t) => doc(
    p(t(["Pick a departure on any destination page, or ", "Kies een vertrekdatum op een bestemmingspagina, of "]), rtLink(page("contact"), t(["contact a travel designer", "neem contact op met een reisontwerper"])), t([" for a tailor-made trip. We confirm availability within one working day.", " voor een reis op maat. We bevestigen de beschikbaarheid binnen één werkdag."])),
  )));
  faq("group-size", ["How big are your group tours?", "Hoe groot zijn jullie groepsreizen?"], bi((t) => doc(
    p(t(["Our group tours have a maximum of **12 travellers**, plus a local tour leader.", "Onze groepsreizen hebben maximaal **12 reizigers**, plus een lokale reisleider."])),
  )));
  faq("customise", ["Can I customise a group tour?", "Kan ik een groepsreis aanpassen?"], bi((t) => doc(
    p(t(["Yes. You can add nights before or after the tour, upgrade hotels or add private excursions. For a fully flexible itinerary, have a look at our ", "Ja. Je kunt nachten toevoegen voor of na de reis, je hotel upgraden of privé-excursies boeken. Wil je volledige vrijheid, kijk dan naar onze "]), rtLink(page("private-journeys"), t(["private journeys", "privéreizen"])), "."),
  )));
  faq("included", ["What is included in the price?", "Wat is er inbegrepen in de prijs?"], bi((t) => doc(
    p(t(["Unless stated otherwise, our prices include:", "Tenzij anders vermeld, is het volgende inbegrepen:"])),
    ul([
      t(["Accommodation in hand-picked hotels", "Verblijf in zorgvuldig gekozen hotels"]),
      t(["Daily breakfast and selected meals", "Dagelijks ontbijt en een aantal maaltijden"]),
      t(["All transport during the trip", "Al het vervoer tijdens de reis"]),
      t(["A local tour leader or guide", "Een lokale reisleider of gids"]),
    ]),
  )));
  faq("flights", ["Do you arrange flights?", "Regelen jullie ook vluchten?"], bi((t) => doc(
    p(t(["We can, but you are free to book your own. We always suggest train connections where they are a realistic alternative.", "Dat kan, maar je mag ook zelf boeken. We stellen altijd treinverbindingen voor als dat een realistisch alternatief is."])),
  )));
  faq("cancellation", ["What is your cancellation policy?", "Wat zijn jullie annuleringsvoorwaarden?"], bi((t) => doc(
    p(t(["You can cancel free of charge up to 60 days before departure. After that, cancellation costs apply as described in our ", "Je kunt kosteloos annuleren tot 60 dagen voor vertrek. Daarna gelden annuleringskosten zoals beschreven in onze "]), rtLink(page("terms-and-conditions"), t(["terms and conditions", "algemene voorwaarden"])), "."),
  )));
  faq("insurance-needed", ["Do I need travel insurance?", "Heb ik een reisverzekering nodig?"], bi((t) => doc(
    p(t(["Travel insurance with medical cover is mandatory on all our trips. You can add ", "Een reisverzekering met medische dekking is verplicht op al onze reizen. Je kunt "]), rtLink(page("travel-insurance"), t(["our own policy", "onze eigen verzekering"])), t([" during booking or use your own.", " tijdens het boeken toevoegen of je eigen verzekering gebruiken."])),
  )));
  faq("children", ["Are your trips suitable for children?", "Zijn jullie reizen geschikt voor kinderen?"], bi((t) => doc(
    p(t(["Most private journeys work well for families. Group tours have a minimum age of 12.", "De meeste privéreizen zijn heel geschikt voor gezinnen. Voor groepsreizen geldt een minimumleeftijd van 12 jaar."])),
  )));
  faq("carbon", ["How do you offset carbon emissions?", "Hoe compenseren jullie CO2-uitstoot?"], bi((t) => doc(
    p(t(["We reduce first: rail where possible, smaller groups and local partners. Remaining emissions are offset through certified projects. Read more on our ", "We verminderen eerst: de trein waar het kan, kleinere groepen en lokale partners. Resterende uitstoot compenseren we via gecertificeerde projecten. Lees meer op onze "]), rtLink(page("sustainability"), t(["sustainability page", "pagina over duurzaamheid"])), "."),
  )));
  faq("instalments", ["Can I pay in instalments?", "Kan ik in termijnen betalen?"], bi((t) => doc(
    p(t(["Yes. You pay a _20% deposit_ when booking and the remainder six weeks before departure.", "Ja. Je betaalt een _aanbetaling van 20%_ bij het boeken en de rest zes weken voor vertrek."])),
  )));
  faq("remote", ["Do you offer remote positions?", "Bieden jullie functies op afstand aan?"], bi((t) => doc(
    p(t(["Most office roles are hybrid, with two days a week in our Amsterdam office. Some engineering roles are fully remote within Europe.", "De meeste kantoorfuncties zijn hybride, met twee dagen per week op ons kantoor in Amsterdam. Sommige technische functies zijn volledig op afstand binnen Europa."])),
  )));
  faq("hiring", ["What does the hiring process look like?", "Hoe ziet het sollicitatieproces eruit?"], bi((t) => doc(
    ol([
      t(["A short call with our people team", "Een kort gesprek met ons people-team"]),
      t(["A conversation with your future team", "Een gesprek met je toekomstige team"]),
      t(["A practical assignment (paid for senior roles)", "Een praktijkopdracht (betaald voor senior functies)"]),
      t(["An offer within two weeks", "Binnen twee weken een aanbod"]),
    ]),
  )));
  faq("tour-leaders", ["Do you hire tour leaders abroad?", "Nemen jullie ook reisleiders in het buitenland aan?"], bi((t) => doc(
    p(t(["Yes. We work with more than 80 local tour leaders, all of whom live in the regions they guide.", "Ja. We werken met meer dan 80 lokale reisleiders, die allemaal wonen in de regio waar ze gidsen."])),
  )));
  faq("medical", ["Is medical cover included?", "Is medische dekking inbegrepen?"], bi((t) => doc(
    p(t(["Yes, medical expenses abroad are covered up to **€1,000,000**, including repatriation.", "Ja, medische kosten in het buitenland zijn gedekt tot **€ 1.000.000**, inclusief repatriëring."])),
  )));
  faq("flight-cancelled", ["What happens if my flight is cancelled?", "Wat gebeurt er als mijn vlucht wordt geannuleerd?"], bi((t) => doc(
    p(t(["If a cancelled flight causes you to miss part of your trip, we cover additional accommodation and transport up to €2,500 per person.", "Mis je door een geannuleerde vlucht een deel van je reis, dan vergoeden we extra verblijf en vervoer tot € 2.500 per persoon."])),
  )));
  faq("other-bookings", ["Can I insure a trip I booked elsewhere?", "Kan ik een reis verzekeren die ik elders heb geboekt?"], bi((t) => doc(
    p(t(["Unfortunately not. Our policy only covers trips booked with Driftwood Travel.", "Helaas niet. Onze verzekering dekt alleen reizen die bij Driftwood Travel zijn geboekt."])),
  )));

  const faqBlock = (id: string, heading: Pair, items: string[]) =>
    add(`block:faq:${id}`, "faqBlock", {
      internalName: one(`FAQ – ${id}`),
      heading: loc(heading),
      items: one(items.map((i) => entryLink(`faq:${i}`))),
    });

  faqBlock("main", ["Frequently asked questions", "Veelgestelde vragen"], ["how-to-book", "group-size", "customise", "included", "flights", "cancellation", "insurance-needed", "children", "carbon", "instalments"]);
  faqBlock("group-tours", ["Good to know", "Goed om te weten"], ["group-size", "customise", "included", "children"]);
  faqBlock("careers", ["Questions about working here", "Vragen over werken bij ons"], ["remote", "hiring", "tour-leaders"]);
  faqBlock("insurance", ["Insurance questions", "Vragen over de verzekering"], ["medical", "flight-cancelled", "other-bookings", "insurance-needed"]);
  faqBlock("contact", ["Before you get in touch", "Voordat je contact opneemt"], ["how-to-book", "cancellation", "instalments"]);

  /* ---------------------------------------------------------- feature grids */

  const featureItem = (id: string, icon: string, title: Pair, description: Pair, linkTo?: string, tr = true) =>
    add(`featureItem:${id}`, "featureItem", {
      title: loc(title, tr),
      description: loc(description, tr),
      icon: one(icon),
      link: linkTo ? one(entryLink(linkTo)) : undefined,
    });

  const featureGrid = (id: string, heading: Pair, intro: Pair | null, columns: number, items: string[], tr = true) =>
    add(`block:features:${id}`, "featureGrid", {
      internalName: one(`Features – ${id}`),
      heading: loc(heading, tr),
      intro: intro ? loc(intro, tr) : undefined,
      columns: one(columns),
      items: one(items.map((i) => entryLink(i))),
    });

  featureGrid("home-why", ["Why travel with Driftwood", "Waarom reizen met Driftwood"], ["Since 2008 we've designed trips around one idea: travel slower, see more.", "Sinds 2008 ontwerpen we reizen rond één idee: reis langzamer, zie meer."], 4, [
    featureItem("small-groups", "users", ["Small groups", "Kleine groepen"], ["Never more than 12 travellers, so you meet people instead of crowds.", "Nooit meer dan 12 reizigers, zodat je mensen ontmoet in plaats van mensenmassa's."], page("group-tours")),
    featureItem("local-guides", "map", ["Local guides", "Lokale gidsen"], ["Every trip is led by someone who lives there.", "Elke reis wordt geleid door iemand die er woont."]),
    featureItem("lower-carbon", "leaf", ["Lower-carbon by design", "Ontworpen voor minder CO2"], ["Rail first, fewer flights, and every trip's footprint offset.", "Eerst de trein, minder vluchten, en de voetafdruk van elke reis gecompenseerd."], page("sustainability")),
    featureItem("support", "shield", ["24/7 support", "24/7 bereikbaar"], ["A real person on the phone, wherever you are.", "Een echt mens aan de telefoon, waar je ook bent."]),
  ]);
  featureGrid("services", ["Four ways to travel", "Vier manieren om te reizen"], null, 2, [
    featureItem("svc-group", "users", ["Group tours", "Groepsreizen"], ["Fixed departures with like-minded travellers.", "Vaste vertrekdata met gelijkgestemde reizigers."], page("group-tours")),
    featureItem("svc-private", "compass", ["Private journeys", "Privéreizen"], ["Your dates, your pace, your own guide.", "Jouw data, jouw tempo, je eigen gids."], page("private-journeys")),
    featureItem("svc-corporate", "star", ["Corporate travel", "Zakelijke reizen"], ["Team retreats and incentive trips that people talk about.", "Teamuitjes en incentivereizen waar nog lang over wordt gepraat."], page("corporate-travel")),
    featureItem("svc-honeymoon", "heart", ["Honeymoons", "Huwelijksreizen"], ["Unhurried journeys with a few surprises along the way.", "Reizen zonder haast, met hier en daar een verrassing."], page("honeymoons")),
  ]);
  featureGrid("about-values", ["What we believe", "Waar we in geloven"], null, 3, [
    featureItem("value-slowly", "compass", ["Travel slowly", "Reis langzaam"], ["Fewer places, more time in each.", "Minder plekken, meer tijd per plek."]),
    featureItem("value-fairly", "heart", ["Travel fairly", "Reis eerlijk"], ["Local partners are paid fairly and on time.", "Lokale partners worden eerlijk en op tijd betaald."]),
    featureItem("value-well", "star", ["Travel well", "Reis goed"], ["Comfortable places to stay, with character.", "Comfortabele verblijven met karakter."]),
  ]);
  featureGrid("careers-perks", ["Why work here", "Waarom bij ons werken"], null, 4, [
    featureItem("perk-trip", "plane", ["Annual research trip", "Jaarlijkse onderzoeksreis"], ["Every employee travels to one of our destinations each year.", "Elke medewerker reist ieder jaar naar een van onze bestemmingen."]),
    featureItem("perk-hybrid", "map", ["Hybrid working", "Hybride werken"], ["Two days in the office, the rest wherever you work best.", "Twee dagen op kantoor, de rest waar jij het best werkt."]),
    featureItem("perk-learning", "star", ["Learning budget", "Opleidingsbudget"], ["€1,500 a year for courses, books and conferences.", "€ 1.500 per jaar voor cursussen, boeken en congressen."]),
    featureItem("perk-leave", "sun", ["30 days of leave", "30 vakantiedagen"], ["Because we believe in holidays. Obviously.", "Omdat we in vakantie geloven. Uiteraard."]),
  ]);
  featureGrid("sustainability", ["How we reduce our footprint", "Hoe we onze voetafdruk verkleinen"], null, 3, [
    featureItem("sus-rail", "train", ["Rail first", "Eerst de trein"], ["We plan European trips by train whenever the journey takes under eight hours.", "We plannen Europese reizen per trein als de reis korter duurt dan acht uur."]),
    featureItem("sus-local", "users", ["Local partners", "Lokale partners"], ["92% of what you spend on the ground stays in the local economy.", "92% van wat je ter plekke uitgeeft blijft in de lokale economie."]),
    featureItem("sus-offset", "leaf", ["Certified offsetting", "Gecertificeerde compensatie"], ["Remaining emissions are offset through Gold Standard projects.", "Resterende uitstoot wordt gecompenseerd via Gold Standard-projecten."]),
  ]);
  featureGrid("corporate", ["What we organise", "Wat we organiseren"], null, 3, [
    featureItem("corp-retreats", "mountain", ["Team retreats", "Teamretraites"], ["Three to five days to reconnect, away from the office.", "Drie tot vijf dagen om elkaar weer te vinden, weg van kantoor."], undefined, false),
    featureItem("corp-incentives", "star", ["Incentive trips", "Incentivereizen"], ["Reward your best people with a trip they'd never plan themselves.", "Beloon je beste mensen met een reis die ze zelf nooit zouden plannen."], undefined, false),
    featureItem("corp-events", "users", ["Offsite events", "Offsites"], ["Venues, logistics and activities handled end to end.", "Locaties, logistiek en activiteiten van begin tot eind geregeld."], undefined, false),
  ], false);
  featureGrid("gift-cards", ["How it works", "Zo werkt het"], null, 3, [
    featureItem("gift-any", "wallet", ["Any amount", "Elk bedrag"], ["From €50 to €5,000.", "Van € 50 tot € 5.000."]),
    featureItem("gift-valid", "sun", ["Valid for 3 years", "3 jaar geldig"], ["Plenty of time to plan the perfect trip.", "Genoeg tijd om de perfecte reis te plannen."]),
    featureItem("gift-digital", "heart", ["Instant delivery", "Direct geleverd"], ["Sent by email or printed at home.", "Per e-mail verstuurd of thuis geprint."]),
  ]);

  /* ------------------------------------------------------- stats and grids */

  type Stat = { value: string; label: string };
  const stats = (id: string, heading: Pair, en: Stat[], nl: Stat[]) =>
    add(`block:stats:${id}`, "statsBlock", { internalName: one(`Stats – ${id}`), heading: loc(heading), stats: loc([en, nl]) });

  stats("home", ["Driftwood in numbers", "Driftwood in cijfers"],
    [{ value: "25", label: "Destinations" }, { value: "12,000+", label: "Happy travellers" }, { value: "4.8", label: "Average rating" }, { value: "2008", label: "Founded" }],
    [{ value: "25", label: "Bestemmingen" }, { value: "12.000+", label: "Tevreden reizigers" }, { value: "4,8", label: "Gemiddelde beoordeling" }, { value: "2008", label: "Opgericht" }]);
  stats("about", ["Our team", "Ons team"],
    [{ value: "38", label: "Colleagues in Amsterdam" }, { value: "80+", label: "Local tour leaders" }, { value: "14", label: "Languages spoken" }],
    [{ value: "38", label: "Collega's in Amsterdam" }, { value: "80+", label: "Lokale reisleiders" }, { value: "14", label: "Gesproken talen" }]);
  stats("sustainability", ["Our 2025 footprint", "Onze voetafdruk in 2025"],
    [{ value: "-31%", label: "CO2 per traveller since 2019" }, { value: "64%", label: "European trips by rail" }, { value: "100%", label: "Remaining emissions offset" }],
    [{ value: "-31%", label: "CO2 per reiziger sinds 2019" }, { value: "64%", label: "Europese reizen per trein" }, { value: "100%", label: "Resterende uitstoot gecompenseerd" }]);

  const grid = (id: string, heading: Pair, mode: string, o: { items?: string[]; category?: string; limit: number }) =>
    add(`block:grid:${id}`, "contentGrid", {
      internalName: one(`Grid – ${id}`),
      heading: loc(heading),
      mode: one(mode),
      manualItems: o.items ? one(o.items.map((k) => entryLink(k))) : undefined,
      category: o.category ? one(entryLink(o.category)) : undefined,
      limit: one(o.limit),
    });

  grid("home-featured-destinations", ["Featured destinations", "Uitgelichte bestemmingen"], "featuredDestinations", { limit: 6 });
  grid("home-latest", ["Fresh from the journal", "Nieuw in het magazine"], "latestArticles", { limit: 3 });
  grid("honeymoon-destinations", ["Our honeymoon favourites", "Onze favorieten voor huwelijksreizen"], "manual", {
    items: ["destination:santorini", "destination:zanzibar", "destination:bali", "destination:kyoto"], limit: 4,
  });
  grid("sustainability-stories", ["Stories about responsible travel", "Verhalen over bewust reizen"], "category", {
    category: "category:sustainable-travel", limit: 3,
  });
  grid("group-tours-picks", ["Popular with our groups", "Populair bij onze groepen"], "manual", {
    items: ["destination:lisbon", "destination:cappadocia", "destination:wadi-rum", ...opts.pickArticleKeys.slice(0, 1)], limit: 4,
  });

  /* ---------------------------------------------------------- image + text */

  const imageWithText = (id: string, heading: Pair, body: [Document, Document], photo: number, position: string, caption: Pair | null, tr = true) =>
    add(`block:iwt:${id}`, "imageWithText", {
      internalName: one(`Image + text – ${id}`),
      heading: loc(heading, tr),
      body: loc(body, tr),
      image: one(assetLink(photoKey(photo))),
      imagePosition: one(position),
      caption: caption ? loc(caption, tr) : undefined,
    });

  imageWithText("our-story", ["From one camper van to 25 destinations", "Van één kampeerbusje naar 25 bestemmingen"], bi((t) => doc(
    p(t(["In 2008 our founders spent a summer driving a borrowed camper van along the Portuguese coast. Friends kept asking for their route, then for their contacts, then for help planning their own trips.", "In 2008 reden onze oprichters een zomer lang met een geleend kampeerbusje langs de Portugese kust. Vrienden vroegen om hun route, daarna om hun contacten, en uiteindelijk om hulp bij het plannen van hun eigen reis."])),
    p(t(["Driftwood Travel grew out of those conversations, and the van is still parked behind our office.", "Uit die gesprekken groeide Driftwood Travel, en het busje staat nog steeds achter ons kantoor."])),
  )), 183, "left", ["Our first 'office', 2008", "Ons eerste 'kantoor', 2008"]);
  imageWithText("team", ["Small team, big address book", "Klein team, groot adresboek"], bi((t) => doc(
    p(t(["Our Amsterdam team designs every itinerary in-house, working with more than 80 local tour leaders.", "Ons team in Amsterdam ontwerpt elke reis zelf, samen met meer dan 80 lokale reisleiders."])),
    ul([t(["Travel designers", "Reisontwerpers"]), t(["Operations and 24/7 support", "Operations en 24/7 support"]), t(["Writers and photographers", "Schrijvers en fotografen"])]),
  )), 129, "right", null);
  imageWithText("group-tours", ["What a typical day looks like", "Zo ziet een typische dag eruit"], bi((t) => doc(
    p(t(["Mornings are for the big sights, before the crowds. Afternoons are yours: join an optional excursion or simply explore.", "De ochtenden zijn voor de grote bezienswaardigheden, voordat het druk wordt. De middagen zijn van jou: ga mee met een excursie of ga zelf op pad."])),
    p(t(["Most evenings end around one table, with food chosen by your tour leader.", "De meeste avonden eindigen rond één tafel, met eten uitgekozen door je reisleider."])),
  )), 177, "left", null);
  imageWithText("private", ["Designed around you", "Helemaal om jou ontworpen"], bi((t) => doc(
    p(t(["Tell us how you like to travel and we'll build the trip from there: the pace, the hotels, the balance between guided days and free time.", "Vertel ons hoe je graag reist en we bouwen de reis vanaf daar: het tempo, de hotels, de balans tussen begeleide en vrije dagen."])),
  )), 116, "right", ["Val d'Orcia, Tuscany", "Val d'Orcia, Toscane"]);
  imageWithText("honeymoons", ["Unhurried and personal", "Zonder haast en persoonlijk"], bi((t) => doc(
    p(t(["Late breakfasts, private transfers and a few surprises we won't tell you about in advance.", "Uitgebreide ontbijten, privétransfers en een paar verrassingen die we je van tevoren niet verklappen."])),
  )), 77, "left", null);
  imageWithText("contact-office", ["Visit our office", "Bezoek ons kantoor"], bi((t) => doc(
    p(t(["Driftwood Travel, Keizersgracht 123, 1015 CJ Amsterdam. Open Monday to Friday, 9:00 to 17:30.", "Driftwood Travel, Keizersgracht 123, 1015 CJ Amsterdam. Open van maandag tot en met vrijdag, 9:00 tot 17:30."])),
    p(t(["Coffee is on us. ", "De koffie is van ons. "]), link("https://www.openstreetmap.org/?mlat=52.3676&mlon=4.8852#map=17/52.3676/4.8852", t(["Get directions", "Routebeschrijving"]))),
  )), 164, "right", null);
  imageWithText("press-kit", ["Media kit", "Mediakit"], bi((t) => doc(
    p(t(["Logos, photography and founder portraits are available on request for editorial use.", "Logo's, foto's en portretten van de oprichters zijn op aanvraag beschikbaar voor redactioneel gebruik."])),
  )), 122, "left", null, false);

  /* ------------------------------------------------------------- rich text */

  const richText = (id: string, body: [Document, Document], width: "narrow" | "wide" = "narrow", tr = true) =>
    add(`block:rt:${id}`, "richTextBlock", { internalName: one(`Rich text – ${id}`), body: loc(body, tr), width: one(width) });

  richText("about-intro", bi((t) => doc(
    p(t(["Driftwood Travel is an independent tour operator from Amsterdam. We design small-group tours and private journeys to 25 destinations on six continents.", "Driftwood Travel is een onafhankelijke reisorganisatie uit Amsterdam. We ontwerpen kleine groepsreizen en privéreizen naar 25 bestemmingen op zes continenten."])),
    p(t(["Want to know how it started? Read ", "Wil je weten hoe het begon? Lees "]), rtLink(page("our-story"), t(["our story", "ons verhaal"])), t([", or meet ", ", of maak kennis met "]), rtLink(page("team"), t(["the team", "het team"])), "."),
  )));
  richText("our-story", bi((t) => doc(
    h2(t(["The road trip", "De roadtrip"])),
    p(t(["It began with a borrowed camper van, a paper map and no fixed plan. Six weeks later we had a notebook full of family-run guesthouses, fishermen who cooked for strangers and back roads that never made it into a guidebook.", "Het begon met een geleend kampeerbusje, een papieren kaart en geen vast plan. Zes weken later hadden we een notitieboek vol familiepensions, vissers die voor vreemden kookten en binnenwegen die nooit in een reisgids terechtkwamen."])),
    embedEntry("video:our-story"),
    h2(t(["The first trips", "De eerste reizen"])),
    p(t(["Our first group tour left for Portugal in May 2009 with nine travellers. Two of them still travel with us every year.", "Onze eerste groepsreis vertrok in mei 2009 naar Portugal, met negen reizigers. Twee van hen reizen nog elk jaar met ons mee."])),
    quote(t(["We never wanted to be the biggest. We wanted to be the company our friends would book with.", "We wilden nooit de grootste zijn. We wilden het bedrijf zijn waar onze vrienden zouden boeken."])),
    hr(),
    h2(t(["Today", "Vandaag"])),
    p(t(["Today 38 people work at our Amsterdam office, and we travel to 25 destinations. The notebook has become a database, but the idea is the same.", "Vandaag werken er 38 mensen op ons kantoor in Amsterdam en reizen we naar 25 bestemmingen. Het notitieboek is een database geworden, maar het idee is hetzelfde gebleven."])),
  )), "wide");
  richText("team", bi((t) => doc(
    h2(t(["Meet some of our writers", "Maak kennis met een paar van onze schrijvers"])),
    ul([
      [link("/authors/maren-visser", "Maren Visser"), t([", editor-in-chief", ", hoofdredacteur"])],
      [link("/authors/tomas-herrera", "Tomás Herrera"), t([", senior travel writer", ", senior reisjournalist"])],
      [link("/authors/leilani-santos", "Leilani Santos"), t([", food editor", ", food-redacteur"])],
      [link("/authors/clara-moreau", "Clara Moreau"), t([", sustainability lead", ", duurzaamheidsmanager"])],
    ]),
  )));
  richText("careers", bi((t) => doc(
    p(t(["We're a team of 38 travel designers, operations specialists, writers and engineers. We hire for curiosity first.", "We zijn een team van 38 reisontwerpers, operationele specialisten, schrijvers en developers. We nemen mensen aan op nieuwsgierigheid."])),
    h2(t(["Open roles", "Vacatures"])),
    ul([
      [link("https://jobs.driftwood.example/travel-designer-asia", t(["Travel designer, Asia", "Reisontwerper Azië"])), " (Amsterdam)"],
      [link("https://jobs.driftwood.example/senior-frontend-engineer", "Senior frontend engineer"), " (remote, EU)"],
      [link("https://jobs.driftwood.example/customer-care", t(["Customer care specialist", "Medewerker klantenservice"])), " (Amsterdam)"],
    ]),
  )));
  richText("sustainability", bi((t) => doc(
    p(t(["Tourism is responsible for around 8% of global emissions. We think a travel company should be honest about its share, so we publish ours every year.", "Toerisme is verantwoordelijk voor ongeveer 8% van de wereldwijde uitstoot. We vinden dat een reisorganisatie eerlijk moet zijn over haar aandeel, dus we publiceren het onze elk jaar."])),
    h2(t(["Emissions per traveller", "Uitstoot per reiziger"])),
    table(
      [t(["Trip type", "Type reis"]), t(["kg CO2e per traveller", "kg CO2e per reiziger"]), t(["Change since 2019", "Verandering sinds 2019"])],
      [
        [t(["European rail trip", "Europese treinreis"]), "96", "-12%"],
        [t(["European trip with flights", "Europese reis met vliegtuig"]), "412", "-18%"],
        [t(["Long-haul trip", "Verre reis"]), "2,140", "-27%"],
      ],
    ),
    p(t(["Figures include transport, accommodation and activities. ", "De cijfers zijn inclusief vervoer, verblijf en activiteiten. "]), link("https://www.goldstandard.org", t(["About Gold Standard offsetting", "Over Gold Standard-compensatie"])), "."),
  )), "wide");
  richText("group-tours", bi((t) => doc(
    p(t(["Our group tours bring together up to 12 travellers with a local tour leader. You get the company of a group and the freedom to do your own thing.", "Onze groepsreizen brengen maximaal 12 reizigers samen met een lokale reisleider. Je hebt het gezelschap van een groep én de vrijheid om je eigen gang te gaan."])),
    embedEntry("cta:summer-2026"),
  )));
  richText("private-journeys", bi((t) => doc(
    p(t(["A private journey starts with a conversation. We'll ask about the trips you've loved, the ones you didn't, and what you'd like this one to feel like.", "Een privéreis begint met een gesprek. We vragen naar de reizen waar je van genoten hebt, die waar je niet van genoot, en hoe deze reis moet voelen."])),
    p(t(["Within a week you'll receive a first proposal. Most trips go through two or three rounds before they are just right.", "Binnen een week ontvang je een eerste voorstel. De meeste reizen gaan twee of drie rondes heen en weer voordat ze helemaal kloppen."])),
  )));
  richText("corporate", bi((t) => doc(
    p(t(["From a three-day leadership retreat in the Swiss Alps to an incentive trip to Cape Town for 60 people, we plan corporate travel with the same care as our private journeys.", "Van een driedaagse leiderschapsretraite in de Zwitserse Alpen tot een incentivereis naar Kaapstad voor 60 mensen: we plannen zakelijke reizen met dezelfde zorg als onze privéreizen."])),
    p(t(["Every corporate trip includes a dedicated project manager and a carbon report.", "Elke zakelijke reis heeft een eigen projectmanager en een CO2-rapport."])),
  )), "narrow", false);
  richText("contact", bi((t) => doc(
    h2(t(["Talk to a travel designer", "Spreek een reisontwerper"])),
    ul([
      [t(["Phone: ", "Telefoon: "]), link("tel:+31201234567", "+31 20 123 4567")],
      [t(["Email: ", "E-mail: "]), link("mailto:hello@driftwood.example", "hello@driftwood.example")],
      [t(["Emergency line during your trip: ", "Noodnummer tijdens je reis: "]), link("tel:+31201234599", "+31 20 123 4599")],
    ]),
    p(t(["Press enquiries? Visit our ", "Vragen van de pers? Bekijk onze "]), rtLink(page("press"), t(["press page", "perspagina"])), "."),
  )));
  richText("insurance", bi((t) => doc(
    p(t(["Our travel insurance is underwritten by a licensed European insurer and designed for the trips we run.", "Onze reisverzekering wordt afgegeven door een erkende Europese verzekeraar en is ontworpen voor de reizen die wij organiseren."])),
    table(
      [t(["Cover", "Dekking"]), "Basic", "Complete"],
      [
        [t(["Medical expenses", "Medische kosten"]), "€ 1,000,000", "€ 1,000,000"],
        [t(["Cancellation", "Annulering"]), "—", "€ 5,000"],
        [t(["Baggage", "Bagage"]), "€ 1,000", "€ 2,500"],
        [t(["Price per day", "Prijs per dag"]), "€ 2.10", "€ 4.80"],
      ],
    ),
  )), "wide");
  richText("gift-cards", bi((t) => doc(
    p(t(["Gift cards can be used for any Driftwood trip, in full or as part payment. They are not exchangeable for cash.", "Cadeaukaarten zijn te gebruiken voor elke Driftwood-reis, voor het hele bedrag of een deel ervan. Ze zijn niet inwisselbaar voor geld."])),
  )));
  richText("press", bi((t) => doc(
    h2(t(["Press releases", "Persberichten"])),
    ul([
      [t(["12 Sep 2026: ", "12 sep 2026: "]), link("https://press.driftwood.example/2026-rail-first", t(["Driftwood moves all European trips under eight hours to rail", "Driftwood verplaatst alle Europese reizen korter dan acht uur naar de trein"]))],
      [t(["3 Mar 2026: ", "3 mrt 2026: "]), link("https://press.driftwood.example/2026-new-destinations", t(["Five new destinations for 2027", "Vijf nieuwe bestemmingen voor 2027"]))],
      [t(["18 Nov 2025: ", "18 nov 2025: "]), link("https://press.driftwood.example/2025-impact-report", t(["Impact report 2025", "Impactrapport 2025"]))],
    ]),
    p(t(["Media contact: ", "Mediacontact: "]), link("mailto:press@driftwood.example", "press@driftwood.example")),
  )), "narrow", false);

  const legalDoc = (headings: Pair[], offset: number) =>
    bi((t) => doc(...headings.flatMap((heading, i) => [
      h2(t(heading)),
      p(t(LEGAL[(offset + i * 2) % LEGAL.length]), " ", t(LEGAL[(offset + i * 2 + 1) % LEGAL.length])),
    ])));

  richText("privacy", legalDoc([
    ["Who we are", "Wie we zijn"], ["What data we collect", "Welke gegevens we verzamelen"], ["How long we keep it", "Hoe lang we die bewaren"], ["Your rights", "Jouw rechten"], ["Cookies", "Cookies"],
  ], 0));
  richText("terms", legalDoc([
    ["Scope", "Toepassing"], ["Booking and payment", "Boeken en betalen"], ["Prices", "Prijzen"], ["Changes to your trip", "Wijzigingen in je reis"],
  ], 6), "narrow", false);
  richText("newsletter", bi((t) => doc(
    p(t(["Once a month we send a short letter with new departures, a destination guide and one early-bird offer. Unsubscribe at any time.", "Eén keer per maand sturen we een korte brief met nieuwe vertrekdata, een bestemmingsgids en één vroegboekaanbieding. Afmelden kan altijd."])),
    p(t(["The sign-up form is not part of this demo.", "Het aanmeldformulier maakt geen deel uit van deze demo."])),
  )));
  richText("accessibility", bi((t) => doc(
    h2(t(["Our commitment", "Onze inzet"])),
    p(t(["We want everyone to be able to use this website, including people with a visual, motor or cognitive impairment.", "We willen dat iedereen deze website kan gebruiken, ook mensen met een visuele, motorische of cognitieve beperking."])),
    h3(t(["Known issues", "Bekende problemen"])),
    ul([t(["Embedded videos do not yet have Dutch captions.", "Ingesloten video's hebben nog geen Nederlandse ondertiteling."]), t(["Some older photos lack descriptive alt text.", "Sommige oudere foto's missen een beschrijvende alt-tekst."])]),
  )));

  /* ----------------------------------------------------------------- heroes */

  const hero = (id: string, o: { headline: Pair; sub?: Pair; photo: number; cta?: [Pair, string]; variant: string; overlay?: number }, tr = true) =>
    add(`block:hero:${id}`, "heroBlock", {
      internalName: one(`Hero – ${id}`),
      headline: loc(o.headline, tr),
      subheadline: o.sub ? loc(o.sub, tr) : undefined,
      backgroundImage: one(assetLink(photoKey(o.photo))),
      ctaLabel: o.cta ? loc(o.cta[0], tr) : undefined,
      ctaLink: o.cta ? one(entryLink(o.cta[1])) : undefined,
      variant: one(o.variant),
      overlayOpacity: o.overlay !== undefined ? one(o.overlay) : undefined,
    });

  hero("home", { headline: ["Journeys designed around you", "Reizen die om jou draaien"], sub: ["Small-group tours and tailor-made trips to 25 destinations, planned by people who have been there.", "Kleine groepsreizen en reizen op maat naar 25 bestemmingen, gepland door mensen die er zelf zijn geweest."], photo: 177, cta: [["Ways to travel", "Manieren om te reizen"], page("services")], variant: "fullBleed", overlay: 40 });
  hero("about", { headline: ["We travel slowly, so you can see more", "We reizen langzaam, zodat jij meer ziet"], sub: ["An independent tour operator from Amsterdam, since 2008.", "Een onafhankelijke reisorganisatie uit Amsterdam, sinds 2008."], photo: 129, variant: "split" });
  hero("our-story", { headline: ["Our story", "Ons verhaal"], sub: ["It started with a camper van and a road trip through Portugal.", "Het begon met een kampeerbusje en een roadtrip door Portugal."], photo: 183, variant: "centered", overlay: 30 });
  hero("team", { headline: ["The people behind your trip", "De mensen achter je reis"], photo: 103, variant: "centered", overlay: 35 });
  hero("careers", { headline: ["Work with us", "Werken bij Driftwood"], sub: ["Help us design trips people remember for the rest of their lives.", "Help ons reizen te ontwerpen die mensen de rest van hun leven bijblijven."], photo: 76, variant: "split" });
  hero("sustainability", { headline: ["Travel that leaves a lighter footprint", "Reizen met een lichtere voetafdruk"], photo: 182, variant: "fullBleed", overlay: 45 });
  hero("services", { headline: ["Four ways to travel with us", "Vier manieren om met ons te reizen"], sub: ["Join a small group, design your own journey, or bring the whole team.", "Reis mee met een kleine groep, ontwerp je eigen reis of neem het hele team mee."], photo: 191, variant: "fullBleed", overlay: 35 });
  hero("group-tours", { headline: ["Group tours for curious travellers", "Groepsreizen voor nieuwsgierige reizigers"], photo: 177, cta: [["Ask about dates", "Vraag naar data"], page("contact")], variant: "split" });
  hero("private-journeys", { headline: ["Private journeys, at your own pace", "Privéreizen, in je eigen tempo"], photo: 116, cta: [["Start planning", "Begin met plannen"], page("contact")], variant: "split" });
  hero("corporate-travel", { headline: ["Corporate travel and team retreats", "Zakelijke reizen en teamretraites"], photo: 193, variant: "centered", overlay: 40 }, false);
  hero("honeymoons", { headline: ["Honeymoons worth the wait", "Huwelijksreizen die het wachten waard zijn"], photo: 49, variant: "fullBleed", overlay: 30 });
  hero("contact", { headline: ["Get in touch", "Neem contact op"], sub: ["We reply within one working day.", "We reageren binnen één werkdag."], photo: 164, variant: "centered", overlay: 40 });
  hero("faq", { headline: ["Questions? We've got answers", "Vragen? Wij hebben antwoorden"], photo: 17, variant: "centered", overlay: 40 });
  hero("travel-insurance", { headline: ["Travel insurance, without the small print", "Reisverzekering, zonder kleine lettertjes"], photo: 203, variant: "split" });
  hero("gift-cards", { headline: ["Give someone a journey", "Geef iemand een reis"], photo: 110, variant: "centered", overlay: 35 });
  hero("press", { headline: ["Press & media", "Pers & media"], photo: 122, variant: "centered", overlay: 45 }, false);
  hero("newsletter", { headline: ["The Driftwood letter", "De Driftwood-brief"], photo: 199, variant: "centered", overlay: 30 });

  /* ------------------------------------------------------------------ pages */

  type PageDef = {
    slug: string;
    parent?: string;
    title: Pair;
    description?: Pair;
    sections: string[];
    translated?: boolean;
    showInSitemap?: boolean;
    noIndex?: boolean;
    tags?: string[];
  };

  const PAGES: PageDef[] = [
    { slug: "home", title: ["Home", "Home"], description: ["Small-group tours and tailor-made trips to 25 destinations.", "Kleine groepsreizen en reizen op maat naar 25 bestemmingen."], tags: ["evergreen"],
      sections: ["block:hero:home", "block:features:home-why", "block:grid:home-featured-destinations", "block:stats:home", "block:grid:home-latest", "testimonial:hannah", "cta:newsletter"] },
    { slug: "about", title: ["About us", "Over ons"], description: ["An independent tour operator from Amsterdam, since 2008.", "Een onafhankelijke reisorganisatie uit Amsterdam, sinds 2008."],
      sections: ["block:hero:about", "block:rt:about-intro", "block:stats:about", "block:features:about-values", "testimonial:henk", "cta:careers"] },
    { slug: "our-story", parent: "about", title: ["Our story", "Ons verhaal"], description: ["How a camper van road trip became Driftwood Travel.", "Hoe een roadtrip met een kampeerbusje Driftwood Travel werd."],
      sections: ["block:hero:our-story", "block:rt:our-story", "block:iwt:our-story", "cta:newsletter"] },
    { slug: "team", parent: "about", title: ["Our team", "Ons team"], description: ["Meet the travel designers, writers and guides behind your trip.", "Maak kennis met de reisontwerpers, schrijvers en gidsen achter je reis."],
      sections: ["block:hero:team", "block:iwt:team", "block:rt:team", "cta:careers"] },
    { slug: "careers", parent: "about", title: ["Careers", "Vacatures"], description: ["Join a team that designs trips people remember.", "Kom werken bij een team dat reizen ontwerpt die bijblijven."],
      sections: ["block:hero:careers", "block:rt:careers", "block:features:careers-perks", "block:faq:careers", "cta:apply"] },
    { slug: "sustainability", parent: "about", title: ["Sustainability", "Duurzaamheid"], description: ["How we measure, reduce and offset the footprint of our trips.", "Hoe we de voetafdruk van onze reizen meten, verkleinen en compenseren."],
      sections: ["block:hero:sustainability", "block:rt:sustainability", "block:features:sustainability", "block:stats:sustainability", "block:grid:sustainability-stories", "cta:newsletter"] },
    { slug: "services", title: ["Ways to travel", "Manieren om te reizen"], description: ["Group tours, private journeys, corporate travel and honeymoons.", "Groepsreizen, privéreizen, zakelijke reizen en huwelijksreizen."],
      sections: ["block:hero:services", "block:features:services", "testimonial:amara", "cta:contact"] },
    { slug: "group-tours", parent: "services", title: ["Group tours", "Groepsreizen"], description: ["Small-group tours with a local tour leader, max. 12 travellers.", "Kleine groepsreizen met een lokale reisleider, max. 12 reizigers."], tags: ["campaignSummer2026"],
      sections: ["block:hero:group-tours", "block:rt:group-tours", "block:iwt:group-tours", "video:guides", "block:grid:group-tours-picks", "block:faq:group-tours", "cta:contact"] },
    { slug: "private-journeys", parent: "services", title: ["Private journeys", "Privéreizen"], description: ["Tailor-made trips at your own pace, with your own guide.", "Reizen op maat in je eigen tempo, met je eigen gids."],
      sections: ["block:hero:private-journeys", "block:rt:private-journeys", "block:iwt:private", "testimonial:peter", "cta:contact"] },
    { slug: "corporate-travel", parent: "services", title: ["Corporate travel", "Zakelijke reizen"], description: ["Team retreats, incentive trips and offsites.", "Teamretraites, incentivereizen en offsites."], translated: false, tags: ["needsReview"],
      sections: ["block:hero:corporate-travel", "block:rt:corporate", "block:features:corporate", "cta:contact"] },
    { slug: "honeymoons", parent: "services", title: ["Honeymoons", "Huwelijksreizen"], description: ["Unhurried, personal honeymoons in our favourite places.", "Persoonlijke huwelijksreizen zonder haast, naar onze favoriete plekken."],
      sections: ["block:hero:honeymoons", "block:iwt:honeymoons", "block:grid:honeymoon-destinations", "testimonial:lotte", "cta:contact"] },
    { slug: "contact", title: ["Contact", "Contact"], description: ["Phone, email and office address. We reply within one working day.", "Telefoon, e-mail en adres. We reageren binnen één werkdag."],
      sections: ["block:hero:contact", "block:rt:contact", "block:iwt:contact-office", "block:faq:contact"] },
    { slug: "faq", title: ["FAQ", "Veelgestelde vragen"], description: ["Answers to the questions we hear most often.", "Antwoorden op de vragen die we het vaakst krijgen."],
      sections: ["block:hero:faq", "block:faq:main", "cta:contact"] },
    { slug: "travel-insurance", title: ["Travel insurance", "Reisverzekering"], description: ["Medical and cancellation cover designed for our trips.", "Medische en annuleringsdekking, ontworpen voor onze reizen."],
      sections: ["block:hero:travel-insurance", "block:rt:insurance", "block:faq:insurance", "cta:contact"] },
    { slug: "gift-cards", title: ["Gift cards", "Cadeaukaarten"],
      sections: ["block:hero:gift-cards", "block:features:gift-cards", "block:rt:gift-cards", "cta:gift-cards"] },
    { slug: "press", title: ["Press", "Pers"], description: ["Press releases, media kit and contact details.", "Persberichten, mediakit en contactgegevens."], translated: false,
      sections: ["block:hero:press", "block:rt:press", "video:press-reel", "block:iwt:press-kit"] },
    { slug: "privacy-policy", title: ["Privacy policy", "Privacyverklaring"], description: ["How Driftwood Travel handles your personal data.", "Hoe Driftwood Travel met je persoonsgegevens omgaat."],
      sections: ["block:rt:privacy"] },
    { slug: "terms-and-conditions", title: ["Terms and conditions", "Algemene voorwaarden"], description: ["The terms that apply to every Driftwood booking.", "De voorwaarden die gelden voor elke Driftwood-boeking."], translated: false,
      sections: ["block:rt:terms"] },
    { slug: "newsletter", title: ["Newsletter", "Nieuwsbrief"], description: ["Sign up for the monthly Driftwood letter.", "Meld je aan voor de maandelijkse Driftwood-brief."], showInSitemap: false, noIndex: true,
      sections: ["block:hero:newsletter", "block:rt:newsletter"] },
    { slug: "accessibility", title: ["Accessibility", "Toegankelijkheid"],
      sections: ["block:rt:accessibility", "cta:contact"] },
  ];

  for (const def of PAGES) {
    const tr = def.translated ?? true;
    const seoKey = def.description ? `seo:landingPage:${def.slug}` : undefined;
    if (seoKey) {
      add(seoKey, "seo", {
        internalName: one(`SEO – page /${def.slug}`),
        metaTitle: loc([`${def.title[0]} | Driftwood Travel`, `${def.title[1]} | Driftwood Travel`], tr),
        metaDescription: loc(def.description!, tr),
        noIndex: def.noIndex ? one(true) : undefined,
      });
    }
    add(page(def.slug), "landingPage", {
      title: loc(def.title, tr),
      slug: one(def.slug),
      parentPage: def.parent ? one(entryLink(page(def.parent))) : undefined,
      sections: one(def.sections.map((k) => entryLink(k))),
      seo: seoKey ? one(entryLink(seoKey)) : undefined,
      showInSitemap: one(def.showInSitemap ?? true),
    }, { tags: def.tags });
  }

  /* ------------------------------------------------------------- navigation */

  type NavDef = { id: string; label: Pair; to?: string; url?: string; newTab?: boolean; children?: NavDef[] };

  const navLink = (menu: string, def: NavDef): string =>
    add(`nav:${menu}:${def.id}`, "navigationLink", {
      label: loc(def.label),
      internalLink: def.to ? one(entryLink(def.to)) : undefined,
      url: def.url ? one(def.url) : undefined,
      openInNewTab: def.newTab ? one(true) : undefined,
      children: def.children?.length ? one(def.children.map((c) => entryLink(navLink(menu, c)))) : undefined,
    });

  const menu = (id: string, name: string, items: NavDef[]) =>
    add(`menu:${id}`, "navigationMenu", {
      internalName: one(name),
      items: one(items.map((i) => entryLink(navLink(id, i)))),
    });

  menu("main", "Main navigation", [
    { id: "destinations", label: ["Destinations", "Bestemmingen"], url: "/destinations", children: [
      { id: "lisbon", label: ["Lisbon", "Lissabon"], to: "destination:lisbon" },
      { id: "kyoto", label: ["Kyoto", "Kyoto"], to: "destination:kyoto" },
      { id: "cape-town", label: ["Cape Town", "Kaapstad"], to: "destination:cape-town" },
      { id: "banff", label: ["Banff", "Banff"], to: "destination:banff" },
      { id: "all-destinations", label: ["All destinations", "Alle bestemmingen"], url: "/destinations" },
    ] },
    { id: "journal", label: ["Journal", "Magazine"], url: "/blog", children: [
      { id: "guides", label: ["Guides", "Reisgidsen"], url: "/blog/category/guides" },
      { id: "food", label: ["Food & Drink", "Eten & drinken"], url: "/blog/category/food-and-drink" },
      { id: "sustainable", label: ["Sustainable travel", "Duurzaam reizen"], url: "/blog/category/sustainable-travel" },
      { id: "all-stories", label: ["All stories", "Alle verhalen"], url: "/blog" },
    ] },
    { id: "services", label: ["Ways to travel", "Manieren om te reizen"], to: page("services"), children: [
      { id: "group-tours", label: ["Group tours", "Groepsreizen"], to: page("group-tours") },
      { id: "private-journeys", label: ["Private journeys", "Privéreizen"], to: page("private-journeys") },
      { id: "corporate-travel", label: ["Corporate travel", "Zakelijke reizen"], to: page("corporate-travel") },
      { id: "honeymoons", label: ["Honeymoons", "Huwelijksreizen"], to: page("honeymoons") },
    ] },
    { id: "about", label: ["About", "Over ons"], to: page("about"), children: [
      { id: "our-story", label: ["Our story", "Ons verhaal"], to: page("our-story") },
      { id: "team", label: ["Team", "Team"], to: page("team") },
      { id: "sustainability", label: ["Sustainability", "Duurzaamheid"], to: page("sustainability") },
      { id: "careers", label: ["Careers", "Vacatures"], to: page("careers") },
    ] },
    { id: "contact", label: ["Contact", "Contact"], to: page("contact") },
  ]);

  // Footer: top-level items without a link act as column headings.
  menu("footer", "Footer navigation", [
    { id: "company", label: ["Company", "Bedrijf"], children: [
      { id: "about", label: ["About us", "Over ons"], to: page("about") },
      { id: "press", label: ["Press", "Pers"], to: page("press") },
      { id: "careers", label: ["Careers", "Vacatures"], to: page("careers") },
      { id: "sustainability", label: ["Sustainability", "Duurzaamheid"], to: page("sustainability") },
    ] },
    { id: "help", label: ["Help", "Hulp"], children: [
      { id: "faq", label: ["FAQ", "Veelgestelde vragen"], to: page("faq") },
      { id: "contact", label: ["Contact", "Contact"], to: page("contact") },
      { id: "insurance", label: ["Travel insurance", "Reisverzekering"], to: page("travel-insurance") },
      { id: "accessibility", label: ["Accessibility", "Toegankelijkheid"], to: page("accessibility") },
    ] },
    { id: "more", label: ["More", "Meer"], children: [
      { id: "gift-cards", label: ["Gift cards", "Cadeaukaarten"], to: page("gift-cards") },
      { id: "newsletter", label: ["Newsletter", "Nieuwsbrief"], to: page("newsletter") },
      { id: "instagram", label: ["Instagram", "Instagram"], url: "https://www.instagram.com/", newTab: true },
    ] },
    { id: "legal", label: ["Legal", "Juridisch"], children: [
      { id: "privacy", label: ["Privacy policy", "Privacyverklaring"], to: page("privacy-policy") },
      { id: "terms", label: ["Terms and conditions", "Algemene voorwaarden"], to: page("terms-and-conditions") },
    ] },
  ]);

  /* --------------------------------------------------- settings + redirects */

  add("seo:default", "seo", {
    internalName: one("SEO – site default"),
    metaTitle: loc(["Driftwood Travel – small-group tours and tailor-made trips", "Driftwood Travel – kleine groepsreizen en reizen op maat"]),
    metaDescription: loc(["Small-group tours and tailor-made trips to 25 destinations, designed in Amsterdam since 2008.", "Kleine groepsreizen en reizen op maat naar 25 bestemmingen, ontworpen in Amsterdam sinds 2008."]),
    ogImage: one(assetLink(photoKey(177))),
  });

  add("settings", "siteSettings", {
    internalName: one("Site settings"),
    siteName: loc(["Driftwood Travel", "Driftwood Travel"]),
    logo: one(assetLink(LOGO_KEY)),
    homePage: one(entryLink(page("home"))),
    mainNavigation: one(entryLink("menu:main")),
    footerNavigation: one(entryLink("menu:footer")),
    footerText: loc([
      "Driftwood Travel is a fictional company. All content on this site is generated demo content.",
      "Driftwood Travel is een fictief bedrijf. Alle inhoud op deze site is gegenereerde demo-inhoud.",
    ]),
    announcement: loc(["Summer 2026 departures are open: book before 31 January for 10% off group tours.", "Vertrekken voor zomer 2026 zijn open: boek vóór 31 januari voor 10% korting op groepsreizen."]),
    defaultSeo: one(entryLink("seo:default")),
    socialLinks: one({ instagram: "https://www.instagram.com/", facebook: "https://www.facebook.com/", youtube: "https://www.youtube.com/" }),
  });

  const redirect = (from: string, to: string, permanent = true) =>
    add(`redirect:${from}`, "redirect", { fromPath: one(from), toPath: one(to), permanent: one(permanent) });

  redirect("/about-us", "/about");
  redirect("/our-team", "/about/team");
  redirect("/jobs", "/about/careers");
  redirect("/trips", "/destinations");
  redirect("/insurance", "/travel-insurance");
  redirect("/privacy", "/privacy-policy");
  redirect("/terms", "/terms-and-conditions");
  redirect("/blog/lisbon-guide", `/blog/${opts.lisbonGuideSlug}`);
  redirect("/destinations/iceland", "/destinations/reykjavik");
  redirect("/summer", "/services/group-tours", false);
  redirect("/partner-portal", "https://partners.driftwood.example", false);

  return specs;
}
