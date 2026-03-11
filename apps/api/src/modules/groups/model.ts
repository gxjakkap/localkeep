import { t } from "elysia"

export namespace GroupsModel {
	export const getGroupsResponse = t.Object({
		groups: t.Array(
			t.Object({
				id: t.String(),
				name: t.String(),
				slug: t.String(),
			})
		),
	})
	export type linkGroupsResponse = typeof getGroupsResponse.static

	export const getLinksFromGroupSlugParams = t.Object({
		slug: t.String(),
	})
	export type getLinksFromGroupSlugParams = typeof getLinksFromGroupSlugParams.static

	export const getLinksFromGroupSlugResponse = t.Object({
		links: t.Array(
			t.Object({
				id: t.String(),
				title: t.String(),
				url: t.String(),
				note: t.Union([t.String(), t.Null()]),
				createdAt: t.Date(),
			})
		),
	})
	export type getLinksFromGroupSlugResponse = typeof getLinksFromGroupSlugResponse.static

	export const createGroupBody = t.Object({
		name: t.String(),
	})
	export type createGroupBody = typeof createGroupBody.static

	export const createGroupResponse = t.Object({
		slug: t.String(),
	})
	export type createGroupResponse = typeof createGroupResponse.static

	export const removeGroupBody = t.Object({
		slug: t.String(),
	})
	export type removeGroupBody = typeof removeGroupBody.static

	export const removeGroupResponse = t.Object({
		name: t.String(),
	})
	export type removeGroupResponse = typeof removeGroupResponse.static
}
