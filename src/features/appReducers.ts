import { PayloadAction } from '@reduxjs/toolkit'
import { AppState } from './appSlice'

const reducers = {
  setSidebarWidth: (state: AppState, action: PayloadAction<number>) => {
    state.sidebar.sidebarWidth = action.payload
  },
  showSidebar: (state: AppState) => {
    state.sidebar.showSidebar = true
  },

  hideSidebar: (state: AppState) => {
    state.sidebar.showSidebar = false
  },

  toggleSidebar: (state: AppState) => {
    state.sidebar.showSidebar = !state.sidebar.showSidebar
  },
}

export default reducers
