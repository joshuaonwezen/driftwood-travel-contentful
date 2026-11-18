const { PAGE_TYPES, URL_VALIDATION, IMAGE_ONLY } = require("./_shared.cjs");

/** @type {import('contentful-migration').MigrationFunction} */
module.exports = function (migration) {
  // --- Navigation link --------------------------------------------------------------
  const link = migration
    .createContentType("navigationLink")
    .name("Navigation link")
    .description("Menu item. Links to a page entry, or to a custom URL for code routes like /blog.")
    .displayField("label");

  link.createField("label").name("Label").type("Symbol").required(true).localized(true);
  link
    .createField("internalLink")
    .name("Internal link")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: PAGE_TYPES }]);
  link.createField("url").name("Custom URL").type("Symbol").validations([URL_VALIDATION]);
  link.createField("openInNewTab").name("Open in new tab").type("Boolean");
  link
    .createField("children")
    .name("Sub-items")
    .type("Array")
    .validations([{ size: { max: 8 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["navigationLink"] }] });

  link.changeFieldControl("url", "builtin", "urlEditor", {
    helpText: "Used when Internal link is empty. Site paths (/blog) are prefixed with the current language.",
  });

  // --- Navigation menu ---------------------------------------------------------------
  const menu = migration
    .createContentType("navigationMenu")
    .name("Navigation menu")
    .description("Ordered list of navigation links (main menu, footer).")
    .displayField("internalName");

  menu.createField("internalName").name("Internal name").type("Symbol").required(true);
  menu
    .createField("items")
    .name("Items")
    .type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["navigationLink"] }] });

  // --- Site settings (singleton) -------------------------------------------------------
  const settings = migration
    .createContentType("siteSettings")
    .name("Site settings")
    .description("Global settings. Exactly one entry of this type should exist.")
    .displayField("internalName");

  settings.createField("internalName").name("Internal name").type("Symbol").required(true);
  settings.createField("siteName").name("Site name").type("Symbol").required(true).localized(true);
  settings
    .createField("logo")
    .name("Logo")
    .type("Link")
    .linkType("Asset")
    .validations([IMAGE_ONLY]);
  settings
    .createField("homePage")
    .name("Home page")
    .type("Link")
    .linkType("Entry")
    .required(true)
    .validations([{ linkContentType: ["landingPage"] }]);
  settings
    .createField("mainNavigation")
    .name("Main navigation")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
  settings
    .createField("footerNavigation")
    .name("Footer navigation")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
  settings.createField("footerText").name("Footer text").type("Text").localized(true);
  settings.createField("announcement").name("Announcement bar").type("Symbol").localized(true);
  settings
    .createField("defaultSeo")
    .name("Default SEO")
    .type("Link")
    .linkType("Entry")
    .validations([{ linkContentType: ["seo"] }]);
  settings.createField("socialLinks").name("Social links").type("Object");

  // --- Redirect ------------------------------------------------------------------------
  const redirect = migration
    .createContentType("redirect")
    .name("Redirect")
    .description("URL redirect, applied at build time. Paths are language-independent.")
    .displayField("fromPath");

  redirect
    .createField("fromPath")
    .name("From path")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      { regexp: { pattern: "^/[^\\s]*$" }, message: "Must start with / and contain no language prefix." },
    ]);
  redirect.createField("toPath").name("To path or URL").type("Symbol").required(true).validations([URL_VALIDATION]);
  redirect
    .createField("permanent")
    .name("Permanent (301/308)")
    .type("Boolean")
    .defaultValue({ "en-US": true });
};
