/**
 * Copies the published posts out of cv-app-v2 so Mr. Planet can ship them
 * without a database. Run it whenever a post lands over there:
 *
 *   pnpm sync:blog                # sibling checkout at ../cv-app-v2
 *   CV_APP=/path/to/cv-app-v2 pnpm sync:blog
 *
 * Only `content/blog` is copied — that directory means "live" in cv-app-v2,
 * drafts sit in `writing/` and stay there. Images the posts reference under
 * /blog/ are copied too, so the article page works offline.
 */
import { cp, mkdir, readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(
  process.env.CV_APP ?? path.join(root, "..", "cv-app-v2"),
);

const postsFrom = path.join(source, "content", "blog");
const postsTo = path.join(root, "content", "blog");
const imagesFrom = path.join(source, "public", "blog");
const imagesTo = path.join(root, "public", "blog");

const entries = await readdir(postsFrom).catch(() => null);
if (!entries) {
  console.error(
    `No posts at ${postsFrom}. Set CV_APP to the cv-app-v2 checkout.`,
  );
  process.exit(1);
}
const posts = entries.filter((name) => /\.mdx?$/.test(name));

await rm(postsTo, { recursive: true, force: true });
await mkdir(postsTo, { recursive: true });
await mkdir(imagesTo, { recursive: true });

const images = new Set();
for (const name of posts) {
  const file = await readFile(path.join(postsFrom, name), "utf8");
  await cp(path.join(postsFrom, name), path.join(postsTo, name));
  for (const match of file.matchAll(/\]\(\/blog\/([^)\s]+)\)/g))
    images.add(match[1]);
}

for (const image of images) {
  await cp(path.join(imagesFrom, image), path.join(imagesTo, image));
}

console.log(
  `Synced ${posts.length} posts and ${images.size} images from ${source}`,
);
