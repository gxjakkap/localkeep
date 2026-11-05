"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import React, { createContext, useCallback, useContext } from "react"
import { toast } from "sonner"
import { useCreateGroup, useLinkGroups, useRemoveGroup } from "@/hooks/use-groups"
import { useAddLinkToGroup, useRemoveLinkFromGroup } from "@/hooks/use-links"
import type { Group, Link } from "./data"

interface AppContextType {
	groups: Group[]
	isLoading: boolean
	selectedGroupSlug: string | null
	addGroup: (name: string) => void
	deleteGroup: (slug: string) => void
	addLinkToGroup: (groupSlug: string, link: Omit<Link, "id" | "createdAt" | "title">) => void
	deleteLinkFromGroup: (linkId: string) => void
	selectGroup: (slug: string | null) => void
	getSelectedGroup: () => Group | null
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
	const { group: selectedGroupSlug } = useSearch({ from: "/" })
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	// fetch initial data
	const { data, error, isLoading } = useLinkGroups()

	if (error) throw error

	const groups: Group[] = data?.groups ?? []

	// Call mutation hooks at top level
	const createGroupMutation = useCreateGroup()
	const removeGroupMutation = useRemoveGroup()
	const addLinkMutation = useAddLinkToGroup()
	const removeLinkMutation = useRemoveLinkFromGroup()

	const invalidateGroups = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ["groups"] })
	}, [queryClient])

	const addGroup = useCallback(
		(name: string) => {
			createGroupMutation.mutate(
				{ name },
				{
					onSuccess: invalidateGroups,
					onError: () => toast.error(`Couldn’t create “${name}”. Check your connection and try again.`),
				}
			)
		},
		[createGroupMutation, invalidateGroups]
	)

	const deleteGroup = useCallback(
		(slug: string) => {
			removeGroupMutation.mutate(
				{ slug },
				{
					onSuccess: () => {
						invalidateGroups()
						if (slug === selectedGroupSlug) navigate({ to: "/", search: { group: null } })
					},
					onError: () => toast.error("Couldn’t delete the group. Check your connection and try again."),
				}
			)
		},
		[removeGroupMutation, invalidateGroups, selectedGroupSlug, navigate]
	)

	const addLinkToGroup = useCallback(
		(groupSlug: string, link: Omit<Link, "id" | "createdAt" | "title">) => {
			addLinkMutation.mutate(
				{ groupSlug, link },
				{
					onSuccess: () => {
						invalidateGroups()
						queryClient.invalidateQueries({ queryKey: ["links", groupSlug] })
					},
					onError: () => toast.error("Couldn’t add the link. Check the URL and try again."),
				}
			)
		},
		[addLinkMutation, invalidateGroups, queryClient]
	)

	const deleteLinkFromGroup = useCallback(
		(linkId: string) => {
			removeLinkMutation.mutate(
				{ id: linkId },
				{
					onSuccess: () => {
						invalidateGroups()
						queryClient.invalidateQueries({ queryKey: ["links"] })
					},
					onError: () => toast.error("Couldn’t delete the link. Check your connection and try again."),
				}
			)
		},
		[removeLinkMutation, invalidateGroups, queryClient]
	)

	const selectGroup = useCallback(
		(slug: string | null) => {
			navigate({ to: "/", search: { group: slug } })
		},
		[navigate]
	)

	const getSelectedGroup = useCallback(() => {
		return groups.find((group) => group.slug === selectedGroupSlug) || null
	}, [groups, selectedGroupSlug])

	return (
		<AppContext.Provider
			value={{
				groups,
				isLoading,
				selectedGroupSlug,
				addGroup,
				deleteGroup,
				addLinkToGroup,
				deleteLinkFromGroup,
				selectGroup,
				getSelectedGroup,
			}}>
			{children}
		</AppContext.Provider>
	)
}

export function useApp() {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error("useApp must be used within AppProvider")
	}
	return context
}
