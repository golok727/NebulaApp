import { getSaveState } from '@/features/selectors'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNebulaCore } from '@/context/nebula'

const useUpdatePage = (saveTime: number = 1000) => {
  const saveState = useSelector(getSaveState)
  const nebula = useNebulaCore()

  const params = useParams()
  const pageId = params.pageId

  useEffect(() => {
    const { currentDoc, currentPageId, previousContent } = saveState
    let timeout: NodeJS.Timeout
    if (
      currentPageId &&
      pageId !== undefined &&
      previousContent !== undefined
    ) {
      if (currentPageId !== pageId && currentDoc !== previousContent.body) {
        nebula.core.updatePage(currentPageId, currentDoc)
      }
      if (currentPageId === pageId && currentDoc !== previousContent.body) {
        timeout = setTimeout(() => {
          nebula.core.updatePage(currentPageId, currentDoc)
        }, saveTime)
      }
    }
    return () => {
      if (timeout !== undefined) {
        clearTimeout(timeout)
      }
    }
  }, [pageId, saveState])
}

export default useUpdatePage
