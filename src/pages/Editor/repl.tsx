import { isInView } from '@/features/selectors'
import useCodeMirror from '@/hooks/use-codemirror'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import './repl.css'
import { EditorState } from '@codemirror/state'

interface Props {
  doc: string
  onChange: (doc: string) => void
}
const Repl = (props: Props) => {
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
    <div className={`editor__repl-container ${showRepl ? ' ' : 'hidden'}`}>
      <div ref={editorRef} className="editor__repl editor-hover" />
    </div>
  )
}

export default Repl
