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

interface PageInfo {
  _id_: string
  title: string
  sub_pages: PageInfo[]
}

interface NotebookInfo {
  _id_: string
  created_at: string
  notebook_name: string
  pages: PageInfo[]
}
