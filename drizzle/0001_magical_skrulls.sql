ALTER TABLE "mr_planet_blog" DROP CONSTRAINT "mr_planet_blog_title_unique";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP CONSTRAINT "mr_planet_blog_search_title_unique";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP CONSTRAINT "mr_planet_blog_path_to_main_blog_picture_unique";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP CONSTRAINT "mr_planet_blog_url_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "title_index";--> statement-breakpoint
DROP INDEX IF EXISTS "author_index";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "mr_planet_blog" ALTER COLUMN "publication_date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "mr_planet_blog" ALTER COLUMN "publication_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "search_title";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "author";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "path_to_main_blog_picture";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "type_of_main_blog_picture";--> statement-breakpoint
ALTER TABLE "mr_planet_blog" DROP COLUMN IF EXISTS "url";