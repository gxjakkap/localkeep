import { cron, Patterns } from "@elysiajs/cron"
import { removeDeletedGroups, removeDeletedLinks } from "./service"

export const removeDeletedGroupsJob = cron({
	name: "remove_deleted_groups",
	pattern: Patterns.EVERY_DAY_AT_MIDNIGHT,
	run: async () => {
		await removeDeletedGroups()
	},
})

export const removeDeletedLinksJob = cron({
	name: "remove_deleted_links",
	pattern: Patterns.EVERY_DAY_AT_MIDNIGHT,
	run: async () => {
		await removeDeletedLinks()
	},
})
