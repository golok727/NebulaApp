import { useDispatch, useSelector } from 'react-redux'
import './assets_browser.css'
import { useEffect } from 'react'
import { RootState } from '@/app/store'
import { NebulaAssetBrowser } from '@/features/assetsBrowserSlice'
import Button from '@/components/Button'
import { useNebulaCore } from '@/context/nebula'
import useView from '@/hooks/use-view'

const AssetBrowser = () => {
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

  useEffect(() => {
    nebula.core.loadAssets()
  }, [nebula])

  return (
    <div
      className={`app__assets-browser ${!isOpen ? 'hide' : ''}`}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) dispatch(NebulaAssetBrowser.close())
      }}
    >
      <div className="app__assets-browser__main">
        <div className="app__assets-browser__main__left">
          <div className="filter-group">
            <label htmlFor="filter">Show Assets For</label>
            <select name="filter" id="filter">
              <option value="">All Assets</option>
              <option value="Notebook">Notebook Assets</option>
            </select>
          </div>
        </div>
        <div className="app__assets-browser__main__right">
          <div className="app__assets-browser__main__right__container">
            {assets && assets.length > 0 ? (
              assets.map((asset) => (
                <AssetCard
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
}: {
  asset: NebulaAsset
  insertDisabled: boolean
}) => {
  return (
    <div className="asset-card">
      <div className="asset-card__image-container">
        <img src={asset.asset_url} alt={asset.name} />
      </div>
      <div>
        <section className="actions">
          <span className="filename">{asset.name}</span>
          <Button disabled={insertDisabled} variant="transparent">
            Insert
          </Button>
        </section>
      </div>
    </div>
  )
}

export default AssetBrowser
