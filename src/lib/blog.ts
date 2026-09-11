/**
 * Posts, read off disk.
 *
 * The same markdown files are published by cv-app-v2, and this loader is that
 * one with its i18n coupling removed — worth keeping recognisable, so a fix to
 * either can be carried across.
 *
 * Server-only: it touches the filesystem. The grid takes the result as props
 * rather than calling in from the client.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { slugify } from "~/lib/slug";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export const LOCALES = ["en", "sr"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * The level is one column of planets with no language switch on it, so a mixed
 * grid would just be half the posts unreadable. The Serbian files ship anyway —
 * `translationSlug` pairs them up — so turning this into a real choice later is
 * a routing problem, not a content one.
 */
export const SITE_LOCALE: Locale = "en";

const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  locale: Locale;
  translationSlug: string | null;
};

type Frontmatter = Record<string, string>;

export async function getAllPosts(): Promise<BlogPost[]> {
  const fileNames = await getPostFileNames();
  const posts = await Promise.all(fileNames.map(readPostFile));

  return posts.sort(
    (first, second) => second.createdAt.getTime() - first.createdAt.getTime(),
  );
}

/** Newest first, which is the order the planets are laid out in. */
export async function getPosts(locale: Locale = SITE_LOCALE) {
  const posts = await getAllPosts();

  return posts.filter((post) => post.locale === locale);
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();

  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostSlugs() {
  const posts = await getAllPosts();

  return posts.map((post) => post.slug);
}

async function getPostFileNames() {
  try {
    const entries = await readdir(postsDirectory, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
      .map((entry) => entry.name);
  } catch (error) {
    // No content directory yet is an empty blog, not a crash.
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function readPostFile(fileName: string): Promise<BlogPost> {
  const filePath = path.join(postsDirectory, fileName);
  const file = await readFile(filePath, "utf8");
  const { metadata, content } = parseMarkdownFile(file, fileName);

  const slug = slugify(metadata.slug ?? fileName.replace(/\.mdx?$/, ""));
  const title = metadata.title;
  const excerpt = metadata.excerpt;
  const date = metadata.date ? new Date(metadata.date) : null;
  const locale = metadata.locale;

  // Loud rather than lenient: a post with no title would otherwise reach the
  // grid as a blank sign on a planet, which is harder to trace back to here.
  if (!slug || !title || !excerpt || !date || Number.isNaN(date.getTime())) {
    throw new Error(
      `Blog post "${fileName}" needs title, date, excerpt, and a valid slug.`,
    );
  }

  if (!locale || !isLocale(locale)) {
    throw new Error(
      `Blog post "${fileName}" needs locale: "en" or locale: "sr".`,
    );
  }

  return {
    id: slug,
    slug,
    title,
    excerpt,
    content,
    createdAt: date,
    locale,
    translationSlug: metadata.translationSlug
      ? slugify(metadata.translationSlug)
      : null,
  };
}

function parseMarkdownFile(file: string, fileName: string) {
  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(file);

  if (!frontmatterMatch?.[0] || !frontmatterMatch[1]) {
    throw new Error(`Blog post "${fileName}" needs frontmatter.`);
  }

  return {
    metadata: parseFrontmatter(frontmatterMatch[1]),
    content: file.slice(frontmatterMatch[0].length).trim(),
  };
}

function parseFrontmatter(frontmatter: string): Frontmatter {
  return frontmatter.split(/\r?\n/).reduce<Frontmatter>((metadata, line) => {
    const separatorIndex = line.indexOf(":");

    if (separatorIndex === -1) {
      return metadata;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key) {
      metadata[key] = value.replace(/^["']|["']$/g, "");
    }

    return metadata;
  }, {});
}
