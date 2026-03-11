import { treaty } from "@elysiajs/eden"
import type { App } from "@repo/api-types"

const apiUrl = (window as any).ENV?.VITE_API_URL || import.meta.env.VITE_API_URL;
export const api = treaty<App>(`${apiUrl}`)
