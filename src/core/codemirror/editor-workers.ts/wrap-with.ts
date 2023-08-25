import {
  StateCommand,
  EditorSelection,
  ChangeSpec,
  Text,
  Transaction,
} from '@codemirror/state'

export const createWrapWithCommand = (character: string): StateCommand => {
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
