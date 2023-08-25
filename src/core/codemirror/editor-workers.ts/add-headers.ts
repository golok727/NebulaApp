import {
  StateCommand,
  EditorSelection,
  Text,
  Transaction,
} from '@codemirror/state'

export const convertOrAddHeader = (tag: number): StateCommand => {
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
