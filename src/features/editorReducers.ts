import { PayloadAction } from '@reduxjs/toolkit'
import { AppEditorState } from './editorSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { invoke } from '@tauri-apps/api/tauri'
import { NavigateFunction } from 'react-router-dom'

const updatePageName = (
  state: AppEditorState,
  action: PayloadAction<{ pageId: string; newName: string }>
) => {
  let pages = state.currentNotebook?.pages
  if (!pages) return
  const helper = (pages: PageSimple[], pageId: string, newName: string) => {
    for (const page of pages) {
      if (page.__id === pageId) {
        page.title = newName
        return
      }
      if (page.sub_pages.length > 0) {
        helper(page.sub_pages, pageId, newName)
      }
    }
  }
  helper(pages, action.payload.pageId, action.payload.newName)
}

const reducers = {
  setCurrentDoc: (state: AppEditorState, action: PayloadAction<string>) => {
    state.currentDoc = action.payload
  },
  toggleExpanded: (state: AppEditorState, action: PayloadAction<string>) => {
    const page_id = action.payload
    if (state.expandedPages.includes(action.payload)) {
      state.expandedPages = state.expandedPages.filter((id) => page_id !== id)
    } else {
      state.expandedPages = [...state.expandedPages, page_id]
    }
  },

  collapseAll: (state: AppEditorState) => {
    state.expandedPages = []
  },

  resetNotebookState: (state: AppEditorState) => {
    state.currentNotebook = null
    state.currentPage = null
    state.status = {
      ...state.status,
      error: false,
      loading: false,
      message: '',
      code: '',
    }
    state.expandedPages = []
  },
  unloadPage: (state: AppEditorState) => {
    state.currentPage = null
  },
  resetEditorStatus: (state: AppEditorState) => {
    state.status = {
      ...state.status,
      code: '',
      error: false,
      loading: false,
      message: '',
    }
  },
  setEditorStatus: (
    state: AppEditorState,
    action: PayloadAction<Partial<AppEditorState['status']>>
  ) => {
    state.status = { ...state.status, ...action.payload }
  },
  togglePageGroup: (state: AppEditorState) => {
    state.sidebarGroup.pages = !state.sidebarGroup.pages
  },
  toggleTrashGroup: (state: AppEditorState) => {
    state.sidebarGroup.trash = !state.sidebarGroup.trash
  },
  setPageGroupState: (
    state: AppEditorState,
    action: PayloadAction<boolean>
  ) => {
    state.sidebarGroup.pages = action.payload
  },

  setTrashGroupState: (
    state: AppEditorState,
    action: PayloadAction<boolean>
  ) => {
    state.sidebarGroup.trash = action.payload
  },
  updatePageName,
}
type LoadNotebookPayload = { notebookId: string }
export const loadNotebook = createAsyncThunk(
  'editor/loadNotebook',
  async (payload: LoadNotebookPayload, thunkApi) => {
    try {
      const nebula_notebook = await invoke<NotebookInfo>(
        'load_nebula_notebook',
        {
          notebookId: payload.notebookId,
        }
      )
      return nebula_notebook
    } catch (error: any) {
      console.log(error)
      return thunkApi.rejectWithValue(error)
    }
  }
)
type MovePageToTrashPayload = { pageId: string; navigate?: NavigateFunction }
export const movePageToTrash = createAsyncThunk(
  'editor/movePageToTrash',
  async (payload: MovePageToTrashPayload, thunkApi) => {
    try {
      let new_pages = await invoke<{
        pages: PageSimple[]
        trash_pages: TrashPage[]
      }>('move_page_to_trash', {
        pageId: payload.pageId,
      })
      return new_pages
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

type DeletePagePermanentPayload = { pageId: string }
export const deletePagePermanent = createAsyncThunk(
  'editor/deletePagePermanent',
  async (payload: DeletePagePermanentPayload, thunkApi) => {
    try {
      let deleted_page_id = await invoke<string>('delete_page_permanently', {
        pageId: payload.pageId,
      })
      return deleted_page_id
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)
type RecoverPagePayload = { trashPageId: string; navigate?: NavigateFunction }
export const recoverPage = createAsyncThunk(
  'editor/recoverPage',
  async (payload: RecoverPagePayload, thunkApi) => {
    try {
      let deleted_page_id = await invoke<PageSimple[]>('recover_page', {
        trashPageId: payload.trashPageId,
      })
      return deleted_page_id
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

type LoadPagePayload = { pageId: string }
export const loadPage = createAsyncThunk(
  'editor/loadPage',
  async (payload: LoadPagePayload, thunkApi) => {
    try {
      const res = await invoke<{ page: PageEntry; expanded: string[] }>(
        'load_page',
        {
          pageId: payload.pageId,
        }
      )

      return res
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

type AddPagePayload = {
  title: string
  parentId: string | null
  insertAfterId: string | null
  onPageAdded: (newPageId: string) => void
}
export const addPage = createAsyncThunk(
  'editor/addPage',
  async (payload: AddPagePayload, thunkApi) => {
    try {
      const newSimplePages = await invoke<{
        pages: PageSimple[]
        new_page_id: string
      }>('add_page', {
        ...payload,
      })
      return newSimplePages
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export default reducers
