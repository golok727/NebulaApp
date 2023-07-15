import { useEffect, useState } from 'react'
import { RootState } from '../../app/store'
import './sidebar.css'
import { useSelector, useDispatch } from 'react-redux'
import { setSidebarWidth } from '../../features/appSlice'
const Sidebar = () => {
  const { sidebarWidth, showSidebar } = useSelector(({ app }: RootState) => ({
    sidebarWidth: app.sidebar.sidebarWidth,
    showSidebar: app.sidebar.showSidebar,
  }))
  const dispatch = useDispatch()
  console.log(sidebarWidth)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()
    document.documentElement.style.cursor = 'w-resize'
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.documentElement.style.cursor = 'default'
  }

  const handleMouseMove = (ev: MouseEvent) => {
    if (isDragging) {
      const minSidebarWidth = 200
      const maxSidebarWidth = 500
      const newWidth = Math.max(
        minSidebarWidth,
        Math.min(maxSidebarWidth, ev.pageX)
      )
      dispatch(setSidebarWidth(newWidth))
    }
  }

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
