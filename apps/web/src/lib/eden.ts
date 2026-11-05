import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/api-types"

declare global {
	// injected at runtime by entrypoint.sh
	interface Window {
		ENV?: { VITE_API_URL?: string }
	}
}

const apiUrl = window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL
export const api = treaty<App>(`${apiUrl}`)
