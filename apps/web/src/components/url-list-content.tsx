"use client"

import { Copy, ExternalLink, Plus, Trash2 } from "lucide-react"
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
import { useLinksByGroupSlug } from "@/hooks/use-links"
import { useApp } from "@/lib/context"
import type { Link } from "@/lib/data"

export function UrlListContent() {
	const { getSelectedGroup, addLinkToGroup, deleteLinkFromGroup } = useApp()
	const selectedGroup = getSelectedGroup()

	const { data: links = [], isLoading } = useLinksByGroupSlug(selectedGroup?.slug ?? null)

	const [open, setOpen] = useState(false)
	const [url, setUrl] = useState("")
	const [description, setDescription] = useState("")
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [copied, setCopied] = useState<string | null>(null)

	if (!selectedGroup) {
		return (
			<div className="flex-1 flex items-center justify-center bg-background">
				<div className="text-center">
					<p className="text-muted-foreground mb-4">Select a group to view links</p>
				</div>
			</div>
		)
	}

	const handleAddLink = (e: React.SubmitEvent) => {
		e.preventDefault()
		if (url.trim()) {
			const l: Omit<Link, "id" | "createdAt" | "title"> = {
				url,
				note: description || null,
			}
			addLinkToGroup(selectedGroup.slug, l)
			setUrl("")
			setDescription("")
			setOpen(false)
		}
	}

	const handleCopyUrl = (url: string) => {
		navigator.clipboard.writeText(url)
		setCopied(url)
		setTimeout(() => setCopied(null), 2000)
	}

	const handleDeleteLink = () => {
		if (deleteId) {
			deleteLinkFromGroup(deleteId)
			setDeleteId(null)
		}
	}

	return (
		<div className="flex-1 flex flex-col bg-background">
			<div className="border-b border-border p-6 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground">{selectedGroup.name}</h2>
					<p className="text-sm text-muted-foreground mt-1">description placeholder</p>
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger render={<Button />}>
						<Plus size={16} className="mr-2" />
						Add Link
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New Link</DialogTitle>
							<DialogDescription>Add a new link to the {selectedGroup.name} group</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddLink} className="space-y-4">
							<div>
								<label className="text-xs font-medium">URL</label>
								<Input
									placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									type="url"
								/>
							</div>
							<div>
								<label className="text-xs font-medium">Description (optional)</label>
								<Input
									placeholder="Brief description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit">Add Link</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Links List */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="text-center text-muted-foreground py-12 px-6">
						<p>Loading links...</p>
					</div>
				) : links.length === 0 ? (
					<div className="text-center text-muted-foreground py-12 px-6">
						<p>No links yet. Add one to get started!</p>
					</div>
				) : (
					<div className="divide-y divide-border">
						{links.map((link) => (
							<div key={link.id} className="p-4 hover:bg-muted/40 transition-colors group">
								<div className="flex items-start gap-4">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<h3 className="font-semibold text-foreground truncate">{link.title}</h3>
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="p-1.5 hover:bg-muted rounded-md transition-colors shrink-0">
												<ExternalLink size={16} className="text-muted-foreground" />
											</a>
										</div>
										{link.note && <p className="text-sm text-muted-foreground mb-2">{link.note}</p>}
										<code className="text-xs bg-muted px-2.5 py-1.5 rounded inline-block">
											{new URL(link.url).hostname}
										</code>
									</div>
									<div className="flex items-center gap-2 shrink-0">
										<button
											onClick={() => handleCopyUrl(link.url)}
											className="p-2 hover:bg-muted rounded-md transition-colors"
											title="Copy URL">
											<Copy size={16} className="text-muted-foreground" />
										</button>
										<button
											onClick={() => setDeleteId(link.id)}
											className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
											title="Delete link">
											<Trash2 size={16} />
										</button>
									</div>
								</div>
								{copied === link.url && <p className="text-xs text-green-600 mt-2 ml-4">Copied to clipboard!</p>}
							</div>
						))}
					</div>
				)}
			</div>

			<Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Link?</DialogTitle>
						<DialogDescription>This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteId(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteLink}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
