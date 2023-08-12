import type { Store } from '@/app/store'
import { invoke } from '@tauri-apps/api/tauri'
import { HomeNotebook, HomeNotebooks } from '@/utils/notebook'
import { NebulaModal } from '@/features/modalSlice'
import { movePageToTrash } from '@/features/editorReducers'

export interface INebulaCore {
  store: Store
  createNotebook: (notebookName: string) => Promise<string>
  updatePage: (pageId: string | undefined, currDoc: string) => Promise<void>
  saveCurrentNotebook: () => Promise<void>
  loadHomeNotebooks: () => Promise<HomeNotebook[]>
  openSettings: () => Promise<void>
  movePageToTrash: (pageId: string) => Promise<void>
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

  async updatePage(pageId: string | undefined, currDoc: string) {
    if (pageId !== undefined) {
      console.log('update')
      await invoke('update_page', {
        pageId: pageId,
        newContent: currDoc,
      })
    }
  }
  async saveCurrentNotebook() {
    let state = this.store.getState()
    let currentPageId = state.editor.currentPage?.__id
    let currentContent = state.editor.currentDoc
    if (currentPageId) {
      await this.updatePage(currentPageId, currentContent)
    }
    await invoke('save_notebook')
  }
  async loadHomeNotebooks() {
    try {
      const nebula_notebooks = await invoke<HomeNotebooks>(
        'load_nebula_notebooks'
      )
      return nebula_notebooks.notebooks
    } catch (error: any) {
      throw error
    }
  }
  async openSettings() {
    await invoke('open_settings_window')
  }
  async movePageToTrash(pageId: string) {
    //Todo Make this
    console.log(`Moving ${pageId} to trash`)
    this.store.dispatch(movePageToTrash({ pageId }))
    this.store.dispatch(NebulaModal.unloadModal())
  }
}
