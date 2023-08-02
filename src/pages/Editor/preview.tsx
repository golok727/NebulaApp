import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/app/store'
import { setView } from '@/features/appSlice'
import { isInView } from '@/features/selectors'
import 'github-markdown-css/github-markdown.css'
import { createElement } from 'react'
import rehypeReact from 'rehype-react'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import './preview.css'
import RemarkCode from './remark-code'
import RemarkImg from './remark-image'

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
      'nb',
    ],
  },
}

const Preview = ({}: Props) => {
  const dispatch = useDispatch()
  const doc = useSelector((state: RootState) => state.editor.currentDoc)
  const currentPageName = useSelector(
    (state: RootState) => state.editor.currentPage?.title ?? ''
  )
  const { preview: showPreview, appMode } = useSelector(isInView)
  const handleDoubleClick = () => {
    if (appMode == 'both') {
      dispatch(setView('preview-only'))
    } else {
      dispatch(setView('edit-only'))
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
      .processSync(
        doc !== '' ? doc : `# Start writing in '${currentPageName}...'`
      ).result
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
