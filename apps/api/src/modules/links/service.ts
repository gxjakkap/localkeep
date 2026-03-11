import { db } from "@repo/db"
import { and, eq, isNotNull, isNull } from "@repo/db/orm"
import { group, link, titleCache } from "@repo/db/schema"
import { getWebsiteTitle, hashUrl, removeTrackingParams } from "@/utils/url"

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "NotFoundError"
	}
}

export const addLink = async (url: string, note: string | null, groupSlug: string) => {
	const [g] = await db.select({ id: group.id }).from(group).where(eq(group.slug, groupSlug)).limit(1)
	if (!g) {
		throw new NotFoundError(`Group with slug "${groupSlug}" not found`)
	}
	const title = await getTitleFromCacheOrOG(url)
	await db
		.insert(link)
		.values({
			url: url,
			title: title,
			note: note,
			groupId: g.id,
		})
		.returning()
	const links = await db.select({ url: link.url, note: link.note }).from(link).where(eq(link.groupId, g.id))
	return links
}

export const removeLink = async (id: string) => {
	const [rl] = await db
		.update(link)
		.set({ deleted_at: new Date() })
		.where(and(eq(link.id, id), isNull(link.deleted_at)))
		.returning()
	if (!rl) throw new NotFoundError(`Link not found`)
	return rl
}

export const undoLinkRemove = async (id: string) => {
	const [rl] = await db
		.update(link)
		.set({ deleted_at: null })
		.where(and(eq(link.id, id), isNotNull(link.deleted_at)))
		.returning()
	if (!rl) throw new NotFoundError(`Link not found`)
	return rl
}

const checkForTitleCache = async (hash: string) => {
	const [tc] = await db.select({ title: titleCache.title }).from(titleCache).where(eq(titleCache.hash, hash)).limit(1)
	if (tc) return tc.title
	return null
}

export const getTitleFromCacheOrOG = async (url: string) => {
	const hash = hashUrl(removeTrackingParams(url))
	const cachedTitle = await checkForTitleCache(hash)

	if (cachedTitle) return cachedTitle

	const ogTitle = await getWebsiteTitle(url)
	await db.insert(titleCache).values({ hash, title: ogTitle || url })

	if (!ogTitle) return url

	return ogTitle
}