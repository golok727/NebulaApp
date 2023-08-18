import { HighlightStyle, tags } from '@codemirror/highlight'
import { EditorView } from '@codemirror/view'

export const transparentTheme = EditorView.theme({
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
export const syntaxHighlighting = HighlightStyle.define([
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
