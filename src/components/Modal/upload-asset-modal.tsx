import { useFileUpload } from '@/context/file-upload-context'
import './upload-asset-modal.css'
import { IUploadAssetsModal, NebulaModal } from '@/features/modalSlice'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  convertToDataUri,
  generateRandomString,
  supportedMimeTypes,
} from '@/utils/helper'
import { v4 as uuidv4 } from 'uuid'
import Button from '../Button'
import { useDispatch } from 'react-redux'
import { invoke } from '@tauri-apps/api'
import { NebulaAssetBrowser } from '@/features/assetsBrowserSlice'

type ImageFile = {
  uri: string
  __id: string
  filename: string
}

const UploadAssetModal = ({}: { modal: IUploadAssetsModal }) => {
  const { toUpload } = useFileUpload()

  const toUploadLength = useRef<number>(toUpload?.length ?? 0)
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    isUploaded: false,
    uploadingProgressInfo: '',
  })

  const processedFilesLength = useRef<number>(imageFiles.length)
  const [showWarning, setShowWarning] = useState(true)
  const dispatch = useDispatch()
  const processImageFiles = useCallback(async () => {
    if (toUpload === null) {
      return []
    }
    const processed = Array.from(toUpload).reduce(
      async (images: Promise<ImageFile[]>, file: File) => {
        if (supportedMimeTypes.includes(file.type)) {
          let uri = await convertToDataUri(file)
          let imageFile: ImageFile = {
            __id: uuidv4(),
            filename: file.name,
            uri,
          }
          ;(await images).push(imageFile)
        }
        return images
      },
      Promise.resolve([])
    )

    return processed
  }, [toUpload])

  /**
   * Upload the assets to the backend
   */
  type UploadBody = {
    __id: string
    filename: string
    data: number[]
  }

  const uploadAssets = async () => {
    setUploadStatus({
      ...uploadStatus,
      isUploading: true,
      uploadingProgressInfo: `Uploading ${imageFiles.length} files...`,
    })
    for (const image of imageFiles) {
      const ext = image.filename.slice(image.filename.lastIndexOf('.'))
      let sanitizedFilename = `${generateRandomString(
        5
      )}-${generateRandomString(2)}${ext}`

      // Remove spaces from the sanitized filename
      sanitizedFilename = sanitizedFilename.replace(/\s+/g, '')
      const response = await fetch(image.uri)
      const buffer = await response.arrayBuffer()

      const payload: UploadBody = {
        __id: image.__id,
        data: Array.from(new Uint8Array(buffer)),
        filename: sanitizedFilename,
      }

      const new_asset = await invoke<NebulaAsset>('upload_asset', {
        imageData: payload,
      })
      setUploadStatus({
        ...uploadStatus,
        isUploading: true,
        uploadingProgressInfo: `Adding ${new_asset.name}`,
      })
      dispatch(NebulaAssetBrowser.addAsset(new_asset))
    }

    setUploadStatus({
      ...uploadStatus,
      isUploading: false,
      isUploaded: true,
      uploadingProgressInfo: `Assets Uploaded Successfully`,
    })

    setTimeout(() => {
      dispatch(NebulaModal.unloadModal())
    }, 2000)
  }

  /**
   * Remove the images on click
   *
   */
  const removeImage = (imageId: string) => {
    setImageFiles(imageFiles.filter((image) => image.__id !== imageId))
    if (imageFiles.length === 1) {
      dispatch(NebulaModal.unloadModal())
    }
  }

  /**
   * Load the dropped images
   */

  useEffect(() => {
    setImageFiles([])
    processImageFiles().then((images) => {
      if (images.length === 0) {
        dispatch(NebulaModal.unloadModal())
        return
      }
      processedFilesLength.current = images.length
      setImageFiles(images)

      setTimeout(() => {
        setShowWarning(false)
      }, 5000)
    })
  }, [processImageFiles])

  /**
   * Store the main upload file length
   */
  useEffect(() => {
    if (toUpload) {
      toUploadLength.current = toUpload.length
    }
  }, [toUpload])

  return (
    <div
      className="modal__upload-asset-modal-container"
      onClick={(ev) => {
        if (uploadStatus.isUploading) {
          ev.stopPropagation()
        }
      }}
    >
      {!uploadStatus.isUploading &&
        !uploadStatus.isUploaded &&
        imageFiles.length > 0 && (
          <div
            className="modal__upload-asset-modal__main"
            onClick={(ev) => ev.stopPropagation()}
          >
            <>
              <header>
                <Button onClick={() => uploadAssets()} variant="menu">
                  <h3>
                    Upload {imageFiles.length}{' '}
                    {imageFiles.length > 1 ? 'Assets' : 'Asset'}
                  </h3>
                </Button>

                {showWarning &&
                  imageFiles.length &&
                  toUploadLength.current > processedFilesLength.current && (
                    <span className="warning">
                      {toUploadLength.current - processedFilesLength.current} of{' '}
                      {toUploadLength.current} files were unsupported
                    </span>
                  )}
              </header>
              <section className="image-previews">
                {imageFiles.map((image) => (
                  <div
                    key={image.__id}
                    className="image-container"
                    onClick={() => removeImage(image.__id)}
                  >
                    <img src={image.uri} />
                  </div>
                ))}
              </section>
            </>
          </div>
        )}

      {!uploadStatus.isUploading && imageFiles.length === 0 && (
        <span className="processing">{`Processing  ${toUploadLength.current} Images.....`}</span>
      )}

      {uploadStatus.isUploading ||
        (uploadStatus.isUploaded && (
          <span className="processing">
            {' '}
            {uploadStatus.uploadingProgressInfo}
          </span>
        ))}
    </div>
  )
}

export default UploadAssetModal
