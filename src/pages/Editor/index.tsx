import './editor.css'
import { useEffect } from 'react'
import TopBar from '@/components/topbar'
import Main from './main'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadNotebook } from '@/features/editorReducers'
import { AppDispatch, RootState } from '@/app/store'
import { resetNotebookState } from '@/features/editorSlice'
const Editor = () => {
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const currentNotebook = useSelector(
    (state: RootState) => state.editor.currentNotebook
  )
  const notebookId = params.notebook

  useEffect(() => {
    if (notebookId !== undefined) {
      dispatch(loadNotebook({ notebook_id: notebookId }))
      console.log(currentNotebook)
    }

    return () => {
      console.log('Unload')
      dispatch(resetNotebookState())
    }
  }, [dispatch, notebookId])

  return (
    <div className="app__editor">
      <TopBar />
      {currentNotebook ? <Main /> : <div>Notebook Not found</div>}
    </div>
  )
}

export default Editor
