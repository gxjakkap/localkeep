import { Check, Copy, ExternalLink, Plus, Trash2 } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"
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
import { useLinksByGroupSlug } from "@/hooks/use-links"
import { useApp } from "@/lib/context"
import type { Link } from "@/lib/data"

const hostname = (url: string) => {
	try {
		return new URL(url).hostname
	} catch {
		return url
	}
}

export function UrlListContent() {
	const { groups, isLoading: groupsLoading, getSelectedGroup, addLinkToGroup, deleteLinkFromGroup } = useApp()
	const selectedGroup = getSelectedGroup()

	const { data: links = [], isLoading } = useLinksByGroupSlug(selectedGroup?.slug ?? null)

	const [open, setOpen] = useState(false)
	const [url, setUrl] = useState("")
	const [note, setNote] = useState("")
	const [pendingDelete, setPendingDelete] = useState<Link | null>(null)
	const [copied, setCopied] = useState<string | null>(null)

	if (!selectedGroup) {
		return (
			<div className="flex-1 flex items-center justify-center bg-background p-6">
				{!groupsLoading && (
					<p className="text-muted-foreground text-center">
						{groups.length === 0 ? "Create a group in the sidebar to start saving links." : "Choose a group to see its links."}
					</p>
				)}
			</div>
		)
	}

	const handleAddLink = (e: React.FormEvent) => {
		e.preventDefault()
		if (url.trim()) {
			addLinkToGroup(selectedGroup.slug, { url: url.trim(), note: note.trim() || null })
			setUrl("")
			setNote("")
			setOpen(false)
		}
	}

	const handleCopyUrl = async (url: string) => {
		try {
			await navigator.clipboard.writeText(url)
			setCopied(url)
			toast.success("Link copied")
			setTimeout(() => setCopied((c) => (c === url ? null : c)), 2000)
		} catch {
			toast.error("Couldn’t copy the link. Your browser blocked clipboard access.")
		}
	}

	const handleDeleteLink = () => {
		if (pendingDelete) {
			deleteLinkFromGroup(pendingDelete.id)
			setPendingDelete(null)
		}
	}

	return (
		<div className="flex-1 min-h-0 flex flex-col bg-background">
			<div className="border-b border-border px-4 py-4 md:px-6 flex items-center justify-between gap-4">
				<div className="min-w-0">
					<h2 className="text-2xl font-bold text-foreground truncate">{selectedGroup.name}</h2>
					{!isLoading && (
						<p className="text-sm text-muted-foreground mt-1">
							{links.length === 1 ? "1 link" : `${links.length} links`}
						</p>
					)}
				</div>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger render={<Button />}>
						<Plus size={16} aria-hidden />
						Add Link
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Link</DialogTitle>
							<DialogDescription>Save a link to {selectedGroup.name}.</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleAddLink} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="link-url" className="text-sm font-medium">
									URL
								</label>
								<Input
									id="link-url"
									placeholder="https://example.com/article"
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									type="url"
									inputMode="url"
									autoComplete="url"
									required
									autoFocus
								/>
							</div>
							<div className="space-y-1.5">
								<label htmlFor="link-note" className="text-sm font-medium">
									Note (optional)
								</label>
								<Input
									id="link-note"
									placeholder="Why you saved it"
									value={note}
									onChange={(e) => setNote(e.target.value)}
								/>
							</div>
							<DialogFooter>
								<Button type="button" variant="outline" onClick={() => setOpen(false)}>
									Cancel
								</Button>
								<Button type="submit" disabled={!url.trim()}>
									Add Link
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Links List */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<div className="divide-y divide-border" aria-busy="true">
						{[0, 1, 2].map((i) => (
							<div key={i} className="p-4 space-y-2">
								<Skeleton className="h-5 w-1/3 rounded-md" />
								<Skeleton className="h-4 w-1/5 rounded-md" />
							</div>
						))}
					</div>
				) : links.length === 0 ? (
					<div className="text-center text-muted-foreground py-12 px-6 space-y-4">
						<p>No links in {selectedGroup.name} yet.</p>
						<Button variant="outline" onClick={() => setOpen(true)}>
							<Plus size={16} aria-hidden />
							Add Link
						</Button>
					</div>
				) : (
					<ul className="divide-y divide-border">
						{links.map((link: Link) => (
							<li key={link.id} className="p-4 hover:bg-muted/40 transition-colors">
								<div className="flex items-start gap-4">
									<div className="flex-1 min-w-0">
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex max-w-full items-center gap-2 mb-1 font-semibold text-foreground hover:underline rounded-sm">
											<span className="truncate">{link.title || hostname(link.url)}</span>
											<ExternalLink size={14} className="shrink-0 text-muted-foreground" aria-hidden />
											<span className="sr-only">(opens in a new tab)</span>
										</a>
										{link.note && <p className="text-sm text-muted-foreground mb-2">{link.note}</p>}
										<p className="text-xs text-muted-foreground truncate">{hostname(link.url)}</p>
									</div>
									<div className="flex items-center gap-1 shrink-0">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleCopyUrl(link.url)}
											aria-label={`Copy link to ${link.title || hostname(link.url)}`}
											title="Copy Link">
											{copied === link.url ? <Check aria-hidden /> : <Copy aria-hidden />}
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setPendingDelete(link)}
											aria-label={`Delete ${link.title || hostname(link.url)}`}
											title="Delete Link"
											className="hover:bg-destructive/10 hover:text-destructive">
											<Trash2 aria-hidden />
										</Button>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>

			<Dialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete “{pendingDelete && (pendingDelete.title || hostname(pendingDelete.url))}”?</DialogTitle>
						<DialogDescription>This can’t be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPendingDelete(null)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteLink}>
							Delete Link
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
