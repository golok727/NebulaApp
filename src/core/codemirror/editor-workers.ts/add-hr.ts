import { StateCommand } from '@codemirror/state'

export const addHr: StateCommand = ({ state, dispatch }) => {
  const currentPosition = state.selection.main.from
  const line = state.doc.lineAt(currentPosition)
  const hr = '\n' + '-'.repeat(Math.min(50, Math.max(3, line.length)))
  const transaction = state.update({
    changes: {
      from: line.to,
      insert: hr,
    },
  })
  dispatch(transaction)
  return true
}
