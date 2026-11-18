const {
  PAGE_TYPES,
  URL_VALIDATION,
  IMAGE_ONLY,
  ICONS,
  RICH_TEXT_FULL,
  RICH_TEXT_SIMPLE,
} = require("./_shared.cjs");

/**
 * Page-building blocks. Blocks are standalone entries, so the same block can be
 * referenced from several pages (e.g. the newsletter CTA banner).
 *
 * @type {import('contentful-migration').MigrationFunction}
 */
module.exports = function (migration) {
  const internalName = (ct) =>
    ct
      .createField("internalName")
      .name("Internal name")
      .type("Symbol")
      .required(true);

  // --- Video embed (also embeddable inside rich text) -----------------------
  const video = migration
    .createContentType("videoEmbed")
    .name("Video embed")
    .description("YouTube or Vimeo video. Can be a page section or embedded in rich text.")
    .displayField("internalName");
  internalName(video);
  video.createField("title").name("Title").type("Symbol").localized(true);
  video
    .createField("provider")
    .name("Provider")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["youtube", "vimeo"] }]);
  video
    .createField("videoId")
    .name("Video ID")
    .type("Symbol")
    .required(true)
    .validations([{ regexp: { pattern: "^[A-Za-z0-9_-]{6,20}$" }, message: "Only the ID, not the full URL." }]);
  video.createField("caption").name("Caption").type("Symbol").localized(true);
  video.changeFieldControl("provider", "builtin", "radio");

  // --- Hero -------------------------------------------------------------------
  const hero = migration
    .createContentType("heroBlock")
    .name("Hero")
    .description("Large banner at the top of a landing page.")
    .displayField("internalName");
  internalName(hero);
  hero.createField("headline").name("Headline").type("Symbol").required(true).localized(true);
  hero.createField("subheadline").name("Subheadline").type("Text").localized(true);
  hero
    .createField("backgroundImage")
    .name("Background image")
    .type("Link")
    .linkType("Asset")
    .validations([IMAGE_ONLY]);
  hero.createField("ctaLabel").name("Button label").type("Symbol").localized(true);
  hero
    .createField("ctaLink")
    .name("Button link")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: PAGE_TYPES }]);
  hero
    .createField("variant")
    .name("Layout variant")
    .type("Symbol")
    .validations([{ in: ["centered", "split", "fullBleed"] }])
    .defaultValue({ "en-US": "centered" });
  hero
    .createField("overlayOpacity")
    .name("Overlay opacity (%)")
    .type("Integer")
    .validations([{ range: { min: 0, max: 90 } }]);
  hero.changeFieldControl("variant", "builtin", "radio");
  hero.changeFieldControl("subheadline", "builtin", "multipleLine");

  // --- Rich text block -----------------------------------------------------------
  const richTextBlock = migration
    .createContentType("richTextBlock")
    .name("Rich text")
    .description("Free-form formatted copy.")
    .displayField("internalName");
  internalName(richTextBlock);
  richTextBlock
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .localized(true)
    .validations(RICH_TEXT_FULL);
  richTextBlock
    .createField("width")
    .name("Width")
    .type("Symbol")
    .validations([{ in: ["narrow", "wide"] }])
    .defaultValue({ "en-US": "narrow" });
  richTextBlock.changeFieldControl("width", "builtin", "radio");

  // --- Feature grid + items -----------------------------------------------------
  const featureItem = migration
    .createContentType("featureItem")
    .name("Feature item")
    .description("A single tile inside a Feature grid.")
    .displayField("title");
  featureItem.createField("title").name("Title").type("Symbol").required(true).localized(true);
  featureItem.createField("description").name("Description").type("Text").localized(true);
  featureItem.createField("icon").name("Icon").type("Symbol").validations([{ in: ICONS }]);
  featureItem
    .createField("link")
    .name("Link")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: PAGE_TYPES }]);
  featureItem.changeFieldControl("icon", "builtin", "dropdown");

  const featureGrid = migration
    .createContentType("featureGrid")
    .name("Feature grid")
    .description("Grid of 2-8 feature tiles with icons.")
    .displayField("internalName");
  internalName(featureGrid);
  featureGrid.createField("heading").name("Heading").type("Symbol").localized(true);
  featureGrid.createField("intro").name("Intro").type("Text").localized(true);
  featureGrid
    .createField("columns")
    .name("Columns")
    .type("Integer")
    .validations([{ in: [2, 3, 4] }])
    .defaultValue({ "en-US": 3 });
  featureGrid
    .createField("items")
    .name("Items")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2, max: 8 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["featureItem"] }] });
  featureGrid.changeFieldControl("columns", "builtin", "radio");

  // --- CTA banner (also embeddable inside rich text) ----------------------------
  const cta = migration
    .createContentType("ctaBanner")
    .name("Call to action banner")
    .description("Colored banner with a button. Can be a page section or embedded in rich text.")
    .displayField("internalName");
  internalName(cta);
  cta.createField("heading").name("Heading").type("Symbol").required(true).localized(true);
  cta.createField("body").name("Body").type("Text").localized(true);
  cta.createField("buttonLabel").name("Button label").type("Symbol").localized(true);
  cta
    .createField("buttonLink")
    .name("Button link (internal)")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: PAGE_TYPES }]);
  cta
    .createField("buttonUrl")
    .name("Button URL (external or custom path)")
    .type("Symbol")
    .validations([URL_VALIDATION]);
  cta
    .createField("theme")
    .name("Theme")
    .type("Symbol")
    .validations([{ in: ["sand", "ocean", "forest", "dark"] }])
    .defaultValue({ "en-US": "ocean" });
  cta.changeFieldControl("theme", "builtin", "dropdown");
  cta.changeFieldControl("buttonUrl", "builtin", "urlEditor", {
    helpText: "Used when no internal link is set. A site path like /destinations or a full URL.",
  });

  // --- Testimonial -------------------------------------------------------------
  const testimonial = migration
    .createContentType("testimonialBlock")
    .name("Testimonial")
    .description("Customer quote with optional star rating.")
    .displayField("internalName");
  internalName(testimonial);
  testimonial.createField("quote").name("Quote").type("Text").required(true).localized(true);
  testimonial.createField("personName").name("Person name").type("Symbol").required(true);
  testimonial.createField("personTitle").name("Person title / trip").type("Symbol").localized(true);
  testimonial
    .createField("avatar")
    .name("Avatar")
    .type("Link")
    .linkType("Asset")
    .validations([IMAGE_ONLY]);
  testimonial
    .createField("rating")
    .name("Rating")
    .type("Integer")
    .validations([{ range: { min: 1, max: 5 } }]);
  testimonial.changeFieldControl("rating", "builtin", "rating", { stars: 5 });

  // --- FAQ ------------------------------------------------------------------------
  const faqItem = migration
    .createContentType("faqItem")
    .name("FAQ item")
    .description("Question + answer, used inside an FAQ block.")
    .displayField("question");
  faqItem.createField("question").name("Question").type("Symbol").required(true).localized(true);
  faqItem
    .createField("answer")
    .name("Answer")
    .type("RichText")
    .required(true)
    .localized(true)
    .validations(RICH_TEXT_SIMPLE);

  const faqBlock = migration
    .createContentType("faqBlock")
    .name("FAQ")
    .description("Accordion list of FAQ items.")
    .displayField("internalName");
  internalName(faqBlock);
  faqBlock.createField("heading").name("Heading").type("Symbol").localized(true);
  faqBlock
    .createField("items")
    .name("Questions")
    .type("Array")
    .required(true)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["faqItem"] }] });

  // --- Image with text ---------------------------------------------------------
  const imageWithText = migration
    .createContentType("imageWithText")
    .name("Image with text")
    .description("Image next to a short formatted copy block.")
    .displayField("internalName");
  internalName(imageWithText);
  imageWithText.createField("heading").name("Heading").type("Symbol").localized(true);
  imageWithText
    .createField("body")
    .name("Body")
    .type("RichText")
    .localized(true)
    .validations(RICH_TEXT_SIMPLE);
  imageWithText
    .createField("image")
    .name("Image")
    .type("Link")
    .linkType("Asset")
    .required(true)
    .validations([IMAGE_ONLY]);
  imageWithText
    .createField("imagePosition")
    .name("Image position")
    .type("Symbol")
    .validations([{ in: ["left", "right"] }])
    .defaultValue({ "en-US": "left" });
  imageWithText.createField("caption").name("Image caption").type("Symbol").localized(true);
  imageWithText.changeFieldControl("imagePosition", "builtin", "radio");

  // --- Stats ------------------------------------------------------------------------
  const stats = migration
    .createContentType("statsBlock")
    .name("Stats")
    .description("Row of key figures.")
    .displayField("internalName");
  internalName(stats);
  stats.createField("heading").name("Heading").type("Symbol").localized(true);
  stats.createField("stats").name("Stats").type("Object").required(true).localized(true);
  stats.changeFieldControl("stats", "builtin", "objectEditor", {
    helpText: 'JSON array: [{"value": "25+", "label": "Countries"}]. Translate the labels per locale.',
  });

  // --- Content grid -----------------------------------------------------------------
  const grid = migration
    .createContentType("contentGrid")
    .name("Content grid")
    .description("Cards for articles or destinations, picked by hand or by a query.")
    .displayField("internalName");
  internalName(grid);
  grid.createField("heading").name("Heading").type("Symbol").localized(true);
  grid
    .createField("mode")
    .name("Mode")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["manual", "latestArticles", "featuredDestinations", "category"] }])
    .defaultValue({ "en-US": "manual" });
  grid
    .createField("manualItems")
    .name("Items (manual mode)")
    .type("Array")
    .validations([{ size: { max: 12 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["article", "destination"] }] });
  grid
    .createField("category")
    .name("Category (category mode)")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["category"] }]);
  grid
    .createField("limit")
    .name("Max items")
    .type("Integer")
    .validations([{ range: { min: 1, max: 12 } }])
    .defaultValue({ "en-US": 3 });
  grid.changeFieldControl("mode", "builtin", "dropdown", {
    helpText: "manual = pick items below; the other modes ignore the manual list.",
  });
};
