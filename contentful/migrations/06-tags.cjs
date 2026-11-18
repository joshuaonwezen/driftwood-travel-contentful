/**
 * Contentful content tags (entry/asset metadata, not a field).
 * Public tags are returned by the Delivery API; private tags are editor-only.
 *
 * @type {import('contentful-migration').MigrationFunction}
 */
module.exports = function (migration) {
  migration.createTag("sponsored", { name: "Sponsored" }, "public");
  migration.createTag("campaignSummer2026", { name: "Campaign: Summer 2026" }, "public");
  migration.createTag("evergreen", { name: "Evergreen" }, "public");
  migration.createTag("needsReview", { name: "Needs review" }, "private");
};
