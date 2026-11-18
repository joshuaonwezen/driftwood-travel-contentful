import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types";
import { cfId } from "./ids";

/* Small builders for Contentful Rich Text JSON. Strings are plain text nodes;
   `**bold**` and `_italic_` inside a string are converted to marks. */

type Inline = Record<string, unknown>;
type Block = Record<string, unknown>;
type Content = string | Inline;

function textNodes(value: string): Inline[] {
  const parts = value.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
  return parts.map((part) => {
    if (part.startsWith("**")) return text(part.slice(2, -2), [MARKS.BOLD]);
    if (part.startsWith("_") && part.endsWith("_")) return text(part.slice(1, -1), [MARKS.ITALIC]);
    return text(part);
  });
}

function inlineContent(content: Content[]): Inline[] {
  const nodes = content.flatMap((c) => (typeof c === "string" ? textNodes(c) : [c]));
  // Contentful requires paragraphs to start and end with a text node.
  if (nodes[0]?.nodeType !== "text") nodes.unshift(text(""));
  if (nodes[nodes.length - 1]?.nodeType !== "text") nodes.push(text(""));
  return nodes;
}

export const text = (value: string, marks: string[] = []): Inline => ({
  nodeType: "text",
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
});

export const doc = (...content: Block[]): Document =>
  ({ nodeType: BLOCKS.DOCUMENT, data: {}, content }) as unknown as Document;

export const p = (...content: Content[]): Block => ({ nodeType: BLOCKS.PARAGRAPH, data: {}, content: inlineContent(content) });
export const h2 = (value: string): Block => ({ nodeType: BLOCKS.HEADING_2, data: {}, content: [text(value)] });
export const h3 = (value: string): Block => ({ nodeType: BLOCKS.HEADING_3, data: {}, content: [text(value)] });
export const hr = (): Block => ({ nodeType: BLOCKS.HR, data: {}, content: [] });
export const quote = (value: string): Block => ({ nodeType: BLOCKS.QUOTE, data: {}, content: [p(value)] });

const listItem = (item: Content | Content[]): Block => ({
  nodeType: BLOCKS.LIST_ITEM,
  data: {},
  content: [p(...(Array.isArray(item) ? item : [item]))],
});
export const ul = (items: (Content | Content[])[]): Block => ({ nodeType: BLOCKS.UL_LIST, data: {}, content: items.map(listItem) });
export const ol = (items: (Content | Content[])[]): Block => ({ nodeType: BLOCKS.OL_LIST, data: {}, content: items.map(listItem) });

export const link = (uri: string, value: string): Inline => ({ nodeType: INLINES.HYPERLINK, data: { uri }, content: [text(value)] });

/** Hyperlink to another entry (resolved to a URL by the website). `key` is a seed key. */
export const entryLink = (key: string, value: string): Inline => ({
  nodeType: INLINES.ENTRY_HYPERLINK,
  data: { target: { sys: { id: cfId(key), type: "Link", linkType: "Entry" } } },
  content: [text(value)],
});

export const embedEntry = (key: string): Block => ({
  nodeType: BLOCKS.EMBEDDED_ENTRY,
  data: { target: { sys: { id: cfId(key), type: "Link", linkType: "Entry" } } },
  content: [],
});

export const embedAsset = (key: string): Block => ({
  nodeType: BLOCKS.EMBEDDED_ASSET,
  data: { target: { sys: { id: cfId(key), type: "Link", linkType: "Asset" } } },
  content: [],
});

/** Table with a header row. */
export const table = (header: string[], rows: string[][]): Block => {
  const cell = (nodeType: string, value: string): Block => ({ nodeType, data: {}, content: [p(value)] });
  const row = (cells: Block[]): Block => ({ nodeType: BLOCKS.TABLE_ROW, data: {}, content: cells });
  return {
    nodeType: BLOCKS.TABLE,
    data: {},
    content: [
      row(header.map((h) => cell(BLOCKS.TABLE_HEADER_CELL, h))),
      ...rows.map((r) => row(r.map((c) => cell(BLOCKS.TABLE_CELL, c)))),
    ],
  };
};
