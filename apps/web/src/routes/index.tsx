import { createFileRoute } from "@tanstack/react-router"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Sidebar } from "@/components/sidebar"
import { UrlListContent } from "@/components/url-list-content"
import { AppProvider } from "@/lib/context"

export const Route = createFileRoute("/")({
	component: Index,
	validateSearch: (search: Record<string, unknown>) => ({
		group: (search.group as string) || null,
	}),
})

function Index() {
	return (
		<AppProvider>
			<LayoutWrapper>
				<Sidebar />
				<UrlListContent />
			</LayoutWrapper>
		</AppProvider>
	)
}
