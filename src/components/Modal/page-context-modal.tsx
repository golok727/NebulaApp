import React, { useEffect, useRef } from 'react'
import './page-context-modal.css'
import { IPageContextModal, NebulaModal } from '@/features/modalSlice'
import { CgRename } from 'react-icons/cg'
import { PiTrashSimple } from 'react-icons/pi'
import { TbStatusChange, TbInfoSquareRounded } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
type Props = {
  modal: IPageContextModal
}

const PageContextModal = ({ modal }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const handleRenamePage = (ev: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(
      NebulaModal.showModal({
        id: 'renamePage',
        type: 'page/rename',
        pageId: modal.pageId,
        label: 'Rename Page',
        x: ev.pageX,
        y: ev.pageY,
      })
    )
  }
  const handleRemovePage = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'removePage',
        type: 'context/confirm',
        x: 0,
        y: 0,
        label: 'Confirm delete page',
        dangerLevel: 1,
        for: 'Delete Page',
        information:
          "You are about to delete this page and its sub pages.\nDeleted page will be available in trash for 30 day's after deletion",
        fullScreen: true,
        props: {
          type: 'removePage',
          pageId: modal.pageId,
        },
      })
    )
  }
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus()
  }, [containerRef])
  return (
    <div ref={containerRef} tabIndex={0} className="modal__page-context">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <button onClick={handleRenamePage} className="modal__button">
        <CgRename />
        Rename
      </button>
      <button className="modal__button">
        <TbStatusChange />
        Move To
      </button>
      <button className="modal__button" onClick={handleRemovePage}>
        <PiTrashSimple />
        Remove
      </button>
      <button className="modal__button">
        <TbInfoSquareRounded />
        Details
      </button>
    </div>
  )
}

export default PageContextModal
