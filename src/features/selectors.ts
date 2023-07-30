import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/app/store'
import { C } from '@tauri-apps/api/shell-efff51a2'

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
export const getCurrentPages = (state: RootState) =>
  state.editor.currentNotebook?.pages ?? []

export const isExpanded = (
  page_id: string
): ((state: RootState) => boolean) => {
  return (state: RootState) => state.editor.expandedPages.includes(page_id)
}

const getCurrentDoc = (state: RootState) => state.editor.currentDoc
const getCurrentPageId = (state: RootState) => state.editor.currentPage?.__id
const getPreviousContent = (state: RootState) =>
  state.editor.currentPage?.content
export const getSaveState = createSelector(
  getCurrentDoc,
  getCurrentPageId,
  getPreviousContent,
  (currentDoc, currentPageId, previousContent) => ({
    currentDoc,
    currentPageId,
    previousContent,
  })
)

const getCurrentPageName = (state: RootState) => state.editor.currentPage?.title
const getCurrentNotebookName = (state: RootState) =>
  state.editor.currentNotebook?.name

export const currentPageAndNoteName = createSelector(
  getCurrentPageName,
  getCurrentNotebookName,
  (currentPageName, currentNotebookName) => ({
    currentPageName,
    currentNotebookName,
  })
)
