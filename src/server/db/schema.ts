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
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  publicationDate: timestamp("publication_date", { mode: "date" })
    .defaultNow()
    .notNull(),
});

export type InsertBlog = typeof blog.$inferInsert;
export type SelectBlog = typeof blog.$inferSelect;
