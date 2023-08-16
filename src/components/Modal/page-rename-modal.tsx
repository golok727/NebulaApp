import { IPageRenameModal, NebulaModal } from '@/features/modalSlice'
import React from 'react'
import './page-rename-modal.css'

import { getPageNameWithPageId } from '@/features/selectors'
import { useDispatch } from 'react-redux'
import { useNebulaCore } from '@/context/nebula'
type Props = {
  modal: IPageRenameModal
}

const PageRenameModal: React.FC<Props> = ({ modal }) => {
  const currentPageName = React.useMemo(
    () => getPageNameWithPageId(modal.pageId),
    [modal.pageId]
  )

  const dispatch = useDispatch()
  const [newName, setNewName] = React.useState(currentPageName ?? '')
  const nebula = useNebulaCore()

  const handleRenamePage = async (ev: React.FormEvent) => {
    ev.preventDefault()
    await nebula.core.renamePage(modal.pageId, currentPageName ?? '', newName)
    dispatch(NebulaModal.unloadModal())
  }
  return (
    <form onSubmit={handleRenamePage} className="modal__notebook-create">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <input
        autoFocus
        aria-autocomplete="none"
        type="text"
        value={newName}
        onChange={(ev) => setNewName(ev.target.value)}
        placeholder="Rename Notebook"
        required
        name="title"
      />
      <input
        className="modal__button"
        type="submit"
        value={'Rename Page'}
        disabled={newName === currentPageName || newName.length < 3}
      />
    </form>
  )
}

export default PageRenameModal
