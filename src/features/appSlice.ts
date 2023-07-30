import { createSlice } from '@reduxjs/toolkit'
import reducers from './appReducers'
export interface AppState {
  darkMode: boolean
  fontSize: number
  sidebar: {
    showSidebar: boolean
    sidebarWidth: number
  }
  imageUrlCache: Record<string, string>
  prevMode: 'edit-only' | 'preview-only' | 'both' | 'no-distractions'
  mode: 'edit-only' | 'preview-only' | 'both' | 'no-distractions'
  notebooks: NotebookInfo[]
}

const initialState: AppState = {
  darkMode: true,
  fontSize: 16,
  sidebar: {
    showSidebar: true,
    sidebarWidth: 300,
  },
  imageUrlCache: {},
  mode: 'preview-only',
  prevMode: 'preview-only',
  notebooks: [],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers,
})

export const {
  toggleSidebar,
  hideSidebar,
  showSidebar,
  setSidebarWidth,
  toggleSplitMode,
  setView,
  switchToPreviousView,
  toggleNoDistractionsMode,
  onEditorUnloadState,
  togglePreviewOnly,
} = appSlice.actions
export default appSlice.reducer
