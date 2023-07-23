import { createSlice } from '@reduxjs/toolkit'

import reducers, { loadNotebook } from './editorReducers'

export interface AppEditorState {
  currentDoc: string
  currentNotebook: NotebookInfo | null
  currentPage: PageEntry | null
  status: {
    loading: boolean
    error: boolean
    msg: string
  }
}

const initialState: AppEditorState = {
  currentDoc: `# Radhey Shyam
**Shrimati Radhika Rani**

![Radha Rani](nebula://assets/shriradha.png)
`,
  currentNotebook: null,
  currentPage: null,
  status: {
    loading: false,
    error: false,
    msg: '',
  },
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder
      .addCase(loadNotebook.pending, (state) => {
        state.status.loading = true
        state.status.msg = 'Loading Notebook...'
      })
      .addCase(loadNotebook.fulfilled, (state, action) => {
        state.status.loading = false
        state.status.msg = ''
        state.currentNotebook = action.payload.notebook
      })
      .addCase(loadNotebook.rejected, (state, action) => {
        state.status.error = true
        state.status.msg =
          (action.payload as any)?.message !== undefined
            ? (action.payload as any).message
            : 'Failed Loading Notebook'
      })
  },
})

export default editorSlice.reducer
export const {
  setCurrentDoc,
  resetNotebookState,
  resetEditorStatus: resetStatus,
  setEditorStatus: setStatus,
} = editorSlice.actions
