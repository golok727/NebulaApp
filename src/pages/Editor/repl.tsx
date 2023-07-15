import './repl.css'
import useCodeMirror from '@/hooks/use-codemirror'
import React from 'react'

interface Props {}
const Repl: React.FC<Props> = () => {
  const [editorRef, view] = useCodeMirror({
    initialDoc: '# Radhey Shyam',
    onChange: () => {},
  })

  return (
    <div className="editor__repl-container">
      <div ref={editorRef} className="editor__repl" />
    </div>
  )
}

export default Repl
