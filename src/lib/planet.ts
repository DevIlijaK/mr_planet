/**
 * Picks a planet for a post, and the shape of the ledge it sits on.
 *
 * Deterministic so the same post keeps the same world across renders —
 * `Math.random()` during render reshuffled them on every state change and
 * broke hydration.
 *
 * Keyed by slug now rather than a database uuid, which means a post's planet
 * is stable for as long as its URL is, instead of being reassigned whenever
 * the row was recreated.
 */
export function pickIndex(id: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
