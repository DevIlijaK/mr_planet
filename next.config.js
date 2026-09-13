/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

// The game lives at ilijakosanin.dev/mr-planet: that site rewrites
// `/mr-planet/*` to this deployment, so every route and asset here has to
// carry the prefix. Next applies it to routes, links and `_next/` assets;
// `NEXT_PUBLIC_BASE_PATH` lets plain `<img>` tags in posts do the same.
const basePath = "/mr-planet";

/** @type {import("next").NextConfig} */
const config = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  async redirects() {
    // The game used to live here.
    return [{ source: "/blog-grid", destination: "/", permanent: true }];
  },
};

export default config;
