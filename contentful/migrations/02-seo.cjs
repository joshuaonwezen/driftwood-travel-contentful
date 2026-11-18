const { IMAGE_ONLY, URL_VALIDATION } = require("./_shared.cjs");

/** @type {import('contentful-migration').MigrationFunction} */
module.exports = function (migration) {
  const seo = migration
    .createContentType("seo")
    .name("SEO metadata")
    .description("Reusable SEO settings. Referenced from pages and from Site settings (default).")
    .displayField("internalName");

  seo.createField("internalName").name("Internal name").type("Symbol").required(true);
  seo
    .createField("metaTitle")
    .name("Meta title")
    .type("Symbol")
    .localized(true)
    .validations([{ size: { max: 70 }, message: "Keep meta titles under 70 characters." }]);
  seo
    .createField("metaDescription")
    .name("Meta description")
    .type("Text")
    .localized(true)
    .validations([{ size: { max: 170 }, message: "Keep meta descriptions under 170 characters." }]);
  seo
    .createField("ogImage")
    .name("Social sharing image")
    .type("Link")
    .linkType("Asset")
    .validations([IMAGE_ONLY]);
  seo.createField("noIndex").name("Hide from search engines (noindex)").type("Boolean");
  seo.createField("noFollow").name("Do not follow links (nofollow)").type("Boolean");
  seo.createField("canonicalUrl").name("Canonical URL").type("Symbol").validations([URL_VALIDATION]);

  seo.changeFieldControl("metaDescription", "builtin", "multipleLine");
};
