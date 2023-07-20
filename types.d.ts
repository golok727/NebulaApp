interface Content {
  doctype: 'markdown' | 'text' | 'html'
  body: string
}
interface Page {
  _id_: string
  title: string
  starred: boolean
  pinned: boolean
  content: Content
  subPages: Page[]
}

interface Notebook {
  _id_: string
  createdAt: Date
  pages: Page[]
}
