import { db } from "@repo/db"
import { and, between, eq, isNotNull, isNull } from "@repo/db/orm"
import { group, link } from "@repo/db/schema"
import { SOFT_DELETE_KEEP_DURATION } from "@/utils/const"

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "NotFoundError"
	}
}

const slugify = (name: string): string => {
	return name
		.toLowerCase()
		.trim()
		.normalize("NFKC")
		.replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
}

export const getLinkGroups = async () => {
	const groups = await db.select().from(group).where(isNull(group.deleted_at))
	return groups
}

export const getRecentlyDeletedGroups = async () => {
	const now = new Date()
	const lastKeepDate = new Date()
	lastKeepDate.setDate(now.getDate() - SOFT_DELETE_KEEP_DURATION)
	const groups = await db
		.select()
		.from(group)
		.where(and(isNotNull(group.deleted_at), between(group.deleted_at, lastKeepDate, now)))
	return groups
}

export const getLinksByGroupSlug = async (slug: string) => {
	const links = await db
		.select({
			id: link.id,
			title: link.title,
			url: link.url,
			note: link.note,
			createdAt: link.created_at,
		})
		.from(link)
		.innerJoin(group, eq(link.groupId, group.id))
		.where(and(eq(group.slug, slug), isNull(group.deleted_at)))

	if (links.length === 0) {
		const exists = await db.select({ id: group.id }).from(group).where(eq(group.slug, slug))

		if (exists.length === 0) throw new NotFoundError(`Group with slug ${slug} not found!`)
	}

	return links
}

export const createGroup = async (name: string) => {
	const slug = slugify(name)
	await db
		.insert(group)
		.values({
			name: name,
			slug: slug,
		})
		.returning()
	return slug
}

export const removeGroupBySlug = async (slug: string) => {
	const [rg] = await db
		.update(group)
		.set({ deleted_at: new Date() })
		.where(and(eq(group.slug, slug), isNull(group.deleted_at)))
		.returning()
	if (!rg) throw new NotFoundError(`Group not found`)
	return rg
}

export const undoGroupRemove = async (slug: string) => {
	const [rg] = await db
		.update(group)
		.set({ deleted_at: null })
		.where(and(eq(group.slug, slug), isNotNull(group.deleted_at)))
		.returning()
	if (!rg) throw new NotFoundError(`Group not found`)
	return rg
}
