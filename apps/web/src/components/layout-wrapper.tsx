"use client"

import { Menu, X } from "lucide-react"
import React, { type ReactNode, useState } from "react"

interface LayoutWrapperProps {
	children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<>
			{/* Mobile Header */}
			<div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border z-50">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-lg font-semibold text-sidebar-foreground">URL Keeper</h1>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-1 hover:bg-sidebar-accent rounded-md transition-colors">
						{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</div>

			{/* Sidebar Overlay (Mobile) */}
			{sidebarOpen && (
				<div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
			)}

			{/* Main Layout */}
			<div className="flex h-screen bg-background pt-16 md:pt-0">
				{/* Sidebar - Hidden on mobile, shown on desktop */}
				<div className="hidden md:flex md:w-64 md:flex-col">{React.Children.toArray(children)[0]}</div>

				{/* Sidebar - Mobile Drawer */}
				{sidebarOpen && (
					<div className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-40 overflow-y-auto">
						{React.Children.toArray(children)[0]}
					</div>
				)}

				{/* Main Content */}
				<div className="flex-1 flex flex-col md:flex-col">{React.Children.toArray(children)[1]}</div>
			</div>
		</>
	)
}
