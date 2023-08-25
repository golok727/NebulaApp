import {
  StateCommand,
  EditorSelection,
  Text,
  Transaction,
} from '@codemirror/state'

const pairCharacters: Record<string, string> = {
  '{': '}',
  '[': ']',
  '(': ')',
}

const pairCharactersToSkipAutoClose = [']', '}', ')']

export const createAutoCloseCommand = (
  triggerCharacter: string
): StateCommand => {
  return ({ state, dispatch }) => {
    const changes = state.changeByRange((range) => {
      const closingCharacter =
        pairCharacters[triggerCharacter] ?? triggerCharacter

      const charBeforeCursor = state.sliceDoc(range.from - 1, range.from)
      const charAfterCursor = state.sliceDoc(range.to, range.to + 1)

      const hasSelection = range.from !== range.to

      const shouldSkipAutoClose =
        (pairCharactersToSkipAutoClose.includes(triggerCharacter) ||
          charAfterCursor === triggerCharacter) &&
        !hasSelection
      /**
       * if the next char is not a char to be skipped or if it is a quote and if we have some prev character then just do the default behavior
       * This is to prevent auto closing if example:
       * abc'  -> in this case auto close does not autoclose as it has a prev char which is not ['' or \s or \n]
       * ' -> this will autoclose as the prev char is \n or ''
       * \s'' -> this will autoclose as the prev char  is ' '
       * '
       */

      const shouldSkipAutoCloseIfPrevCharIsQuote = ["'", '`'].includes(
        triggerCharacter
      )

      if (
        !shouldSkipAutoClose &&
        charBeforeCursor !== ' ' &&
        charBeforeCursor !== '\n' &&
        charBeforeCursor !== '' &&
        !hasSelection &&
        shouldSkipAutoCloseIfPrevCharIsQuote
      ) {
        return {
          changes: [
            {
              from: range.from,
              insert: Text.of([triggerCharacter]),
            },
          ],
          range: EditorSelection.range(range.from + 1, range.to + 1),
        }
      }

      /**
       * Skip the char and go to the end of the char
       * if
       *  if it is a pair trigger like [] or () or {} then from the mappings find it and skip
       * else
       *  if it is ' ot " or ` then skip it  and continue writing
       */

      if (shouldSkipAutoClose) {
        return {
          changes: [],
          range: EditorSelection.range(
            range.from + triggerCharacter.length,
            range.to + triggerCharacter.length
          ),
        }
      }

      /* Auto Close  */
      let newText = ''
      if (pairCharactersToSkipAutoClose.includes(triggerCharacter)) {
        newText = triggerCharacter
      } else {
        newText =
          triggerCharacter +
          state.sliceDoc(range.from, range.to) +
          closingCharacter
      }
      return {
        changes: [
          {
            from: range.from,
            to: range.to,
            insert: Text.of([newText]),
          },
        ],
        range: EditorSelection.range(range.to + 1, range.to + 1),
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
