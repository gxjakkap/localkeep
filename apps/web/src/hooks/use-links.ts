import type { Link } from "@/lib/data";
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/eden"

export function useLinksByGroupSlug(slug: string | null) {
    return useQuery({
        queryKey: ["links", slug],
        queryFn: async () => {
            if (!slug) return []
            const { data, error } = await api.groups.group({ slug }).get()
            if (error) {
                throw error
            }
            return data.links
        },
        enabled: !!slug,
    })
}

export function useAddLinkToGroup() {
    return useMutation({
        mutationFn: async ({ groupSlug, link }: { groupSlug: string; link: Omit<Link, "id" | "createdAt" | "title"> }) => {
            const { data, error } = await api.links.add.post({
                url: link.url,
                note: link.note,
                groupSlug,
            })
            if (error) {
                throw error
            }
            return data
        },
    })
}

export function useRemoveLinkFromGroup() {
    return useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            const { data, error } = await api.links.rem.delete({
                id,
            })
            if (error) {
                throw error
            }
            return data
        },
    })
}