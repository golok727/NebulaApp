import { createSlice } from '@reduxjs/toolkit'
import reducers from './assetsBrowserReducers'

export const AssetsBrowserGroupFilter = {
  ALL_ASSETS: 'ALL_ASSETS',
  CURRENT_NOTEBOOK: 'CURRENT_NOTEBOOK',
} as const

export interface AssetsBrowserState {
  isOpen: boolean
  currentPath: string
  currentAssets: NebulaAsset[]
  currentGroup: keyof typeof AssetsBrowserGroupFilter
}

const initialState: AssetsBrowserState = {
  isOpen: false,
  currentPath: '/',
  currentAssets: [],
  currentGroup: AssetsBrowserGroupFilter.ALL_ASSETS,
}
const assetBrowserSlice = createSlice({
  name: 'assetBrowser',
  initialState,
  reducers: reducers,
})
export default assetBrowserSlice.reducer
export const NebulaAssetBrowser = assetBrowserSlice.actions
