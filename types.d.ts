interface Content {
  doctype: 'markdown'
  body: string
}
interface PageEntry {
  __id: string
  title: string
  tags: string[]
  starred: boolean
  content: Content
  tags: string[]
  parent_id: string | null
  starred: boolean
  pinned: boolean
}
interface NebulaAsset {
  name: string
  asset_url: string
  nb_protocol_url: string
  is_new: boolean
}

interface PageSimple {
  __id: string
  parent_id: string | null
  title: string
  pinned: boolean
  starred: boolean
  sub_pages: PageSimple[]
}

interface NotebookInfo {
  __id: string
  name: string
  author: string | null
  thumbnail: string | null
  description: string
  created_at: string
  last_accessed_at: string
  pages: PagesSimple[]
  trash_pages: TrashPage[]
  assets: string[]
}

interface TrashPage {
  __id: string
  title: string
  days_remaining: number
}
