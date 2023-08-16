import { createSlice } from '@reduxjs/toolkit'

import reducers, {
  addPage,
  deletePagePermanent,
  loadNotebook,
  loadPage,
  movePageToTrash,
  recoverPage,
} from './editorReducers'

export interface AppEditorState {
  currentDoc: string
  currentNotebook: NotebookInfo | null
  currentPage: PageEntry | null
  expandedPages: string[]
  sidebarGroup: {
    pages: boolean
    trash: boolean
  }
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
  sidebarGroup: {
    pages: true,
    trash: false,
  },
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
      .addCase(loadPage.fulfilled, (state, action) => {
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

    /// Helper to get the next page or previous or parent page
    const navigateTo = (
      pages: PageSimple[],
      movedPage: string
    ): string | null => {
      for (const page of pages) {
        if (page.__id === movedPage) {
          const currentIndex = pages.indexOf(page)
          if (pages.length === 1) return pages[currentIndex].parent_id

          if (currentIndex === 0) {
            return pages[currentIndex + 1]?.__id ?? null
          } else if (currentIndex === pages.length - 1) {
            return pages[currentIndex - 1]?.__id ?? null
          } else {
            return (
              pages[currentIndex - 1]?.__id ??
              pages[currentIndex + 1]?.__id ??
              null
            )
          }
        }

        const subPageResult = navigateTo(page.sub_pages, movedPage)
        if (subPageResult !== null) {
          return subPageResult
        }
      }

      return null
    }

    // Move Page to trash
    builder
      .addCase(movePageToTrash.fulfilled, (state, action) => {
        state.status = {
          ...state.status,
          loading: false,
          code: '',
          error: false,
          message: '',
        }

        if (state.currentNotebook) {
          const needToNavigate =
            state.currentPage &&
            state.currentPage.__id === action.meta.arg.pageId
          const navigate = action.meta.arg.navigate
          if (needToNavigate && navigate !== undefined) {
            const movedPageId = action.meta.arg.pageId

            const navigateToPage = navigateTo(
              state.currentNotebook.pages,
              movedPageId
            )
            state.currentNotebook.pages = action.payload.pages
            state.currentNotebook.trash_pages = action.payload.trash_pages

            if (navigateToPage !== null) {
              navigate(
                `/editor/${state.currentNotebook.__id}/${navigateToPage}`
              )
            } else {
              navigate(`/editor/${state.currentNotebook.__id}`)
            }
          } else {
            state.currentNotebook.pages = action.payload.pages
            state.currentNotebook.trash_pages = action.payload.trash_pages
          }
        }
      })
      .addCase(movePageToTrash.rejected, (state, action) => {
        handleRejectedStatus(state, action.payload)
      })

    builder.addCase(deletePagePermanent.fulfilled, (state, action) => {
      if (state.currentNotebook) {
        state.currentNotebook.trash_pages =
          state.currentNotebook.trash_pages.filter(
            (trashPage) => trashPage.__id !== action.payload
          )
      }
    })

    builder.addCase(recoverPage.fulfilled, (state, action) => {
      if (state.currentNotebook) {
        state.currentNotebook.pages = action.payload
        const recoveredPage = action.meta.arg.trashPageId
        state.currentNotebook.trash_pages =
          state.currentNotebook.trash_pages.filter(
            (trashPage) => trashPage.__id !== recoveredPage
          )
        const navigate = action.meta.arg.navigate
        if (navigate)
          navigate(`/editor/${state.currentNotebook.__id}/${recoveredPage}`)
      }
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
  setPageGroupState,
  setTrashGroupState,
  togglePageGroup,
  toggleTrashGroup,
  updatePageName,
  updateEditorState,
} = editorSlice.actions
