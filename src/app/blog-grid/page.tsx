import { BlogGrid, type PlanetPost } from "~/components/blog-grid";
import { getPosts } from "~/lib/blog";

export default async function BlogPage() {
  const posts = await getPosts();

  // Only the signage crosses to the client. The bodies stay here — the grid
  // never shows them, and shipping twelve full posts to draw twelve labels
  // would be the largest thing on the page by far.
  const planets: PlanetPost[] = posts.map(({ slug, title, excerpt }) => ({
    slug,
    title,
    excerpt,
  }));

  return <BlogGrid posts={planets} />;
}
