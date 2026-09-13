/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  async redirects() {
    // The game used to live here.
    return [{ source: "/blog-grid", destination: "/", permanent: true }];
  },
};

export default config;
