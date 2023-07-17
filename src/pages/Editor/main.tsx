import './main.css'
import Sidebar from './sidebar'
import Repl from './repl'
import Preview from './preview'
import { useRef } from 'react'

const Main = () => {
  const replContainerRef = useRef<HTMLDivElement | null>(null)
  return (
    <div className="editor__main">
      <Sidebar />
      <Repl ref={replContainerRef} />
      <Preview replRef={replContainerRef} />
    </div>
  )
}

export default Main
