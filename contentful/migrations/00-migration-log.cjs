/** @type {import('contentful-migration').MigrationFunction} */
module.exports = function (migration) {
  const log = migration
    .createContentType("migrationLog")
    .name("System: migration log")
    .description("Tracks which scripts in contentful/migrations have been applied. Do not edit by hand.")
    .displayField("name");

  log.createField("name").name("Name").type("Symbol").required(true);
  log.createField("applied").name("Applied migrations").type("Array").items({ type: "Symbol" });
};
