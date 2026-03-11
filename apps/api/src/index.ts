import { logger } from "@bogeychan/elysia-logger"
import { Elysia } from "elysia"
import { removeDeletedGroupsJob, removeDeletedLinksJob } from "@/modules/cron"
import { groupsRoutes } from "@/modules/groups"
import { linksRoutes } from "@/modules/links"

const PORT = parseInt(Bun.env.PORT || "4000", 10)

const app = new Elysia()
	.use(logger())
	.use(removeDeletedGroupsJob)
	.use(removeDeletedLinksJob)
	.use(groupsRoutes)
	.use(linksRoutes)
	.get("/", () => "Alive")
	.listen(PORT)

console.log(`API is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
