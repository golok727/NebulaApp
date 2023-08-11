import { INotebookCreationModal, NebulaModal } from '@/features/modalSlice'
import React from 'react'
import './notebook-create-modal.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/store'
import { useNebulaCore } from '@/context/nebula'

interface Props {
  modal: INotebookCreationModal
}

const NotebookCreateModal: React.FC<Props> = ({ modal }) => {
  const [notebookName, setNotebookName] = React.useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const nebula = useNebulaCore()

  const handleAddNotebook = async (ev: React.FormEvent) => {
    ev.preventDefault()

    try {
      const newNotebookId = await nebula.core.createNotebook(notebookName)
      navigate(`/editor/${newNotebookId}/`)
      setNotebookName('')
    } catch (error) {
      console.log(error)
    }

    dispatch(NebulaModal.unloadModal())
  }

  return (
    <form onSubmit={handleAddNotebook} className="modal__notebook-create">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <input
        autoFocus
        aria-autocomplete="none"
        type="text"
        value={notebookName}
        onChange={(e) => setNotebookName(e.target.value)}
        placeholder="Notebook Name"
        required
        name="title"
      />
      <input
        className="modal__button"
        disabled={notebookName.length <= 2}
        type="submit"
        value={'Create Notebook'}
      />
    </form>
  )
}

export default NotebookCreateModal
