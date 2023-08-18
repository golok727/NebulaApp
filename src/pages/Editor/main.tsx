import './main.css'
import Sidebar from './sidebar'
import Repl from './repl'
import Preview from './preview'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentDoc } from '@/features/editorSlice'
import { RootState } from '@/app/store'
import SelectAPage from '@/components/select-a-page'

const Main = () => {
  const dispatch = useDispatch()

  const handleDocChange = useCallback(
    (newDoc: string) => {
      dispatch(setCurrentDoc(newDoc))
    },
    [dispatch]
  )
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )

  return (
    <div className="editor__main">
      <Sidebar />
      {currentPage ? (
        <>
          <Repl onChange={handleDocChange} />
          <Preview />
        </>
      ) : (
        <SelectAPage />
      )}
    </div>
  )
}

export default Main
