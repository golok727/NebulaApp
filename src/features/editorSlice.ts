import { createSlice } from '@reduxjs/toolkit'

import reducers, { loadNotebook } from './editorReducers'

export interface AppEditorState {
  currentDoc: string
  currentNotebook: NotebookInfo | null
  currentPage: PageEntry | null
  expandedPages: string[]
  status: {
    code: string
    loading: boolean
    error: boolean
    message: string
  }
}

const initialState: AppEditorState = {
  currentDoc: `# Radhey Shyam
**Shrimati Radhika Rani**

![Radha Rani](nebula://assets/shriradha.png)
`,
  currentNotebook: null,
  currentPage: null,
  expandedPages: [],
  status: {
    code: '',
    loading: false,
    error: false,
    message: '',
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
        state.status.message = 'Loading Notebook...'
      })
      .addCase(loadNotebook.fulfilled, (state, action) => {
        state.status = {
          ...state.status,
          loading: false,
          code: '',
          error: false,
          message: '',
        }
        state.currentNotebook = action.payload
      })
      .addCase(loadNotebook.rejected, (state, action) => {
        state.status.error = true
        if (
          'message' in (action.payload as any) ||
          'code' in (action.payload as any)
        ) {
          state.status = { ...state.status, ...(action.payload as any) }
        }
        console.log(state.status)
      })
  },
})

export default editorSlice.reducer
export const {
  setCurrentDoc,
  resetNotebookState,
  resetEditorStatus: resetStatus,
  setEditorStatus: setStatus,
  toggleExpanded,
} = editorSlice.actions
