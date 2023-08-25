import { KeyBinding } from '@codemirror/view'
import { convertOrAddHeader } from './editor-workers.ts/add-headers'
import { addHr } from './editor-workers.ts/add-hr'
import { createWrapWithCommand } from './editor-workers.ts/wrap-with'
import { createAutoCloseCommand } from './editor-workers.ts/add-autoclose'

export const markdownCustomBindings: KeyBinding[] = [
  // Headers
  {
    key: 'Ctrl-1',
    run: convertOrAddHeader(1),
  },

  {
    key: 'Ctrl-2',
    run: convertOrAddHeader(2),
  },

  {
    key: 'Ctrl-3',
    run: convertOrAddHeader(3),
  },

  {
    key: 'Ctrl-4',
    run: convertOrAddHeader(4),
  },

  {
    key: 'Ctrl-5',
    run: convertOrAddHeader(5),
  },

  {
    key: 'Ctrl-6',
    run: convertOrAddHeader(6),
  },
  // Hr
  {
    key: 'Ctrl-l',
    run: addHr,
  },
  // Text Transform
  {
    key: 'Ctrl-b',
    run: createWrapWithCommand('**'),
  },

  {
    key: 'Alt-i',
    run: createWrapWithCommand('_'),
  },

  {
    key: 'Alt-k',
    run: createWrapWithCommand('~~'),
  },

  {
    key: 'Alt-`',
    run: createWrapWithCommand('`'),
  },

  ...autoCloseKeyBinder(`"'\`{}[]()`.split('')),
]

function autoCloseKeyBinder(tags: string[]): KeyBinding[] {
  return tags.map((tag) => ({
    key: tag,
    run: createAutoCloseCommand(tag),
  }))
}
