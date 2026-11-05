import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useApp } from "@/lib/context"
import type { Group } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function Sidebar() {
	const { groups, isLoading, selectedGroupSlug, selectGroup, addGroup, deleteGroup } = useApp()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [pendingDelete, setPendingDelete] = useState<Group | null>(null)
	const [collapsed, setCollapsed] = useState(false)

	const handleAddGroup = (e: React.FormEvent) => {
		e.preventDefault()
		if (name.trim()) {
			addGroup(name.trim())
			setName("")
			setOpen(false)
		}
	}

	const handleDeleteGroup = () => {
		if (pendingDelete) {
			deleteGroup(pendingDelete.slug)
			setPendingDelete(null)
		}
	}

	return (
		<aside
			className={cn(
				"bg-sidebar md:border-r border-sidebar-border flex flex-col flex-1 min-h-0 md:h-dvh w-full transition-[width] duration-300 motion-reduce:transition-none",
				collapsed ? "md:w-16" : "md:w-64"
			)}>
			{/* Header - Desktop only */}
			<div className="hidden md:flex h-16 px-4 border-b border-sidebar-border items-center justify-between">
				{!collapsed && <h1 className="text-lg font-semibold text-sidebar-foreground">Localkeep</h1>}
				{!collapsed && (
					<div className="ml-auto mr-1">
						<ThemeToggle />
					</div>
				)}
				<button
					type="button"
					onClick={() => setCollapsed(!collapsed)}
					aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
					aria-expanded={!collapsed}
					className="size-8 flex items-center justify-center hover:bg-sidebar-accent rounded-md transition-colors">
					{collapsed ? <ChevronRight size={18} aria-hidden /> : <ChevronLeft size={18} aria-hidden />}
				</button>
			</div>

			{/* Add Group Button */}
			<div className="p-2 border-b border-sidebar-border">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={
							<Button
								variant="outline"
								className={cn("w-full", collapsed && "px-0")}
								aria-label={collapsed ? "New Group" : undefined}
								title={collapsed ? "New Group" : undefined}
							/>
						}>
						<Plus size={16} aria-hidden />
						{!collapsed && "New Group"}
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>New Group</DialogTitle>
							<DialogDescription>Groups keep related links together.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddGroup} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="group-name" className="text-sm font-medium">
									Name
								</label>
								<Input
									id="group-name"
									placeholder="e.g., Development Tools"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									autoFocus
								/>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={!name.trim()}>
									Create Group
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Groups List */}
			<nav aria-label="Groups" className="flex-1 overflow-y-auto p-2">
				{isLoading ? (
					<div className="space-y-1" aria-busy="true">
						{[0, 1, 2].map((i) => (
							<Skeleton key={i} className="h-11 rounded-md" />
						))}
					</div>
				) : groups.length === 0 ? (
					!collapsed && (
						<p className="text-sm text-muted-foreground p-2">No groups yet. Create one to start saving links.</p>
					)
				) : (
					<ul className="space-y-1">
						{groups.map((group) => {
							const selected = selectedGroupSlug === group.slug
							return (
								<li
									key={group.id}
									className={cn(
										"group flex items-center rounded-md transition-colors",
										selected
											? "bg-sidebar-primary text-sidebar-primary-foreground"
											: "text-sidebar-foreground hover:bg-sidebar-accent"
									)}>
									<button
										type="button"
										onClick={() => selectGroup(group.slug)}
										aria-current={selected ? "page" : undefined}
										title={collapsed ? group.name : undefined}
										className={cn(
											"flex-1 min-w-0 min-h-11 text-left rounded-md",
											collapsed ? "text-center font-semibold" : "px-3"
										)}>
										{collapsed ? (
											<>
												<span aria-hidden>{group.name.charAt(0).toUpperCase()}</span>
												<span className="sr-only">{group.name}</span>
											</>
										) : (
											<span className="block text-sm font-medium truncate">{group.name}</span>
										)}
									</button>
									{!collapsed && (
										<button
											type="button"
											onClick={() => setPendingDelete(group)}
											aria-label={`Delete ${group.name}`}
											className="size-9 mr-1 flex items-center justify-center rounded-md transition-opacity pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 focus-visible:opacity-100">
											<Trash2 size={16} aria-hidden />
										</button>
									)}
								</li>
							)
						})}
					</ul>
				)}
			</nav>

			{/* Delete Confirmation Dialog */}
			<Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete “{pendingDelete?.name}”?</DialogTitle>
						<DialogDescription>All links in this group will be deleted too. This can’t be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPendingDelete(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteGroup}>
							Delete Group
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</aside>
	)
}
