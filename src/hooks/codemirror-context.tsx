import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import { createContext, useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { setCurrentDoc } from '@/features/editorSlice'
import useCodeMirror from './use-codemirror'
// Context
interface ICodeMirrorContext {
  editorRef: React.MutableRefObject<HTMLDivElement | null>
  view?: EditorView
}

const CodeMirrorContext = createContext<ICodeMirrorContext>(
  {} as ICodeMirrorContext
)

export const CodeMirrorProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const currentPage = useSelector(
    (state: RootState) => state.editor.currentPage
  )
  const dispatch = useDispatch()

  const handleDocChange = useCallback(
    (newDoc: string) => {
      dispatch(setCurrentDoc(newDoc))
    },
    [dispatch]
  )

  const handleChange = useCallback(
    (state: EditorState) => handleDocChange(state.doc.toString()),
    [dispatch]
  )
  const [editorRef, view] = useCodeMirror({
    initialDoc: currentPage?.content.body ?? '',
    onChange: handleChange,
  })

  return (
    <CodeMirrorContext.Provider value={{ editorRef, view }}>
      {children}
    </CodeMirrorContext.Provider>
  )
}
