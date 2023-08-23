import './modal.css'
import { useCallback, useEffect, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/store'
import { ModalTypes, NebulaModal } from '@/features/modalSlice'
import PageCreationModal from './page-create-modal'
import PageContextModal from './page-context-modal'
import NotebookCreateModal from './notebook-create-modal'
import ConfirmationModal from './confirmation_modal'
import PageRenameModal from './page-rename-modal'
import ImagePreviewModal from './image-preview-modal'
import UploadAssetModal from './upload-asset-modal'

const Modal = () => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClick = (ev: MouseEvent) => {
      if (!modalContainerRef.current) return
      if (
        !modalContainerRef.current.contains(ev.target as Node) ||
        currentModal?.fullScreen === true
      ) {
        if (currentModal) dispatch(NebulaModal.unloadModal())
      }
    }
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        dispatch(NebulaModal.unloadModal())
      }
    }
    const delayedRegistration = setTimeout(() => {
      document.addEventListener('click', handleClick)
      document.addEventListener('keydown', handleKeyDown)
    }, 10) // Delay the registration of the click event listener

    return () => {
      clearTimeout(delayedRegistration) // Clear the timeout to avoid memory leaks
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, modalContainerRef, currentModal])

  const renderModal = useCallback(() => {
    if (currentModal === null) return <></>
    switch (currentModal.type) {
      case ModalTypes.CREATE_PAGE: {
        return <PageCreationModal modal={currentModal} />
      }
      case ModalTypes.PAGE_CONTEXT_MENU: {
        return <PageContextModal modal={currentModal} />
      }
      case ModalTypes.CREATE_NOTEBOOK: {
        return <NotebookCreateModal modal={currentModal} />
      }
      case ModalTypes.CONFIRMATION: {
        return <ConfirmationModal modal={currentModal} />
      }
      case ModalTypes.RENAME_PAGE: {
        return <PageRenameModal modal={currentModal} />
      }
      case ModalTypes.ASSET_PREVIEW: {
        return <ImagePreviewModal modal={currentModal} />
      }
      case ModalTypes.CREATE_ASSET: {
        return <UploadAssetModal modal={currentModal} />
      }
      default:
        return <></>
    }
  }, [currentModal])

  return (
    <div
      ref={modalContainerRef}
      style={{
        ...(currentModal !== null
          ? {
              ...(currentModal.fullScreen !== true
                ? {
                    top: `${currentModal.y}px`,
                    left: `${currentModal.x}px`,
                  }
                : {
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(7px)',
                  }),
            }
          : { display: 'none' }),
      }}
      className="app__modal"
    >
      {renderModal()}
    </div>
  )
}

export default Modal
