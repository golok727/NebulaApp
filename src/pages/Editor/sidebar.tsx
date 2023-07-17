import { RootState } from '@/app/store'
import { setSidebarWidth } from '@/features/appSlice'
import { isInView } from '@/hooks/selectors'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './sidebar.css'
const Sidebar = () => {
  const sidebarWidth = useSelector(
    ({ app }: RootState) => app.sidebar.sidebarWidth
  )
  const { sidebar: showSidebar } = useSelector(isInView)

  const dispatch = useDispatch()

  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()
    // document.documentElement.style.cursor = 'w-resize'
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    // document.documentElement.style.cursor = 'default'
  }

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (isDragging) {
        const minSidebarWidth = 200
        const maxSidebarWidth = 300
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
      <div className="main__sidebar__modern">Sidebar</div>
      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  )
}

export default Sidebar
