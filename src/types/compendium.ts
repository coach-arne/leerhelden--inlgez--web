export type TiptapTextNode = {
  type: 'text'
  text: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
}

export type TiptapNode = {
  type: string
  attrs?: Record<string, unknown>
  content?: TiptapNode[]
} | TiptapTextNode

export type TiptapDoc = {
  type: 'doc'
  content?: TiptapNode[]
}

export type CompendiumItem = {
  id: string
  nameNL: string
  nameEN: string
  description: TiptapDoc
  additions: TiptapDoc
  compendium: string
}

export type CompendiumMeta = {
  slug: string
  label: string
  description: string
  itemCount: number
}
