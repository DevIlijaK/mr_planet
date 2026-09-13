import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildLevel,
  ROW_PITCH_RATIO,
  spawnPoint,
  type LevelPost,
} from "./level.ts";

const posts: LevelPost[] = Array.from({ length: 6 }, (_, i) => ({
  slug: `post-${i}`,
  title: `Post ${i}`,
  excerpt: "…",
  readingMinutes: 4,
}));

// Sprite is 150x231 scaled by 5 / 4 / 3 (hero-size-provider).
const screens = [
  { name: "phone", width: 390, height: 660, heroWidth: 30 },
  { name: "small phone", width: 320, height: 560, heroWidth: 30 },
  { name: "tablet", width: 768, height: 1024, heroWidth: 38 },
  { name: "laptop", width: 1280, height: 720, heroWidth: 50 },
  { name: "desktop", width: 1710, height: 895, heroWidth: 50 },
];

for (const screen of screens) {
  const level = buildLevel({ posts, ...screen });
  const minGap = screen.heroWidth * 1.5;

  test(`${screen.name}: every post gets exactly one platform`, () => {
    const slugs = level.platforms
      .filter((p) => p.post)
      .map((p) => p.post!.slug)
      .sort();
    assert.deepEqual(slugs, posts.map((p) => p.slug).sort());
  });

  test(`${screen.name}: the newest post is on the bottom row`, () => {
    const first = level.platforms.find((p) => p.post?.slug === "post-0")!;
    assert.equal(first.row, 0);
  });

  test(`${screen.name}: the hero can fall off both sides of every ledge`, () => {
    for (const p of level.platforms) {
      assert.ok(p.x >= minGap, `${p.id} touches the left wall`);
      assert.ok(
        level.worldWidth - (p.x + p.width) >= minGap,
        `${p.id} touches the right wall`,
      );
      for (const other of level.platforms) {
        if (other === p || other.row !== p.row) continue;
        const gap = Math.max(
          other.x - (p.x + p.width),
          p.x - (other.x + other.width),
        );
        assert.ok(gap >= minGap, `${p.id} and ${other.id} are too close`);
      }
    }
  });

  test(`${screen.name}: every ledge is one jump up from a ledge below it`, () => {
    const jump = screen.height * 0.36;
    for (const p of level.platforms) {
      const below =
        p.row === 0
          ? { x: 0, width: level.worldWidth, y: level.floor.top }
          : level.platforms.find(
              (o) => o.row === p.row - 1 && o.column === p.column,
            )!;
      const overlap =
        Math.min(p.x + p.width, below.x + below.width) - Math.max(p.x, below.x);
      assert.ok(overlap > screen.heroWidth, `${p.id} has nothing under it`);
      assert.ok(below.y - p.y < jump * 0.8, `${p.id} is too high to reach`);
      assert.ok(
        Math.abs(below.y - p.y - screen.height * ROW_PITCH_RATIO) < 2,
        `${p.id} breaks the row pitch`,
      );
    }
  });

  test(`${screen.name}: nothing sits above the top of the world`, () => {
    for (const p of level.platforms) assert.ok(p.y - level.headroom >= 0);
    assert.ok(level.worldHeight >= screen.height);
    assert.equal(level.floor.top + level.floor.height, level.worldHeight);
  });
}

test("phones stack one post per row with no placeholders", () => {
  const level = buildLevel({ posts, width: 390, height: 660, heroWidth: 30 });
  assert.equal(level.columns, 1);
  assert.equal(level.platforms.length, posts.length);
  assert.ok(level.platforms.every((p) => p.post));
  assert.ok(level.worldHeight > 660, "six rows need a taller world");
  // Alternating sides is what makes the zigzag climbable.
  const sides = level.platforms.map((p) => p.align);
  for (let i = 1; i < sides.length; i++)
    assert.notEqual(sides[i], sides[i - 1]);
});

test("desktop fills a 3x3 grid, padding the gaps with placeholders", () => {
  const level = buildLevel({ posts, width: 1710, height: 895, heroWidth: 50 });
  assert.equal(level.columns, 3);
  assert.equal(level.platforms.length, 9);
  assert.equal(level.platforms.filter((p) => !p.post).length, 3);
  // Three rows fit on one screen, give or take the margin under the wordmark.
  assert.ok(level.worldHeight - 895 < 80);
});

test("desktop grows past 3 rows when there are more posts", () => {
  const many = Array.from({ length: 10 }, (_, i) => ({
    ...posts[0]!,
    slug: `p${i}`,
  }));
  const level = buildLevel({
    posts: many,
    width: 1710,
    height: 895,
    heroWidth: 50,
  });
  assert.equal(level.platforms.length, 12);
  assert.ok(level.worldHeight > 895);
});

test("spawn lands on the floor, or on the platform asked for", () => {
  const level = buildLevel({ posts, width: 1280, height: 720, heroWidth: 50 });
  const floor = spawnPoint(level, 50, 77);
  assert.equal(floor.y + 77, level.floor.top);

  const back = spawnPoint(level, 50, 77, "post-3");
  const platform = level.platforms.find((p) => p.id === "post-3")!;
  assert.equal(back.y + 77, platform.y);
  assert.ok(back.x > platform.x && back.x + 50 < platform.x + platform.width);

  assert.deepEqual(spawnPoint(level, 50, 77, "missing"), floor);
});
