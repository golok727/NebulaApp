import { StateCommand, EditorSelection, Transaction } from '@codemirror/state'

export const toggleCheckBox: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const currentLine = state.doc.lineAt(range.from)

    const isCurrentLineCheckbox = currentLine.text.match(
      /^(?:\s+)?-\s\[(?<checked>[\sxX])\]\s.*/
    )
    if (isCurrentLineCheckbox !== null && isCurrentLineCheckbox.groups) {
      let isChecked = isCurrentLineCheckbox.groups.checked.toLowerCase() === 'x'

      if (isChecked) {
        /* If it is already checked uncheck it */
        let newText = currentLine.text.replace(/\[x\]/, '[ ]')
        return {
          changes: [
            {
              from: currentLine.from,
              to: currentLine.to,
              insert: newText,
            },
          ],
          range: EditorSelection.range(range.from, range.to),
        }
      } else {
        /* If it is not checked then check it  */
        let newText = currentLine.text.replace(/\[ \]/, '[x]')
        return {
          changes: [
            {
              from: currentLine.from,
              to: currentLine.to,
              insert: newText,
            },
          ],
          range: EditorSelection.range(range.from, range.to),
        }
      }
    } else {
      /* If it is not a checkbox then make it one */
      let newText = '- [ ] ' + currentLine.text.replace(/^-?(?:\s*)?/, '')
      return {
        changes: [
          {
            from: currentLine.from,
            to: currentLine.to,
            insert: newText,
          },
        ],
        range: EditorSelection.range(
          currentLine.from + newText.length,
          currentLine.from + newText.length
        ),
      }
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
