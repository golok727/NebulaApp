import { isInView } from '@/features/selectors'
import useCodeMirror from '@/hooks/use-codemirror'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import './repl.css'
import { EditorState } from '@codemirror/state'
import { RootState } from '@/app/store'
import { useEffect } from 'react'

interface Props {
  onChange: (doc: string) => void
}
const Repl = (props: Props) => {
  const {
    repl: showRepl,
    sidebar: showSidebar,
    appMode,
  } = useSelector(isInView)
  const { onChange } = props
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange]
  )

  const [editorRef, view] = useCodeMirror({
    initialDoc: currentPage?.content.body || '',
    onChange: handleChange,
  })

  useEffect(() => {
    if (view && currentPage) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: currentPage.content.body,
        },
      })
    }
  }, [view, currentPage])

  useEffect(() => {
    if (showRepl && view) {
      view.focus()
    }
  }, [showRepl, view])

  return (
    <div
      className={`editor__repl-container ${showRepl ? ' ' : 'hidden'}`}
      style={{ flex: showSidebar && appMode === 'both' ? 2 : 1 }}
    >
      <div ref={editorRef} className="editor__repl editor-hover" />
    </div>
  )
}

export default Repl
