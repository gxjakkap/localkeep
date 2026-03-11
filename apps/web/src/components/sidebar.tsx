"use client"

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
import { useApp } from "@/lib/context"
import { cn } from "@/lib/utils"

export function Sidebar() {
	const { groups, selectedGroupSlug, selectGroup, addGroup, deleteGroup } = useApp()
	const [open, setOpen] = useState(false)
	const [name, setName] = useState("")
	const [description, setDescription] = useState("")
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [collapsed, setCollapsed] = useState(false)

	const handleAddGroup = (e: React.FormEvent) => {
		e.preventDefault()
		if (name.trim()) {
			addGroup(name)
			setName("")
			setDescription("")
			setOpen(false)
		}
	}

	const handleDeleteGroup = () => {
		if (deleteId) {
			deleteGroup(deleteId)
			setDeleteId(null)
		}
	}

	return (
		<aside
			className={cn(
				"bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-all duration-300",
				collapsed ? "w-16" : "w-64"
			)}>
			{/* Header - Desktop only */}
			<div className="hidden md:flex p-4 border-b border-sidebar-border items-center justify-between">
				{!collapsed && <h1 className="text-lg font-semibold text-sidebar-foreground">URL Keeper</h1>}
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="p-1 hover:bg-sidebar-accent rounded-md transition-colors ml-auto">
					{collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
				</button>
			</div>

			{/* Groups List */}
			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{groups.length === 0
					? !collapsed && <p className="text-xs text-muted-foreground p-2">No groups yet</p>
					: groups.map((group) => (
						<div
							key={group.id}
							className={cn(
								"group flex items-center justify-between rounded-md cursor-pointer transition-colors",
								collapsed ? "p-2" : "p-3",
								selectedGroupSlug === group.slug
									? "bg-sidebar-primary text-sidebar-primary-foreground"
									: "text-sidebar-foreground hover:bg-sidebar-accent"
							)}
							title={collapsed ? group.name : undefined}>
							<button
								onClick={() => selectGroup(group.slug || null)}
								className={cn("text-left flex-1", collapsed ? "hidden" : "")}>
								<p className="text-sm font-medium truncate">{group.name}</p>
								{/* {group.description && <p className="text-xs opacity-70 truncate">{group.description}</p>} */}
							</button>
							<button
								onClick={() => setDeleteId(group.id)}
								className={cn(
									"opacity-0 group-hover:opacity-100 transition-opacity p-1",
									selectedGroupSlug === group.slug ? "text-sidebar-primary-foreground" : "",
									collapsed ? "opacity-0" : ""
								)}>
								<Trash2 size={16} />
							</button>
						</div>
					))}
			</div>

			{/* Add Group Button */}
			<div className="p-2 border-t border-sidebar-border">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={
							<Button
								variant="outline"
								size="sm"
								className={cn("w-full", collapsed ? "px-2" : "")}
								title={collapsed ? "New Group" : undefined}
							/>
						}>
						<Plus size={16} className={!collapsed ? "mr-2" : ""} />
						{!collapsed && "New Group"}
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Group</DialogTitle>
							<DialogDescription>Add a new group to organize your links</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddGroup} className="space-y-4">
							<div>
								<label className="text-xs font-medium">Group Name</label>
								<Input
									placeholder="e.g., Development Tools"
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoFocus
								/>
							</div>
							<div>
								<label className="text-xs font-medium">Description (optional)</label>
								<Input
									placeholder="Brief description of this group"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Create Group</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Group?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. All links in this group will be deleted.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteGroup}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</aside>
	)
}
