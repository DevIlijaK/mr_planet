// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mr_planet_${name}`);

export const blog = createTable("blog", {
  id: uuid("id").primaryKey(),
  title: text("title").notNull().unique(),
  blogBody: text("content").notNull(),
  author: text("author").notNull(),
  publicationDate: timestamp("publication_date").defaultNow(),
  pathToMainBlogPicture: text("path_to_main_blog_picture").notNull().unique(),
  typeOfMainBlogPicture: text("type_of_main_blog_picture").notNull(),
  url: text("url").notNull().unique(),
});

export type InsertBlog = typeof blog.$inferInsert;
export type SelectBlog = typeof blog.$inferSelect;
