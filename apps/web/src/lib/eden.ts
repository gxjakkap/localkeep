import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/api-types"

export const api = treaty<App>(`${import.meta.env.VITE_API_URL}`)
