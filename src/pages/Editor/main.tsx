import './main.css'
import { useParams } from 'react-router-dom'
import Sidebar from './sidebar'
import Repl from './repl'

const Main = () => {
  return (
    <div className="editor__main">
      <Sidebar />
      <Repl />
    </div>
  )
}

export default Main
