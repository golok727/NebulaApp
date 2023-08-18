import { useDispatch, useSelector } from 'react-redux'
import './assets_browser.css'
import { useEffect, useState, useCallback } from 'react'
import { RootState } from '@/app/store'
import { NebulaAssetBrowser } from '@/features/assetsBrowserSlice'
import Button from '@/components/Button'
import { useNebulaCore } from '@/context/nebula'
import useView from '@/hooks/use-view'
import { useCode } from '@/hooks/codemirror-context'
import { NebulaModal } from '@/features/modalSlice'
import { SlReload } from 'react-icons/sl'

const AssetBrowser = () => {
  const [browserInfo, setBrowserInfo] = useState('')

  const isOpen = useSelector((state: RootState) => state.assetBrowser.isOpen)
  const isAnyPageSelected = useSelector(
    (state: RootState) => state.editor.currentPage !== null
  )
  const { editor: editorView } = useView()
  const assets = useSelector(
    (state: RootState) => state.assetBrowser.currentAssets
  )
  const nebula = useNebulaCore()
  const dispatch = useDispatch()

  useEffect(() => {
    const handleCloseBrowserOnEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        dispatch(NebulaAssetBrowser.close())
      }
    }
    document.addEventListener('keydown', handleCloseBrowserOnEsc)

    return () => {
      document.removeEventListener('keydown', handleCloseBrowserOnEsc)
    }
  }, [dispatch])

  const reloadAssets = () => {
    nebula.core.loadAssets()
    if (assets && assets.length > 0) {
      setInfoAutoFade(
        `${assets.length} ${assets.length === 1 ? 'asset' : 'assets'} loaded`
      )
    } else {
      setInfoAutoFade('Not assets yet')
    }
  }
  const setInfoAutoFade = useCallback(
    (info: string, decay: number = 2000) => {
      setBrowserInfo(info)
      return setTimeout(() => {
        setBrowserInfo('')
      }, decay)
    },
    [setBrowserInfo, browserInfo]
  )
  const onInsert = (assetName: string) => {
    setInfoAutoFade(`Inserted: ${assetName}`)
  }
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
      <div className="app__assets-browser__main">
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
        type: 'asset/preview',
        url: asset.asset_url,
        x: 0,
        y: 0,
        fullScreen: true,
        label: 'Preview ' + asset.name,
      })
    )
  }
  return (
    <div className="asset-card">
      <div className="asset-card__image-container" onClick={handleShowPreview}>
        <img src={asset.asset_url} alt={asset.name} />
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
