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
type LoadNotebookPayload = { notebook_id: string }
export const loadNotebook = createAsyncThunk(
  'editor/loadNotebook',
  async (payload: LoadNotebookPayload, thunkApi) => {
    try {
      const nebula_notebook = await invoke<NotebookInfo>(
        'load_nebula_notebook',
        {
          notebookId: payload.notebook_id,
        }
      )

      return nebula_notebook
    } catch (error: any) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export default reducers
