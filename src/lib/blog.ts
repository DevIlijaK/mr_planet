import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Posts are the markdown files synced from cv-app-v2 (`pnpm sync:blog`), read
 * straight off disk at build time. There is no database and no draft state:
 * a file in `content/blog` is live.
 */
const postsDirectory = path.join(process.cwd(), "content", "blog");

export type Locale = "en" | "sr";

/** What the level needs to draw a platform. Safe to send to the client. */
export interface PostSummary {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  locale: Locale;
  translationSlug: string | null;
  readingMinutes: number;
}

export interface Post extends PostSummary {
  content: string;
}

const WORDS_PER_MINUTE = 220;

let cache: Promise<Post[]> | null = null;

/** Every post, newest first. Read once per process. */
export function getAllPosts(): Promise<Post[]> {
  cache ??= readAll();
  return cache;
}

/** The posts in one language, newest first — one platform each. */
export async function getPosts(locale: Locale): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.locale === locale)
    .map(({ content: _content, ...summary }) => summary);
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

async function readAll(): Promise<Post[]> {
  let names: string[];
  try {
    names = (await readdir(postsDirectory)).filter((name) =>
      /\.mdx?$/.test(name),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const posts = await Promise.all(names.map(readPost));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

async function readPost(name: string): Promise<Post> {
  const file = await readFile(path.join(postsDirectory, name), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(file);
  if (!match?.[1]) throw new Error(`Post "${name}" has no frontmatter.`);

  const meta = parseFrontmatter(match[1]);
  const content = file.slice(match[0].length).trim();
  const slug = meta.slug ?? name.replace(/\.mdx?$/, "");
  const locale = meta.locale;

  if (!meta.title || !meta.excerpt || !meta.date) {
    throw new Error(`Post "${name}" needs title, excerpt and date.`);
  }
  if (locale !== "en" && locale !== "sr") {
    throw new Error(`Post "${name}" needs locale: "en" or "sr".`);
  }

  return {
    slug,
    title: meta.title,
    excerpt: meta.excerpt,
    date: meta.date,
    locale,
    translationSlug: meta.translationSlug ?? null,
    readingMinutes: Math.max(
      1,
      Math.round(content.split(/\s+/).length / WORDS_PER_MINUTE),
    ),
    content,
  };
}

/** The posts use flat `key: "value"` frontmatter; nothing nested, no YAML. */
function parseFrontmatter(block: string): Record<string, string> {
  const meta: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    const key = line.slice(0, at).trim();
    const value = line
      .slice(at + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  }
  return meta;
}
