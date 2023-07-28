import './modal.css'
import { useCallback, useEffect, useRef } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/app/store'
import { NebulaModal } from '@/features/modalSlice'
import PageCreationModal from './page-create-modal'
import PageContextModal from './page-context-modal'

const Modal = () => {
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const currentModal = useSelector(
    (state: RootState) => state.modal.currentModal
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const handleClick = (ev: MouseEvent) => {
      if (!modalContainerRef.current) return
      if (!modalContainerRef.current.contains(ev.target as Node)) {
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
      case 'page/create': {
        return <PageCreationModal modal={currentModal} />
      }
      case 'page/context': {
        return <PageContextModal modal={currentModal} />
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
              top: `${currentModal.y}px`,
              left: `${currentModal.x}px`,
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
