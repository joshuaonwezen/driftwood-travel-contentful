// Shared constants for the migration scripts. Files starting with "_" are not run as migrations.

/** Content types that have their own URL on the website. */
const PAGE_TYPES = ["landingPage", "article", "destination"];

/** Content types an editor can place in landingPage.sections. */
const SECTION_TYPES = [
  "heroBlock",
  "richTextBlock",
  "featureGrid",
  "ctaBanner",
  "testimonialBlock",
  "faqBlock",
  "imageWithText",
  "statsBlock",
  "contentGrid",
  "videoEmbed",
];

const SLUG_VALIDATION = {
  regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
  message: "Lowercase letters, numbers and single dashes only (e.g. my-page-slug).",
};

const URL_VALIDATION = {
  regexp: { pattern: "^(https?://[^\\s]+|/[^\\s]*)$" },
  message: "Use an absolute URL (https://...) or a site-relative path starting with /.",
};

const IMAGE_ONLY = { linkMimetypeGroup: ["image"] };

const ICONS = ["compass", "mountain", "utensils", "camera", "sun", "snowflake", "train", "wallet", "leaf", "users", "shield", "heart", "map", "plane", "star"];

/** Full rich text: articles, destination descriptions, rich text blocks. */
const RICH_TEXT_FULL = [
  { enabledMarks: ["bold", "italic", "underline", "code"], message: "Only bold, italic, underline and code are allowed." },
  {
    enabledNodeTypes: [
      "heading-2",
      "heading-3",
      "heading-4",
      "ordered-list",
      "unordered-list",
      "hr",
      "blockquote",
      "table",
      "embedded-entry-block",
      "embedded-asset-block",
      "hyperlink",
      "entry-hyperlink",
    ],
  },
  {
    nodes: {
      "embedded-entry-block": [{ linkContentType: ["videoEmbed", "ctaBanner"] }],
      "entry-hyperlink": [{ linkContentType: PAGE_TYPES }],
    },
  },
];

/** Restricted rich text: FAQ answers and image+text copy. */
const RICH_TEXT_SIMPLE = [
  { enabledMarks: ["bold", "italic"], message: "Only bold and italic are allowed." },
  { enabledNodeTypes: ["unordered-list", "ordered-list", "hyperlink", "entry-hyperlink"] },
  { nodes: { "entry-hyperlink": [{ linkContentType: PAGE_TYPES }] } },
];

module.exports = {
  PAGE_TYPES,
  SECTION_TYPES,
  SLUG_VALIDATION,
  URL_VALIDATION,
  IMAGE_ONLY,
  ICONS,
  RICH_TEXT_FULL,
  RICH_TEXT_SIMPLE,
};
