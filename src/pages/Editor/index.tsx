import './editor.css'
import TopBar from '@/components/topbar'
import Main from './main'
import { useParams } from 'react-router-dom'
const Editor = () => {
  const params = useParams()
  console.log(params)
  return (
    <div className="app__editor">
      <TopBar />
      <Main />
    </div>
  )
}

export default Editor
