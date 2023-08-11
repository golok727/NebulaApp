import store from '@/app/store'
import { invoke } from '@tauri-apps/api/tauri'
type Store = typeof store

export interface INebulaCore {
  store: Store
  createNotebook: (notebookName: string) => Promise<string>
  createPage: (pageName: string) => Promise<void>
  updatePage: (pageId: string) => Promise<void>
}

export class NebulaCore implements INebulaCore {
  store: Store

  constructor(store: Store) {
    this.store = store
  }
  async createNotebook(notebookName: string) {
    try {
      const res = (await invoke('create_nebula_notebook', {
        notebookName: notebookName.trim(),
      })) as any

      return res.notebook.__id
    } catch (error) {
      //TODO handle error
      console.log(error)
    }
  }
  async createPage(pageName: string) {}
  async updatePage(pageId: string) {}
}
