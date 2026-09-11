import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import bg from "../../../../public/images/background.jpg";
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
    <div
      className="hide-scrollbar h-[100dvh] overflow-y-scroll overscroll-contain"
      // viewport-fit=cover lets the starfield run under the notch; the text
      // must not follow it there when the phone is held sideways.
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt=""
        aria-hidden
        className="-z-50 h-[100dvh] w-full object-cover object-center"
        fill
      />

      <div className="mx-auto max-w-[68ch] p-4 text-white sm:p-10 lg:py-24">
        {/* The level is the only navigation this site has, and on a phone
            there is no keyboard to leave with. */}
        <Link
          href="/blog-grid"
          className="hud-prompt hud-prompt-tappable mb-8 inline-flex items-center gap-2 px-3 py-2 font-pixel text-[13px] leading-none no-underline"
        >
          <span aria-hidden>←</span> Back to orbit
        </Link>

        <h1 className="font-pixel">{post.title}</h1>
        <p className="mt-0 text-[13px] text-[color:var(--dust)]">
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
      </div>
    </div>
  );
}
