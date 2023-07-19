import './main.css'
import Sidebar from './sidebar'
import Repl from './repl'
import Preview from './preview'
import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentDoc } from '@/features/editorSlice'
import { RootState } from '@/app/store'

const initialDoc = `# Radhey Shyam
**Shrimati Radhika Rani**
![image](nebula://assets/shriradha.png)
`
const Main = () => {
  const replContainerRef = useRef<HTMLDivElement | null>(null)
  const doc = useSelector((state: RootState) => state.editor.currentDoc)
  const dispatch = useDispatch()

  const handleDocChange = useCallback((newDoc: string) => {
    dispatch(setCurrentDoc(newDoc))
  }, [])

  return (
    <div className="editor__main">
      <Sidebar />
      <Repl onChange={handleDocChange} doc={doc} ref={replContainerRef} />
      <Preview replRef={replContainerRef} doc={doc} />
    </div>
  )
}

export default Main
