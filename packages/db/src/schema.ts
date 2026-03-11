import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const group = pgTable("group", {
	id: uuid("id").defaultRandom().notNull().primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	created_at: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
	deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
})

export const link = pgTable("link", {
	id: uuid("id").defaultRandom().notNull().primaryKey(),
	url: text("url").notNull(),
	title: text("title").notNull(),
	note: text("note"),
	groupId: uuid("group_id")
		.notNull()
		.references(() => group.id, { onDelete: "cascade" }),
	created_at: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
	deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
})

export const titleCache = pgTable("title_cache", {
	hash: text("hash").notNull().primaryKey(),
	title: text("title"),
	created_at: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
})
