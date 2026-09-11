import assert from "node:assert/strict";
import { test } from "node:test";

import { postHref, resolveTeleport } from "./teleport.ts";

const on = (slug: string | null | undefined) => ({
  pressed: true,
  slug,
  alreadyLeaving: false,
});

test("opens the post the hero is standing on", () => {
  assert.equal(resolveTeleport(on("my-three-legged-goat")), "my-three-legged-goat");
});

test("does nothing without a press", () => {
  assert.equal(
    resolveTeleport({ ...on("my-three-legged-goat"), pressed: false }),
    null,
  );
});

test("does nothing in mid-air", () => {
  assert.equal(resolveTeleport(on(null)), null);
});

test("does nothing on the floor, which is a platform but not a post", () => {
  // The floor carries no data-slug, so it reaches here as undefined.
  assert.equal(resolveTeleport(on(undefined)), null);
});

test("ignores an empty slug rather than opening /blog/", () => {
  assert.equal(resolveTeleport(on("")), null);
});

test("only fires once while a push is already in flight", () => {
  // The loop keeps running for the frames between the push and the new route
  // painting; every one of them would otherwise navigate again.
  assert.equal(
    resolveTeleport({ ...on("my-three-legged-goat"), alreadyLeaving: true }),
    null,
  );
});

test("builds the post URL the route actually serves", () => {
  assert.equal(postHref("my-three-legged-goat"), "/blog/my-three-legged-goat");
});
