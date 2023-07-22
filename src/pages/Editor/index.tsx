import './editor.css'
import { useEffect } from 'react'
import TopBar from '@/components/topbar'
import Main from './main'
import { useParams } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/tauri'
const Editor = () => {
  const params = useParams()
  useEffect(() => {
    if (params.notebook !== undefined) {
      ;(async () => {
        try {
          const res = await invoke('load_notebook', {
            notebookId: params.notebook,
          })
          console.log(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [params])

  return (
    <div className="app__editor">
      <TopBar />
      <Main />
    </div>
  )
}

export default Editor
