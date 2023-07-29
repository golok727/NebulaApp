import store from '@/app/store'
import { invoke } from '@tauri-apps/api/tauri'

export type HomeNotebook = {
  __id: string
  name: string
  thumbnail: string | null
}
type HomeNotebooks = {
  notebooks: HomeNotebook[]
}
export const loadNebulaNotebooks = async (): Promise<HomeNotebooks> => {
  try {
    const nebula_notebooks = await invoke<HomeNotebooks>(
      'load_nebula_notebooks'
    )
    return nebula_notebooks
  } catch (error: any) {
    throw error
  }
}
export const updatePage = async (
  currentPageId: string | undefined,
  currentDoc: string
) => {
  if (currentPageId !== undefined) {
    await invoke('update_page', {
      pageId: currentPageId,
      newContent: currentDoc,
    })
  }
  return
}
