import { Elysia } from "elysia"
import { ErrorModel } from "@/schemas/error"
import { GroupsModel } from "./model"
import {
	createGroup,
	getLinkGroups,
	getLinksByGroupSlug,
	getRecentlyDeletedGroups,
	NotFoundError,
	removeGroupBySlug,
} from "./service"

export const groupsRoutes = new Elysia({ prefix: "/groups" })
	.get(
		"/",
		async () => {
			const groups = await getLinkGroups()
			return { groups }
		},
		{
			response: {
				200: GroupsModel.getGroupsResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
	.get(
		"/recently-deleted",
		async () => {
			const groups = await getRecentlyDeletedGroups()
			return { groups }
		},
		{
			response: {
				200: GroupsModel.getGroupsResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
	.get(
		"/group/:slug",
		async ({ params, set }) => {
			try {
				const links = await getLinksByGroupSlug(params.slug)
				return {
					links: links,
				}
			} catch (err) {
				if (err instanceof NotFoundError) {
					set.status = 404
					return {
						code: 404,
						message: "Not Found",
						details: err.message,
					}
				}
				set.status = 500
				return {
					code: 500,
					message: "Internal Server Error",
				}
			}
		},
		{
			params: GroupsModel.getLinksFromGroupSlugParams,
			response: {
				200: GroupsModel.getLinksFromGroupSlugResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
	.post(
		"/create",
		async ({ body, set }) => {
			try {
				const sl = await createGroup(body.name)
				return {
					slug: sl,
				}
			} catch (_e) {
				set.status = 500
				return {
					code: 500,
					message: "Internal Server Error",
				}
			}
		},
		{
			body: GroupsModel.createGroupBody,
			response: {
				200: GroupsModel.createGroupResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
	.delete(
		"/rem",
		async ({ body, set }) => {
			try {
				const rg = await removeGroupBySlug(body.slug)
				return {
					name: rg.name,
				}
			} catch (err) {
				if (err instanceof NotFoundError) {
					set.status = 404
					return {
						code: 404,
						message: "Not Found",
						details: err.message,
					}
				}
				set.status = 500
				return {
					code: 500,
					message: "Internal Server Error",
				}
			}
		},
		{
			body: GroupsModel.removeGroupBody,
			response: {
				200: GroupsModel.removeGroupResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
