import { IPageCreationModal, NebulaModal } from '@/features/modalSlice'
import React, { useState } from 'react'
import './page-create-modal.css'
import { useDispatch } from 'react-redux'

type Props = {
  modal: IPageCreationModal
}

const PageCreationModal = ({ modal }: Props) => {
  const [pageTitle, setPageTitle] = useState('')
  const dispatch = useDispatch()
  const handleAddPage = (ev: React.FormEvent) => {
    ev.preventDefault()
    console.log('Add Page With title', pageTitle)

    dispatch(NebulaModal.unloadModal())
  }
  return (
    <form onSubmit={handleAddPage} className="modal__page-create">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <input
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
