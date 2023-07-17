import { createSlice } from '@reduxjs/toolkit'
import reducers from './appReducers'
export interface AppState {
  darkMode: boolean
  fontSize: number
  sidebar: {
    showSidebar: boolean
    sidebarWidth: number
  }

  replWidth: number
  mode: 'edit-only' | 'preview-only' | 'both' | 'no-distractions'
}

const initialState: AppState = {
  darkMode: true,
  fontSize: 16,
  sidebar: {
    showSidebar: true,
    sidebarWidth: 200,
  },
  replWidth: 0,
  mode: 'both',
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
} = appSlice.actions
export default appSlice.reducer
