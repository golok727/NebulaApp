import { NebulaAssetBrowser } from './../features/assetsBrowserSlice'
import type { AppDispatch, Store } from '@/app/store'
import { invoke } from '@tauri-apps/api/tauri'
import { HomeNotebook, HomeNotebooks } from '@/utils/notebook'
import {
  movePageToTrash,
  deletePagePermanent,
  recoverPage,
} from '@/features/editorReducers'
import { NavigateFunction } from 'react-router-dom'
import { updateEditorState, updatePageName } from '@/features/editorSlice'
export interface INebulaCore {
  store: Store
  createNotebook: (notebookName: string) => Promise<string>
  updatePage: (pageId: string | undefined, currDoc: string) => Promise<void>
  saveCurrentNotebook: () => Promise<void>
  loadHomeNotebooks: () => Promise<HomeNotebook[]>
  openSettings: () => Promise<void>
  movePageToTrash: (pageId: string, navigate: NavigateFunction) => Promise<void>
  deletePagePermanent: (pageId: string) => Promise<void>
  recoverPage: (
    trashPageId: string,
    navigate?: NavigateFunction
  ) => Promise<void>
  recoverAll: () => Promise<void>
  deleteAllPermanently: () => Promise<void>
  renamePage: (pageId: string, newName: string) => Promise<void>
  loadAssets: (path?: string) => Promise<void>
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
  async movePageToTrash(pageId: string, navigate: NavigateFunction) {
    this.store.dispatch(movePageToTrash({ pageId, navigate }))
  }
  async deletePagePermanent(pageId: string) {
    this.store.dispatch(deletePagePermanent({ pageId }))

    putFadingMessage('Deleted Page', this.store.dispatch)
  }
  async recoverPage(
    trashPageId: string,
    navigate: NavigateFunction | undefined = undefined
  ) {
    this.store.dispatch(recoverPage({ trashPageId, navigate }))

    putFadingMessage('Recovered 1 Page', this.store.dispatch)
  }
  async recoverAll() {
    let trashPages =
      this.store.getState().editor.currentNotebook?.trash_pages ?? []
    if (trashPages.length > 0) {
      for (let i = 0; i < trashPages.length; i++) {
        let toDelete = trashPages[i].__id
        this.store.dispatch(recoverPage({ trashPageId: toDelete }))
      }
    }

    const message = `Recovered ${trashPages.length} ${
      trashPages.length === 1 ? 'page' : 'pages'
    }`

    putFadingMessage(message, this.store.dispatch)
  }
  async deleteAllPermanently() {
    let trashPages =
      this.store.getState().editor.currentNotebook?.trash_pages ?? []
    if (trashPages.length > 0) {
      for (let i = 0; i < trashPages.length; i++) {
        let toDelete = trashPages[i].__id
        this.store.dispatch(deletePagePermanent({ pageId: toDelete }))
      }
    }

    const message = `Deleted ${trashPages.length} ${
      trashPages.length === 1 ? 'page' : 'pages'
    }`
    putFadingMessage(message, this.store.dispatch)
  }

  async renamePage(pageId: string, newName: string) {
    try {
      const res = await invoke<string>('rename_page', { pageId, newName })
      this.store.dispatch(updatePageName({ pageId, newName: res }))

      putFadingMessage('Page Renamed', this.store.dispatch)
    } catch {}
  }
  async loadAssets(path: string = '/') {
    try {
      let res = await invoke<{ assets: NebulaAsset[] }>('fetch_assets', {
        path,
      })
      this.store.dispatch(NebulaAssetBrowser.setAssets(res.assets))
    } catch {}
  }
}

function putFadingMessage(
  message: string,
  dispatch: AppDispatch,
  decay: number = 2000
) {
  dispatch(updateEditorState({ message }))
  setTimeout(() => {
    dispatch(
      updateEditorState({ message: 'Up To Date', code: '', error: false })
    )
  }, decay)
}
