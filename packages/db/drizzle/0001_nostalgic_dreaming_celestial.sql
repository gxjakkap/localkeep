CREATE TABLE IF NOT EXISTS "title_cache" (
	"hash" text PRIMARY KEY NOT NULL,
	"title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
