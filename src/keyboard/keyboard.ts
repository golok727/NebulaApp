import { AppDispatch } from '@/app/store'
import store from '@/app/store'
import {
  toggleNoDistractionsMode,
  togglePreviewOnly,
  toggleSidebar,
  toggleSplitMode,
} from '@/features/appSlice'
import { NebulaModal } from '@/features/modalSlice'
import useView from '@/hooks/use-view'
import { INebulaCoreContext } from '@/context/nebula'
import { NebulaAssetBrowser } from '@/features/assetsBrowserSlice'

const globalShortcuts = {
  'ctrl+,': 'global:open-settings',
  'ctrl+q': 'global:quit',
  'ctrl+shift+a': 'assets:open',
} as const
type GlobalShortcutsCommands =
  (typeof globalShortcuts)[keyof typeof globalShortcuts]
const globalShortcutCommands = Object.values(globalShortcuts)

const globalHandlers: Record<
  GlobalShortcutsCommands,
  (dispatch: AppDispatch, nebula: INebulaCoreContext) => void
> = {
  'global:open-settings': (_, nebula) => {
    nebula.core.openSettings()
  },
  'global:quit': () => {},
  'assets:open': (dispatch) => {
    const isOpen = store.getState().assetBrowser.isOpen
    if (!isOpen) {
      dispatch(NebulaAssetBrowser.open())
    } else {
      dispatch(NebulaAssetBrowser.close())
    }
  },
} as const

const applicationCommands = {
  editor: [
    'view:toggle-sidebar',
    'view:toggle-no-distractions',
    'view:toggle-preview-only',
    'view:toggle-preview-only',
    'view:toggle-split-mode',
    'core:add-page',
    'core:add-sub-page',
    'core:save-current-notebook',
    ...globalShortcutCommands,
  ] as const,
  settings: [...globalShortcutCommands] as const,
  home: ['core:new-notebook', ...globalShortcutCommands] as const,
} as const
type EditorCommands = (typeof applicationCommands.editor)[number]
type HomeCommands = (typeof applicationCommands.home)[number]
type SettingsCommands = (typeof applicationCommands.settings)[number]

type ApplicationCommands = EditorCommands | HomeCommands | SettingsCommands

interface IAppShortcuts {
  editor: Record<string, EditorCommands>
  home: Record<string, HomeCommands>
  settings: Record<string, SettingsCommands>
}

const applicationShortcuts: IAppShortcuts = {
  home: {
    ...globalShortcuts,
    'ctrl+n': 'core:new-notebook',
  },
  editor: {
    ...globalShortcuts,
    'ctrl+.': 'view:toggle-sidebar',
    'ctrl+shift+d': 'view:toggle-no-distractions',
    'ctrl+/': 'view:toggle-preview-only',
    'ctrl+e': 'view:toggle-preview-only',
    'ctrl+shift+?': 'view:toggle-split-mode',
    // ------------------------
    'ctrl+n': 'core:add-page',
    'ctrl+shift+n': 'core:add-sub-page',
    'ctrl+s': 'core:save-current-notebook',
  },
  settings: { ...globalShortcuts },
}

export interface IAppCoreKeyboardHandlers {
  editor: Record<
    EditorCommands,
    (dispatch: AppDispatch, nebula: INebulaCoreContext) => void
  >
  home: Record<
    HomeCommands,
    (dispatch: AppDispatch, nebula: INebulaCoreContext) => void
  >
  settings: Record<
    SettingsCommands,
    (dispatch: AppDispatch, nebula: INebulaCoreContext) => void
  >
}

export const applicationCoreKeyboardHandlers: IAppCoreKeyboardHandlers = {
  editor: {
    ...globalHandlers,
    'core:add-page': (dispatch) => {
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
    },
    'core:save-current-notebook': async (dispatch, nebula) => {
      nebula.core.saveCurrentNotebook()
    },

    'core:add-sub-page': (dispatch) => {
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
    },
    'view:toggle-split-mode': (dispatch) => {
      dispatch(toggleSplitMode())
    },
    'view:toggle-sidebar': (dispatch) => {
      dispatch(toggleSidebar())
    },
    'view:toggle-no-distractions': (dispatch) => {
      dispatch(toggleNoDistractionsMode())
    },
    'view:toggle-preview-only': (dispatch) => {
      dispatch(togglePreviewOnly())
    },
  },
  home: {
    ...globalHandlers,
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
  settings: { ...globalHandlers },
}

export const getHandler = (
  command: ApplicationCommands,
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
): ApplicationCommands | undefined => {
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
