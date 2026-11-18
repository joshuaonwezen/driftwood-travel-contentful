/**
 * Added after launch: link articles to the destinations they cover (powers the
 * "Stories from ..." list on destination pages) and store an editor-set reading time.
 *
 * @type {import('contentful-migration').MigrationFunction}
 */
module.exports = function (migration) {
  const article = migration.editContentType("article");

  article
    .createField("destinations")
    .name("Destinations covered")
    .type("Array")
    .validations([{ size: { max: 3 } }])
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["destination"] }] });

  article
    .createField("readingTimeMinutes")
    .name("Reading time (minutes)")
    .type("Integer")
    .validations([{ range: { min: 1, max: 60 } }]);

  article.moveField("destinations").afterField("categories");
  article.moveField("readingTimeMinutes").afterField("publishDate");
  article.changeFieldControl("readingTimeMinutes", "builtin", "numberEditor", {
    helpText: "Leave empty to have the website estimate it from the body.",
  });
};
