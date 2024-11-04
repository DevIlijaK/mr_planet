"use server";

import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "./db";
import { blog } from "./db/schema";

export async function getBlog(input: { id: string }) {
  const [selectedBlog] = await db
    .select()
    .from(blog)
    .where(eq(blog.id, input.id));
  return selectedBlog;
}
export async function getBlogs(input: { limit: number }) {
  return db
    .select()
    .from(blog)
    .orderBy(desc(blog.publicationDate))
    .limit(input.limit);
}

export async function saveBlog(input: { id?: string; content: string }) {
  const { id, content } = input;

  let response: { id: string };
  if (id) {
    await db.update(blog).set({ content }).where(eq(blog.id, id)).execute();

    const [updated] = await db
      .select({ id: blog.id })
      .from(blog)
      .where(eq(blog.id, id));

    response = updated!;
  } else {
    const [inserted] = await db.insert(blog).values({ content }).returning({
      id: blog.id,
    });

    response = inserted!;
  }
  return response.id;
}
