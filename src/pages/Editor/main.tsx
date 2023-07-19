import './main.css'
import Sidebar from './sidebar'
import Repl from './repl'
import Preview from './preview'
import { useCallback, useRef, useState } from 'react'

const initialDoc = `# Radhey Shyam
**Shrimati Radhika Rani**

![image](/nebula://assets/radha-krsna.png)
`
const Main = () => {
  const replContainerRef = useRef<HTMLDivElement | null>(null)
  const [doc, setDoc] = useState<string>(initialDoc)

  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc)
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
