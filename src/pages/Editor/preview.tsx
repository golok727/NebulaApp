import { useDispatch } from 'react-redux'
import './preview.css'

import React, { useCallback, useEffect, useState } from 'react'
import { setReplWidth } from '@/features/appSlice'

interface Props {
  replRef: React.MutableRefObject<HTMLDivElement | null>
}

const Preview = ({ replRef }: Props) => {
  const dispatch = useDispatch()

  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.preventDefault()
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (isDragging) {
        if (replRef.current) {
          const replContainerOffsetX = ev.pageX - replRef.current.offsetLeft
          const newReplWidth = Math.min(1200, replContainerOffsetX)
          dispatch(setReplWidth(newReplWidth))
        }
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
    <div className="editor__preview-container">
      <div className="editor__preview">Preview</div>

      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  )
}

export default Preview
