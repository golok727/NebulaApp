import { useDispatch, useSelector } from 'react-redux'
import './assets_browser.css'
import { useEffect, useState, useCallback, useRef } from 'react'
import { RootState } from '@/app/store'
import { NebulaAssetBrowser } from '@/features/assetsBrowserSlice'
import Button from '@/components/Button'
import { useNebulaCore } from '@/context/nebula'
import useView from '@/hooks/use-view'
import { useCode } from '@/hooks/codemirror-context'
import { ModalTypes, NebulaModal } from '@/features/modalSlice'
import { SlReload } from 'react-icons/sl'
import { useFileUpload } from '@/context/file-upload-context'

const AssetBrowser = () => {
  const [browserInfo, setBrowserInfo] = useState('')
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const { setToUpload } = useFileUpload()
  const isOpen = useSelector((state: RootState) => state.assetBrowser.isOpen)
  const isAnyPageSelected = useSelector(
    (state: RootState) => state.editor.currentPage !== null
  )
  const { editor: editorView } = useView()
  const assets = useSelector(
    (state: RootState) => state.assetBrowser.currentAssets
  )
  const isAnyModelOpen = useSelector(
    (state: RootState) => state.modal.currentModal !== null
  )

  const dropOverlayRef = useRef<HTMLDivElement | null>(null)
  const nebula = useNebulaCore()
  const dispatch = useDispatch()
  /**
   * Escape key fn to close the asset browser
   */
  useEffect(() => {
    const handleCloseBrowserOnEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && !isAnyModelOpen) {
        dispatch(NebulaAssetBrowser.close())
      }
    }
    document.addEventListener('keydown', handleCloseBrowserOnEsc)

    return () => {
      document.removeEventListener('keydown', handleCloseBrowserOnEsc)
    }
  }, [dispatch, isAnyModelOpen])

  /**
   * Reload the assets if something goes wrong and it is not showing the asset that
   * you uploaded and is not visible in the browser.
   * The assets will be only fetched at the start not each time you open
   * the browser it also rerenders when you upload the asset
   */
  const reloadAssets = () => {
    nebula.core.loadAssets()
    if (assets && assets.length > 0) {
      setInfoAutoFade(
        `${assets.length} ${assets.length === 1 ? 'asset' : 'assets'} reloaded`
      )
    } else {
      setInfoAutoFade('Not assets yet')
    }
  }

  /**
   * Function to show and automatically fade
   * the current browser info after a defined delay
   */

  const setInfoAutoFade = useCallback(
    (info: string, decay: number = 2000) => {
      setBrowserInfo(info)
      return setTimeout(() => {
        setBrowserInfo('')
      }, decay)
    },
    [setBrowserInfo, browserInfo]
  )
  /**
   * Handler for each asset card
   */
  const onInsert = (assetName: string) => {
    setInfoAutoFade(`Inserted: ${assetName}`)
  }
  /**
   * Handler for uploading assets by dropping it into the asset browser
   */
  const handleFileDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault()
    ev.stopPropagation()

    setIsDraggingOver(false)

    if (ev.dataTransfer.files.length > 0) {
      setToUpload(ev.dataTransfer.files)

      dispatch(
        NebulaModal.showModal({
          id: 'UploadAsset',
          type: ModalTypes.CREATE_ASSET,
          x: 0,
          y: 0,
          fullScreen: true,
          label: 'Upload Assets',
        })
      )
    }
    //TODO Load the upload modal
  }
  /**
   * Load the assets on first run
   */
  useEffect(() => {
    nebula.core.loadAssets()
  }, [nebula])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (assets && assets.length > 0) {
      timeout = setInfoAutoFade(`${assets.length} assets loaded`)
    } else {
      timeout = setInfoAutoFade('Not assets yet')
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div
      className={`app__assets-browser ${!isOpen ? 'hide' : ''}`}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) dispatch(NebulaAssetBrowser.close())
      }}
    >
      <div
        className="app__assets-browser__main"
        onDrop={handleFileDrop}
        onDragOver={(ev) => {
          ev.preventDefault()
          ev.stopPropagation()
        }}
        onDragEnter={(ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          setIsDraggingOver(true)
        }}
        onDragLeave={(ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          /**
           *! Important
           * Checks if the Leaved element is the drop area itself so that it does not check for events
           * fired by other elements
           */
          if (ev.target === dropOverlayRef.current) {
            setIsDraggingOver(false)
          }
        }}
      >
        {isDraggingOver && (
          <div ref={dropOverlayRef} className="drop-here">
            <span>Drop here to upload</span>
          </div>
        )}
        <div className="app__assets-browser__main__left">
          <section className="filter-group">
            <label htmlFor="filter">Show Assets In</label>
            <select name="filter" id="filter">
              <option value="">All Assets</option>
              <option value="Notebook">Notebook Assets</option>
            </select>
          </section>
          <section className="footer">
            <Button onClick={reloadAssets} variant="transparent">
              <SlReload />
            </Button>
            <div className="info">{browserInfo}</div>
          </section>
        </div>
        <div className="app__assets-browser__main__right">
          <div className="app__assets-browser__main__right__container">
            {assets && assets.length > 0 ? (
              assets.map((asset, i) => (
                <AssetCard
                  key={i}
                  onInsert={onInsert}
                  insertDisabled={!editorView || !isAnyPageSelected}
                  asset={asset}
                />
              ))
            ) : (
              <span>No Assets</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const AssetCard = ({
  asset,
  insertDisabled,
  onInsert,
}: {
  asset: NebulaAsset
  insertDisabled: boolean
  onInsert?: (assetName: string) => void
}) => {
  const { view } = useCode()
  const dispatch = useDispatch()
  const handleAddAsset = () => {
    if (!view) return
    const currentPosition = view.state.selection.main.from
    const line = view.state.doc.lineAt(currentPosition)
    const isLineEmpty = line.length === 0

    const transaction = view.state.update({
      changes: {
        from: line.to,
        insert: `${!isLineEmpty ? '\n' : ''}![${
          asset.name.split('.')[0] ?? ''
        }](${asset.nb_protocol_url})`,
      },
    })
    view.dispatch(transaction)
    onInsert && onInsert(asset.name)
  }
  const handleShowPreview = () => {
    dispatch(
      NebulaModal.showModal({
        id: 'ImagePreview',
        type: ModalTypes.ASSET_PREVIEW,
        url: asset.asset_url,
        x: 0,
        y: 0,
        fullScreen: true,
        label: 'Preview ' + asset.name,
      })
    )
  }
  return (
    <div className={`asset-card ${asset.is_new ? 'new' : ''}`}>
      <div className="asset-card__image-container" onClick={handleShowPreview}>
        <img draggable={false} src={asset.asset_url} alt={asset.name} />
      </div>
      <div>
        <section className="actions">
          <span className="filename">{asset.name}</span>
          {!insertDisabled && (
            <Button
              onClick={handleAddAsset}
              disabled={insertDisabled}
              variant="menu"
            >
              Insert
            </Button>
          )}
        </section>
      </div>
    </div>
  )
}

export default AssetBrowser
