import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Mr. Planet reads its posts from `content/blog` and has no database, so the
 * only variable it cares about is the one Next sets itself. Anything added
 * here is validated at build time.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
