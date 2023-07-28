import { PayloadAction } from '@reduxjs/toolkit'
import { AppEditorState } from './editorSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { invoke } from '@tauri-apps/api/tauri'
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
  collapseAll: (state: AppEditorState) => {
    state.expandedPages = []
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
      return thunkApi.rejectWithValue(error)
    }
  }
)

type LoadPagePayload = { pageId: string }
export const loadPage = createAsyncThunk(
  'editor/loadPage',
  async (payload: LoadPagePayload, thunkApi) => {
    try {
      const page = await invoke<PageEntry>('load_page', {
        pageId: payload.pageId,
      })
      return page
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

type AddPagePayload = {
  title: string
  parentId: string | null
  insertAfterId: string | null
}
export const addPage = createAsyncThunk(
  'editor/addPage',
  async (payload: AddPagePayload, thunkApi) => {
    try {
      const newSimplePages = await invoke<{ pages: PageSimple[] }>('add_page', {
        ...payload,
      })
      console.log(newSimplePages)
      return newSimplePages
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export default reducers
