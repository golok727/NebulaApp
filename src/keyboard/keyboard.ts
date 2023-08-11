import { AppDispatch } from '@/app/store'
import store from '@/app/store'
import {
  toggleNoDistractionsMode,
  togglePreviewOnly,
  toggleSidebar,
  toggleSplitMode,
} from '@/features/appSlice'
import { NebulaModal } from '@/features/modalSlice'
import { updatePage } from '@/utils/notebook'
import { invoke } from '@tauri-apps/api/tauri'
import useView from '@/hooks/use-view'

export const isInEditor = () => window.location.pathname.startsWith('/editor')

export const findView = (): keyof IAPPShortcuts => {
  let currPath = window.location.pathname
  if (currPath === '/') {
    return 'home'
  } else if (currPath.startsWith('/editor')) {
    return 'editor'
  } else if (currPath.startsWith('/settings')) {
    return 'settings'
  }
  return 'home'
}
export const applicationCommands = {
  editor: [
    'view:toggle-sidebar',
    'view:toggle-no-distractions',
    'view:toggle-preview-only',
    'view:toggle-preview-only',
    'view:toggle-split-mode',
    'core:add-page',
    'core:add-sub-page',
    'core:save-current-notebook',
  ] as const,
  settings: [] as const,
  home: ['core:new-notebook'] as const,
} as const

type EditorCommands = (typeof applicationCommands.editor)[number]
type HomeCommands = (typeof applicationCommands.home)[number]
type SettingsCommands = (typeof applicationCommands.settings)[number]

interface IAPPShortcuts {
  editor: Record<string, EditorCommands>
  home: Record<string, HomeCommands>
  settings: Record<string, SettingsCommands>
}

export const applicationShortcuts: IAPPShortcuts = {
  home: {
    'ctrl+n': 'core:new-notebook',
  },
  editor: {
    'ctrl+.': 'view:toggle-sidebar',
    'ctrl+shift+d': 'view:toggle-no-distractions',
    'ctrl+/': 'view:toggle-preview-only',
    'ctrl+e': 'view:toggle-preview-only',
    'ctrl+shift+?': 'view:toggle-split-mode',
    'ctrl+n': 'core:add-page',
    'ctrl+shift+n': 'core:add-sub-page',
    'ctrl+s': 'core:save-current-notebook',
  },
  settings: {},
}

export interface IAppCoreKeyboardHandlers {
  editor: Record<EditorCommands, (dispatch: AppDispatch) => void>
  home: Record<HomeCommands, (dispatch: AppDispatch) => void>
  settings: Record<SettingsCommands, (dispatch: AppDispatch) => void>
}

export const applicationCoreKeyboardHandlers: IAppCoreKeyboardHandlers = {
  editor: {
    'core:add-page': (dispatch) => {
      if (isInEditor()) {
        const currentPage = store.getState().editor.currentPage
        dispatch(
          NebulaModal.showModal({
            type: 'page/create',
            id: 'Create Page Keyboard',
            parentId: currentPage !== null ? currentPage.parent_id : null,
            insertAfterId: currentPage !== null ? currentPage.__id : null,
            label: 'Create Page',
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2 - 100,
            subtractHalfWidth: true,
          })
        )
      }
    },
    'core:save-current-notebook': async (dispatch) => {
      if (isInEditor()) {
        let state = store.getState()
        let currentPageId = state.editor.currentPage?.__id
        let currentContent = state.editor.currentDoc
        if (currentPageId) {
          await updatePage(currentPageId, currentContent)
        }

        let res = await invoke('save_notebook')
        console.log(res)
      }
    },

    'core:add-sub-page': (dispatch) => {
      if (isInEditor()) {
        const currentPage = store.getState().editor.currentPage
        if (currentPage) {
          dispatch(
            NebulaModal.showModal({
              type: 'page/create',
              id: 'Create Subpage Keyboard',
              parentId: currentPage !== null ? currentPage.__id : null,
              insertAfterId: null,
              label: 'Create Sub-Page',
              x: window.innerWidth / 2 - 100,
              y: window.innerHeight / 2 - 100,
              subtractHalfWidth: true,
            })
          )
        }
      }
    },
    'view:toggle-split-mode': (dispatch) => {
      if (isInEditor()) {
        dispatch(toggleSplitMode())
      }
    },
    'view:toggle-sidebar': (dispatch) => {
      if (isInEditor()) {
        dispatch(toggleSidebar())
      }
    },
    'view:toggle-no-distractions': (dispatch) => {
      if (isInEditor()) {
        dispatch(toggleNoDistractionsMode())
      }
    },
    'view:toggle-preview-only': (dispatch) => {
      if (isInEditor()) {
        dispatch(togglePreviewOnly())
      }
    },
  },
  home: {
    'core:new-notebook': (dispatch) => {
      dispatch(
        NebulaModal.showModal({
          id: 'createNotebook',
          type: 'notebook/create',
          label: 'Create Notebook',
          x: window.innerWidth / 2 - 100,
          y: window.innerHeight / 2 - 100,
          subtractHalfWidth: true,
        })
      )
    },
  },
  settings: {},
}

export const getHandler = (
  command: string,
  currentView: ReturnType<typeof useView>
) => {
  if (currentView.editor)
    return (
      applicationCoreKeyboardHandlers.editor[command as EditorCommands] ??
      undefined
    )
  else if (currentView.home)
    return (
      applicationCoreKeyboardHandlers.home[command as HomeCommands] ?? undefined
    )
  else if (currentView.settings)
    return (
      applicationCoreKeyboardHandlers.settings[command as SettingsCommands] ??
      undefined
    )
}

export const getCommand = (
  binding: string,
  currentView: ReturnType<typeof useView>
): string | undefined => {
  if (currentView.editor) return applicationShortcuts.editor[binding]
  else if (currentView.home) return applicationShortcuts.home[binding]
  else if (currentView.settings) return applicationShortcuts.settings[binding]
}

export const getKeyBindings = (ev: KeyboardEvent) => {
  const ctrlKey = ev.getModifierState('Control')
  const shiftKey = ev.getModifierState('Shift')
  const altKey = ev.getModifierState('Alt')
  const binding = []
  if (ctrlKey) binding.push('ctrl')
  if (shiftKey) binding.push('shift')
  if (altKey) binding.push('alt')

  if (!['Control', 'Shift', 'Alt'].includes(ev.key))
    binding.push(ev.key.toLowerCase())

  return binding.join('+')
}
