import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createHeroState,
  stepHero,
  type HeroInput,
  type HeroState,
  type Platform,
  type World,
} from "./hero-physics.ts";

const SCREEN_WIDTH = 1710;
const SCREEN_HEIGHT = 895;
const HERO_WIDTH = 52.5;
const HERO_HEIGHT = 80.84;

// Mirrors the ratios in physics-provider.tsx.
const JUMP_HEIGHT = SCREEN_HEIGHT * 0.36;
const TIME_TO_APEX = 0.42;
const MOVE_SPEED = SCREEN_WIDTH * 0.25;
const JUMP_VELOCITY = (2 * JUMP_HEIGHT) / TIME_TO_APEX;

const FLOOR_TOP = 805.5;
const LEDGE: Platform = { top: 500, left: 300, right: 700, isFloor: false };

const world: World = {
  platforms: [
    { top: FLOOR_TOP, left: 0, right: SCREEN_WIDTH, isFloor: true },
    LEDGE,
  ],
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  heroWidth: HERO_WIDTH,
  heroHeight: HERO_HEIGHT,
  tuning: {
    moveSpeed: MOVE_SPEED,
    jumpVelocity: JUMP_VELOCITY,
    gravity: (2 * JUMP_HEIGHT) / TIME_TO_APEX ** 2,
    maxFallSpeed: JUMP_VELOCITY * 2,
  },
};

const FRAME = 1 / 60;
const IDLE: HeroInput = { left: false, right: false, jumpPressed: false };

/** Advances `frames` steps, taking the input for each from `input(frame)`. */
function run(
  from: HeroState,
  frames: number,
  input: (frame: number) => Partial<HeroInput> = () => IDLE,
  delta = FRAME,
) {
  let state = from;
  let standingOn: Platform | null = null;
  const trace: HeroState[] = [];

  for (let i = 0; i < frames; i++) {
    const result = stepHero(state, { ...IDLE, ...input(i) }, world, delta);
    state = result.state;
    standingOn = result.standingOn;
    trace.push(state);
  }

  return { state, standingOn, trace };
}

const bottomOf = (state: HeroState) => state.y + HERO_HEIGHT;
/** A hero at rest on the floor, the starting point for most of these. */
const resting = run(createHeroState(50, 0), 120).state;

test("falls under gravity and comes to rest on the floor", () => {
  const { state, standingOn } = run(createHeroState(50, 0), 120);

  assert.ok(Math.abs(bottomOf(state) - FLOOR_TOP) < 1);
  assert.equal(state.grounded, true);
  assert.equal(state.velocityY, 0);
  assert.equal(standingOn?.isFloor, true);
});

test("runs at a steady speed while a direction is held", () => {
  const moved = run(resting, 60, () => ({ right: true })).state;

  assert.ok(Math.abs(moved.x - resting.x - MOVE_SPEED) < 8);
  assert.equal(moved.facing, 1);
  assert.equal(moved.grounded, true);
});

test("stops the moment the key is released", () => {
  const moved = run(resting, 60, () => ({ right: true })).state;
  const afterRelease = run(moved, 30).state;

  assert.equal(afterRelease.x, moved.x);
});

test("opposite directions cancel instead of fighting", () => {
  const state = run(resting, 30, () => ({ left: true, right: true })).state;

  assert.equal(state.x, resting.x);
});

test("jumps to the configured height in the configured time", () => {
  const { trace, state } = run(resting, 90, (frame) => ({
    jumpPressed: frame === 0,
  }));

  const apex = Math.min(...trace.map((s) => s.y));
  const apexFrame = trace.findIndex((s) => s.y === apex);

  assert.ok(Math.abs(resting.y - apex - JUMP_HEIGHT) < 3);
  assert.ok(Math.abs(apexFrame * FRAME - TIME_TO_APEX) < 0.03);
  assert.ok(Math.abs(bottomOf(state) - FLOOR_TOP) < 1);
});

