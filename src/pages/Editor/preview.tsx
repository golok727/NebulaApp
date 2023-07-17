import { useDispatch, useSelector } from 'react-redux'

import React, {
  useCallback,
  useEffect,
  useState,
  createElement,
  ReactNode,
} from 'react'
import {
  setReplWidth,
  setView,
  switchToPreviousView,
} from '@/features/appSlice'
import { isInView } from '@/hooks/selectors'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkReact, { Options } from 'remark-react'
import { defaultSchema } from 'hast-util-sanitize'
import './preview.css'

import 'github-markdown-css/github-markdown.css'
import RemarkCode from './remark-code'

interface Props {
  replRef: React.MutableRefObject<HTMLDivElement | null>
  doc: string
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
}

const Preview = ({ replRef, doc }: Props) => {
  const dispatch = useDispatch()
  const { preview: showPreview, appMode } = useSelector(isInView)
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

  const handleDoubleClick = () => {
    if (appMode === 'preview-only') {
      dispatch(switchToPreviousView())
    } else {
      dispatch(setView('preview-only'))
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

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReact, {
      createElement: createElement,
      sanitize: schema,
      remarkReactComponents: {
        code: RemarkCode,
      },
    } as Options)
    .processSync(doc).result
  return (
    <div
      className={`editor__preview-container ${showPreview ? '' : 'hidden'} `}
    >
      <div
        className="editor__preview markdown-body"
        onDoubleClick={handleDoubleClick}
      >
        {md as ReactNode}
      </div>

      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  )
}

export default Preview
