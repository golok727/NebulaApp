import { RootState } from '@/app/store'
import Button from '@/components/Button'
import { setSidebarWidth, toggleSidebar } from '@/features/appSlice'
import { getCurrentPages, isInView } from '@/features/selectors'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'
import { SlNotebook } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import SidebarGroup, { GroupTypes } from './sidebar-group'
import './sidebar.css'
import SidebarExpandable from './sidebar-expandable'
import TrashPage from './trash-page'
const Sidebar = () => {
  const status = useSelector((state: RootState) => state.editor.status.message)

  const sidebarWidth = useSelector(
    ({ app }: RootState) => app.sidebar.sidebarWidth
  )

  const currentNotebookName = useSelector(
    (state: RootState) => state.editor.currentNotebook?.name ?? ''
  )

  const { sidebar: showSidebar } = useSelector(isInView)
  const currentPages = useSelector(getCurrentPages)
  const trashPages = useSelector(
    (state: RootState) => state.editor.currentNotebook?.trash_pages
  )
  const [isDragging, setIsDragging] = useState(false)

  const dispatch = useDispatch()

  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()
    // document.documentElement.style.cursor = 'w-resize'
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // document.documentElement.style.cursor = 'default'
  }

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }
  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (isDragging) {
        const minSidebarWidth = 270
        const maxSidebarWidth = 400
        const newWidth = Math.max(
          minSidebarWidth,
          Math.min(maxSidebarWidth, ev.pageX)
        )
        dispatch(setSidebarWidth(newWidth))
      }
    },
    [dispatch, isDragging]
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      className={`main__sidebar ${isDragging ? 'dragging' : ''} ${
        showSidebar ? '' : 'hidden'
      }`}
      style={{ width: sidebarWidth }}
    >
      <div className="main__sidebar__modern">
        <header className="sidebar-modern__header">
          <div className="sidebar-modern__header__left">
            <SlNotebook />
            <span>
              {currentNotebookName ? currentNotebookName : 'Untitled'}
            </span>
          </div>
          <div className="sidebar-modern__header__right">
            <Button onClick={handleToggleSidebar} variant={'transparent'}>
              <ChevronDoubleLeftIcon width={19} />
            </Button>
          </div>
        </header>

        <section className="sidebar__main">
          <SidebarGroup groupTitle="Pages" for={GroupTypes.Page}>
            {currentPages && currentPages.length > 0 ? (
              currentPages.map((page) => {
                return <SidebarExpandable key={page.__id} page={page} />
              })
            ) : (
              <span className="no-pages-found">Start your journey...</span>
            )}
          </SidebarGroup>

          <SidebarGroup key={'trash'} groupTitle="Trash" for={GroupTypes.Trash}>
            {trashPages && trashPages.length > 0 ? (
              trashPages.map((trashPage) => (
                <TrashPage key={trashPage.__id} trashPage={trashPage} />
              ))
            ) : (
              <span className="no-pages-found">Noting In Trash...</span>
            )}
          </SidebarGroup>
        </section>
        {/* Status */}
        <div className="sidebar__app-status">
          {status ? status : 'Up to Date'}
        </div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  )
}

export default Sidebar
