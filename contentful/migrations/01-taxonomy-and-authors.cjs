const { SLUG_VALIDATION, IMAGE_ONLY, ICONS } = require("./_shared.cjs");

/** @type {import('contentful-migration').MigrationFunction} */
module.exports = function (migration) {
  // --- Category -------------------------------------------------------------
  const category = migration
    .createContentType("category")
    .name("Category")
    .description("Blog category. Articles reference 1-3 categories.")
    .displayField("name");

  category.createField("name").name("Name").type("Symbol").required(true).localized(true);
  category
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, SLUG_VALIDATION]);
  category.createField("description").name("Description").type("Text").localized(true);
  category
    .createField("color")
    .name("Accent color")
    .type("Symbol")
    .validations([{ regexp: { pattern: "^#[0-9a-fA-F]{6}$" }, message: "Hex color, e.g. #1f6f8b" }]);
  category.createField("icon").name("Icon").type("Symbol").validations([{ in: ICONS }]);

  category.changeFieldControl("slug", "builtin", "slugEditor", { trackingFieldId: "name" });
  category.changeFieldControl("icon", "builtin", "dropdown");

  // --- Author ---------------------------------------------------------------
  const author = migration
    .createContentType("author")
    .name("Author")
    .description("Writer of blog articles. Has a public profile page at /authors/{slug}.")
    .displayField("name");

  author.createField("name").name("Name").type("Symbol").required(true);
  author
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, SLUG_VALIDATION]);
  author.createField("role").name("Role").type("Symbol").localized(true);
  author.createField("bio").name("Bio").type("Text").localized(true);
  author
    .createField("avatar")
    .name("Avatar")
    .type("Link")
    .linkType("Asset")
    .validations([IMAGE_ONLY]);
  author
    .createField("email")
    .name("Email")
    .type("Symbol")
    .validations([{ regexp: { pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" }, message: "Must be an email address" }]);
  author.createField("socialLinks").name("Social links").type("Object");
  author.createField("isStaff").name("Staff writer").type("Boolean");

  author.changeFieldControl("slug", "builtin", "slugEditor", { trackingFieldId: "name" });
  author.changeFieldControl("bio", "builtin", "markdown", { helpText: "Markdown. Shown on the author page." });
  author.changeFieldControl("socialLinks", "builtin", "objectEditor", {
    helpText: 'JSON object, e.g. {"instagram": "https://...", "website": "https://..."}',
  });
  author.changeFieldControl("isStaff", "builtin", "boolean", { trueLabel: "Staff", falseLabel: "Freelance" });
};
