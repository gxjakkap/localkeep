export interface Link {
	id: string
	title: string
	url: string
	note: string | null
	createdAt: Date
}
export interface TGroup {
	name: string,
	slug?: string
}

export interface Group extends TGroup {
	id: string
	slug: string
	links?: Link[]
}
