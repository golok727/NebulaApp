import { useDispatch, useSelector } from 'react-redux'

import React, { createElement, ReactNode } from 'react'
import { setView, switchToPreviousView } from '@/features/appSlice'
import { isInView } from '@/hooks/selectors'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkReact, { Options } from 'remark-react'
import { Schema, defaultSchema } from 'hast-util-sanitize'
import './preview.css'

import 'github-markdown-css/github-markdown.css'
import RemarkCode from './remark-code'
import RemarkImg from './remark-image'

interface Props {
  doc: string
}

const schema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
  // For allowing the custom protocol
  protocols: {
    ...defaultSchema.protocols,
    src: [
      ...(defaultSchema.protocols !== undefined
        ? defaultSchema.protocols['src'] ?? []
        : []),
      'nebula',
    ],
  },
}

const Preview = ({ doc }: Props) => {
  const dispatch = useDispatch()
  const { preview: showPreview, appMode } = useSelector(isInView)
  const handleDoubleClick = () => {
    if (appMode === 'preview-only') {
      dispatch(switchToPreviousView())
    } else {
      dispatch(setView('preview-only'))
    }
  }
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReact, {
      createElement: createElement,
      sanitize: schema,
      remarkReactComponents: {
        code: RemarkCode,
        img: RemarkImg,
      },
    } as Options)
    .processSync(doc).result as ReactNode
  return (
    <div
      className={`editor__preview-container ${showPreview ? '' : 'hidden'} `}
    >
      <div
        className="editor__preview markdown-body"
        onDoubleClick={handleDoubleClick}
      >
        {md}
      </div>
    </div>
  )
}

export default Preview
