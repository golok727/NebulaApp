interface Content {
  doctype: 'markdown'
  body: string
  starred: boolean
  pinned: boolean
}
interface PageEntry {
  _id_: string
  title: string
  tags: string[]
  starred: boolean
  pinned: boolean
  content: Content
  sub_pages: PageEntry[]
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
  assets: string[]
}
