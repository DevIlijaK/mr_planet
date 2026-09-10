/**
 * Blog content is stored as the HTML the editor produces. The grid needs a
 * plain-text title and teaser out of it, without pulling in a parser.
 */

const TAG = /<[^>]*>/g;
const FIRST_HEADING = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function toPlainText(html: string): string {
  return html
    .replace(TAG, " ")
    .replace(/&[a-z#0-9]+;/gi, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
}

/** The post's own heading, falling back to its opening words. */
export function getTitle(html: string): string {
  const heading = FIRST_HEADING.exec(html);
  const fromHeading = heading?.[1] ? toPlainText(heading[1]) : "";
  if (fromHeading) return fromHeading;

  const words = toPlainText(html).split(" ").slice(0, 6).join(" ");
  return words || "Untitled";
}

/** The body copy with the heading removed, trimmed to fit a sign. */
export function getTeaser(html: string, words = 22): string {
  const body = toPlainText(html.replace(FIRST_HEADING, " ")).split(" ");
  const teaser = body.slice(0, words).join(" ");
  return body.length > words ? `${teaser}…` : teaser;
}

/**
 * Picks a planet for a post. Deterministic so the same post keeps the same
 * world across renders — `Math.random()` during render reshuffled them on
 * every state change and broke hydration.
 */
export function pickIndex(id: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
