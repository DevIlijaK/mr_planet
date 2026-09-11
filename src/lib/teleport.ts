/**
 * What a teleport press should do, given what the hero is standing on.
 *
 * Pulled out of the game loop for the same reason `hero-physics` is: the loop
 * only runs inside a browser with a visible tab, and a rule that decides
 * whether to navigate away is worth being able to check without one.
 */

export interface TeleportInput {
  /** True only on the frame the teleport key went down. */
  pressed: boolean;
  /**
   * The slug on the ledge under the hero: null in mid-air, and null on the
   * floor, which is a platform but not a post.
   */
  slug: string | null | undefined;
  /** A push is already in flight and the route is mid-swap. */
  alreadyLeaving: boolean;
}

/** The post to open, or null to stay in the level. */
export function resolveTeleport({
  pressed,
  slug,
  alreadyLeaving,
}: TeleportInput): string | null {
  if (!pressed || alreadyLeaving) return null;
  if (!slug) return null;

  return slug;
}

/** Where a post lives. One place, so the loop and the links can't disagree. */
export function postHref(slug: string): string {
  return `/blog/${slug}`;
}
