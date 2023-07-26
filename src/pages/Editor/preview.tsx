import { useDispatch, useSelector } from 'react-redux'

import React, { createElement } from 'react'
import { setView, switchToPreviousView } from '@/features/appSlice'
import { isInView } from '@/features/selectors'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeReact from 'rehype-react'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkRehype from 'remark-rehype'
import 'github-markdown-css/github-markdown.css'
import RemarkCode from './remark-code'
import RemarkImg from './remark-image'
import { RootState } from '@/app/store'
import './preview.css'

interface Props {}

const schema = {
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

const Preview = ({}: Props) => {
  const dispatch = useDispatch()
  const doc = useSelector((state: RootState) => state.editor.currentDoc)
  const { preview: showPreview, appMode } = useSelector(isInView)
  const handleDoubleClick = () => {
    if (appMode === 'preview-only') {
      dispatch(switchToPreviousView())
    } else {
      dispatch(setView('preview-only'))
    }
  }
  let md = <></>

  if (showPreview) {
    md = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(remarkGfm)
      .use(rehypeSanitize, schema)
      .use(rehypeReact, {
        createElement: createElement,
        components: {
          code: RemarkCode,
          img: RemarkImg,
        },
      })
      .processSync(doc).result
  }
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
