import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'

const getAppMode = (state: RootState) => state.app.mode
const getSidebarVisibility = (state: RootState) => state.app.sidebar.showSidebar

export const isInView = createSelector(
  getAppMode,
  getSidebarVisibility,
  (appMode, sidebar) => {
    switch (appMode) {
      case 'both': {
        return { repl: true, preview: true, sidebar, appMode }
      }
      case 'edit-only': {
        return { repl: true, preview: false, sidebar, appMode }
      }
      case 'preview-only': {
        return { repl: false, preview: true, sidebar, appMode }
      }
      case 'no-distractions': {
        return { repl: true, preview: false, sidebar: false, appMode }
      }
      default: {
        return { repl: true, preview: true, sidebar, appMode }
      }
    }
  }
)
