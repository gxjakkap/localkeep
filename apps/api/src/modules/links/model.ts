import { t } from "elysia"

export namespace LinksModel {
	export const linkAddBody = t.Object({
		url: t.String({ format: "uri" }),
		note: t.Union([t.String(), t.Null()]),
		groupSlug: t.String(),
	})
	export type linkAddBody = typeof linkAddBody.static

	export const linkAddResponse = t.Object({
		links: t.Array(
			t.Object({
				url: t.String(),
				note: t.Union([t.String(), t.Null()]),
			})
		),
	})
	export type linkAddResponse = typeof linkAddResponse.static

	export const linkDeleteBody = t.Object({
		id: t.String(),
	})
	export type linkDeleteBody = typeof linkDeleteBody.static

	export const linkDeleteResponse = t.Object({
		url: t.String(),
	})
	export type linkDeleteResponse = typeof linkDeleteResponse.static
}
