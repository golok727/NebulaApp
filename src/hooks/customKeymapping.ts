import {
  StateCommand,
  EditorSelection,
  ChangeSpec,
  Text,
  Transaction,
} from '@codemirror/state'
import { KeyBinding } from '@codemirror/view'

const convertOrAddHeader = (tag: number): StateCommand => {
  return ({ state, dispatch }) => {
    const changes = state.changeByRange((range) => {
      const currentLine = state.doc.lineAt(range.from)
      const currentLineContent = currentLine.text
      const headerMatch = currentLineContent.match(/^(?:\s+)?(?<header>#+)\s/)

      if (headerMatch !== null) {
        /**
         * If this line is a header then do stuff according to the below conditions
         */
        const currentHeadingTag = headerMatch.groups
          ? headerMatch.groups.header.length
          : 1

        if (tag === currentHeadingTag) {
          /**
           * If the tag to change is the same as the to change to tag
           * then remove it as a header
           */

          const lineWithHeaderRemoved = currentLineContent.replace(
            /^(?:\s+)?(?<header>#+)\s/,
            ''
          )
          return {
            changes: [
              {
                from: currentLine.from,
                to: currentLine.to,
                insert: Text.of([lineWithHeaderRemoved]),
              },
            ],
            range: EditorSelection.range(
              currentLine.from + lineWithHeaderRemoved.length,
              currentLine.from + lineWithHeaderRemoved.length
            ),
          }
        } else {
          /**
           * Switch current header to another header
           */
          const newHeader = currentLineContent.replace(
            /^(?:\s+)?(?<header>#+)\s/,
            '#'.repeat(tag) + ' '
          )
          return {
            changes: [
              {
                from: currentLine.from,
                to: currentLine.to,
                insert: Text.of([newHeader]),
              },
            ],
            range: EditorSelection.range(
              currentLine.from + newHeader.length,
              currentLine.from + newHeader.length
            ),
          }
        }
      } else {
        /**
         * If it is not a header make it a header
         */
        const newHeader = '#'.repeat(tag) + ' ' + currentLineContent
        return {
          changes: [
            {
              from: currentLine.from,
              to: currentLine.to,
              insert: Text.of([newHeader]),
            },
          ],
          range: EditorSelection.range(
            currentLine.from + newHeader.length,
            currentLine.from + newHeader.length
          ),
        }
      }
    })
    if (changes) {
      dispatch(
        state.update(changes, {
          scrollIntoView: true,
          annotations: Transaction.userEvent.of('input'),
        })
      )
      return true
    }
    return false
  }
}

const wrapWith = (character: string): StateCommand => {
  return ({ state, dispatch }) => {
    const changes = state.changeByRange((range) => {
      const charLen = character.length
      const isWrapperCharBefore =
        state.sliceDoc(range.from - charLen, range.from) === character
      const isWrapperCharAfter =
        state.sliceDoc(range.to, range.to + charLen) === character
      const changes: ChangeSpec[] = []

      changes.push(
        isWrapperCharBefore
          ? {
              from: range.from - charLen,
              to: range.from,
              insert: Text.of(['']),
            }
          : {
              from: range.from,
              insert: Text.of([character]),
            }
      )
      changes.push(
        isWrapperCharAfter
          ? {
              from: range.to,
              to: range.to + 2,
              insert: Text.of(['']),
            }
          : {
              from: range.to,
              insert: Text.of([character]),
            }
      )
      const extendBefore = isWrapperCharBefore ? -charLen : charLen
      const extendAfter = isWrapperCharAfter ? -charLen : charLen

      return {
        changes,
        range: EditorSelection.range(
          range.from + extendBefore,
          range.to + extendAfter
        ),
      }
    })

    dispatch(
      state.update(changes, {
        scrollIntoView: true,
        annotations: Transaction.userEvent.of('input'),
      })
    )
    return true
  }
}

const addHr: StateCommand = ({ state, dispatch }) => {
  const currentPosition = state.selection.main.from
  const line = state.doc.lineAt(currentPosition)
  const hr = '\n' + '-'.repeat(Math.min(50, Math.max(3, line.length)))
  console.log(hr)
  const transaction = state.update({
    changes: {
      from: line.to,
      insert: hr,
    },
  })
  dispatch(transaction)
  return true
}

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
    run: wrapWith('**'),
  },

  {
    key: 'Alt-i',
    run: wrapWith('_'),
  },

  {
    key: 'Alt-k',
    run: wrapWith('~~'),
  },

  {
    key: 'Alt-`',
    run: wrapWith('`'),
  },
]
