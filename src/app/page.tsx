import { Level } from "~/components/level";
import { getPosts } from "~/lib/blog";

/** The English posts are the level; each has a Serbian twin on its own page. */
export default async function HomePage() {
  const posts = await getPosts("en");

  return (
    <Level
      posts={posts.map(({ slug, title, excerpt, readingMinutes }) => ({
        slug,
        title,
        excerpt,
        readingMinutes,
      }))}
    />
  );
}
