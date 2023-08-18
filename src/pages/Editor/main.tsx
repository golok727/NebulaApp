import { RootState } from '@/app/store'
import SelectAPage from '@/components/select-a-page'
import { useSelector } from 'react-redux'
import './main.css'
import Preview from './preview'
import Repl from './repl'
import Sidebar from './sidebar'

const Main = () => {
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )

  return (
    <div className="editor__main">
      <Sidebar />
      {currentPage ? (
        <>
          <Repl />
          <Preview />
        </>
      ) : (
        <SelectAPage />
      )}
    </div>
  )
}

export default Main
