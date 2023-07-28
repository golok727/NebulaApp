import { IPageCreationModal, NebulaModal } from '@/features/modalSlice'
import React, { useEffect, useRef, useState } from 'react'
import './page-create-modal.css'
import { useDispatch } from 'react-redux'
import { addPage } from '@/features/editorReducers'
import { AppDispatch } from '@/app/store'

type Props = {
  modal: IPageCreationModal
}

const PageCreationModal = ({ modal }: Props) => {
  const [pageTitle, setPageTitle] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const handleAddPage = (ev: React.FormEvent) => {
    ev.preventDefault()
    console.log('Add Page With title', pageTitle)
    dispatch(
      addPage({
        title: pageTitle,
        parentId: modal.parentId,
        insertAfterId: modal.insertAfterId,
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
        disabled={pageTitle.length < 4}
      />
    </form>
  )
}

export default PageCreationModal
