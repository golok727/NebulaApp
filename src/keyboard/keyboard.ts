import { AppDispatch } from '@/app/store'
import {
  toggleNoDistractionsMode,
  togglePreviewOnly,
  toggleSidebar,
} from '@/features/appSlice'

export const shortcuts: Record<string, string> = {
  'ctrl+/': 'view:toggle-sidebar',
  'ctrl+shift+d': 'view:toggle-no-distractions',
  'ctrl+shift+?': 'view:toggle-preview-only',
}
export const handlers: Record<string, (dispatch: AppDispatch) => void> = {
  'view:toggle-sidebar': (dispatch: AppDispatch) => {
    dispatch(toggleSidebar())
  },
  'view:toggle-no-distractions': (dispatch: AppDispatch) => {
    dispatch(toggleNoDistractionsMode())
  },
  'view:toggle-preview-only': (dispatch: AppDispatch) => {
    dispatch(togglePreviewOnly())
  },
}
export const getHandler = (command: string) => {
  return handlers[command]
}
export const getCommand = (binding: string): string | undefined => {
  return shortcuts[binding]
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
