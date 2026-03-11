import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/eden"

export function useLinkGroups() {
	return useQuery({
		queryKey: ["groups"],
		queryFn: async () => {
			const { data, error } = await api.groups.get()
			if (error) {
				throw error
			}
			return data
		},
	})
}

export function useRecentlyDeletedGroups() {
	return useQuery({
		queryKey: ["rd-groups"],
		queryFn: async () => {
			const { data, error } = await api.groups["recently-deleted"].get()
			if (error) {
				throw error
			}
			return data
		},
	})
}

export function useCreateGroup() {
	return useMutation({
		mutationFn: async ({ name }: { name: string }) => {
			const { data, error } = await api.groups.create.post({ name })
			if (error) {
				throw error
			}
			return data
		},
	})
}

export function useRemoveGroup() {
	return useMutation({
		mutationFn: async ({ slug }: { slug: string }) => {
			const { data, error } = await api.groups.rem.delete({ slug })
			if (error) {
				throw error
			}
			return data
		},
	})
}