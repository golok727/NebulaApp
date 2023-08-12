import React, { useCallback } from 'react'
import { IConfirmationModal, NebulaModal } from '@/features/modalSlice'
import './confirmation_modal.css'
import Button from '../Button'
import { useDispatch } from 'react-redux'
import { useNebulaCore } from '@/context/nebula'

type Props = {
  modal: IConfirmationModal
}
const ConfirmationModal: React.FC<Props> = ({ modal }) => {
  const dispatch = useDispatch()
  const nebula = useNebulaCore()
  const getConfirmationHandler = useCallback(
    (modal: IConfirmationModal) => {
      switch (modal.id) {
        case 'removePage': {
          return () => {
            if (modal.props.type === 'removePage') {
              nebula.core.movePageToTrash(modal.props.pageId)
            }
          }
        }
      }
    },
    [dispatch, modal]
  )

  return (
    <div className="modal__confirmation_modal_container">
      <div
        className="modal__confirmation_modal"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header>
          <h3>{modal.for}</h3>
          <p>{modal.information}</p>
        </header>
        <div className="confirmation_modal__actions">
          <Button
            onClick={getConfirmationHandler(modal)}
            className="modal__confirmation_modal_btn confirm"
          >
            Confirm
          </Button>
          <Button
            onClick={() => dispatch(NebulaModal.unloadModal())}
            className="modal__confirmation_modal_btn reject"
            autoFocus
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
