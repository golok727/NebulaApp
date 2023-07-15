import './repl.css'
import React from 'react'
import { useParams } from 'react-router-dom'
interface Props {}
const Repl: React.FC<Props> = () => {
  const { notebook } = useParams()
  return (
    <div className="editor__repl-container">
      <div className="editor__repl"></div>
    </div>
  )
}

export default Repl
