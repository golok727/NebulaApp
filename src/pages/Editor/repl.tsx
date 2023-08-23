import { RootState } from '@/app/store'
import { isInView } from '@/features/selectors'
import { useCode } from '@/context/codemirror-context'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import './repl.css'

const Repl = () => {
  const {
    repl: showRepl,
    sidebar: showSidebar,
    appMode,
  } = useSelector(isInView)
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )

  const { editorRef, view } = useCode()

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
