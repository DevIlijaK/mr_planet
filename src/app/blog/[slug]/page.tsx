import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "~/components/article-shell";
import { Markdown } from "~/components/markdown";
import { getAllPosts, getPost } from "~/lib/blog";

type Props = { params: { slug: string } };

/** Every post is a static page; nothing is fetched at request time. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      locale: post.locale === "sr" ? "sr_RS" : "en_US",
    },
  };
}

const formatDate = (date: string, locale: string) =>
  new Date(date).toLocaleDateString(locale === "sr" ? "sr-Latn-RS" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const translation = post.translationSlug
    ? await getPost(post.translationSlug)
    : null;
  const sr = post.locale === "sr";

  return (
    <ArticleShell
      locale={post.locale}
      returnTo={sr && translation ? translation.slug : post.slug}
    >
      <article lang={post.locale} className="article-enter">
        <header className="mb-10 sm:mb-14">
          <p className="font-pixel text-[13px] uppercase tracking-[0.12em] text-[color:var(--signal)]">
            {formatDate(post.date, post.locale)}
            <span className="mx-2 text-[color:var(--crust-shade)]">·</span>
            {post.readingMinutes} {sr ? "min čitanja" : "min read"}
          </p>
          <h1 className="mt-4 text-balance text-[2rem] font-semibold leading-[1.15] tracking-tight text-[color:var(--crust)] sm:text-[2.6rem]">
            {post.title}
          </h1>
          <p className="mt-5 text-pretty text-[1.05rem] leading-relaxed text-[color:var(--ink-soft)] sm:text-[1.15rem]">
            {post.excerpt}
          </p>
          {translation && (
            <a
              href={`/blog/${translation.slug}`}
              className="mt-6 inline-flex items-center gap-2 border-2 border-[color:var(--regolith)] px-3 py-1.5 font-pixel text-[13px] text-[color:var(--dust)] no-underline transition-colors hover:border-[color:var(--signal)] hover:text-[color:var(--signal)]"
              hrefLang={translation.locale}
              lang={translation.locale}
            >
              {sr ? "Read in English" : "Čitaj na srpskom"}
              <span aria-hidden>→</span>
            </a>
          )}
        </header>

        <div className="article">
          <Markdown content={post.content} />
        </div>

        <footer className="mt-16 border-t-2 border-[color:var(--regolith-deep)] pt-6 text-[0.95rem] text-[color:var(--dust)]">
          {sr ? "Originalno objavljeno na " : "Originally published at "}
          <a
            href={`https://ilijakosanin.dev/${post.locale}/blog/${post.slug}`}
            className="text-[color:var(--signal)] underline underline-offset-4"
          >
            ilijakosanin.dev
          </a>
          .
        </footer>
      </article>
    </ArticleShell>
  );
}
