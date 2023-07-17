import { PayloadAction } from '@reduxjs/toolkit'
import { AppState } from './appSlice'

const reducers = {
  setSidebarWidth: (state: AppState, action: PayloadAction<number>) => {
    state.sidebar.sidebarWidth = action.payload
  },

  setReplWidth: (state: AppState, action: PayloadAction<number>) => {
    state.replWidth = action.payload
  },
  showSidebar: (state: AppState) => {
    if (state.mode === 'no-distractions') return
    state.sidebar.showSidebar = true
  },

  hideSidebar: (state: AppState) => {
    state.sidebar.showSidebar = false
  },

  toggleSidebar: (state: AppState) => {
    if (state.mode === 'no-distractions') {
      state.sidebar.showSidebar = false
      return
    }
    state.sidebar.showSidebar = !state.sidebar.showSidebar
  },
  setView: (state: AppState, action: PayloadAction<AppState['mode']>) => {
    state.prevMode = state.mode
    state.mode = action.payload
  },

  switchToPreviousView: (state: AppState) => {
    const temp = state.mode
    state.mode = state.prevMode !== 'no-distractions' ? state.prevMode : 'both'
    state.prevMode = temp
  },

  toggleNoDistractionsMode: (state: AppState) => {
    const currMode = state.mode

    if (currMode === 'no-distractions') {
      state.mode = state.prevMode
    } else {
      state.mode = 'no-distractions'
    }

    state.prevMode = currMode
  },
  togglePreviewMode: (state: AppState) => {
    const mode = state.mode

    const isPreviewHidden = mode === 'edit-only' || mode === 'no-distractions'
    if (isPreviewHidden) {
      state.mode = 'both'
    } else {
      state.mode = 'edit-only'
    }
    state.prevMode = mode
  },
}

export default reducers