test("one press gives one jump, however long the key is held", () => {
  const { trace } = run(resting, 200, (frame) => ({
    jumpPressed: frame === 0,
  }));

  const landings = trace.filter(
    (state, i) => i > 0 && !trace[i - 1]!.grounded && state.grounded,
  );

  assert.equal(landings.length, 1);
});

test("the jump can be steered in mid-air", () => {
  const steered = run(resting, 60, (frame) => ({
    jumpPressed: frame === 0,
    right: frame > 10,
  })).state;

  assert.ok(steered.x > resting.x);
});

test("platforms are one-way: up through, land on top", () => {
  const underLedge = { ...resting, x: 450 };
  const { trace, state, standingOn } = run(underLedge, 90, (frame) => ({
    jumpPressed: frame === 0,
  }));

  assert.ok(trace.some((s) => bottomOf(s) < LEDGE.top));
  assert.ok(Math.abs(bottomOf(state) - LEDGE.top) < 1);
  assert.equal(standingOn?.isFloor, false);
});

test("walking off a ledge drops him to the floor", () => {
  const underLedge = { ...resting, x: 450 };
  const onLedge = run(underLedge, 90, (frame) => ({
    jumpPressed: frame === 0,
  })).state;

  const fallen = run(onLedge, 90, () => ({ right: true })).state;

  assert.ok(Math.abs(bottomOf(fallen) - FLOOR_TOP) < 1);
});

test("coyote time allows a jump just after stepping off an edge", () => {
  const underLedge = { ...resting, x: 450 };
  const onLedge = run(underLedge, 90, (frame) => ({
    jumpPressed: frame === 0,
  })).state;

  const { trace } = run(onLedge, 12, (frame) => ({
    right: true,
    jumpPressed: frame === 8,
  }));

  assert.ok(trace[11]!.velocityY < 0);
});

test("a jump pressed just before landing fires on touchdown", () => {
  const falling = run(
    { ...resting, y: FLOOR_TOP - HERO_HEIGHT - 20, grounded: false, coyote: 0 },
    1,
  ).state;

  const { trace } = run(falling, 40, (frame) => ({ jumpPressed: frame === 0 }));

  assert.ok(Math.min(...trace.map((s) => s.y)) < falling.y);
});

test("is held inside the screen by both walls", () => {
  const left = run(resting, 300, () => ({ left: true })).state;
  const right = run(resting, 300, () => ({ right: true })).state;

  assert.equal(left.x, 0);
  assert.equal(right.x, SCREEN_WIDTH - HERO_WIDTH);
});

test("is stopped by the ceiling instead of leaving the viewport", () => {
  const onTopRow = { ...resting, y: 40, grounded: true, coyote: 0.1 };
  const { trace } = run(onTopRow, 60, (frame) => ({
    jumpPressed: frame === 0,
  }));

  assert.ok(Math.min(...trace.map((s) => s.y)) >= 0);
  // and he comes back down rather than sticking to it
  assert.ok(trace.at(-1)!.y > 40);
});

test("behaves the same at 30fps and at 144fps", () => {
  const fallFor = (delta: number) => {
    let state = createHeroState(50, 0);
    for (let elapsed = 0; elapsed < 2; elapsed += delta) {
      state = stepHero(state, IDLE, world, delta).state;
    }
    return state.y;
  };

  assert.ok(Math.abs(fallFor(1 / 30) - fallFor(1 / 144)) < 1);
});

test("a negative frame delta does not fire a phantom jump", () => {
  // rAF's first timestamp can be a hair earlier than the performance.now()
  // that primed the loop's clock.
  const start = createHeroState(300, FLOOR_TOP - HERO_HEIGHT);
  const { state } = stepHero(start, IDLE, world, -0.0005);
  assert.equal(state.velocityY, 0);
  assert.equal(state.jumpBuffer, 0);
  assert.equal(state.y, start.y);
});
