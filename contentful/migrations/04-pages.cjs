const { SECTION_TYPES, SLUG_VALIDATION, IMAGE_ONLY, RICH_TEXT_FULL } = require("./_shared.cjs");

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** @type {import('contentful-migration').MigrationFunction} */
module.exports = function (migration) {
  // --- Landing page ------------------------------------------------------------
  const landingPage = migration
    .createContentType("landingPage")
    .name("Landing page")
    .description(
      "Flexible page built from sections. The URL is built from the parent chain, e.g. about > team = /about/team. The page with slug 'home' is the homepage.",
    )
    .displayField("title");

  landingPage.createField("title").name("Title").type("Symbol").required(true).localized(true);
  landingPage
    .createField("slug")
    .name("Slug (URL segment)")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, SLUG_VALIDATION]);
  landingPage
    .createField("parentPage")
    .name("Parent page")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["landingPage"] }]);
  landingPage
    .createField("sections")
    .name("Sections")
    .type("Array")
    .validations([{ size: { max: 12 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: SECTION_TYPES }] });
  landingPage
    .createField("seo")
    .name("SEO")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["seo"] }]);
  landingPage
    .createField("showInSitemap")
    .name("Show in sitemap")
    .type("Boolean")
    .defaultValue({ "en-US": true });

  landingPage.changeFieldControl("slug", "builtin", "slugEditor", { trackingFieldId: "title" });
  landingPage.changeFieldControl("parentPage", "builtin", "entryLinkEditor", {
    helpText: "Leave empty for top-level pages.",
  });
  landingPage.changeFieldControl("sections", "builtin", "entryCardsEditor");

  // --- Article ------------------------------------------------------------------
  const article = migration
    .createContentType("article")
    .name("Blog article")
    .description("Travel blog post, published at /blog/{slug}.")
    .displayField("title");

  article.createField("title").name("Title").type("Symbol").required(true).localized(true);
  article
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, SLUG_VALIDATION]);
  article
    .createField("excerpt")
    .name("Excerpt")
    .type("Text")
    .localized(true)
    .validations([{ size: { max: 300 } }]);
  article
    .createField("heroImage")
    .name("Hero image")
    .type("Link")
    .linkType("Asset")
    .required(true)
    .validations([IMAGE_ONLY]);
  article
    .createField("body")
    .name("Body")
    .type("RichText")
    .required(true)
    .localized(true)
    .validations(RICH_TEXT_FULL);
  article
    .createField("author")
    .name("Author")
    .type("Link")
    .linkType("Entry")
    .required(true)
    .validations([{ linkContentType: ["author"] }]);
  article
    .createField("categories")
    .name("Categories")
    .type("Array")
    .validations([{ size: { min: 1, max: 3 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["category"] }] });
  article.createField("tags").name("Keywords").type("Array").items({ type: "Symbol" });
  article.createField("publishDate").name("Publish date").type("Date").required(true);
  article.createField("featured").name("Featured").type("Boolean");
  article
    .createField("relatedArticles")
    .name("Related articles")
    .type("Array")
    .validations([{ size: { max: 3 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["article"] }] });
  article
    .createField("seo")
    .name("SEO")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["seo"] }]);

  article.changeFieldControl("slug", "builtin", "slugEditor", { trackingFieldId: "title" });
  article.changeFieldControl("excerpt", "builtin", "multipleLine");
  article.changeFieldControl("tags", "builtin", "tagEditor", {
    helpText: "Free-form keywords used for on-site search and related content.",
  });
  article.changeFieldControl("publishDate", "builtin", "datePicker", { format: "dateonly" });

  // --- Destination ---------------------------------------------------------------
  const destination = migration
    .createContentType("destination")
    .name("Destination")
    .description("Bookable destination, published at /destinations/{slug}.")
    .displayField("name");

  destination.createField("name").name("Name").type("Symbol").required(true).localized(true);
  destination
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, SLUG_VALIDATION]);
  destination.createField("tagline").name("Tagline").type("Symbol").localized(true);
  destination.createField("summary").name("Summary").type("Text").localized(true);
  destination
    .createField("heroImage")
    .name("Hero image")
    .type("Link")
    .linkType("Asset")
    .required(true)
    .validations([IMAGE_ONLY]);
  destination
    .createField("gallery")
    .name("Gallery")
    .type("Array")
    .validations([{ size: { max: 8 } }])
    .items({ type: "Link", linkType: "Asset", validations: [IMAGE_ONLY] });
  destination.createField("country").name("Country").type("Symbol").required(true).localized(true);
  destination
    .createField("region")
    .name("Region")
    .type("Symbol")
    .required(true)
    .validations([
      { in: ["Europe", "Asia", "Africa", "North America", "South America", "Oceania", "Middle East"] },
    ]);
  destination.createField("location").name("Map location").type("Location").required(true);
  destination
    .createField("priceFrom")
    .name("Price from")
    .type("Number")
    .validations([{ range: { min: 0 } }]);
  destination
    .createField("currency")
    .name("Currency")
    .type("Symbol")
    .validations([{ in: ["EUR", "USD", "GBP"] }])
    .defaultValue({ "en-US": "EUR" });
  destination
    .createField("tripLengthDays")
    .name("Typical trip length (days)")
    .type("Integer")
    .validations([{ range: { min: 1, max: 60 } }]);
  destination
    .createField("bestMonths")
    .name("Best months to visit")
    .type("Array")
    .items({ type: "Symbol", validations: [{ in: MONTHS }] });
  destination
    .createField("rating")
    .name("Guest rating")
    .type("Number")
    .validations([{ range: { min: 1, max: 5 } }]);
  destination.createField("highlights").name("Highlights").type("Object").localized(true);
  destination.createField("travelTips").name("Travel tips").type("Text").localized(true);
  destination
    .createField("description")
    .name("Description")
    .type("RichText")
    .localized(true)
    .validations(RICH_TEXT_FULL);
  destination.createField("featured").name("Featured").type("Boolean");
  destination
    .createField("seo")
    .name("SEO")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["seo"] }]);

  destination.changeFieldControl("slug", "builtin", "slugEditor", { trackingFieldId: "name" });
  destination.changeFieldControl("region", "builtin", "dropdown");
  destination.changeFieldControl("currency", "builtin", "radio");
  destination.changeFieldControl("bestMonths", "builtin", "checkbox");
  destination.changeFieldControl("gallery", "builtin", "assetGalleryEditor");
  destination.changeFieldControl("highlights", "builtin", "objectEditor", {
    helpText: 'JSON array: [{"title": "...", "description": "..."}]. Translate per locale.',
  });
  destination.changeFieldControl("travelTips", "builtin", "markdown");
};
