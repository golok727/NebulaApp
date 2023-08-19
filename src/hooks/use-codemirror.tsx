import { EditorState } from '@codemirror/state'
import { EditorView, highlightActiveLine, keymap } from '@codemirror/view'

import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { lineNumbers } from '@codemirror/gutter'
import { defaultHighlightStyle } from '@codemirror/highlight'
import { history, historyKeymap } from '@codemirror/history'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { indentOnInput } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { bracketMatching } from '@codemirror/matchbrackets'
import { oneDark } from '@codemirror/theme-one-dark'
import { useEffect, useRef, useState } from 'react'
import { markdownCustomBindings } from './customKeymapping'
import { syntaxHighlighting, transparentTheme } from './nebulaTheme'

interface Props {
  initialDoc: string
  onChange?: (state: EditorState) => void
}
const useCodeMirror = (
  props: Props
): [React.MutableRefObject<HTMLDivElement | null>, EditorView?] => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const { onChange } = props

  const [editorView, setEditorView] = useState<EditorView>()

  useEffect(() => {
    if (!editorRef.current) return

    const startState = EditorState.create({
      doc: props.initialDoc,
      extensions: [
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...markdownCustomBindings,
          indentWithTab,
        ]),
        history(),
        highlightActiveLine(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        lineNumbers(),
        indentOnInput(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
          extensions: [],
        }),
        oneDark,
        transparentTheme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        }),
      ],
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })
    setEditorView(view)

    return () => {
      // Clean up the editor when the component is unmounted
      view?.destroy()
    }
  }, [props.initialDoc])

  return [editorRef, editorView]
}

export default useCodeMirror
