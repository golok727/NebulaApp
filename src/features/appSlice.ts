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
  replWidth: number
  prevMode: 'edit-only' | 'preview-only' | 'both' | 'no-distractions'
  mode: 'edit-only' | 'preview-only' | 'both' | 'no-distractions'
}

const initialState: AppState = {
  darkMode: true,
  fontSize: 16,
  sidebar: {
    showSidebar: true,
    sidebarWidth: 300,
  },
  imageUrlCache: {},
  replWidth: 0,
  mode: 'edit-only',
  prevMode: 'edit-only',
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
  setReplWidth,
  togglePreviewMode,
  setView,
  switchToPreviousView,
  toggleNoDistractionsMode,
} = appSlice.actions
export default appSlice.reducer
