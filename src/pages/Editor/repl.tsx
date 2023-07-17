import { RootState } from '@/app/store'
import { isInView } from '@/hooks/selectors'
import useCodeMirror from '@/hooks/use-codemirror'
import { forwardRef, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import './repl.css'
import { EditorState } from '@codemirror/state'

interface Props {
  doc: string
  onChange: (doc: string) => void
}
const Repl = forwardRef<HTMLDivElement | null, Props>((props, ref) => {
  const replWidth = useSelector((state: RootState) => state.app.replWidth)
  const { repl: showRepl } = useSelector(isInView)
  const { doc: initialDoc, onChange } = props

  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange]
  )
  const [editorRef, view] = useCodeMirror({
    initialDoc,
    onChange: handleChange,
  })

  return (
    <div
      ref={ref}
      style={{ minWidth: `${replWidth}px` }}
      className={`editor__repl-container ${showRepl ? ' ' : 'hidden'}`}
    >
      <div ref={editorRef} className="editor__repl" />
    </div>
  )
})

export default Repl
