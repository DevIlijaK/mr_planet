CREATE TABLE IF NOT EXISTS "mr_planet_blog" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"search_title" text NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"publication_date" timestamp,
	"path_to_main_blog_picture" text NOT NULL,
	"type_of_main_blog_picture" text NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "mr_planet_blog_title_unique" UNIQUE("title"),
	CONSTRAINT "mr_planet_blog_search_title_unique" UNIQUE("search_title"),
	CONSTRAINT "mr_planet_blog_path_to_main_blog_picture_unique" UNIQUE("path_to_main_blog_picture"),
	CONSTRAINT "mr_planet_blog_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_index" ON "mr_planet_blog" USING btree ("search_title");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "author_index" ON "mr_planet_blog" USING btree ("author");