import { db } from "@repo/db"
import { and, gt, isNotNull } from "@repo/db/orm"
import { group, link } from "@repo/db/schema"
import { SOFT_DELETE_KEEP_DURATION } from "@/utils/const"

export const removeDeletedGroups = async () => {
	const now = new Date()
	const lastKeepDate = new Date()
	lastKeepDate.setDate(now.getDate() - SOFT_DELETE_KEEP_DURATION)
	await db.delete(group).where(and(isNotNull(group.deleted_at), gt(group.deleted_at, lastKeepDate)))
}

export const removeDeletedLinks = async () => {
	const now = new Date()
	const lastKeepDate = new Date()
	lastKeepDate.setDate(now.getDate() - SOFT_DELETE_KEEP_DURATION)
	await db.delete(link).where(and(isNotNull(link.deleted_at), gt(link.deleted_at, lastKeepDate)))
}
