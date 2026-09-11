import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPostBySlug, getPostSlugs } from "~/lib/blog";

type BlogPageProps = {
  params: { slug: string };
};

/** Every post is a file, so every post can be built ahead of time. */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params: { slug },
}: BlogPageProps): Promise<Metadata> {
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPage({ params: { slug } }: BlogPageProps) {
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    // No starfield, and no scroll container: the page scrolls the way a
    // document does, so the scrollbar shows how much is left, the keyboard
    // works, and the browser restores your place when you come back.
    <div className="reading">
      <article className="reading-column">
        <Link href="/blog-grid" className="back-to-level">
          Back to orbit
        </Link>

        <h1 className="post-title">{post.title}</h1>
        <p className="post-date">
          <time dateTime={post.createdAt.toISOString()}>
            {post.createdAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </p>

        {/* No sanitiser: react-markdown does not render embedded HTML unless
            rehype-raw is added, so the markdown can't carry markup through. */}
        <div className="post">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* The level is the only navigation this site has, and by here it is
            a long way back up. */}
        <div className="reading-end">
          <Link href="/blog-grid" className="back-to-level">
            Back to orbit
          </Link>
        </div>
      </article>
    </div>
  );
}
