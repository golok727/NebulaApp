import { EditorState } from '@codemirror/state'
import { EditorView, keymap, highlightActiveLine } from '@codemirror/view'

import { useEffect, useRef, useState } from 'react'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { historyKeymap, history } from '@codemirror/history'
import { lineNumbers } from '@codemirror/gutter'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags,
} from '@codemirror/highlight'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { oneDark } from '@codemirror/theme-one-dark'

const transparentTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent !important',
    height: '100%',
    border: 'none !important',
    outline: 'none !important',
  },

  // For the line numbers gutter
  '& .cm-gutters': {
    backgroundColor: 'transparent !important',
    color: '#444 !important',
    fontWeight: 'bold !important',
    fontSize: '1.2em !important',
  },

  '& .cm-content': {
    backgroundColor: 'transparent !important',
    fontFamily: "'Fira Code', monospace !important",
    fontWeight: '500 !important',
    fontSize: '1rem !important',
  },

  '& .cm-gutterElement': {
    padding: '0 1em !important',
  },

  '& .cm-line': {
    backgroundColor: 'transparent !important',
  },
})
const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: '1.7em',
    fontWeight: 'bold',
  },
  {
    tag: tags.monospace,
    backgroundColor: '#222',
    borderRadius: '10px',
    color: '#888',
    padding: '0 .2rem',
  },

  {
    tag: tags.heading2,
    fontSize: '1.4em',
    fontWeight: 'bold',
  },
  {
    tag: tags.heading3,
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  {
    tag: tags.brace,
    color: 'yellow',
  },
  {
    tag: tags.squareBracket,
    color: 'pink',
  },

  {
    tag: tags.bracket,
    color: 'hotpink',
  },
])

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
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
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
  }, [editorRef])

  return [editorRef, editorView]
}

export default useCodeMirror
