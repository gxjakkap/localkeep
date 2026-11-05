import { useSearch } from "@tanstack/react-router"
import { Menu } from "lucide-react"
import React, { type ReactNode, useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

interface LayoutWrapperProps {
	children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const { group } = useSearch({ from: "/" })
	const [sidebar, content] = React.Children.toArray(children)

	// Picking a group is the drawer's whole job, so close it once the selection changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: group is the trigger
	useEffect(() => setSidebarOpen(false), [group])

	return (
		<>
			{/* Mobile Header */}
			<header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-40 flex items-center justify-between px-4">
				<h1 className="text-lg font-semibold text-sidebar-foreground">Localkeep</h1>
				<div className="ml-auto">
					<ThemeToggle className="size-11 [&_svg]:size-5" />
				</div>
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					aria-label="Show groups"
					aria-expanded={sidebarOpen}
					className="size-11 -mr-2.5 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors">
					<Menu size={24} aria-hidden />
				</button>
			</header>

			{/* Sidebar - Mobile Drawer */}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="md:hidden bg-sidebar w-72 gap-0">
					<SheetHeader className="border-b border-sidebar-border">
						<SheetTitle className="text-lg font-semibold">Groups</SheetTitle>
					</SheetHeader>
					{sidebar}
				</SheetContent>
			</Sheet>

			{/* Main Layout */}
			<div className="flex h-dvh bg-background pt-16 md:pt-0">
				{/* Sidebar - Desktop */}
				<div className="hidden md:flex md:flex-col">{sidebar}</div>

				{/* Main Content */}
				<div className="flex-1 min-w-0 min-h-0 flex flex-col">{content}</div>
			</div>
		</>
	)
}
