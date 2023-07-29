import { createSlice } from '@reduxjs/toolkit'

import reducers, { addPage, loadNotebook, loadPage } from './editorReducers'
import { P } from '@tauri-apps/api/event-41a9edf5'

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
  currentDoc: '',
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
    // Load Notebook

    const handleRejectedStatus = (state: AppEditorState, payload: any) => {
      const messageAndCode = {
        message: payload.message ?? '',
        code: payload.code ?? '',
      }
      state.status = { ...state.status, error: true, ...messageAndCode }
    }

    builder
      .addCase(loadNotebook.pending, (state) => {
        state.status = {
          ...state.status,
          loading: true,
          message: 'Loading Notebook',
        }
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
        handleRejectedStatus(state, action.payload)
      })

    // Load Page
    builder
      .addCase(loadPage.pending, (state) => {
        state.status = {
          ...state.status,
          loading: true,
          message: 'Loading Page',
        }
      })
      .addCase(loadPage.fulfilled, (state, action) => {
        state.status = {
          ...state.status,
          loading: false,
          code: '',
          error: false,
          message: '',
        }
        state.currentPage = action.payload.page
        state.currentDoc = action.payload.page.content.body
        state.expandedPages = [
          ...new Set([...state.expandedPages, ...action.payload.expanded]),
        ]
      })
      .addCase(loadPage.rejected, (state, action) => {
        handleRejectedStatus(state, action.payload)
      })

    // Add Page

    builder
      .addCase(addPage.pending, (state) => {
        state.status = {
          ...state.status,
          loading: true,
          message: 'Adding Page',
        }
      })
      .addCase(addPage.fulfilled, (state, action) => {
        state.status = {
          ...state.status,
          loading: false,
          code: '',
          error: false,
          message: '',
        }
        if (state.currentNotebook) {
          state.currentNotebook.pages = action.payload.pages
        }

        const argParentId = action.meta.arg.parentId
        if (
          argParentId !== null &&
          !state.expandedPages.includes(argParentId)
        ) {
          state.expandedPages = [...state.expandedPages, argParentId]
        }
        action.meta.arg.onPageAdded(action.payload.new_page_id)
      })
      .addCase(addPage.rejected, (state, action) => {
        handleRejectedStatus(state, action.payload)
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
  collapseAll,
  unloadPage,
} = editorSlice.actions
