import { IImagePreviewModal } from '@/features/modalSlice'
import './image-preview-modal.css'
type Props = {
  modal: IImagePreviewModal
}
const ImagePreviewModal = ({ modal }: Props) => {
  return (
    <div className="modal__image-preview-modal">
      <img src={modal.url} alt={modal.label} />
    </div>
  )
}

export default ImagePreviewModal
