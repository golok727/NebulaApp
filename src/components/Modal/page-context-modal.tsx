import { useEffect, useRef } from 'react'
import './page-context-modal.css'
import { IPageContextModal } from '@/features/modalSlice'
import { CgRename } from 'react-icons/cg'
import { PiTrashSimple } from 'react-icons/pi'
import { TbStatusChange, TbInfoSquareRounded } from 'react-icons/tb'
type Props = {
  modal: IPageContextModal
}

const PageContextModal = ({ modal }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus()
  }, [containerRef])
  return (
    <div ref={containerRef} tabIndex={0} className="modal__page-context">
      {modal.label && <span className="modal__title">{modal.label}</span>}
      <button className="modal__button">
        <CgRename />
        Rename
      </button>
      <button className="modal__button">
        <TbStatusChange />
        Move To
      </button>
      <button className="modal__button">
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
