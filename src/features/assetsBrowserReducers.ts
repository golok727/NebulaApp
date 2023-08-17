import { PayloadAction } from '@reduxjs/toolkit'
import { AssetsBrowserState } from './assetsBrowserSlice'

const reducers = {
  open: (state: AssetsBrowserState) => {
    state.isOpen = true
  },
  close: (state: AssetsBrowserState) => {
    state.isOpen = false
  },
  setAssets: (
    state: AssetsBrowserState,
    action: PayloadAction<NebulaAsset[]>
  ) => {
    state.currentAssets = action.payload
  },
}

export default reducers
