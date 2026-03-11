import { Elysia } from "elysia"
import { ErrorModel } from "@/schemas/error"
import { LinksModel } from "./model"
import { addLink, NotFoundError, removeLink } from "./service"

export const linksRoutes = new Elysia({ prefix: "/links" })
	.post(
		"/add",
		async ({ body, set }) => {
			try {
				const nLinks = await addLink(body.url, body.note, body.groupSlug)
				return {
					links: nLinks,
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
			body: LinksModel.linkAddBody,
			response: {
				200: LinksModel.linkAddResponse,
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
				const rl = await removeLink(body.id)
				return {
					url: rl.url,
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
			body: LinksModel.linkDeleteBody,
			response: {
				200: LinksModel.linkDeleteResponse,
				300: ErrorModel,
				400: ErrorModel,
				500: ErrorModel,
			},
		}
	)
