import './upload-asset-modal.css'
import { IUploadAssetsModal } from '@/features/modalSlice'

const UploadAssetModal = ({ modal }: { modal: IUploadAssetsModal }) => {
  console.log('Loaded' + modal.assets.length)
  return <div>UploadAssetModal</div>
}

export default UploadAssetModal
