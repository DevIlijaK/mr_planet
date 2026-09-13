/**
 * Picks a stable index for a string — which planet a post gets, how wide its
 * ledge is. Deterministic so the same post keeps the same look across renders
 * and between server and client; `Math.random()` during render broke hydration.
 */
export function pickIndex(id: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % count;
}
