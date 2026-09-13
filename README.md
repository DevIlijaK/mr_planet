# Mr. Planet

[ilijakosanin.dev](https://ilijakosanin.dev)'s blog as a platformer. Every
post is a ledge; jump onto one and press **H** to read it. On a phone the
level is a tower — climb it with the on-screen pad.

## How it works

- **Posts** are the markdown files in `content/blog`, copied from the
  `cv-app-v2` repo. There is no database, no CMS and no environment variable;
  the site builds to static HTML.
- **The level** is generated from the posts and the viewport in
  `src/lib/level.ts`: one ledge per post, newest at the bottom, rows one jump
  apart, open air on both sides of every ledge. Wide screens get a 3×3 grid
  (empty slots become "Coming soon"), phones get one post per row and a
  camera that follows the hero.
- **Physics** lives in `src/lib/hero-physics.ts`, pure and unit-tested.
  Tuning that scales with the screen is in `src/lib/tuning.ts`.
- **Reading** happens at `/blog/[slug]`, statically generated for every post
  in both languages. Mr. Planet waits in the corner; **Esc** (or tapping him)
  beams you back to the ledge you came from.

## Commands

```sh
pnpm dev          # http://localhost:3000
pnpm check        # lint, types, unit tests
pnpm build        # production build (static)
pnpm sync:blog    # copy posts + images from ../cv-app-v2 (or CV_APP=/path)
```

Publishing a post: write it in `cv-app-v2/content/blog`, run
`pnpm sync:blog` here, commit `content/blog` and `public/blog`, push.

## Controls

| Action | Keyboard                | Touch             |
| ------ | ----------------------- | ----------------- |
| Move   | ← → or A D              | ◀ ▶             |
| Jump   | Space, ↑ or W           | ▲                 |
| Read   | H or Enter (on a ledge) | the "Read" prompt |
| Back   | Esc or M (in a post)    | tap Mr. Planet    |
