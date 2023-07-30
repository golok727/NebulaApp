import { IPageCreationModal, NebulaModal } from '@/features/modalSlice'
import React, { useEffect, useRef, useState } from 'react'
import './page-create-modal.css'
import { useDispatch, useSelector } from 'react-redux'
import { addPage } from '@/features/editorReducers'
import { AppDispatch, RootState } from '@/app/store'
import { useNavigate } from 'react-router-dom'

type Props = {
  modal: IPageCreationModal
}

const PageCreationModal = ({ modal }: Props) => {
  const [pageTitle, setPageTitle] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const currentNotebookId = useSelector(
    (state: RootState) => state.editor.currentNotebook?.__id
  )
  const navigate = useNavigate()

  const handlePageAdded = (newPageId: string) => {
    if (currentNotebookId) {
      navigate(`/editor/${currentNotebookId}/${newPageId}`)
    }
  }
  const handleAddPage = (ev: React.FormEvent) => {
    ev.preventDefault()
    dispatch(
      addPage({
        title: pageTitle.trim(),
        parentId: modal.parentId,
        insertAfterId: modal.insertAfterId,
        onPageAdded: handlePageAdded,
      })
    )
    dispatch(NebulaModal.unloadModal())
  }
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [inputRef])
  return (
    <form onSubmit={handleAddPage} className="modal__page-create">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <input
        ref={inputRef}
        aria-autocomplete="none"
        value={pageTitle}
        onChange={(ev) => setPageTitle(ev.target.value)}
        type="text"
        placeholder="Untitled"
        required
        name="title"
      />
      <input
        className="modal__button"
        type="submit"
        value={'Create'}
        disabled={pageTitle.length < 2}
      />
    </form>
  )
}

export default PageCreationModal
