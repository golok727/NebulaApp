import { PayloadAction } from '@reduxjs/toolkit'
import { AppEditorState } from './editorSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { invoke } from '@tauri-apps/api/tauri'
const reducers = {
  setCurrentDoc: (state: AppEditorState, action: PayloadAction<string>) => {
    state.currentDoc = action.payload
  },

  resetNotebookState: (state: AppEditorState) => {
    state.currentNotebook = null
    state.currentPage = null
    state.status = { ...state.status, error: false, loading: false, msg: '' }
  },

  resetEditorStatus: (state: AppEditorState) => {
    state.status = { ...state.status, error: false, loading: false, msg: '' }
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
      const nebula_notebook = await invoke('load_nebula_notebook', {
        notebookId: payload.notebook_id,
      })
      console.log(nebula_notebook)

      const res = await invoke<{ notebook: NotebookInfo }>('load_notebook', {
        notebookId: payload.notebook_id,
      })

      return res
    } catch (error: any) {
      return thunkApi.rejectWithValue(
        error as { message: string; status: number } | string
      )
    }
  }
)

export default reducers
