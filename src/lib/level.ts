/**
 * Lays the blog out as a platformer level.
 *
 * Pure: takes the posts and the viewport, returns world coordinates. The
 * component draws exactly these rectangles and the physics collides against
 * exactly these rectangles, so what you see is what you land on.
 *
 * The rules that make a level "make sense":
 *   - every ledge has open air on both sides — wide enough for the hero to
 *     fall past — so there is always a way down, on phones too;
 *   - rows are one jump apart, and every ledge overlaps the ledge below it in
 *     the same column, so a straight jump always reaches the next row;
 *   - the newest post is on the lowest row, the first one you can reach;
 *   - phones get one post per row and as many rows as there are posts. Wider
 *     screens get a 3-row grid, and empty slots are filled with placeholders.
 */
import { pickIndex } from "./pick.ts";

export interface LevelPost {
  slug: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
}

export interface LevelPlatform {
  /** Post slug, or `filler-N` for a placeholder. */
  id: string;
  post: LevelPost | null;
  /** World coordinates of the ledge's top-left corner. */
  x: number;
  y: number;
  width: number;
  row: number;
  column: number;
  /** The planet sits at this end of the ledge; the signage at the other. */
  align: "left" | "right";
}

export interface Level {
  platforms: LevelPlatform[];
  floor: { top: number; height: number };
  worldWidth: number;
  /** At least the viewport height; taller when the rows don't fit. */
  worldHeight: number;
  ledgeHeight: number;
  /** Space kept clear above a ledge for the planet and the sign. */
  headroom: number;
  columns: number;
}

export interface LevelOptions {
  posts: LevelPost[];
  width: number;
  height: number;
  heroWidth: number;
}

/** Row spacing, as a share of the viewport height. Must stay under
 *  JUMP_HEIGHT_RATIO in physics-provider by a comfortable margin. */
export const ROW_PITCH_RATIO = 0.25;
const FLOOR_RATIO = 0.08;
const LEDGE_RATIO = 0.06;
const HEADROOM_RATIO = 0.17;
/** Clear space above the top row's sign, so the wordmark never sits on it. */
const TOP_MARGIN = 72;
/** Rows a wide screen always shows, filled with placeholders if need be. */
const GRID_ROWS = 3;
/** Ledge width as a share of its column: enough to land on, never the lot. */
const MIN_SPAN = 0.5;
const MAX_SPAN = 0.68;
/** Minimum clear air beside a ledge, in hero widths. The hero has to fit
 *  through with room to spare, or "fall off the side" is a lie. Between two
 *  ledges the gap is wider, so it reads as a gap and not a crack. */
const WALL_GAP_IN_HEROES = 1.6;
const NEIGHBOUR_GAP_IN_HEROES = 2.6;

export function columnsFor(width: number): number {
  return width < 640 ? 1 : width < 1024 ? 2 : 3;
}

export function buildLevel({
  posts,
  width,
  height,
  heroWidth,
}: LevelOptions): Level {
  const columns = columnsFor(width);
  const rows =
    columns === 1
      ? posts.length
      : Math.max(GRID_ROWS, Math.ceil(posts.length / columns));

  const pitch = height * ROW_PITCH_RATIO;
  const floorHeight = Math.round(height * FLOOR_RATIO);
  const ledgeHeight = Math.round(height * LEDGE_RATIO);
  const headroom = Math.round(height * HEADROOM_RATIO);
  const wallGap = heroWidth * WALL_GAP_IN_HEROES;
  const halfGap = (heroWidth * NEIGHBOUR_GAP_IN_HEROES) / 2;
  const columnWidth = width / columns;

  // Laid out with the floor at the bottom of the viewport first; if the top
  // row ends up above y=0 the whole thing is shifted down afterwards and the
  // world grows to fit.
  const floorTop = height - floorHeight;
  const platforms: LevelPlatform[] = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const slot = row * columns + column;
      const post = posts[slot] ?? null;
      const id = post?.slug ?? `filler-${slot}`;

      // Widths and offsets come off the id so a post keeps its shape between
      // renders. Phones alternate sides so the zigzag is always climbable.
      const spanT = pickIndex(id, 1000) / 999;
      const span = MIN_SPAN + (MAX_SPAN - MIN_SPAN) * spanT;
      const offsetT =
        columns === 1 ? row % 2 : pickIndex(`${id}~x`, 1000) / 999;

      // The usable strip of the column keeps half a gap clear on each inner
      // side, so neighbours are a full gap apart, and a wall gap on the outside.
      const stripLeft =
        column * columnWidth + (column === 0 ? wallGap : halfGap);
      const stripRight =
        (column + 1) * columnWidth -
        (column === columns - 1 ? wallGap : halfGap);
      const stripWidth = stripRight - stripLeft;
      const platformWidth = Math.round(
        Math.min(columnWidth * span, stripWidth),
      );
      const x = Math.round(stripLeft + (stripWidth - platformWidth) * offsetT);

      platforms.push({
        id,
        post,
        x,
        y: Math.round(floorTop - (row + 1) * pitch),
        width: platformWidth,
        row,
        column,
        align: offsetT < 0.5 ? "left" : "right",
      });
    }
  }

  const topMost = Math.min(
    ...platforms.map((p) => p.y - headroom - TOP_MARGIN),
    0,
  );
  const shift = -topMost;
  for (const platform of platforms) platform.y += shift;

  return {
    platforms,
    floor: { top: floorTop + shift, height: floorHeight },
    worldWidth: width,
    worldHeight: height + shift,
    ledgeHeight,
    headroom,
    columns,
  };
}

/** Where the hero starts: on the floor, or on the post he just came back from. */
export function spawnPoint(
  level: Level,
  heroWidth: number,
  heroHeight: number,
  onPlatformId?: string | null,
): { x: number; y: number } {
  const platform = onPlatformId
    ? level.platforms.find((p) => p.id === onPlatformId)
    : undefined;
  if (platform) {
    return {
      x: platform.x + platform.width / 2 - heroWidth / 2,
      y: platform.y - heroHeight,
    };
  }
  return {
    x: Math.round(level.worldWidth * 0.08),
    y: level.floor.top - heroHeight,
  };
}
